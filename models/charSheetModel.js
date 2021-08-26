const mongoose = require('mongoose');

const charSheetSchema = new mongoose.Schema({
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
  // speciesId: {
  //   type: mongoose.ObjectId,
  //   required: [true, 'A character sheet must have an associated speciesId'],
  // },
  charBackground: {
    type: String,
    required: [true, 'A character sheet must have a charBackground'],
  },
  charDescription: {
    type: String,
    required: [true, 'A character sheet must have a charDescription'],
  },
  lifeKredits: Number,
});

const CharSheet = mongoose.model('CharSheet', charSheetSchema);

module.exports = CharSheet;
