const mongoose = require('mongoose');

const creatureSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.ObjectId,
      required: [true, 'A creature must have an associated sheetId'],
    },
    name: {
      type: String,
      required: [true, 'A creature must have a name'],
    },
    description: {
      type: String,
      required: [true, 'A creature must have a description'],
    },
    damageLevel: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'A creature must have a damageLevel'],
    },
    attackingStat: {
      type: String,
      enum: ['strength', 'agility', 'persona', 'aptitude'],
      required: [true, 'A creature must have an attackingStat'],
    },
    types: {
      type: [{ name: String, description: String, universalId: mongoose.Schema.ObjectId }],
      required: [true, 'A creature must have at least one type'],
    },
    mortality: {
      type: Number,
      min: 1,
      default: 1,
    },
    modifiers: {
      type: [{ modifier: String, amount: Number }],
      default: [],
    },
    currentHp: {
      type: Number,
      required: [true, 'A creature must be given a starting currentHp'],
    },
    maxHp: {
      type: Number,
      required: [true, 'A creature must be given a starting maxHp'],
    },
    speed: {
      type: Number,
      required: [true, 'A creature must have a speed'],
      default: 3,
    },
    shieldValue: {
      type: Number,
      required: [true, 'A creature must have a shield value'],
      default: 0,
    },
    conditions: {
      slowed: {
        type: Number,
        default: 0,
      },
      agony: {
        type: Number,
        default: 0,
      },
      injured: {
        type: Number,
        default: 0,
      },
      disturbed: {
        type: Number,
        default: 0,
      },
    },
    strength: {
      die: {
        type: Number,
        min: 2,
        max: 20,
        default: 2,
        enum: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
      },
    },
    agility: {
      die: {
        type: Number,
        min: 2,
        max: 20,
        default: 2,
        enum: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
      },
    },
    persona: {
      die: {
        type: Number,
        min: 2,
        max: 20,
        default: 2,
        enum: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
      },
    },
    aptitude: {
      die: {
        type: Number,
        min: 2,
        max: 20,
        default: 2,
        enum: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true }
);

const Creature = mongoose.model('Creature', creatureSchema);

module.exports = Creature;
