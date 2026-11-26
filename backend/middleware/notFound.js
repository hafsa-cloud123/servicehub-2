const AppError = require('../utils/AppError');

// Runs when no route matched the request.
module.exports = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};
