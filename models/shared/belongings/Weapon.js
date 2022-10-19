const mongoose = require('mongoose');

const weaponSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.ObjectId,
      required: [true, 'A weapon must have an associated sheetId'],
    },
    npcId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Npc',
    },
    universalId: mongoose.Schema.ObjectId,
    name: {
      type: String,
      required: [true, 'A weapon must have a name'],
    },
    nickname: String,
    description: String,
    ability: String,
    type: {
      type: String,
      enum: ['Standard', 'Improvised', 'Custom'],
      required: [true, 'A weapon must have a specified type'],
    },
    damageModifier: {
      type: Number,
      min: 1,
      required: [true, 'A weapon must have a damageModifier'],
    },
    associatedStat: {
      type: String,
      enum: ['strength', 'agility', 'persona', 'aptitude'],
      required: [true, 'A weapon must have an associatedStat'],
    },
    range: {
      type: String,
      enum: ['Close', 'Short', 'Long', 'Far'],
      required: [true, 'A weapon must have a range'],
    },
    quantity: {
      type: Number,
      min: 1,
      default: 1,
    },
    equipped: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    metadata: mongoose.Mixed,
  },
  { timestamps: true }
);

const Weapon = mongoose.model('Weapon', weaponSchema);

module.exports = Weapon;
