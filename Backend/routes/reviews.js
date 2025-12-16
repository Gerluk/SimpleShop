const router = require('express').Router();
const ctrl = require('../controllers/reviews');

router.post('/', ctrl.create);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
