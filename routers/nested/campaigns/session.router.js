const express = require('express');

const sessionController = require('../../../controllers/campaigns/session.controller');

const router = express.Router({ mergeParams: true });

router.route('/').get(sessionController.getSessionsForSheet).post(sessionController.createSessionForSheet);
router.route('/:sessionId').get(sessionController.getSession).patch(sessionController.updateSession).delete(sessionController.deleteSession);

module.exports = router;
