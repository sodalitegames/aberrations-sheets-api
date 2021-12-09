const Creature = require('../../../models/campaigns/interactables/Creature');

const factory = require('../../../utils/handlerFactory');

exports.getCreaturesForSheet = factory.getAllForSheet(Creature);
exports.createCreatureForSheet = factory.createOneForSheet(Creature);
exports.getCreature = factory.getOne(Creature); // optional: populateOptions {path: 'reviews'}
exports.updateCreature = factory.updateOne(Creature); // optional: restrictedFields ['field1', 'field2']
exports.deleteCreature = factory.deleteOne(Creature);
