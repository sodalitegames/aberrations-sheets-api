const Note = require('../../models/shared/Note');

const factory = require('../../utils/handlerFactory');

exports.getNotesForSheet = factory.getAllForSheet(Note);
exports.createNoteForSheet = factory.createOneForSheet(Note);
exports.getNote = factory.getOne(Note); // optional: populateOptions {path: 'reviews'}
exports.updateNote = factory.updateOne(Note); // optional: restrictedFields ['field1', 'field2']
exports.deleteNote = factory.deleteOne(Note);
