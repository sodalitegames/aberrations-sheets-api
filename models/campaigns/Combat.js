const mongoose = require('mongoose');

const combatSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.ObjectId,
      required: [true, 'A combat must have an associated sheetId'],
    },
    activeTurn: mongoose.Schema.ObjectId,
    description: {
      type: String,
      required: [true, 'A combat must have a description'],
    },
    combatants: {
      type: [{ name: String, type: { type: String, enum: ['players', 'npcs', 'creatures'] }, _id: mongoose.Schema.ObjectId, initiative: Number, inCombat: Boolean }],
      required: [true, 'A combat must have combatants'],
    },
  },
  { timestamps: true }
);

const Combat = mongoose.model('Combat', combatSchema);

module.exports = Combat;
