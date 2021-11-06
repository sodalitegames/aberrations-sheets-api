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

// MOUNT THE NESTED ROUTERS

sheetRouter.use('/:sheetId/logs', sheetController.restrictTo('characters', 'campaigns'), routers.logRouter);
sheetRouter.use('/:sheetId/notes', sheetController.restrictTo('characters', 'campaigns'), routers.noteRouter);

module.exports = sheetRouter;
