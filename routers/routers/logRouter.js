const express = require('express');

const logController = require('../../controllers/logController');

const router = express.Router();

router.route('/:charid').get(logController.getLogsByCharSheetId).post(logController.createLogForCharSheet);
router.route('/:campid').get(logController.getLogsByCampSheetId).post(logController.createLogForCampSheet);
router.route('/:id').patch(logController.updateLog).delete(logController.deleteLog);

module.exports = router;
