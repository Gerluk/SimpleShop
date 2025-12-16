const router = require('express').Router();
const ctrl = require('../controllers/users');
const { isAdmin } = require('../middleware/auth');

router.get('/me', ctrl.getMe);
router.patch('/me', ctrl.update);
router.delete('/me', ctrl.remove);

router.get('/', isAdmin, ctrl.getAll);
router.get('/:id', isAdmin, ctrl.getOne);
router.delete('/:id', isAdmin, ctrl.removeOne);

module.exports = router;