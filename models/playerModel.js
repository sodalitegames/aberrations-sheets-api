const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
