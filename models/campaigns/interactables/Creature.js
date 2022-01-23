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
      enum: ['fortitude', 'agility', 'persona', 'aptitude'],
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
    currentHp: {
      type: Number,
      required: [true, 'A creature must be given a starting currentHp'],
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
    fortitude: {
      points: {
        type: Number,
        min: 1,
        max: 10,
        default: 3,
      },
      advantage: {
        type: Number,
        default: 0,
      },
    },
    agility: {
      points: {
        type: Number,
        min: 1,
        max: 10,
        default: 3,
      },
      advantage: {
        type: Number,
        default: 0,
      },
    },
    persona: {
      points: {
        type: Number,
        min: 1,
        max: 10,
        default: 3,
      },
      advantage: {
        type: Number,
        default: 0,
      },
    },
    aptitude: {
      points: {
        type: Number,
        min: 1,
        max: 10,
        default: 3,
      },
      advantage: {
        type: Number,
        default: 0,
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true }
);

// virtual properties
creatureSchema.virtual('power').get(function () {
  return this.fortitude.points + this.agility.points + this.persona.points + this.aptitude.points;
});

creatureSchema.virtual('maxHp').get(function () {
  return this.fortitude.points * 5;
});

creatureSchema.virtual('dodgeValue').get(function () {
  return Math.floor(this.agility.points / 3);
});

const Creature = mongoose.model('Creature', creatureSchema);

module.exports = Creature;
