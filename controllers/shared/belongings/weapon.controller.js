const Weapon = require('../../../models/shared/belongings/Weapon');

const factory = require('../../../utils/handlerFactory');

exports.getWeaponsForSheet = factory.getAllForSheet(Weapon);
exports.createWeaponForSheet = factory.createOneForSheet(Weapon);
exports.getWeapon = factory.getOne(Weapon); // optional: populateOptions {path: 'reviews'}
exports.updateWeapon = factory.updateOne(Weapon); // optional: restrictedFields ['field1', 'field2']
exports.deleteWeapon = factory.deleteOne(Weapon);
