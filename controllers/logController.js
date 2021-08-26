const Log = require('../models/logModel');

const catchAsync = require('../utils/catchAsync');

exports.getLogsByCharSheetId = catchAsync(async (req, res, next) => {
  const logs = await Log.find({ charSheetId: req.params.charid });

  res.status(200).json({
    status: 'success',
    results: logs.length,
    data: {
      logs,
    },
  });
});

exports.getLogsByCampSheetId = catchAsync(async (req, res, next) => {
  const logs = await Log.find({ campSheetId: req.params.campid });

  res.status(200).json({
    status: 'success',
    results: logs.length,
    data: {
      logs,
    },
  });
});

exports.createLogForCharSheet = catchAsync(async (req, res, next) => {
  req.body.charSheetId = req.params.charid;
  req.body.campSheetId = null;

  const newLog = await Log.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      log: newLog,
    },
  });
});

exports.createLogForCampSheet = catchAsync(async (req, res, next) => {
  req.body.campSheetId = req.params.campid;
  req.body.charSheetId = null;

  const newLog = await Log.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      log: newLog,
    },
  });
});

exports.updateLog = catchAsync(async (req, res, next) => {
  const log = await Log.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if (!log) {
    return next(new AppError(`No log found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      log,
    },
  });
});

exports.deleteLog = catchAsync(async (req, res, next) => {
  const log = await Log.findByIdAndDelete(req.params.id);

  if (!log) {
    return next(new AppError(`No log found with id ${req.params.id}`, 404));
  }

  req.status(204).json({
    status: 'success',
    data: null,
  });
});
