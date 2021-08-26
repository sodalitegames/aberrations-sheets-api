const express = require('express');

const charSheetController = require('../../controllers/charSheetController');

const router = express.Router();

router.route('/:sheetId').patch(charSheetController.updateCharSheet).delete(charSheetController.deleteCharSheet);

module.exports = router;
