const express = require('express');

const environmentController = require('../../../../controllers/campaigns/interactables/environment.controller');

const router = express.Router({ mergeParams: true });

router.route('/').get(environmentController.getEnvironmentsForSheet).post(environmentController.createEnvironmentForSheet);
router.route('/:environmentId').get(environmentController.getEnvironment).patch(environmentController.updateEnvironment).delete(environmentController.deleteEnvironment);

module.exports = router;
