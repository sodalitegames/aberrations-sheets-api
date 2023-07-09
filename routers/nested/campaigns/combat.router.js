const express = require('express');

const sheetController = require('../../../controllers/sheet.controller');
const combatController = require('../../../controllers/campaigns/combat.controller');

const router = express.Router({ mergeParams: true });

router.route('/').get(sheetController.restrictTo('campaigns'), combatController.getCombatsForSheet).post(sheetController.restrictTo('campaigns'), combatController.createCombatForSheet);
router
  .route('/:combatId')
  .get(sheetController.restrictTo('campaigns'), combatController.getCombat)
  .patch(combatController.updateCombat)
  .delete(sheetController.restrictTo('campaigns'), combatController.deleteCombat);

module.exports = router;
