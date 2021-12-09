const express = require('express');

const consumableController = require('../../../../controllers/shared/belongings/consumable.controller');

const router = express.Router({ mergeParams: true });

router.route('/').get(consumableController.getConsumablesForSheet).post(consumableController.createConsumableForSheet);
router.route('/:consumableId').get(consumableController.getConsumable).patch(consumableController.updateConsumable).delete(consumableController.deleteConsumable);

module.exports = router;
