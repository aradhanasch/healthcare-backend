require('dotenv').config();
const { Sequelize } = require('sequelize');

const useSSL = process.env.DB_SSL === 'true';
const options = {
  dialect: 'postgres',
  logging: false,
  dialectOptions: useSSL ? { ssl: { require: true, rejectUnauthorized: false } } : {},
};

// Preferred: a single connection string (DATABASE_URL). Falls back to separate fields.
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, options)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      ...options,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
    });

module.exports = sequelize;