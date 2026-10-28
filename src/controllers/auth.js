const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { User } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).max(100).required(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ where: { email } })) {
    throw new AppError('Email already registered', 409);
  }
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { id: user.id, name: user.name, email: user.email },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
  res.json({
    success: true,
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});
