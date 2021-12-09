const express = require('express');

const weaponController = require('../../../../controllers/shared/belongings/weapon.controller');

const router = express.Router({ mergeParams: true });

router.route('/').get(weaponController.getWeaponsForSheet).post(weaponController.createWeaponForSheet);
router.route('/:weaponId').get(weaponController.getWeapon).patch(weaponController.updateWeapon).delete(weaponController.deleteWeapon);

module.exports = router;
