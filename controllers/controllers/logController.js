const Log = require('../../models/models/logModel');

const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.getLogsForSheet = catchAsync(async (req, res, next) => {
  const logs = await Log.find({ sheetId: req.params.sheetId });

  res.status(200).json({
    status: 'success',
    results: logs.length,
    data: {
      logs,
    },
  });
});

exports.createLogForSheet = catchAsync(async (req, res, next) => {
  req.body.sheetId = req.params.sheetId;

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

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
