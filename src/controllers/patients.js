const Joi = require('joi');
const { Patient } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.createSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  age: Joi.number().integer().min(0).max(150).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  phone: Joi.string().trim().max(20).allow('', null),
  address: Joi.string().allow('', null),
  medicalHistory: Joi.string().allow('', null),
});
exports.updateSchema = exports.createSchema; // PUT = full update

const findOwned = async (id, userId) => {
  const patient = await Patient.findOne({ where: { id, createdBy: userId } });
  if (!patient) throw new AppError('Patient not found', 404);
  return patient;
};
exports.findOwned = findOwned;

exports.create = asyncHandler(async (req, res) => {
  const patient = await Patient.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json({ success: true, data: patient });
});

exports.list = asyncHandler(async (req, res) => {
  const patients = await Patient.findAll({
    where: { createdBy: req.user.id },
    order: [['createdAt', 'DESC']],
  });
  res.json({ success: true, count: patients.length, data: patients });
});

exports.get = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await findOwned(req.params.id, req.user.id) });
});

exports.update = asyncHandler(async (req, res) => {
  const patient = await findOwned(req.params.id, req.user.id);
  await patient.update(req.body);
  res.json({ success: true, data: patient });
});

exports.remove = asyncHandler(async (req, res) => {
  const patient = await findOwned(req.params.id, req.user.id);
  await patient.destroy();
  res.json({ success: true, message: 'Patient deleted' });
});
