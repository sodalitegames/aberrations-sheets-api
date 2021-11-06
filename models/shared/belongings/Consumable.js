const mongoose = require('mongoose');

const consumableSchema = new mongoose.Schema({
  sheetId: {
    type: mongoose.ObjectId,
    required: [true, 'A consumable must have an associated sheetId'],
  },
  name: {
    type: String,
    required: [true, 'A consumable must have a name'],
  },
  description: {
    type: String,
    required: [true, 'A consumable must have a description'],
  },
  level: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'A consumable must have a level'],
  },
  uses: {
    type: Number,
    required: [true, 'A consumable must have a specified number of uses'],
  },
  associatedStat: {
    type: String,
    enum: ['Fortitude', 'Agility', 'Persona', 'Aptitude'],
  },
  categories: {
    type: [{ name: String, description: String }],
    required: [true, 'A consumable must belong to at least one category'],
  },
});

const Consumable = mongoose.model('Consumable', consumableSchema);

module.exports = Consumable;
