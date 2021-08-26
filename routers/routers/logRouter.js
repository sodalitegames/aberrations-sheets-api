const express = require('express');

const logController = require('../../controllers/logController');

const router = express.Router();

router.route('/:sheetType/:sheetId').get(logController.getLogsBySheetId).post(logController.createLogForSheet);
router.route('/:id').patch(logController.updateLog).delete(logController.deleteLog);

module.exports = router;
