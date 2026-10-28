const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
});

const Patient = sequelize.define('Patient', {
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  gender: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT },
  medicalHistory: { type: DataTypes.TEXT },
});

const Doctor = sequelize.define('Doctor', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  specialization: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  experienceYears: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const Mapping = sequelize.define(
  'Mapping',
  {},
  { indexes: [{ unique: true, fields: ['PatientId', 'DoctorId'] }] }
);

// Ownership
User.hasMany(Patient, { foreignKey: 'createdBy', onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'createdBy' });
User.hasMany(Doctor, { foreignKey: 'createdBy', onDelete: 'CASCADE' });
Doctor.belongsTo(User, { foreignKey: 'createdBy' });

// Patient <-> Doctor mapping
Patient.hasMany(Mapping, { onDelete: 'CASCADE' });
Mapping.belongsTo(Patient);
Doctor.hasMany(Mapping, { onDelete: 'CASCADE' });
Mapping.belongsTo(Doctor);

module.exports = { sequelize, User, Patient, Doctor, Mapping };
