const Session = require('../../models/campaigns/Session');

const factory = require('../../utils/handlerFactory');

exports.getSessionsForSheet = factory.getAllForSheet(Session);
exports.createSessionForSheet = factory.createOneForSheet(Session);
exports.getSession = factory.getOne(Session); // optional: populateOptions {path: 'reviews'}
exports.updateSession = factory.updateOne(Session); // optional: restrictedFields ['field1', 'field2']
exports.deleteSession = factory.deleteOne(Session);
