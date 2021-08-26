const CampSheet = require('../models/campSheetModel');
const CharSheet = require('../models/charSheetModel');
const Player = require('../models/playerModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/errorClass');

exports.getSheetsForPlayer = catchAsync(async (req, res, next) => {
  let sheets;

  // TODO: MAKE A CHECK TO MAKE SURE PLAYER ID ACTUALLY EXISTS
  if (req.params.sheetType.toLowerCase() === 'characters') {
    sheets = await CharSheet.find({ playerId: req.params.playerId });
  } else if (req.params.sheetType.toLowerCase() === 'campaigns') {
    sheets = await CampSheet.find({ playerId: req.params.playerId });
  } else {
    return next(new AppError(`Param 'sheetType' must be either 'characters' or 'campaigns'`, 400));
  }

  res.status(200).json({
    status: 'success',
    results: sheets.length,
    data: {
      sheets,
    },
  });
});

exports.createSheetForPlayer = catchAsync(async (req, res, next) => {
  // TODO: MAKE A CHECK TO MAKE SURE PLAYER ID ACTUALLY EXISTS
  req.body.playerId = req.params.playerId;

  let newSheet;

  if (req.params.sheetType.toLowerCase() === 'characters') {
    newSheet = await CharSheet.create(req.body);
  } else if (req.params.sheetType.toLowerCase() === 'campaigns') {
    newSheet = await CampSheet.create(req.body);
  } else {
    return next(new AppError(`Param 'sheetType' must be either 'characters' or 'campaigns'`, 400));
  }

  res.status(201).json({
    status: 'success',
    data: {
      sheet: newSheet,
    },
  });
});

exports.createPlayer = catchAsync(async (req, res, next) => {
  const newPlayer = await Player.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      player: newPlayer,
    },
  });
});

exports.getPlayer = catchAsync(async (req, res, next) => {
  const player = await Player.findById(req.params.playerId);

  if (!player) {
    return next(new AppError(`No player found with id ${req.params.playerId}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      player: player,
    },
  });
});

exports.updatePlayer = catchAsync(async (req, res, next) => {
  const player = await Player.findByIdAndUpdate(req.params.playerId, req.body, { new: true, runValidators: true });

  if (!player) {
    return next(new AppError(`No player found with id ${req.params.playerId}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      player: player,
    },
  });
});

exports.deletePlayer = catchAsync(async (req, res, next) => {
  const player = await Player.findByIdAndDelete(req.params.playerId);

  if (!player) {
    return next(new AppError(`No player found with id ${req.params.playerId}`, 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
