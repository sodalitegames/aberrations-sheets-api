const mongoose = require('mongoose');

const environmentSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.ObjectId,
      required: [true, 'An environment must have an associated sheetId'],
    },
    name: {
      type: String,
      required: [true, 'An environment must have a name'],
    },
    description: {
      type: String,
      required: [true, 'An environment must have a description'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Environment = mongoose.model('Environment', environmentSchema);

module.exports = Environment;
