const CampSheet = require('../models/campSheetModel');
const CharSheet = require('../models/charSheetModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/errorClass');

exports.getCharSheetsForPlayer = catchAsync(async (req, res, next) => {
  // TODO: MAKE A CHECK TO MAKE SURE PLAYER ID ACTUALLY EXISTS
  const charSheets = await CharSheet.find({ playerId: req.params.playerId });

  res.status(200).json({
    status: 'success',
    results: charSheets.length,
    data: {
      charSheets,
    },
  });
});

exports.createCharSheetForPlayer = catchAsync(async (req, res, next) => {
  // TODO: MAKE A CHECK TO MAKE SURE PLAYER ID ACTUALLY EXISTS
  req.body.playerId = req.params.playerId;

  const newCharSheet = await CharSheet.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      log: newCharSheet,
    },
  });
});

exports.getCampSheetsForPlayer = catchAsync(async (req, res, next) => {
  // TODO: MAKE A CHECK TO MAKE SURE PLAYER ID ACTUALLY EXISTS
  const campSheets = await CampSheet.find({ playerId: req.params.playerId });

  res.status(200).json({
    status: 'success',
    results: campSheets.length,
    data: {
      campSheets,
    },
  });
});

exports.createCampSheetForPlayer = catchAsync(async (req, res, next) => {
  // TODO: MAKE A CHECK TO MAKE SURE PLAYER ID ACTUALLY EXISTS
  req.body.playerId = req.params.playerId;

  const newCampSheet = await CampSheet.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      log: newCampSheet,
    },
  });
});

exports.createPlayer = catchAsync(async (req, res, next) => {
  const newPlayer = await Player.create();

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

  res.status(204).json({
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
