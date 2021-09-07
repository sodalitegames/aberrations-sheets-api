const express = require('express');

const sheetController = require('../controllers/sheetController');
const authController = require('../controllers/authController');

const routers = require('./routers');

const sheetRouter = express.Router({ mergeParams: true });

// .restrictTo('characters', 'campaigns')
// .checkSheetExists
// .requireAuthorization (must go after checkSheetExists)

sheetRouter.route('/:sheetId').patch(authController.requireAuthorization, sheetController.updateSheet).delete(authController.requireAuthorization, sheetController.deleteSheet);

sheetRouter.use('/:sheetId/log', sheetController.checkSheetExists, authController.requireAuthorization, routers.logRouter);

module.exports = sheetRouter;
