const jwt = require('jsonwebtoken');

const cfg = require('../../../../cfg/cfg');
const gb = require('../../../../system/global');
const User = require('../../../../models/users');

exports.in = (req, res) => {
  const { id, pwd } = req.body;

  if (id === undefined) return res.send({ success: false, msg: 'param err id' });
  if (pwd === undefined) return res.send({ success: false, msg: 'param err pwd' });

  let usr = {};
  User.findOne()
    .where('id').equals(id)
    .then((r) => {
      if (!r) throw new Error('id not exists');
      if (gb.f.encrypt(pwd) !==  r.pwd) throw new Error('password diff');
      if (!r.act) throw new Error('email not confirmed');

      usr = {
        _id: r._id,
        id: r.id,
        email: r.email,
        name: r.name,
        lv: r.lv,
      };

      const secret = req.app.get('jwt-secret');
      const p = new Promise((resolve, reject) => {
        jwt.sign(
          usr,
          secret,
          {
            expiresIn: cfg.web.jwt.expiresIn,
            issuer: cfg.web.host,
            subject: 'user-token'
          }, (err, token) => {
            if (err) reject(err);
            resolve(token);
          })
      })
      return p;
    })
    .then((tk) => {
      res.set('WWW-Authenticate', tk);

      res.send({ success: true, d: usr });
    })
    .catch((err) => {
      res.send({ success: false, msg : err.message });
    });
};

exports.out = (req, res) => {
  res.send({ success: true });
};


exports.act = (req, res) => {
  const _id = req.params._id;
  console.log(_id);

  // let url = 'http';
  // if (cfg.web.https.use) url += 's';
  // url += '//';
  // url += cfg.web.host;
  // url += '/#/register';
  //
  // res.redirect(url); return;


  // res.redirect('/#/register'); return;

  if (_id === undefined) return res.redirect('/#/register');

  User.update({ _id: _id }, { $set: { act: true } })
    .then(() => { res.redirect('/#/sign'); })
    .catch(() => { res.redirect('/#/register'); })

  // if (!_id) return res.redirect({ success: false, msg: 'param err id' });
  // res.send({ success: true });
};