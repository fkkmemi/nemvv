const router = require('express').Router();
const ctrl = require('./ctrls');

router.get('/', ctrl.list);
router.put('/', ctrl.mod);
router.delete('/', ctrl.del);
router.get('/id', ctrl.readId);
router.put('/id', ctrl.modId);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;
