const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.ObjectId,
      required: [true, 'A note must have an associated sheetId'],
    },
    plainText: String,
    content: String,
  },
  { timestamps: true }
);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
