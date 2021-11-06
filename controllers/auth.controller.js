const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const Player = require('../models/Player');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

  // Add player to req obj
  req.player = currentPlayer;

  // Grant access to the protected route
  next();
});
