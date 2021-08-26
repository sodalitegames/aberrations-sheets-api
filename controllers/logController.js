const Log = require('../models/logModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/errorClass');

exports.getLogsForSheet = catchAsync(async (req, res, next) => {
  let logs;

  if (req.params.sheetType.toLowerCase() === 'characters') {
    // TODO: MAKE A CHECK TO MAKE SURE SHEET ID ACTUALLY EXISTS
    logs = await Log.find({ charSheetId: req.params.sheetId });
  } else if (req.params.sheetType.toLowerCase() === 'campaigns') {
    // TODO: MAKE A CHECK TO MAKE SURE SHEET ID ACTUALLY EXISTS
    logs = await Log.find({ campSheetId: req.params.sheetId });
  } else {
    return next(new AppError(`Param 'sheetType' must be either 'character' or 'campaign'`, 400));
  }

  res.status(200).json({
    status: 'success',
    results: logs.length,
    data: {
      logs,
    },
  });
});

exports.createLogForSheet = catchAsync(async (req, res, next) => {
  if (req.params.sheetType.toLowerCase() === 'characters') {
    // TODO: MAKE A CHECK TO MAKE SURE SHEET ID ACTUALLY EXISTS
    req.body.charSheetId = req.params.sheetId;
  } else if (req.params.sheetType.toLowerCase() === 'campaigns') {
    // TODO: MAKE A CHECK TO MAKE SURE SHEET ID ACTUALLY EXISTS
    req.body.campSheetId = req.params.sheetId;
  } else {
    return next(new AppError(`Param 'sheetType' must be either 'character' or 'campaign'`, 400));
  }

  const newLog = await Log.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      log: newLog,
    },
  });
});

exports.updateLog = catchAsync(async (req, res, next) => {
  const log = await Log.findByIdAndUpdate(req.params.logId, req.body, { new: true, runValidators: true });

  if (!log) {
    return next(new AppError(`No log found with id ${req.params.logId}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      log,
    },
  });
});

exports.deleteLog = catchAsync(async (req, res, next) => {
  const log = await Log.findByIdAndDelete(req.params.logId);

  if (!log) {
    return next(new AppError(`No log found with id ${req.params.logId}`, 404));
  }

  req.status(204).json({
    status: 'success',
    data: null,
  });
});
