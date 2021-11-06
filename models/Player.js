const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  _id: {
    type: mongoose.ObjectId,
    required: [true, 'Must provide ObjectId.'],
  },
  createdAt: Date,
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
