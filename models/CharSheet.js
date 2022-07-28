const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const charSheetSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.ObjectId,
      required: [true, 'A character sheet must have an associated playerId'],
    },
    playerName: {
      type: String,
      required: [true, 'A character sheet must have a playerName'],
    },
    playerNickname: String,
    characterName: {
      type: String,
      required: [true, 'A character sheet mmust have a characterName'],
    },
    speciesId: {
      type: mongoose.ObjectId,
      required: [true, 'A character sheet must have an associated speciesId'],
    },
    speciesName: {
      type: String,
      required: [true, 'A character sheet must have a speciesName'],
    },
    specialtyId: {
      type: mongoose.ObjectId,
      // required: [true, 'A character sheet must have an associated specialtyId'],
    },
    specialtyName: {
      type: String,
      // required: [true, 'A character sheet must have a specialtyName'],
    },
    charBackground: {
      type: String,
      required: [true, 'A character sheet must have a charBackground'],
    },
    charDescription: {
      type: String,
      required: [true, 'A character sheet must have a charDescription'],
    },
    campaign: { type: mongoose.Schema.ObjectId, ref: 'Campaigns' },
    wallet: {
      type: Number,
      default: 0,
    },
    mortality: {
      type: Number,
      min: 0,
      default: 0,
    },
    currentHp: {
      type: Number,
      required: [true, 'A character sheet must be given a starting currentHp'],
    },
    maxHp: {
      type: Number,
      required: [true, 'A character sheet must be given a starting maxHp'],
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
    slug: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true }
);

// Virtual properties
charSheetSchema.virtual('speed').get(function () {
  // modified by augmentations and wearables
  return 3;
});

charSheetSchema.virtual('shieldValue').get(function () {
  // determined by augmentations and wearables
  return 0;
});

charSheetSchema.virtual('modifiers').get(function () {
  // determined by augmentations and wearables
  return [];
});

// Document middleware
charSheetSchema.pre('save', function (next) {
  // Runs before save and create, but NOT update
  this.slug = slugify(this.characterName, { lower: true });
  next();
});

charSheetSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

charSheetSchema.pre(/^find/, function (next) {
  // Populate the campaign's basic details
  this.populate({ path: 'campaign', select: 'name overview ccName ccNickname players' });
  next();
});

charSheetSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

const CharSheet = mongoose.model('Characters', charSheetSchema);

module.exports = CharSheet;
