const mongoose = require('mongoose');

const campSheetSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.ObjectId,
    required: [true, 'A campaign sheet must have an associated playerId'],
  },
  name: {
    type: String,
    required: [true, 'A campaign sheet must have a name'],
  },
  overview: {
    type: String,
    required: [true, 'A campaign sheet must have an overview'],
  },
  details: {
    type: String,
    required: [true, 'A campaign sheet must have details'],
  },
});

const CampSheet = mongoose.model('CampSheet', campSheetSchema);

module.exports = CampSheet;
