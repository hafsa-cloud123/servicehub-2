// A small custom error class. Controllers throw it when something is wrong, for example:
//   throw new AppError('Service not found', 404);
// The central error handler (middleware/errorHandler.js) turns it into a JSON response.
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
