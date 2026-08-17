const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  domain: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);