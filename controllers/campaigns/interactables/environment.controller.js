const Environment = require('../../../models/campaigns/interactables/Environment');

const factory = require('../../../utils/handlerFactory');

exports.getEnvironmentsForSheet = factory.getAllForSheet(Environment);
exports.createEnvironmentForSheet = factory.createOneForSheet(Environment);
exports.getEnvironment = factory.getOne(Environment); // optional: populateOptions {path: 'reviews'}
exports.updateEnvironment = factory.updateOne(Environment); // optional: restrictedFields ['field1', 'field2']
exports.deleteEnvironment = factory.deleteOne(Environment);
