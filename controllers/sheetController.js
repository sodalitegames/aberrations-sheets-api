const ObjectId = require('mongoose').Types.ObjectId;

const CharSheet = require('../models/charSheetModel');
const CampSheet = require('../models/campSheetModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const SheetModels = {
  characters: CharSheet,
  campaigns: CampSheet,
};

const allowedFields = {
  characters: ['characterName'],
  campaigns: ['name'],
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.restrictTo =
  (...sheetTypes) =>
  (req, res, next) => {
    // roles is an array
    if (!sheetTypes.includes(req.params.sheetType)) {
      return next(new AppError(`This route does not exist for ${req.params.sheetType} sheets. Did you mean to use ${sheetTypes} sheets?`, 404));
    }
    next();
  };

exports.checkSheetType = (req, res, next) => {
  const { sheetType } = req.params;

  if (sheetType !== 'characters' && sheetType !== 'campaigns') {
    return next(new AppError(`Param 'sheetType' must be either 'characters' or 'campaigns'`, 400));
  }

  // pass the sheet model along in req obj
  req.SheetModel = SheetModels[sheetType];

  next();
};

exports.checkSheetExists = catchAsync(async (req, res, next) => {
  const sheet = await req.SheetModel.findById(req.params.sheetId);

  if (!sheet) {
    return next(new AppError(`No sheet found of type '${req.params.sheetType}' with id '${req.params.sheetId}'`, 404));
  }

  // pass sheet along in req obj
  req.sheet = sheet;

  next();
});

exports.requireAuthorization = (req, res, next) => {
  if (!req.player || !req.sheet) {
    return next(new AppError('Cannot authorize. Player and/or Sheet are undefined.', 400));
  }

  if (req.player.id.toString() !== req.sheet.playerId.toString() && req.player.id.toString() !== req.sheet.ccId.toString()) {
    return next(new AppError('You are not authorized to request this route.', 401));
  }

  next();
};

exports.getSheet = catchAsync(async (req, res, next) => {
  // Get full document using aggregation
  let pipelineArr = [];

  if (req.params.sheetType === 'characters') {
    pipelineArr = [
      {
        $lookup: {
          from: 'logs',
          localField: '_id',
          foreignField: 'sheetId',
          as: 'characterLogs',
        },
      },
    ];
  }

  if (req.params.sheetType === 'campaigns') {
    pipelineArr = [
      {
        $lookup: {
          from: 'logs',
          localField: '_id',
          foreignField: 'sheetId',
          as: 'captainsLogs',
        },
      },
    ];
  }

  const sheet = await req.SheetModel.aggregate([
    {
      $match: { _id: ObjectId(req.sheet.id) },
    },
    ...pipelineArr,
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      sheet,
    },
  });
});

exports.updateSheet = catchAsync(async (req, res, next) => {
  // Specify specific fields allowed to be updated
  const filteredBody = filterObj(req.body, ...allowedFields[req.params.sheetType]);

  // Update document
  const updatedSheet = await req.SheetModel.findByIdAndUpdate(req.params.sheetId, filteredBody, { new: true, runValidators: true });

  res.status(200).json({
    status: 'success',
    data: {
      sheet: updatedSheet,
    },
  });
});

exports.deleteSheet = catchAsync(async (req, res, next) => {
  await req.SheetModel.findByIdAndDelete(req.params.sheetId);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
