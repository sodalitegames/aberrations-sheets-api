const mongoose = require('mongoose');

const wearableSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.ObjectId,
      required: [true, 'A wearable must have an associated sheetId'],
    },
    npcId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Npc',
    },
    name: {
      type: String,
      required: [true, 'A wearable must have a name'],
    },
    description: {
      type: String,
      required: [true, 'A wearable must have a description'],
    },
    bodyArea: {
      type: String,
      enum: ['head', 'face', 'torso', 'arms', 'hands', 'legs', 'feet'],
      required: [true, 'A wearable must have a specified bodyArea'],
    },
    statMods: {
      fortitude: {
        type: Number,
        default: 0,
      },
      agility: {
        type: Number,
        default: 0,
      },
      persona: {
        type: Number,
        default: 0,
      },
      aptitude: {
        type: Number,
        default: 0,
      },
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
  },
  { timestamps: true }
);

const Wearable = mongoose.model('Wearable', wearableSchema);

module.exports = Wearable;
