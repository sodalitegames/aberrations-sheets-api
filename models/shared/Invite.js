const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema(
  {
    charSheetId: {
      type: mongoose.ObjectId,
      required: [true, 'An invite must have a charSheetId'],
    },
    campSheetId: {
      type: mongoose.ObjectId,
      required: [true, 'An invite must have a campSheetId'],
    },
    message: String,
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Denied'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const Invite = mongoose.model('Invite', inviteSchema);

module.exports = Invite;
