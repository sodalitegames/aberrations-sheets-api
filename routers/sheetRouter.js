const express = require('express');

const sheetController = require('../controllers/sheetController');

const routers = require('./routers');

const sheetRouter = express.Router({ mergeParams: true });

sheetRouter.route('/:sheetId').patch(sheetController.updateSheet).delete(sheetController.deleteSheet);

sheetRouter.use('/:sheetId/log', routers.logRouter);

module.exports = sheetRouter;
