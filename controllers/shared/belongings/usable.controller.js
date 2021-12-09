const Usable = require('../../../models/shared/belongings/Usable');

const factory = require('../../../utils/handlerFactory');

exports.getUsablesForSheet = factory.getAllForSheet(Usable);
exports.createUsableForSheet = factory.createOneForSheet(Usable);
exports.getUsable = factory.getOne(Usable); // optional: populateOptions {path: 'reviews'}
exports.updateUsable = factory.updateOne(Usable); // optional: restrictedFields ['field1', 'field2']
exports.deleteUsable = factory.deleteOne(Usable);
