const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.ObjectId,
      required: [true, 'Must provide ObjectId.'],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, 'Must provide email.'],
    },
  },
  { timestamps: true }
);

const Player = mongoose.model('Player', playerSchema);

// Connect to Auth Database
const auth = mongoose.connection.useDb(process.env.DB_AUTH_STRING);
// Create Player model in Auth Database
const AuthPlayer = auth.model('Player', playerSchema);

exports.Player = Player;
exports.AuthPlayer = AuthPlayer;
