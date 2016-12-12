const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  time: { type: Number, required: true }
});

module.exports = mongoose.model('Wish', wishSchema);
