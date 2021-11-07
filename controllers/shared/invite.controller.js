const Invite = require('../../models/shared/Invite');

const factory = require('../../utils/handlerFactory');

exports.getInvitesForSheet = factory.getAllForSheet(Invite);
exports.createInviteForSheet = factory.createOneForSheet(Invite);
exports.getInvite = factory.getOne(Invite); // optional: populateOptions {path: 'reviews'}
exports.updateInvite = factory.updateOne(Invite); // optional: restrictedFields ['field1', 'field2']
exports.deleteInvite = factory.deleteOne(Invite);
