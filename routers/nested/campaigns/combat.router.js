const express = require('express');

const combatController = require('../../../controllers/campaigns/combat.controller');

const router = express.Router({ mergeParams: true });

router.route('/').get(combatController.getCombatsForSheet).post(combatController.createCombatForSheet);
router.route('/:combatId').get(combatController.getCombat).patch(combatController.updateCombat).delete(combatController.deleteCombat);

module.exports = router;
