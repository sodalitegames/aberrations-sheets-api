// imports MUST remain - utilized through eval
const CharSheet = require('../models/charSheetModel');
const CampSheet = require('../models/campSheetModel');

const AppError = require('../utils/errorClass');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.checkSheetType = (req, res, next) => {
  const { sheetType } = req.params;

  if (sheetType !== 'characters' && sheetType !== 'campaigns') {
    return next(new AppError(`Param 'sheetType' must be either 'characters' or 'campaigns'`, 400));
  }

  // pass sheetModelString along in req obj
  req.sheetModelString = sheetType === 'characters' ? 'CharSheet' : 'CampSheet';

  next();
};

exports.checkSheetExists = catchAsync(async (req, res, next) => {
  console.log(req.sheetModelString);
  const sheet = await eval(req.sheetModelString).findById(req.params.sheetId);

  if (!sheet) {
    return next(new AppError(`No sheet found of type '${req.params.sheetType}' with id '${req.params.sheetId}'`, 404));
  }

  // pass sheet along in req obj
  req.sheet = sheet;

  next();
});

exports.updateSheet = catchAsync(async (req, res, next) => {
  // Specify specific fields allowed to be updated
  const filteredBody = filterObj(req.body, 'characterName');

  // Update document
  const updatedSheet = await eval(req.sheetModelString).findByIdAndUpdate(req.params.sheetId, filteredBody, { new: true, runValidators: true });

  res.status(200).json({
    status: 'success',
    data: {
      updatedSheet,
    },
  });
});

exports.deleteSheet = catchAsync(async (req, res, next) => {
  await eval(req.sheetModelString).findByIdAndDelete(req.params.sheetId);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
