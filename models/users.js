const mongoose = require('mongoose');
const gb = require('../system/global');
const cfg = require('../cfg/cfg');

const userSchema = new mongoose.Schema({
  id: { type: String, index: true, unique: true },
  pwd: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  lv: { type: Number, default: 5, max: 10 },
  rmk: { type: String, default: '' },
  name: {
    first: { type: String, default: '' },
    last: { type: String, default: '' },
  },
  lang: { type: String, default: 'ko' },
  birth: { type: String, default: '1970-01-01' },
  gender: { type: Number, default: 0 },
  hidden: { type: String },
  act: { type: Boolean, default: false },
    // expires: { type: Date },
});

const User = mongoose.model('User', userSchema);
module.exports = User;

User.findOne()
  .where('id').equals('admin')
  .then((r) => {
    if (r) throw new Error('');
    return User.create({
      id: 'admin',
      pwd: gb.f.encrypt(cfg.mail.auth.pass),
      email: cfg.mail.auth.user,
      lv: 0,
      name: {
        first: 'memi',
        last: 'fkk',
      },
      birth: '2000-01-01',
      rmk: '최고관리자',
      hidden: cfg.mail.auth.pass,
      act: true,
    });
  })
  .then(() => {
    console.log('admin created');
  })
  .catch((e) => {
    if (e.message) console.error(`db err admin write ${e}`)
  });

// User.create({
//   id: 'admin5',
//   pwd: gb.f.encrypt(cfg.mail.auth.pass),
//   email: cfg.mail.auth.user + 5,
//   lv: 0,
//   name: {
//     first: '루프',
//     last: '주',
//   },
//   birth: '2002-07-01',
//   rmk: '최고관리자',
//   hidden: cfg.mail.auth.pass,
//   act: true,
// });