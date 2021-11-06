const express = require('express');

const noteController = require('../../../controllers/shared/note.controller');

const router = express.Router({ mergeParams: true });

router.route('/').get(noteController.getNotesForSheet).post(noteController.createNoteForSheet);
router.route('/:noteId').patch(noteController.updateNote).delete(noteController.deleteNote);

module.exports = router;
