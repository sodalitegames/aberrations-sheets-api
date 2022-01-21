const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.ObjectId,
      required: [true, 'A session must have an associated sheetId'],
    },
    name: String,
    dateScheduled: Date,
    datePlayed: Date,
    completed: Boolean,
    active: Boolean,
    content: {
      type: String,
      required: [true, 'A session must have content'],
    },
  },
  { timestamps: true }
);

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
