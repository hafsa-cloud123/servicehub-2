const Category = require('../models/Category');
const Service = require('../models/Service');
const AppError = require('../utils/AppError');

// NOTE: Express 5 automatically forwards errors from async functions to the error
// handler, so we do not need try/catch in every controller.

// GET /api/categories  -> list all categories with the number of active services in each
exports.getCategories = async (req, res) => {
  const [categories, counts] = await Promise.all([
    Category.find().sort({ name: 1 }).lean(),
    Service.aggregate([{ $match: { isActive: true } }, { $group: { _id: '$category', count: { $sum: 1 } } }]),
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
  const data = categories.map((c) => ({ ...c, serviceCount: countMap.get(String(c._id)) || 0 }));

  res.json({ success: true, message: 'Categories fetched', data });
};

// POST /api/categories  -> create a category
// (Week 3: only admins will be allowed to do this)
exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.create({ name, description });
  res.status(201).json({ success: true, message: 'Category created', data: category });
};

// PUT /api/categories/:id  -> update a category
exports.updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError('Category not found', 404);

  category.name = req.body.name;
  category.description = req.body.description;
  await category.save(); // save() runs the schema validation

  res.json({ success: true, message: 'Category updated', data: category });
};

// DELETE /api/categories/:id  -> delete a category (only if no service uses it)
exports.deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError('Category not found', 404);

  const inUse = await Service.countDocuments({ category: category._id });
  if (inUse > 0) {
    throw new AppError(`Cannot delete: ${inUse} service(s) still use this category`, 409);
  }

  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted', data: { _id: category._id } });
};
