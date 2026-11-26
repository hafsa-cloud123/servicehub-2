// Central error handler: every error in the app ends up here, so every error response
// has the same JSON shape:  { success: false, message, errors? }
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors;

  if (err.name === 'ValidationError') {
    // Mongoose schema validation failed
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === 'CastError') {
    // For example an invalid ObjectId in the URL
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  } else if (err.code === 11000) {
    // MongoDB duplicate key (unique index)
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'value';
    message = `${field} already exists`;
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Request body is not valid JSON';
  }

  if (statusCode === 500) console.error(err);

  const isProd = process.env.NODE_ENV === 'production';
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && isProd ? 'Something went wrong on the server' : message,
    ...(errors && { errors }),
    ...(!isProd && statusCode === 500 && { stack: err.stack }),
  });
};

module.exports = errorHandler;
