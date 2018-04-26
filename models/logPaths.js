const mongoose = require('mongoose');

const logPathSchema = new mongoose.Schema({
  u_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  path: { type: String, default: '/' },
  method: { type: String, default: '' },
  body: { type: String, default: '' },
  query: { type: String, default: '' },
  ip: { type: String, default: '' },
});

module.exports = mongoose.model('LogPath', logPathSchema);
