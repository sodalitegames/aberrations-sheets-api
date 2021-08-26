const CampSheet = require('../models/campSheetModel');
const AppError = require('../utils/errorClass');
const catchAsync = require('../utils/catchAsync');

exports.updateCampSheet = catchAsync(async (req, res, next) => {
  const campSheet = await CampSheet.findByIdAndUpdate(req.params.sheetId, req.body, { new: true, runValidators: true });

  if (!campSheet) {
    return next(new AppError(`No campaign sheet found with id ${req.params.sheetId}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      campSheet,
    },
  });
});

exports.deleteCampSheet = catchAsync(async (req, res, next) => {
  const campSheet = await CampSheet.findByIdAndDelete(req.params.sheetId);

  if (!campSheet) {
    return next(new AppError(`No campaign sheet found with id ${req.params.sheetId}`, 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
