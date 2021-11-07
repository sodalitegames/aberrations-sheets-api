const express = require('express');

const inviteController = require('../../../controllers/shared/invite.controller');
const sheetController = require('../../../controllers/sheet.controller');

const router = express.Router({ mergeParams: true });

router.route('/').get(inviteController.getInvitesForSheet).post(sheetController.restrictTo('campaigns'), inviteController.createInviteForSheet);
router.route('/:inviteId').get(inviteController.getInvite).patch(inviteController.updateInvite).delete(inviteController.deleteInvite);

module.exports = router;
