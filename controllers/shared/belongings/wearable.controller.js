const Wearable = require('../../../models/shared/belongings/Wearable');

const factory = require('../../../utils/handlerFactory');

exports.getWearablesForSheet = factory.getAllForSheet(Wearable);
exports.createWearableForSheet = factory.createOneForSheet(Wearable);
exports.getWearable = factory.getOne(Wearable); // optional: populateOptions {path: 'reviews'}
exports.updateWearable = factory.updateOne(Wearable); // optional: restrictedFields ['field1', 'field2']
exports.deleteWearable = factory.deleteOne(Wearable);
