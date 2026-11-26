const { validationResult } = require('express-validator');

// Put this after the express-validator rules in a route. If any rule failed,
// it stops the request and answers 400 with a list of field errors.
module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  return res.status(400).json({ success: false, message: 'Validation failed', errors });
};
