const express = require('express');

const sheetController = require('../controllers/sheet.controller');
const authController = require('../controllers/auth.controller');

const routers = require('./nested');

const sheetRouter = express.Router({ mergeParams: true });

// user must be authenticated
sheetRouter.use(authController.requireAuthentication);

// sheetType must be valid
sheetRouter.use(sheetController.checkSheetType);

// .checkSheetExists
// .requireAuthorization (must go after checkSheetExists)

// check that the sheetId is valid and the sheet exists, and require user authorization to view and edit the sheet
sheetRouter.use('/:sheetId', sheetController.checkSheetExists, sheetController.requireAuthorization);

sheetRouter.route('/:sheetId').get(sheetController.getSheet).patch(sheetController.updateSheet).delete(sheetController.deleteSheet);

// routes for leaving or being removed from a campaign
sheetRouter.post('/:sheetId/leave-campaign', sheetController.restrictTo('characters'), sheetController.leaveCampaign);
sheetRouter.post('/:sheetId/remove-player', sheetController.restrictTo('campaigns'), sheetController.removePlayer);

// MOUNT THE NESTED ROUTERS

// shared routes
sheetRouter.use('/:sheetId/logs', routers.logRouter);
sheetRouter.use('/:sheetId/notes', routers.noteRouter);
sheetRouter.use('/:sheetId/augmentations', routers.augmentationRouter);
sheetRouter.use('/:sheetId/invites', routers.inviteRouter);

// belongings
sheetRouter.use('/:sheetId/weapons', routers.weaponRouter);
sheetRouter.use('/:sheetId/wearables', routers.wearableRouter);
sheetRouter.use('/:sheetId/usables', routers.usableRouter);
sheetRouter.use('/:sheetId/consumables', routers.consumableRouter);

// campaign routes
sheetRouter.use('/:sheetId/sessions', sheetController.restrictTo('campaigns'), routers.sessionRouter);
sheetRouter.use('/:sheetId/npcs', sheetController.restrictTo('campaigns'), routers.npcRouter);
sheetRouter.use('/:sheetId/environments', sheetController.restrictTo('campaigns'), routers.environmentRouter);
sheetRouter.use('/:sheetId/creatures', sheetController.restrictTo('campaigns'), routers.creatureRouter);

module.exports = sheetRouter;
