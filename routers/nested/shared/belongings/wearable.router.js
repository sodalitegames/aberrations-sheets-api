const express = require('express');

const wearableController = require('../../../../controllers/shared/belongings/wearable.controller');

const router = express.Router({ mergeParams: true });

router.route('/').get(wearableController.getWearablesForSheet).post(wearableController.createWearableForSheet);
router.route('/:wearableId').get(wearableController.getWearable).patch(wearableController.updateWearable).delete(wearableController.deleteWearable);

module.exports = router;
