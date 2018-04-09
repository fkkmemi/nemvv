const router = require('express').Router();
const board = require('./board');

router.use('/board', board);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;