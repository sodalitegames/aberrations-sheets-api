const Augmentation = require('../../models/shared/Augmentation');

const factory = require('../../utils/handlerFactory');

exports.getAugmentationsForSheet = factory.getAllForSheet(Augmentation);
exports.createAugmentationForSheet = factory.createOneForSheet(Augmentation);
exports.getAugmentation = factory.getOne(Augmentation); // optional: populateOptions {path: 'reviews'}
exports.updateAugmentation = factory.updateOne(Augmentation); // optional: restrictedFields ['field1', 'field2']
exports.deleteAugmentation = factory.deleteOne(Augmentation);
