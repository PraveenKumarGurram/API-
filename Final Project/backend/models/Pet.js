
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: String,
  type: String,
  status: String, // 'lost' or 'found'
  description: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pet', petSchema);
