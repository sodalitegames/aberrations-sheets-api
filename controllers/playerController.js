// imports MUST remain - utilized through eval
const CampSheet = require('../models/campSheetModel');
const CharSheet = require('../models/charSheetModel');

const catchAsync = require('../utils/catchAsync');

exports.getSheetsForPlayer = catchAsync(async (req, res, next) => {
  const sheets = await eval(req.sheetModelString).find({ playerId: req.player.id });

  res.status(200).json({
    status: 'success',
    results: sheets.length,
    data: {
      sheets,
    },
  });
});

exports.createSheetForPlayer = catchAsync(async (req, res, next) => {
  req.body.playerId = req.player.id;

  const newSheet = await eval(req.sheetModelString).create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      sheet: newSheet,
    },
  });
});
