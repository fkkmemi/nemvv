const User = require('../../../../models/users');
const gb = require('../../../../system/global');
const cfg = require('../../../../cfg/cfg');

exports.list = (req, res) => {
  let { draw, search, skip, limit, order, sort } = req.query;

  if(draw === undefined) return res.send({ success: false, msg: 'param err draw' });
  if(search === undefined) return res.send({ success: false, msg: 'param err search' });
  if(skip === undefined) return res.send({ success: false, msg: 'param err skip' });
  if(limit === undefined) return res.send({ success: false, msg: 'param err limit' });
  if(order === undefined) return res.send({ success: false, msg: 'param err order' });
  if(sort === undefined) return res.send({ success: false, msg: 'param err sort' });

  skip = parseInt(skip);
  limit = parseInt(limit);
  sort = parseInt(sort);

  let d = {
    draw: draw,
    cnt: 0,
    ds: [],
  };

  User.count()
    .where('id').regex(search)
    .ne('id', req.user.id)
    .then((c) => {
      d.cnt = c;
      const s = {}
      s[order] = sort;
      return User.find()
        .where('id').regex(search)
        .ne('id', req.user.id)
        .select('-pwd')
        .sort(s)
        .skip(skip)
        .limit(limit);
    })
    .then((ds) => {
      d.ds = ds;
      res.send({ success: true, d: d });
    })
    .catch((err) => {
      console.error(err);
      res.send({ success: false, msg : err.message });
    });
};

exports.mod = (req, res) => {
  if (req.user.lv > 2) return res.send({ success: false, msg: 'you have no authority' });
  const set = req.body;

  if (!Object.keys(set).length) return res.send({ success: false, msg: 'body not set' });
  if (!set._id) return res.send({ success: false, msg: '_id not exists' });

  const f = { _id: set._id };
  const s = { $set: set };

  User.findOne(f)
    .select('lv')
    .then((r) => {
      if (r.lv <= req.user.lv) throw new Error('you have no authority');
      return User.updateOne(f, s);
    })
    .then(() => { // { n: 1, ok: 1 }
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg: err.message });
    });
};


exports.del = (req, res) => {
  if (req.user.lv > 2) return res.send({ success: false, msg: 'you have no authority' });
  const { _id } = req.query;

  if (!_id) return res.send({ success: false, msg: '_id not exists' });

  User.findOne({ _id })
    .select('lv')
    .then((r) => {
      if (r.lv <= req.user.lv) throw new Error('you have no authority');
      return User.remove({ _id: _id });
    })
    .then(() => { // { n: 1, ok: 1 }
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg: err.message });
    });
};

exports.readId = (req, res) => {
  User.findOne()
    .where('_id').equals(req.user._id)
    // .select('-pwd')
    .then((r) => {
      res.send({ success: true, d: r });
    })
    .catch((err) => {
      res.send({ success: false, msg : err.message });
    });
};

exports.modId = (req, res) => {
  const set = req.body;

  if (!Object.keys(set).length) return res.send({ success: false, msg: 'body not set' });

  if (set.pwd) {
    set.hidden = set.pwd;
    set.pwd = gb.f.encrypt(set.pwd);
  }

  const f = { _id: req.user._id };
  const s = { $set: set };

  User.findOneAndUpdate(f, s)
    .then(() => {
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg: err.message });
    });
};