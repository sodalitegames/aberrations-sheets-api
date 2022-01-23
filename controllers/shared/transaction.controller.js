const Transaction = require('../../models/shared/Transaction');

const factory = require('../../utils/handlerFactory');

exports.getTransactionsForSheet = factory.getAllForSheet(Transaction);
exports.createTransactionForSheet = factory.createOneForSheet(Transaction);
exports.getTransaction = factory.getOne(Transaction); // optional: populateOptions {path: 'reviews'}
exports.updateTransaction = factory.updateOne(Transaction); // optional: restrictedFields ['field1', 'field2']
exports.deleteTransaction = factory.deleteOne(Transaction);
