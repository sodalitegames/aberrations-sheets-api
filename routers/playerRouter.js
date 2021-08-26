const express = require('express');

const playerController = require('../controllers/playerController');

const router = express.Router();

router.route('/').post(playerController.createPlayer);
router.route('/:playerId').get(playerController.getPlayer).patch(playerController.updatePlayer).delete(playerController.deletePlayer);
router.route('/:playerId/:sheetType').get(playerController.getSheetsForPlayer).post(playerController.createSheetForPlayer);

module.exports = router;
