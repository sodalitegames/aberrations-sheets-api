const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const Player = require('../models/playerModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/errorClass');

exports.requireAuthentication = catchAsync(async (req, res, next) => {
  let token;
  // 1) Get token and check if it exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please login to get access.', 401));
  }
  // 2) Validate token: Verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentPlayer = await Player.findById(decoded.id);

  if (!currentPlayer) {
    return next(new AppError('The player belonging to this token no longer exists.', 401));
  }

  // GRANT ACCESS TO THE PROTECTED ROUTE
  // add player to req obj
  req.player = currentPlayer;
  next();
});

exports.requireAuthorization = (req, res, next) => {
  console.log(req.player);
  console.log(req.sheet);

  if (!req.player || !req.sheet) {
    return next(new AppError('Cannot authorize. Player and/or Sheet are undefined.', 400));
  }

  if (!req.player.id === req.sheet.playerId && !req.player.id === req.sheet.ccId) {
    return next(new AppError('You are not authorized to request this route.', 401));
  }

  next();
};

exports.restrictTo =
  (...sheetTypes) =>
  (req, res, next) => {
    // roles is an array
    if (!sheetTypes.includes(req.params.sheetType)) {
      return next(new AppError('This route does not exist.', 404));
    }
    next();
  };
