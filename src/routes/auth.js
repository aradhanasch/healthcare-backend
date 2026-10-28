const router = require('express').Router();
const c = require('../controllers/auth');
const { validate } = require('../middleware/validate');

router.post('/register', validate(c.registerSchema), c.register);
router.post('/login', validate(c.loginSchema), c.login);

module.exports = router;
