const Log = require('../../models/shared/Log');

const factory = require('../../utils/handlerFactory');

exports.getLogsForSheet = factory.getAllForSheet(Log);
exports.createLogForSheet = factory.createOneForSheet(Log);
exports.getLog = factory.getOne(Log); // optional: populateOptions {path: 'reviews'}
exports.updateLog = factory.updateOne(Log); // optional: restrictedFields ['field1', 'field2']
exports.deleteLog = factory.deleteOne(Log);
