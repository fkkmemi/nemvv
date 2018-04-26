const jwt = require('jsonwebtoken');
const moment = require('moment');
const cfg = require('../../cfg/cfg');
const LogPath = require('../../models/logPaths');

exports.verify = (req, res, next) => {
  if (req.path.substr(0,6) === '/auth/') return next();

  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ success: false, msg: 'authorization empty' });

  const secret = req.app.get('jwt-secret');

  jwt.verify(token, secret, (err, tk) => {
    if (err) return res.status(401).send({ success: false, msg: err.message });
    if (!tk) return res.status(401).send({ success: false, msg: 'your token expired' });

    LogPath.create({
      u_id: tk._id,
      path: req.path,
      method: req.method,
      ip : req.ip,
      body : JSON.stringify(req.body),//.substr(0,80),
      query : JSON.stringify(req.query),//.substr(0,80),
    });

    req.user = tk;
    const diff = moment(tk.exp*1000).diff(moment(), 'seconds');
    // console.log(moment(tk.exp*1000).toLocaleString(), diff);
    if (diff > cfg.web.jwt.reTokenTime) return next();

    const usr = {
      _id: tk._id,
      id: tk.id,
      email: tk.email,
      name: tk.name,
      lv: tk.lv,
    };

    jwt.sign(
      usr,
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
  });
};