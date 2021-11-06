const mongoose = require('mongoose');

const usableSchema = new mongoose.Schema({
  sheetId: {
    type: mongoose.ObjectId,
    required: [true, 'A usable must have an associated sheetId'],
  },
  name: {
    type: String,
    required: [true, 'A usable must have a name'],
  },
  description: {
    type: String,
    required: [true, 'A usable must have a description'],
  },
  type: {
    type: String,
    enum: ['Unique', 'Common', 'Rare', 'Coveted'],
    required: [true, 'A usable must have a specified type'],
  },
});

const Usable = mongoose.model('Usable', usableSchema);

module.exports = Usable;
