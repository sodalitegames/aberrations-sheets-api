const mongoose = require('mongoose');

const weaponSchema = new mongoose.Schema({
  sheetId: {
    type: mongoose.ObjectId,
    required: [true, 'A weapon must have an associated sheetId'],
  },
  name: {
    type: String,
    required: [true, 'A weapon must have a name'],
  },
  nickname: String,
  description: {
    type: String,
    required: [true, 'A weapon must have a description'],
  },
  ability: String,
  type: {
    type: String,
    enum: ['Standard', 'Improvised', 'Custom'],
    required: [true, 'A weapon must have a specified type'],
  },
  levelDamage: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'A weapon must have a levelDamage'],
  },
  associatedStat: {
    type: String,
    enum: ['Fortitude', 'Agility', 'Persona', 'Aptitude'],
    required: [true, 'A weapon must have an associatedStat'],
  },
  range: {
    type: String,
    required: [true, 'A weapon must have a range'],
  },
});

const Weapon = mongoose.model('Weapon', weaponSchema);

module.exports = Weapon;
