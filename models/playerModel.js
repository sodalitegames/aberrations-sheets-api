const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'A player must have an email address'],
  },
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
