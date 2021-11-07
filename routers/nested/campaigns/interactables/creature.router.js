const express = require('express');

const creatureController = require('../../../../controllers/campaigns/interactables/creature.controller');

const router = express.Router({ mergeParams: true });

router.route('/').get(creatureController.getCreaturesForSheet).post(creatureController.createCreatureForSheet);
router.route('/:creatureId').get(creatureController.getCreature).patch(creatureController.updateCreature).delete(creatureController.deleteCreature);

module.exports = router;
