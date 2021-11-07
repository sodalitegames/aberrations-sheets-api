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
    // speciesId: {
    //   type: mongoose.ObjectId,
    //   required: [true, 'An npc must have an associated speciesId'],
    // },
    diplomacy: {
      type: String,
      enum: ['Ally', 'Neutral', 'Enemy'],
      default: 'Neutral',
    },
    type: {
      type: String,
      enum: ['Combat', 'Athlete', 'Politician', 'Scoundrel', 'Academic', 'Pedestrian'],
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
        min: 0,
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
        min: 0,
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
        min: 0,
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
        min: 0,
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// virtual properties
npcSchema.virtual('power').get(function () {
  return this.fortitude.points + this.agility.points + this.persona.points + this.aptitude.points;
});

npcSchema.virtual('maxHp').get(function () {
  return this.fortitude.points * 5;
});

npcSchema.virtual('dodgeValue').get(function () {
  return Math.floor(this.agility.points / 3);
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

const Npc = mongoose.model('Npc', npcSchema);

module.exports = Npc;
