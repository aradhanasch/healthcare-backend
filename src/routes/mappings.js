const router = require('express').Router();
const c = require('../controllers/mappings');
const auth = require('../middleware/auth');
const { validate, intParam } = require('../middleware/validate');

router.use(auth);
router.param('id', intParam);
router.param('patient_id', intParam);

router.route('/').post(validate(c.createSchema), c.create).get(c.list);
// GET -> all doctors of a patient; DELETE -> remove a mapping by its id
router.get('/:patient_id', c.byPatient);
router.delete('/:id', c.remove);

module.exports = router;
