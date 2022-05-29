const mongoose = require('mongoose');

const npcSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.ObjectId,
      required: [true, 'An npc must have an associated sheetId'],
    },
    name: {
      type: String,
      required: [true, 'An npc must have a name'],
    },
    speciesId: {
      type: mongoose.ObjectId,
      required: [true, 'An npc must have an associated speciesId'],
    },
    speciesName: {
      type: String,
      required: [true, 'An npc must have a speciesName'],
    },
    specialtyId: {
      type: mongoose.ObjectId,
      // required: [true, 'An npc must have an associated specialtyId'],
    },
    specialtyName: {
      type: String,
      // required: [true, 'An npc must have a specialtyName'],
    },
    diplomacy: {
      type: String,
      enum: ['Ally', 'Neutral', 'Enemy'],
      default: 'Neutral',
    },
    type: {
      type: String,
      enum: ['Combat', 'Athlete', 'Politician', 'Scoundrel', 'Academic', 'Pedestrian'],
    },
    levelId: {
      type: mongoose.ObjectId,
      required: [true, 'An npc must have an associated levelId'],
    },
    temperament: {
      type: String,
      enum: ['Earth', 'Fire', 'Water', 'Air'],
    },
    background: {
      type: String,
      required: [true, 'An npc must have a background'],
    },
    description: {
      type: String,
      required: [true, 'An npc must have a description'],
    },
    wallet: {
      type: Number,
      default: 0,
    },
    mortality: {
      type: Number,
      min: 0,
      default: 0,
    },
    spentUpgradePoints: {
      type: Number,
      min: 0,
      default: 0,
    },
    currentHp: {
      type: Number,
      required: [true, 'An npc must be given a starting currentHp'],
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
        // max: 20,
        default: 3,
      },
      advantage: {
        type: Number,
        default: 0,
      },
      experience: {
        type: Number,
        default: 0,
      },
      modifier: {
        type: Number,
        min: -5,
        max: 5,
        default: 0,
      },
      pool: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
    agility: {
      points: {
        type: Number,
        min: 1,
        // max: 20,
        default: 3,
      },
      advantage: {
        type: Number,
        default: 0,
      },
      experience: {
        type: Number,
        default: 0,
      },
      modifier: {
        type: Number,
        min: -5,
        max: 5,
        default: 0,
      },
      pool: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
    persona: {
      points: {
        type: Number,
        min: 1,
        // max: 20,
        default: 3,
      },
      advantage: {
        type: Number,
        default: 0,
      },
      experience: {
        type: Number,
        default: 0,
      },
      modifier: {
        type: Number,
        min: -5,
        max: 5,
        default: 0,
      },
      pool: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
    aptitude: {
      points: {
        type: Number,
        min: 1,
        // max: 20,
        default: 3,
      },
      advantage: {
        type: Number,
        default: 0,
      },
      experience: {
        type: Number,
        default: 0,
      },
      modifier: {
        type: Number,
        min: -5,
        max: 5,
        default: 0,
      },
      pool: {
        type: Number,
        min: 0,
        default: 0,
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

// Virtual properties
npcSchema.virtual('power').get(function () {
  return this.fortitude.points + this.fortitude.modifier + this.agility.points + this.agility.modifier + this.persona.points + this.persona.modifier + this.aptitude.points + this.aptitude.modifier;
});

npcSchema.virtual('maxHp').get(function () {
  return (this.fortitude.points + this.fortitude.modifier) * 5;
});

npcSchema.virtual('shieldValue').get(function () {
  return this.agility.points + this.agility.modifier;
});

npcSchema.virtual('initiative').get(function () {
  return this.persona.points + this.persona.modifier;
});

npcSchema.virtual('assist').get(function () {
  return Math.floor((this.aptitude.points + this.aptitude.modifier) / 2);
});

npcSchema.virtual('upgradePoints').get(function () {
  const power = this.fortitude.points + this.agility.points + this.persona.points + this.aptitude.points;
  return power - this.spentUpgradePoints - 12;
});

npcSchema.virtual('augmentations', {
  ref: 'Augmentation',
  foreignField: 'npcId',
  localField: '_id',
});

npcSchema.virtual('weapons', {
  ref: 'Weapon',
  foreignField: 'npcId',
  localField: '_id',
});

npcSchema.virtual('wearables', {
  ref: 'Wearable',
  foreignField: 'npcId',
  localField: '_id',
});

npcSchema.virtual('consumables', {
  ref: 'Consumable',
  foreignField: 'npcId',
  localField: '_id',
});

npcSchema.virtual('usables', {
  ref: 'Usable',
  foreignField: 'npcId',
  localField: '_id',
});

// Document middleware
npcSchema.pre(/^find/, function (next) {
  // Populate all the virtual reference fields
  this.populate([{ path: 'augmentations' }, { path: 'weapons' }, { path: 'wearables' }, { path: 'consumables' }, { path: 'usables' }]);
  next();
});

const Npc = mongoose.model('Npc', npcSchema);

module.exports = Npc;
