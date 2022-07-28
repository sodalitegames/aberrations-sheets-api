const mongoose = require('mongoose');

const consumableSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.ObjectId,
      required: [true, 'A consumable must have an associated sheetId'],
    },
    npcId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Npc',
    },
    name: {
      type: String,
      required: [true, 'A consumable must have a name'],
    },
    description: String,
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
      enum: ['strength', 'agility', 'persona', 'aptitude'],
    },
    categories: {
      type: [{ name: String, description: String, universalId: mongoose.Schema.ObjectId }],
      required: [true, 'A consumable must belong to at least one category'],
    },
    equipped: {
      type: Boolean,
      default: false,
    },
    quantity: {
      type: Number,
      min: 1,
      default: 1,
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

const Consumable = mongoose.model('Consumable', consumableSchema);

module.exports = Consumable;
