const Consumable = require('../../../models/shared/belongings/Consumable');

const factory = require('../../../utils/handlerFactory');

exports.getConsumablesForSheet = factory.getAllForSheet(Consumable);
exports.createConsumableForSheet = factory.createOneForSheet(Consumable);
exports.getConsumable = factory.getOne(Consumable); // optional: populateOptions {path: 'reviews'}
exports.updateConsumable = factory.updateOne(Consumable); // optional: restrictedFields ['field1', 'field2']
exports.deleteConsumable = factory.deleteOne(Consumable);
