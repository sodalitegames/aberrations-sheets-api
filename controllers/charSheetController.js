const CharSheet = require('../models/charSheetModel');
const AppError = require('../utils/errorClass');
const catchAsync = require('../utils/catchAsync');

exports.updateCharSheet = catchAsync(async (req, res, next) => {
  const charSheet = await CharSheet.findByIdAndUpdate(req.params.sheetId, req.body, { new: true, runValidators: true });

  if (!charSheet) {
    return next(new AppError(`No character sheet found with id ${req.params.sheetId}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      charSheet,
    },
  });
});

exports.deleteCharSheet = catchAsync(async (req, res, next) => {
  const charSheet = await CharSheet.findByIdAndDelete(req.params.sheetId);

  if (!charSheet) {
    return next(new AppError(`No character sheet found with id ${req.params.sheetId}`, 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
