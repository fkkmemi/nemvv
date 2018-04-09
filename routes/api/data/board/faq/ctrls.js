const mongoose = require('mongoose');
const Board = require('../../../../../models/boards');
const Comment = require('../../../../../models/comments');

const boardSchema = Board.schema.obj;
const commentSchema = Comment.schema.obj;

boardSchema.cmt_ids = [{ type: mongoose.Schema.Types.ObjectId, ref: 'FaqComment' }];
commentSchema.bd_id = { type: mongoose.Schema.Types.ObjectId, ref: 'Faq', index: true, required: true };

const Faq = mongoose.model('Faq', boardSchema);
const FaqComment = mongoose.model('FaqComment', commentSchema);

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

  const d = {
    draw: draw,
    cnt: 0,
    ds: [],
  };

  Faq.count()
    .where('title').regex(search)
    .then((c) => {
      d.cnt = c;
      const s = {}
      s[order] = sort;
      return Faq.find()
        .where('title').regex(search)
        .select('ut u_id title cntView cmt_ids')
        .populate({ path: 'u_id', select:'id email'})
        .sort(s)
        .skip(skip)
        .limit(limit);
    })
    .then((ds) => {
      d.ds = ds;
      // res.set('content-type', 'abcdefg');
      // console.log(res.header);
      // res.headers['Cache-Control'] = 'max-age=60, public';
      res.send({success: true, d: d});
    })
    .catch((err) => {
      res.send({success: false, msg : err.message});
    });
};


exports.read = (req, res) => {
  const f = { _id: req.params._id };
  const s = { $inc: { cntView: 1 } };
  const o = { new: true };
  Faq.findOneAndUpdate(f, s, o)
    // .where('_id').equals(_id)
    // .select('content')
    // .populate({ path: 'u_id', select:'id'})
    .populate({
      path: 'cmt_ids',
      populate: {
        path: 'u_id',
        select: 'id email',
      },
    })
    .then((d) => {
      res.send({success: true, d: d});
    })
    .catch((err) => {
      res.send({success: false, msg : err.message});
    });
};

exports.add = (req, res) => {
  const { title, content } = req.body;

  if (!req.user) res.send({ success: false, msg : 'token not exists' });
  if (!content) res.send({ success: false, msg : 'content not exists' });

  const bd = new Faq({
    u_id: req.user._id,
    title: title,
    content: content,
    ip: req.ip,
  });
  bd.save()
    .then(() => {
      res.send({success: true});
    })
    .catch((err) => {
      res.send({success: false, msg : err.message});
    });
};

exports.mod = (req, res) => {
  const set = req.body;

  if (!Object.keys(set).length) return res.send({ success: false, msg: 'body not set' });
  if (!set._id) return res.send({ success: false, msg: 'id not exists' });
  set.ut = new Date();
  set.ip = req.ip;

  const f = { _id: set._id };
  const s = { $set: set };

  Faq.findOneAndUpdate(f, s)
    .then(() => {
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg: err.message });
    });
};

exports.del = (req, res) => {
  const { _id } = req.query;

  if (!_id) return res.send({ success: false, msg: 'id not exists' });
  let cp;
  Faq.findOne({ _id: _id })
    .then((r) => {
      cp = r;
      return FaqComment.remove({ _id: { $in: r.cmt_ids } });
    })
    .then(() => {
      return Faq.remove({ _id: _id });
    })
    .then(() => { // { n: 1, ok: 1 }
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg: err.message });
    });
};

exports.addCmt = (req, res) => {
  const { bd_id, content } = req.body;

  if (!content) res.send({ success: false, msg : 'content not exists' });

  const cmt = new FaqComment({
    bd_id: bd_id,
    u_id: req.user._id,
    content: content,
    ip: req.ip,
  });
  let cr;
  cmt.save()
    .then((r) => {
      cr = r;
      const f = { _id: r.bd_id };
      const s = { $addToSet: { cmt_ids: r._id } };
      return Faq.updateOne(f, s);
    })
    .then((r) => {
      if (!r.nModified) return res.send({ success: false, msg : 'already Faq' });
      res.send({ success: true, d: cr });
    })
    .catch((err) => {
      res.send({ success: false, msg : err.message });
    });
};

exports.modCmt = (req, res) => {
  const set = req.body;

  if (!Object.keys(set).length) return res.send({ success: false, msg: 'body not set' });
  if (!set._id) return res.send({ success: false, msg: 'id not exists' });
  set.ut = new Date();
  set.ip = req.ip;

  const f = { _id: set._id };
  const s = { $set: set };

  FaqComment.findOneAndUpdate(f, s)
    .then(() => {
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg: err.message });
    });
};

exports.delCmt = (req, res) => {
  const _id = req.query._id;
  if (!_id) return res.send({ success: false, msg : 'param id not exists' });
  FaqComment.findOne({_id:_id})
    .then((r) => {
      if (!r) throw new Error('group not exists');
      const f = { _id: r.bd_id };
      const s = { $pull: { cmt_ids: r._id } };
      return Faq.updateOne(f, s);
    })
    .then(() => { // { n: 1, nModified: 1, ok: 1 }
      return FaqComment.remove({ _id: _id });
    })
    .then(() => { // { n: 1, ok: 1 }
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg : err.message });
    });
}