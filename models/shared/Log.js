const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  sheetId: mongoose.ObjectId || null,
  date: {
    type: Date,
    required: [true, 'A log must have a date'],
  },
  content: {
    type: String,
    required: [true, 'A log must have content'],
  },
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
