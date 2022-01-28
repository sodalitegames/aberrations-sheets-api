const Transaction = require('../../models/shared/Transaction');

const CharSheet = require('../../models/CharSheet');
const CampSheet = require('../../models/CampSheet');

const Weapon = require('../../models/shared/belongings/Weapon');
const Wearable = require('../../models/shared/belongings/Wearable');
const Consumable = require('../../models/shared/belongings/Consumable');
const Usable = require('../../models/shared/belongings/Usable');

const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const filterObj = require('../../utils/filterObj');
const factory = require('../../utils/handlerFactory');

exports.getTransactionsForSheet = factory.getAllForSheet(Transaction);
exports.createTransactionForSheet = factory.createOneForSheet(Transaction);
exports.getTransaction = factory.getOne(Transaction); // optional: populateOptions {path: 'reviews'}

exports.deleteTransaction = catchAsync(async (req, res, next) => {
  // Execute the query
  const transaction = await Transaction.findByIdAndDelete(req.params.transactionId);

  if (!transaction) {
    return next(new AppError(`No transaction found with id ${transaction}`, 404));
  }

  // Send the response
  res.status(200).json({
    status: 'success',
    data: null,
    metadata: {
      receivingSheetType: transaction.receivingSheetType,
      receivingSheetId: transaction.receivingSheetId,
    },
  });
});

const updateReceivingSheet = async transaction => {
  let recipientResource;
  let recipientSheet;

  switch (transaction.status) {
    case 'Accepted':
      if ((transaction.documentType === 'wallet' || transaction.sellPrice) && transaction.receivingSheetType === 'characters') {
        const amount = transaction.sellPrice ? -parseInt(transaction.sellPrice) : parseInt(transaction.document.amount);

        recipientSheet = await CharSheet.findByIdAndUpdate(
          transaction.receivingSheetId,
          { $inc: { wallet: amount } },
          {
            new: true,
            runValidators: true,
          }
        );
      }

      if ((transaction.documentType === 'wallet' || transaction.sellPrice) && transaction.receivingSheetType === 'campaigns') {
        const amount = transaction.sellPrice ? -parseInt(transaction.sellPrice) : parseInt(transaction.document.amount);

        recipientSheet = await CampSheet.findByIdAndUpdate(
          transaction.receivingSheetId,
          { $inc: { wallet: amount } },
          {
            new: true,
            runValidators: true,
          }
        );
      }

      let newBody = {
        ...transaction.document,
        sheetId: transaction.receivingSheetId,
        _id: undefined,
        equipped: false,
        metadata: {
          givenBy: transaction.senderName,
        },
      };

      if (transaction.documentType === 'weapons') {
        recipientResource = await Weapon.create(newBody);
      }
      if (transaction.documentType === 'wearables') {
        recipientResource = await Wearable.create(newBody);
      }
      if (transaction.documentType === 'consumables') {
        recipientResource = await Consumable.create(newBody);
      }
      if (transaction.documentType === 'usables') {
        recipientResource = await Usable.create(newBody);
      }

      break;
    case 'Revoked':
    // send a message to the receiving sheet
    case 'Declined':
      // send a message to the sending sheet
      break;
    default:
      break;
  }

  return { recipientSheet, recipientResource };
};

const updateSendingSheet = async transaction => {
  let senderResource;
  let senderSheet;

  if ((transaction.documentType === 'wallet' || transaction.sellPrice) && transaction.sheetType === 'characters') {
    const amount = transaction.sellPrice ? parseInt(transaction.sellPrice) : -parseInt(transaction.document.amount);

    senderSheet = await CharSheet.findByIdAndUpdate(
      transaction.sheetId,
      { $inc: { wallet: amount } },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  if ((transaction.documentType === 'wallet' || transaction.sellPrice) && transaction.sheetType === 'campaigns') {
    const amount = transaction.sellPrice ? parseInt(transaction.sellPrice) : -parseInt(transaction.document.amount);

    senderSheet = await CampSheet.findByIdAndUpdate(
      transaction.sheetId,
      { $inc: { wallet: amount } },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  if (transaction.documentType === 'weapons') {
    senderResource = await Weapon.findByIdAndUpdate(
      transaction.document._id,
      { archived: true, metadata: { givenTo: transaction.recipientName } },
      {
        new: true,
        runValidators: true,
      }
    );
  }
  if (transaction.documentType === 'wearables') {
    senderResource = await Wearable.findByIdAndUpdate(
      transaction.document._id,
      { archived: true, metadata: { givenTo: transaction.recipientName } },
      {
        new: true,
        runValidators: true,
      }
    );
  }
  if (transaction.documentType === 'consumables') {
    senderResource = await Consumable.findByIdAndUpdate(
      transaction.document._id,
      { archived: true, metadata: { givenTo: transaction.recipientName } },
      {
        new: true,
        runValidators: true,
      }
    );
  }
  if (transaction.documentType === 'usables') {
    senderResource = await Usable.findByIdAndUpdate(
      transaction.document._id,
      { archived: true, metadata: { givenTo: transaction.recipientName } },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  return { senderSheet, senderResource };
};

exports.updateTransaction = catchAsync(async (req, res, next) => {
  // Specify specific fields allowed to be updated
  const filteredBody = filterObj.setAllowedFields(req.body, 'status', 'message');

  // Get the transaction
  const transaction = await Transaction.findById(req.params.transactionId);

  // If status has not been changed
  if (filteredBody.status && filteredBody.status === transaction.status) {
    return next(new AppError(`Transaction has already been ${transaction.status}`, 400));
  }

  // Update the transaction
  const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.transactionId, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!updatedTransaction) {
    return next(new AppError(`No transaction found with id ${req.params.transactionId}`, 404));
  }

  // FIRST - update the receiving sheet / create the new resource
  const { recipientSheet, recipientResource } = await updateReceivingSheet(updatedTransaction);

  // If updating the receiving sheet was unsuccessful
  // then set the transaction status to error
  if (
    updatedTransaction.status === 'Accepted' &&
    (((updatedTransaction.sellPrice || updatedTransaction.documentType === 'wallet') && !recipientSheet) || (updatedTransaction.documentType !== 'wallet' && !recipientResource))
  ) {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.transactionId,
      { status: 'Error' },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'fail',
      data: {
        doc: updatedTransaction,
        message: 'An error occurred updating the transaction status.',
      },
    });
    return;
  }

  if (updatedTransaction.status === 'Accepted') {
    // SECOND - if everything was successful, update the paying sheet / archive and update the old resource
    const { senderSheet, senderResource } = await updateSendingSheet(updatedTransaction);

    res.status(200).json({
      status: 'success',
      data: {
        doc: updatedTransaction,
        metadata: {
          recipientSheet,
          recipientResource,
          senderSheet,
          senderResource,
        },
        message: `Transaction has been successfully accepted.`,
      },
    });
    return;
  }

  // Send the response
  res.status(200).json({
    status: 'success',
    data: {
      doc: updatedTransaction,
    },
  });
});
