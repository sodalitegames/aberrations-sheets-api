const express = require('express');

const logController = require('../../controllers/controllers/logController');

const router = express.Router({ mergeParams: true });

router.route('/').get(logController.getLogsForSheet).post(logController.createLogForSheet);
router.route('/:logId').patch(logController.updateLog).delete(logController.deleteLog);

module.exports = router;
