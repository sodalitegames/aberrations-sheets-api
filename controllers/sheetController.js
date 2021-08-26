const CharSheet = require('../models/charSheetModel');
const CampSheet = require('../models/campSheetModel');

const AppError = require('../utils/errorClass');
const catchAsync = require('../utils/catchAsync');

exports.updateSheet = catchAsync(async (req, res, next) => {
  let sheet;

  if (req.params.sheetType.toLowerCase() === 'characters') {
    sheet = await CharSheet.findByIdAndUpdate(req.params.sheetId, req.body, { new: true, runValidators: true });
  } else if (req.params.sheetType.toLowerCase() === 'campaigns') {
    sheet = await CampSheet.findByIdAndUpdate(req.params.sheetId, req.body, { new: true, runValidators: true });
  } else {
    return next(new AppError(`Param 'sheetType' must be either 'characters' or 'campaigns'`, 400));
  }

  if (!sheet) {
    return next(new AppError(`No sheet found of type '${req.params.sheetType}' with id '${req.params.sheetId}'`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      sheet,
    },
  });
});

exports.deleteSheet = catchAsync(async (req, res, next) => {
  let sheet;

  if (req.params.sheetType.toLowerCase() === 'characters') {
    sheet = await CharSheet.findByIdAndDelete(req.params.sheetId);
  } else if (req.params.sheetType.toLowerCase() === 'campaigns') {
    sheet = await CampSheet.findByIdAndDelete(req.params.sheetId);
  } else {
    return next(new AppError(`Param 'sheetType' must be either 'characters' or 'campaigns'`, 400));
  }

  if (!sheet) {
    return next(new AppError(`No sheet found of type '${req.params.sheetType}' with id '${req.params.sheetId}'`, 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
