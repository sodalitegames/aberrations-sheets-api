const express = require('express');

const campSheetController = require('../../controllers/campSheetController');

const router = express.Router();

router.route('/:sheetId').patch(campSheetController.updateCampSheet).delete(campSheetController.deleteCampSheet);

module.exports = router;
