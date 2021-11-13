const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.ObjectId,
      required: [true, 'An invite must have a sheetId'],
    },
    charSheetId: {
      type: mongoose.ObjectId,
      required: [true, 'An invite must have a charSheetId'],
    },
    message: String,
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Denied', 'Revoked', 'Error'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const Invite = mongoose.model('Invite', inviteSchema);

module.exports = Invite;