const Combat = require('../../models/campaigns/Combat');

const factory = require('../../utils/handlerFactory');

exports.getCombatsForSheet = factory.getAllForSheet(Combat);
exports.createCombatForSheet = factory.createOneForSheet(Combat);
exports.getCombat = factory.getOne(Combat); // optional: populateOptions {path: 'reviews'}
exports.updateCombat = factory.updateOne(Combat); // optional: restrictedFields ['field1', 'field2']
exports.deleteCombat = factory.deleteOne(Combat);
