const Npc = require('../../models/campaigns/Npc');

const factory = require('../../utils/handlerFactory');

exports.getNpcsForSheet = factory.getAllForSheet(Npc);
exports.createNpcForSheet = factory.createOneForSheet(Npc);
exports.getNpc = factory.getOne(Npc); // optional: populateOptions {path: 'reviews'}
exports.updateNpc = factory.updateOne(Npc); // optional: restrictedFields ['field1', 'field2']
exports.deleteNpc = factory.deleteOne(Npc);
