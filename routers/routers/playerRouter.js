const express = require('express');

const playerController = require('../../controllers/playerController');

const router = express.Router();

router.route('/').post(playerController.createPlayer);
router.route('/:playerId').get(playerController.getPlayer).delete(playerController.deletePlayer);
router.route('/:playerId/characters').get(playerController.getCharSheetsForPlayer).post(playerController.createCharSheetForPlayer);
router.route('/:playerId/campaigns').get(playerController.getCampSheetsForPlayer).post(playerController.createCampSheetForPlayer);

module.exports = router;
