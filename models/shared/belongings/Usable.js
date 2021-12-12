const mongoose = require('mongoose');

const usableSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.ObjectId,
      required: [true, 'A usable must have an associated sheetId'],
    },
    npcId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Npc',
    },
    name: {
      type: String,
      required: [true, 'A usable must have a name'],
    },
    description: {
      type: String,
      required: [true, 'A usable must have a description'],
    },
    type: {
      type: String,
      enum: ['Common', 'Semi-Common', 'Rare', 'Collectible', 'One of A Kind'],
      required: [true, 'A usable must have a specified type'],
    },
    equippable: {
      type: Boolean,
      default: true,
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
  },
  { timestamps: true }
);

const Usable = mongoose.model('Usable', usableSchema);

module.exports = Usable;
