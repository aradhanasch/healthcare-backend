const router = require('express').Router();
const c = require('../controllers/patients');
const auth = require('../middleware/auth');
const { validate, intParam } = require('../middleware/validate');

router.use(auth);
router.param('id', intParam);

router.route('/').post(validate(c.createSchema), c.create).get(c.list);
router.route('/:id').get(c.get).put(validate(c.updateSchema), c.update).delete(c.remove);

module.exports = router;
