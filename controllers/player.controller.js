const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

exports.getSheetsForPlayer = catchAsync(async (req, res, next) => {
  // If no sort method has been specified, sort by updatedAt field
  if (!req.query.sort) req.query.sort = '-updatedAt';

  // Execute the query
  // req.player comes from authController.requireAuthentication
  // req.SheetModel comes from sheetController.checkSheetType
  const features = new APIFeatures(req.SheetModel.find({ playerId: req.player.id }), req.query).filter().sort().limitFields().paginate();

  const sheets = await features.query; // features.query.explain() - gives me all the info on the query

  // Send the response
  res.status(200).json({
    status: 'success',
    results: sheets.length,
    data: {
      sheets,
    },
  });
});

exports.getSingleSheetForPlayer = catchAsync(async (req, res, next) => {
  // Get document
  // req.sheet comes from sheetController.checkSheetExists
  // req.SheetModel comes from sheetController.checkSheetType
  const sheet = await req.SheetModel.findById(req.sheet.id);

  // Send the response
  res.status(200).json({
    status: 'success',
    data: {
      sheet,
    },
  });
});

exports.createSheetForPlayer = catchAsync(async (req, res, next) => {
  // Set the playerId to the current user's Id
  // req.player comes from authController.requireAuthentication
  req.body.playerId = req.player.id;

  // Execute the query
  // req.SheetModel comes from sheetController.checkSheetType
  const newSheet = await req.SheetModel.create(req.body);

  // Send the response
  res.status(201).json({
    status: 'success',
    data: {
      sheet: newSheet,
    },
  });
});
