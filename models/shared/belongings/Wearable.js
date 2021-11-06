const mongoose = require('mongoose');

const wearableSchema = new mongoose.Schema({
  sheetId: {
    type: mongoose.ObjectId,
    required: [true, 'A wearable must have an associated sheetId'],
  },
  name: {
    type: String,
    required: [true, 'A wearable must have a name'],
  },
  nickname: String,
  description: {
    type: String,
    required: [true, 'A wearable must have a description'],
  },
  bodyArea: {
    type: String,
    enum: [],
    required: [true, 'A wearable must have a specified bodyArea'],
  },
  statMods: {
    type: [{ stat: { type: String, enum: ['Fortitude', 'Agility', 'Persona', 'Aptitude'] }, amount: Number }],
  },
});

const Wearable = mongoose.model('Wearable', wearableSchema);

module.exports = Wearable;
