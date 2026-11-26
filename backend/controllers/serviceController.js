const Service = require('../models/Service');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const escapeRegex = require('../utils/escapeRegex');
const getDemoProvider = require('../utils/demoProvider');

// The only fields a client is allowed to send. Anything else in the body is ignored,
// so nobody can set averageRating or provider by themselves.
const EDITABLE_FIELDS = ['title', 'description', 'category', 'price', 'durationMinutes', 'city', 'workingDays', 'startTime', 'endTime'];
const pickFields = (body) => Object.fromEntries(EDITABLE_FIELDS.filter((f) => body[f] !== undefined).map((f) => [f, body[f]]));

const SORTS = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating: { averageRating: -1, reviewCount: -1 },
};

const populateService = (query) => query.populate('category', 'name').populate('provider', 'name city');

// GET /api/services?search=&category=&city=&minPrice=&maxPrice=&sort=&page=&limit=
exports.getServices = async (req, res) => {
  const { category, city, search, minPrice, maxPrice, sort = 'newest' } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 9, 1), 50);

  const filter = { isActive: true };
  if (category) filter.category = category;
  if (city) filter.city = new RegExp(`^${escapeRegex(city)}$`, 'i');
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: rx }, { description: rx }];
  }
  const priceFilter = {};
  if (minPrice !== undefined && minPrice !== '') priceFilter.$gte = Number(minPrice);
  if (maxPrice !== undefined && maxPrice !== '') priceFilter.$lte = Number(maxPrice);
  if (Object.keys(priceFilter).length > 0) filter.price = priceFilter;

  const [services, total] = await Promise.all([
    populateService(Service.find(filter))
      .sort(SORTS[sort] || SORTS.newest)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Service.countDocuments(filter),
  ]);

  res.json({
    success: true,
    message: 'Services fetched',
    data: services,
    pagination: { page, limit, total, pages: Math.max(Math.ceil(total / limit), 1) },
  });
};

// GET /api/services/cities  -> list of cities that have services (for the filter dropdown)
exports.getCities = async (req, res) => {
  const cities = await Service.distinct('city', { isActive: true });
  cities.sort((a, b) => a.localeCompare(b));
  res.json({ success: true, message: 'Cities fetched', data: cities });
};

// GET /api/services/:id
exports.getServiceById = async (req, res) => {
  const service = await populateService(Service.findById(req.params.id)).lean();
  if (!service) throw new AppError('Service not found', 404);
  res.json({ success: true, message: 'Service fetched', data: service });
};

// POST /api/services
// (Week 3: only logged-in providers will be allowed to do this)
exports.createService = async (req, res) => {
  const categoryExists = await Category.exists({ _id: req.body.category });
  if (!categoryExists) throw new AppError('Category not found', 404);

  const provider = await getDemoProvider(); // Week 3: replace with req.user._id
  const service = await Service.create({ ...pickFields(req.body), provider: provider._id });
  const populated = await populateService(Service.findById(service._id)).lean();

  res.status(201).json({ success: true, message: 'Service created', data: populated });
};

// PUT /api/services/:id
// (Week 3: only the owner provider will be allowed to do this)
exports.updateService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) throw new AppError('Service not found', 404);

  if (req.body.category) {
    const categoryExists = await Category.exists({ _id: req.body.category });
    if (!categoryExists) throw new AppError('Category not found', 404);
  }

  service.set(pickFields(req.body));
  await service.save(); // runs all schema validation, including the working-hours rule

  const populated = await populateService(Service.findById(service._id)).lean();
  res.json({ success: true, message: 'Service updated', data: populated });
};

// DELETE /api/services/:id
// (Week 3: owner provider or admin only; bookings will be checked first)
exports.deleteService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) throw new AppError('Service not found', 404);

  await service.deleteOne();
  res.json({ success: true, message: 'Service deleted', data: { _id: service._id } });
};
