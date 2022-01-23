const express = require('express');

const transactionController = require('../../../controllers/shared/transaction.controller');

const router = express.Router({ mergeParams: true });

router.route('/').get(transactionController.getTransactionsForSheet).post(transactionController.createTransactionForSheet);
router.route('/:transactionId').get(transactionController.getTransaction).patch(transactionController.updateTransaction).delete(transactionController.deleteTransaction);

module.exports = router;
