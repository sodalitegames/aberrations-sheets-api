const express = require('express');

const augmentationController = require('../../../controllers/shared/augmentation.controller');

const router = express.Router({ mergeParams: true });

router.route('/').get(augmentationController.getAugmentationsForSheet).post(augmentationController.createAugmentationForSheet);
router.route('/:augmentationId').get(augmentationController.getAugmentation).patch(augmentationController.updateAugmentation).delete(augmentationController.deleteAugmentation);

module.exports = router;
