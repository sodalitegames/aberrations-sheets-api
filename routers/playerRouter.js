const express = require('express');

const authController = require('../controllers/authController');
const playerController = require('../controllers/playerController');
const sheetController = require('../controllers/sheetController');

const router = express.Router();

// user must be authenticated
router.use(authController.requireAuthentication);

// sheetType must be valid
router.use('/:sheetType', sheetController.checkSheetType);

router.route('/:sheetType').get(playerController.getSheetsForPlayer).post(playerController.createSheetForPlayer);

// .checkSheetExists
// .requireAuthorization (must go after checkSheetExists)

// check that the sheetId is valid and the sheet exists, and require user authorization to view and edit the sheet
router.use('/:sheetType/:sheetId', sheetController.checkSheetExists, sheetController.requireAuthorization);

router.route('/:sheetType/:sheetId').get(playerController.getSingleSheetForPlayer);

module.exports = router;
