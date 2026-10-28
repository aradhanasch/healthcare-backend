require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set in .env');
    console.log('DATABASE_URL loaded:', process.env.DATABASE_URL ? 'YES' : 'NO');

    await sequelize.authenticate();
    await sequelize.sync();
    console.log('PostgreSQL connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:');
    console.error('name   :', err.name);
    console.error('message:', err.message);
    if (err.original) console.error('original:', err.original.code, err.original.message);
    if (err.parent && err.parent.errors) {
      err.parent.errors.forEach((e) => console.error('  -', e.code, e.address, e.port));
    }
    process.exit(1);
  }
})();