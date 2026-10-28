const Joi = require('joi');
const { Mapping, Patient, Doctor } = require('../models');
const { findOwned } = require('./patients');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.createSchema = Joi.object({
  patient: Joi.number().integer().positive().required(),
  doctor: Joi.number().integer().positive().required(),
});

exports.create = asyncHandler(async (req, res) => {
  const { patient, doctor } = req.body;
  await findOwned(patient, req.user.id); // 404 if not the user's patient
  if (!(await Doctor.findByPk(doctor))) throw new AppError('Doctor not found', 404);

  const [mapping, created] = await Mapping.findOrCreate({
    where: { PatientId: patient, DoctorId: doctor },
  });
  if (!created) throw new AppError('Doctor is already assigned to this patient', 409);
  res.status(201).json({ success: true, data: mapping });
});

exports.list = asyncHandler(async (req, res) => {
  const mappings = await Mapping.findAll({
    include: [
      { model: Patient, where: { createdBy: req.user.id }, required: true },
      { model: Doctor },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.json({ success: true, count: mappings.length, data: mappings });
});

exports.byPatient = asyncHandler(async (req, res) => {
  await findOwned(req.params.patient_id, req.user.id);
  const mappings = await Mapping.findAll({
    where: { PatientId: req.params.patient_id },
    include: [Doctor],
  });
  res.json({
    success: true,
    count: mappings.length,
    data: mappings.map((m) => ({ mappingId: m.id, doctor: m.Doctor })),
  });
});

exports.remove = asyncHandler(async (req, res) => {
  const mapping = await Mapping.findOne({
    where: { id: req.params.id },
    include: [{ model: Patient, where: { createdBy: req.user.id }, required: true }],
  });
  if (!mapping) throw new AppError('Mapping not found', 404);
  await mapping.destroy();
  res.json({ success: true, message: 'Doctor removed from patient' });
});
