const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const wishSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  time: { type: Number, required: true },
  filtered: { type: Boolean, required: true },
  isVip: { type: Boolean, required: false }
});

module.exports = mongoose.model('Wish', wishSchema);
