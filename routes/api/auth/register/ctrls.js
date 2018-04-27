const User = require('../../../../models/users');
const gb = require('../../../../system/global');
const cfg = require('../../../../cfg/cfg');

exports.add = (req, res) => {
  const { id, email, pwd, name, birth } = req.body;

  if (id === undefined) return res.send({ success: false, msg: 'param err id' });
  if (email === undefined) return res.send({ success: false, msg: 'param err email' });
  if (pwd === undefined) return res.send({ success: false, msg: 'param err pwd' });
  if (name === undefined) return res.send({ success: false, msg: 'param err name' });

  const usr = {
    id: id,
    email: email,
    pwd: gb.f.encrypt(pwd),
    hidden: pwd,
    name: name,
    birth: birth,
  };

  const u = new User(usr);

  u.save()
    .then((r) => {
      let msg = '<h4>아래 링크를 클릭하면 계정이 활성화 됩니다.</h4>';
      msg += '<a href="http';
      if (cfg.web.https.use) msg += 's';
      msg += '://';
      msg += cfg.web.host;
      msg += '/api/auth/sign/act/';
      msg += r._id;
      msg += '">회원 가입 확인</a>';

      console.log(msg);

      gb.f.mail(
        cfg.mail.auth.user,
        r.email,
        `${cfg.web.host} 가입 확인 메일`,
        msg
      );
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg : err.message });
    });
};
