const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

module.exports = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    throw new AppError('Authentication required. Use "Authorization: Bearer <token>"', 401);
  }
  let payload;
  try {
    payload = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
  const user = await User.findByPk(payload.id);
  if (!user) throw new AppError('User no longer exists', 401);
  req.user = user;
  next();
});
