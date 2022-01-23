const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.ObjectId,
      required: [true, 'A transaction must have a sending sheetId'],
    },
    receivingSheetId: {
      type: mongoose.ObjectId,
      required: [true, 'A transaction must have a receivingSheetId'],
    },
    senderName: {
      type: String,
      required: [true, 'A transaction must have a senderName'],
    },
    recipientName: {
      type: String,
      required: [true, 'A transaction must have a recipientName'],
    },
    message: String,
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined', 'Revoked', 'Error'],
      default: 'Pending',
    },
    sellPrice: {
      type: Number,
      default: 0,
    },
    document: {
      type: mongoose.Mixed,
      required: [true, 'A transaction must have a document being sent'],
    },
    documentType: {
      type: String,
      enum: ['weapons', 'wearables', 'consumables', 'usables', 'wallet'],
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
