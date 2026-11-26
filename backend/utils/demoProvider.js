const User = require('../models/User');
const AppError = require('./AppError');
const { DEMO_PROVIDER_EMAIL } = require('./constants');

// WEEK 2 ONLY: login is not built yet, so we do not know who is calling the API.
// Until Week 3, every new service is assigned to the demo provider created by the seed script.
// In Week 3 this helper is deleted and controllers use `req.user._id` (from the JWT) instead.
const getDemoProvider = async () => {
  const provider = await User.findOne({ email: DEMO_PROVIDER_EMAIL, role: 'provider' });
  if (!provider) {
    throw new AppError('Demo provider not found. Run "npm run seed" in the backend folder first.', 500);
  }
  return provider;
};

module.exports = getDemoProvider;
