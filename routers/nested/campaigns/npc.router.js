const express = require('express');

const npcController = require('../../../controllers/campaigns/npc.controller');

const router = express.Router({ mergeParams: true });

router.route('/').get(npcController.getNpcsForSheet).post(npcController.createNpcForSheet);
router.route('/:npcId').get(npcController.getNpc).patch(npcController.updateNpc).delete(npcController.deleteNpc);

module.exports = router;
