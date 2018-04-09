const router = require('express').Router();
const notice = require('./notice');
const faq = require('./faq');
const qna = require('./qna');
const talk = require('./talk');

router.use('/notice', notice);
router.use('/faq', faq);
router.use('/qna', qna);
router.use('/talk', talk);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;
