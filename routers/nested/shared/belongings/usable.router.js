const express = require('express');

const usableController = require('../../../../controllers/shared/belongings/usable.controller');

const router = express.Router({ mergeParams: true });

router.route('/').get(usableController.getUsablesForSheet).post(usableController.createUsableForSheet);
router.route('/:usableId').get(usableController.getUsable).patch(usableController.updateUsable).delete(usableController.deleteUsable);

module.exports = router;
