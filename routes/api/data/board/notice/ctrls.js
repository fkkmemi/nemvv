const mongoose = require('mongoose');
const Board = require('../../../../../models/boards');
const Comment = require('../../../../../models/comments');

const boardSchema = Board.schema.obj;
const commentSchema = Comment.schema.obj;

boardSchema.cmt_ids = [{ type: mongoose.Schema.Types.ObjectId, ref: 'NoticeComment' }];
commentSchema.bd_id = { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', index: true, required: true };

const Notice = mongoose.model('Notice', boardSchema);
const NoticeComment = mongoose.model('NoticeComment', commentSchema);

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

  Notice.count()
    .where('title').regex(search)
    .then((c) => {
      d.cnt = c;
      const s = {}
      s[order] = sort;
      return Notice.find()
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
  Notice.findOneAndUpdate(f, s, o)
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

  if (req.user.lv > 1) return res.send({ success: false, msg : 'you have no authority' });
  if (!content) return res.send({ success: false, msg : 'content not exists' });

  const bd = new Notice({
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

  Notice.findOne(f)
    .select('u_id')
    .then((r) => {
      if (r.u_id.toString() !== req.user._id) throw new Error('you have no authority');
      return Notice.update(f, s);
    })
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
  Notice.findOne({ _id: _id })
    .select('u_id cmt_ids')
    .then((r) => {
      if (r.u_id.toString() !== req.user._id) throw new Error('you have no authority');
      cp = r;
      return NoticeComment.remove({ _id: { $in: r.cmt_ids } });
    })
    .then(() => {
      return Notice.remove({ _id: _id });
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

  if (!content) return res.send({ success: false, msg : 'content not exists' });

  const cmt = new NoticeComment({
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
      return Notice.updateOne(f, s);
    })
    .then((r) => {
      if (!r.nModified) return res.send({ success: false, msg : 'already Notice' });
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

  NoticeComment.findOne(f)
    .select('u_id')
    .then((r) => {
      if (r.u_id.toString() !== req.user._id) throw new Error('you have no authority');
      return NoticeComment.update(f, s);
    })
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
  NoticeComment.findOne({_id:_id})
    .select('u_id bd_id')
    .then((r) => {
      if (!r) throw new Error('group not exists');
      if (r.u_id.toString() !== req.user._id) throw new Error('you have no authority');
      const f = { _id: r.bd_id };
      const s = { $pull: { cmt_ids: r._id } };
      return Notice.updateOne(f, s);
    })
    .then(() => { // { n: 1, nModified: 1, ok: 1 }
      return NoticeComment.remove({ _id: _id });
    })
    .then(() => { // { n: 1, ok: 1 }
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg : err.message });
    });
}