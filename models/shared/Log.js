const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.ObjectId,
      required: [true, 'A log must have an associated sheetId'],
    },
    date: {
      type: Date,
      required: [true, 'A log must have a date'],
    },
    content: {
      type: String,
      required: [true, 'A log must have content'],
    },
  },
  { timestamps: true }
);

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
