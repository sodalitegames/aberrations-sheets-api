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
      min: 1,
      default: 1,
    },
    modifiers: {
      type: [{ modifier: String, amount: Number }],
      default: [],
    },
    currentHp: {
      type: Number,
      required: [true, 'An npc must be given a starting currentHp'],
    },
    maxHp: {
      type: Number,
      required: [true, 'An npc must be given a starting maxHp'],
    },
    milestones: {
      type: Number,
      default: 0,
    },
    experience: {
      type: Number,
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

// Virtual properties
npcSchema.virtual('speed').get(function () {
  // modified by augmentations and wearables
  return 3;
});

npcSchema.virtual('shieldValue').get(function () {
  // determined by augmentations and wearables
  return 0;
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
