const express = require('express');

const playerController = require('../controllers/playerController');
const sheetController = require('../controllers/sheetController');

const router = express.Router();

router.route('/:sheetType').get(sheetController.checkSheetType, playerController.getSheetsForPlayer).post(sheetController.checkSheetType, playerController.createSheetForPlayer);

module.exports = router;
