const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  sheetId: mongoose.ObjectId || null,
  content: {
    type: String,
    required: [true, 'A note must have content'],
  },
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
