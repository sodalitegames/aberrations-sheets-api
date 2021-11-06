const ObjectId = require('mongoose').Types.ObjectId;

const catchAsync = require('../utils/catchAsync');

exports.getSheetsForPlayer = catchAsync(async (req, res, next) => {
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

  const sheets = await req.SheetModel.aggregate([
    {
      $match: { playerId: ObjectId(req.player.id) },
    },
    ...pipelineArr,
    {
      $sort: { createdAt: -1 },
    },
  ]);

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
  const sheet = await req.SheetModel.findByIdAndUpdate(req.params.sheetId);

  res.status(200).json({
    status: 'success',
    data: {
      sheet,
    },
  });
});

exports.createSheetForPlayer = catchAsync(async (req, res, next) => {
  // set the playerId to the current user's Id
  req.body.playerId = req.player.id;

  const newSheet = await req.SheetModel.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      sheet: newSheet,
    },
  });
});
