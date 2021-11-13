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
    characterName: {
      type: String,
      required: [true, 'A character sheet mmust have a characterName'],
    },
    speciesId: {
      type: mongoose.ObjectId,
      required: [true, 'A character sheet must have an associated speciesId'],
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
      min: 0,
      default: 0,
    },
    upgradePoints: {
      type: Number,
      min: 0,
      default: 0,
    },
    generalExhaustion: {
      type: Number,
      min: 0,
      default: 0,
    },
    currentHp: {
      type: Number,
      min: 0,
      default: 15,
    },
    fortitude: {
      points: {
        type: Number,
        min: 1,
        max: 10,
        default: 3,
      },
      exhaustion: {
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
    },
    agility: {
      points: {
        type: Number,
        min: 1,
        max: 10,
        default: 3,
      },
      exhaustion: {
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
    },
    persona: {
      points: {
        type: Number,
        min: 1,
        max: 10,
        default: 3,
      },
      exhaustion: {
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
    },
    aptitude: {
      points: {
        type: Number,
        min: 1,
        max: 10,
        default: 3,
      },
      exhaustion: {
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
    },
    equipped: {
      weapons: {
        type: Number,
        min: 0,
        max: 2,
        default: 0,
      },
      consumables: {
        type: Number,
        min: 0,
        max: 3,
        default: 0,
      },
      usables: {
        type: Number,
        min: 0,
        max: 3,
        default: 0,
      },
      wearables: {
        head: {
          type: Boolean,
          default: false,
        },
        face: {
          type: Boolean,
          default: false,
        },
        torso: {
          type: Boolean,
          default: false,
        },
        arms: {
          type: Boolean,
          default: false,
        },
        hands: {
          type: Boolean,
          default: false,
        },
        legs: {
          type: Boolean,
          default: false,
        },
        feet: {
          type: Boolean,
          default: false,
        },
      },
    },
    slug: String,
  },
  { toJSON: { virtuals: true }, timestamps: true }
);

// Virtual properties
charSheetSchema.virtual('power').get(function () {
  return this.fortitude.points + this.fortitude.modifier + this.agility.points + this.agility.modifier + this.persona.points + this.persona.modifier + this.aptitude.points + this.aptitude.modifier;
});

charSheetSchema.virtual('maxHp').get(function () {
  return (this.fortitude.points + this.fortitude.modifier) * 5;
});

charSheetSchema.virtual('dodgeValue').get(function () {
  return Math.floor((this.agility.points + this.agility.modifier) / 3);
});

charSheetSchema.virtual('initiative').get(function () {
  return this.persona.points + this.persona.modifier;
});

charSheetSchema.virtual('assist').get(function () {
  return Math.floor((this.aptitude.points + this.aptitude.modifier) / 2);
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
