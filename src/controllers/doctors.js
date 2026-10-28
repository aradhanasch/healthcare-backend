const Joi = require('joi');
const { Doctor } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.createSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().lowercase().required(),
  specialization: Joi.string().trim().max(100).required(),
  phone: Joi.string().trim().max(20).allow('', null),
  experienceYears: Joi.number().integer().min(0).max(80),
});
exports.updateSchema = exports.createSchema;

const findById = async (id) => {
  const doctor = await Doctor.findByPk(id);
  if (!doctor) throw new AppError('Doctor not found', 404);
  return doctor;
};

// Only the user who added a doctor may modify/delete it
const findOwned = async (id, userId) => {
  const doctor = await findById(id);
  if (doctor.createdBy !== userId) throw new AppError('You can only modify doctors you created', 403);
  return doctor;
};

exports.create = asyncHandler(async (req, res) => {
  const doctor = await Doctor.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json({ success: true, data: doctor });
});

exports.list = asyncHandler(async (req, res) => {
  const doctors = await Doctor.findAll({ order: [['name', 'ASC']] });
  res.json({ success: true, count: doctors.length, data: doctors });
});

exports.get = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await findById(req.params.id) });
});

exports.update = asyncHandler(async (req, res) => {
  const doctor = await findOwned(req.params.id, req.user.id);
  await doctor.update(req.body);
  res.json({ success: true, data: doctor });
});

exports.remove = asyncHandler(async (req, res) => {
  const doctor = await findOwned(req.params.id, req.user.id);
  await doctor.destroy();
  res.json({ success: true, message: 'Doctor deleted' });
});
