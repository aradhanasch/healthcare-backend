const AppError = require('../utils/AppError');

exports.validate = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return next(new AppError(error.details.map((d) => d.message).join(', '), 400));
  }
  req.body = value;
  next();
};

// router.param handler: ensures :id style params are positive integers
exports.intParam = (req, res, next, val) => {
  if (!/^[1-9]\d*$/.test(val)) {
    return next(
      new AppError('ID must be a positive integer', 400)
    );
  }

  next();
};
