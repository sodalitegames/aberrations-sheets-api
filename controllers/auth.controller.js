const { Player, AuthPlayer } = require('../models/Player');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { firebase, firestore } = require('../utils/firebase');

exports.requireAuthentication = catchAsync(async (req, res, next) => {
  let token;

  // Get token and check if it exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not authorized to access this route.', 401));
  }

  let decoded;

  // Decode the token
  try {
    decoded = await firebase.auth().verifyIdToken(token);
  } catch (err) {
    if (err.code === 'auth/id-token-expired') {
      return next(new AppError(err.message, 401));
    }
    return next(new AppError('Token could not be verified.', 401));
  }

  // Fetch collection user and get its data
  const userRef = firestore.collection('users').doc(decoded.uid);
  const data = (await userRef.get()).data();

  // Check if player exists
  let player = await Player.findById(data.player_id);

  if (!player) {
    // If no player, fetch check if there is an auth player with this id
    const authPlayer = await AuthPlayer.findById(data.player_id);

    if (!authPlayer) {
      return next(new AppError('The player belonging to this token no longer exists.', 401));
    }

    // If there is an auth player, create a new player using that id
    player = await Player.create({
      _id: authPlayer._id,
      email: authPlayer.email,
    });
  }

  if (!player) {
    return next(new AppError('An error occurred creating and authorizing a new player.', 500));
  }

  if (player.email !== decoded.email) {
    // If the emails do not match, update the players email to match the users
    player = await Player.findByIdAndUpdate(data.player_id, { email: decoded.email }, { new: true });
  }

  if (!data.has_joined_sheets) {
    // If not already, note on the user object that they have joined sheets
    await userRef.update({ has_joined_sheets: true });
  }

  // Save user data, decoded token, and player to req.body
  req.user = data;
  req.token = decoded;
  req.player = player;

  // Grant access to protected route
  return next();
});
