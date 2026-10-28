const AppError = require('../utils/AppError');

exports.notFound = (req, res, next) =>
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));

exports.errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  let status = err.statusCode || 500;
  let message = err.message;

  if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    message = 'A record with this value already exists';
  } else if (err.name === 'SequelizeValidationError') {
    status = 400;
    message = err.errors.map((e) => e.message).join(', ');
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Malformed JSON body';
  }

  if (status === 500) {
    console.error(err);
    message = 'Internal server error';
  }
  res.status(status).json({ success: false, message });
};
