const jwt = require('jsonwebtoken');
const moment = require('moment');
const cfg = require('../../cfg/cfg');

exports.verify = (req, res, next) => {
  // console.log(req.headers.authorization);
  // console.log(req.path);
  //
  if (req.path === '/auth/sign/in') return next();
  if (req.path === '/auth/register') return next();
  if (!req.headers.authorization) return res.status(401).send({ success: false, msg: 'authorization empty' });

  const token = req.headers.authorization;
  // res.set('xxxx', 'abcdefg');
  // res.header('xxxx', 'abcdefg');

  const secret = req.app.get('jwt-secret');

  jwt.verify(token, secret, (err, tk) => {
    if (err) return res.status(401).send({ success: false, msg: 'your token expired' });
    if (!tk) return res.status(401).send({ success: false, msg: 'your token expired' });

    // console.log(moment(tk.exp*1000).diff(moment(), 'seconds'));
    // console.log(tk);
    req.user = tk;
    const diff = moment(tk.exp*1000).diff(moment(), 'seconds');
    if (diff > 100) return next();

    jwt.sign(
      {
        _id: tk._id,
        id: tk.id,
        email: tk.email
      },
      secret,
      {
        expiresIn: cfg.web.jwt.expiresIn,
        issuer: cfg.web.host,
        subject: 'user-token'
      }, (err, ntk) => {
        if (err) return res.status(401).send({ success: false, msg: 'token make error' });
        res.set('WWW-Authenticate', ntk);
        next();
    });


    // console.log(new Date(d.exp*1000).toLocaleString());
    // req.token = tk;
    // // console.log(req.token);
    // next();
  });
};