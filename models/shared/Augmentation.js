const mongoose = require('mongoose');

const augmentationSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.ObjectId,
      required: [true, 'An augmentation must have an associated sheetId'],
    },
    npcId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Npc',
    },
    name: {
      type: String,
      required: [true, 'An augmentation must have a name'],
    },
    description: {
      type: String,
      required: [true, 'An augmentation must have a description'],
    },
    pointCost: {
      type: Number,
      required: [true, 'An augmentation must have a pointCost'],
    },
  },
  { timestamps: true }
);

const Augmentation = mongoose.model('Augmentation', augmentationSchema);

module.exports = Augmentation;
