const ObjectId = require('mongoose').Types.ObjectId;

const CharSheet = require('../models/CharSheet');
const CampSheet = require('../models/CampSheet');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Import the following models to be used when deleting a character sheet
const Log = require('../models/shared/Log');
const Note = require('../models/shared/Note');
const Invite = require('../models/shared/Invite');
const Augmentation = require('../models/shared/Augmentation');
const Weapon = require('../models/shared/belongings/Weapon');
const Wearable = require('../models/shared/belongings/Wearable');
const Consumable = require('../models/shared/belongings/Consumable');
const Usable = require('../models/shared/belongings/Usable');
const Npc = require('../models/campaigns/Npc');
const Session = require('../models/campaigns/Session');
const Creature = require('../models/campaigns/interactables/Creature');
const Environment = require('../models/campaigns/interactables/Environment');

const SheetModels = {
  characters: CharSheet,
  campaigns: CampSheet,
};

const allowedFields = {
  characters: ['characterName'],
  campaigns: ['name'],
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.restrictTo =
  (...sheetTypes) =>
  (req, res, next) => {
    if (!sheetTypes.includes(req.params.sheetType)) {
      return next(new AppError(`This route does not exist for ${req.params.sheetType} sheets. Did you mean to use ${sheetTypes} sheets?`, 404));
    }
    next();
  };

exports.checkSheetType = (req, res, next) => {
  const { sheetType } = req.params;

  if (sheetType !== 'characters' && sheetType !== 'campaigns') {
    return next(new AppError(`Param 'sheetType' must be either 'characters' or 'campaigns'`, 400));
  }

  // Pass the sheet model along in req obj
  req.SheetModel = SheetModels[sheetType];

  next();
};

exports.checkSheetExists = catchAsync(async (req, res, next) => {
  const sheet = await req.SheetModel.findById(req.params.sheetId);

  if (!sheet) {
    return next(new AppError(`No sheet found of type '${req.params.sheetType}' with id '${req.params.sheetId}'`, 404));
  }

  // Pass sheet along in req obj
  req.sheet = sheet;

  next();
});

exports.requireAuthorization = (req, res, next) => {
  // req.player comes from authController.requireAuthorization
  if (!req.player || !req.sheet) {
    return next(new AppError('Cannot authorize. Player and/or Sheet are undefined.', 400));
  }

  // req.player comes from authController.requireAuthorization
  if (req.player.id.toString() !== req.sheet.playerId.toString() && req.player.id.toString() !== req.sheet.ccId.toString()) {
    return next(new AppError('You are not authorized to request this route.', 401));
  }

  next();
};

const pipelinePieces = {
  charSheetVirtualFields: {
    power: { $sum: ['$fortitude.points', '$fortitude.modifier', '$agility.points', '$agility.modifier', '$persona.points', '$persona.modifier', '$aptitude.points', '$aptitude.modifier'] },
    dodgeValue: { $floor: { $divide: [{ $sum: ['$agility.points', '$agility.modifier'] }, 3] } },
    maxHp: { $multiply: [{ $sum: ['$fortitude.points', '$fortitude.modifer'] }, 5] },
  },
  campaignBasicDetails: {
    name: 1,
    overview: 1,
    ccName: 1,
    ccNickname: 1,
    players: 1,
  },
  playerBasicDetails: {
    characterName: 1,
    playerName: 1,
  },
};

exports.getSheet = catchAsync(async (req, res, next) => {
  // Get full document using aggregation
  let pipelineArr = [];

  if (req.params.sheetType === 'characters') {
    pipelineArr = [
      {
        $addFields: pipelinePieces.charSheetVirtualFields,
      },
      ...(req.sheet.campaign
        ? [
            {
              $lookup: {
                from: 'campaigns',
                let: { campId: '$campaign' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$campId'] } } },
                  {
                    $unwind: { path: '$players' },
                  },
                  {
                    $lookup: {
                      from: 'characters',
                      let: { charId: '$players' },
                      pipeline: [
                        {
                          $match: { $expr: { $eq: ['$_id', '$$charId'] } },
                        },
                        {
                          $project: pipelinePieces.playerBasicDetails,
                        },
                      ],
                      as: 'players',
                    },
                  },
                  {
                    $group: {
                      _id: '$_id',
                      players: { $push: { $arrayElemAt: ['$players', 0] } },
                      name: { $first: '$name' },
                      overview: { $first: '$overview' },
                      ccName: { $first: '$ccName' },
                      ccNickname: { $first: '$ccNickname' },
                    },
                  },
                  {
                    $project: pipelinePieces.campaignBasicDetails,
                  },
                ],
                as: 'campaign',
              },
            },
            {
              $unwind: '$campaign',
            },
          ]
        : []),
      {
        $lookup: {
          from: 'augmentations',
          localField: '_id',
          foreignField: 'sheetId',
          as: 'augmentations',
        },
      },
      {
        $lookup: {
          from: 'invites',
          localField: '_id',
          foreignField: 'charSheetId',
          as: 'invites',
        },
      },
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
      ...(req.sheet.players.length
        ? [
            { $unwind: '$players' },
            {
              $lookup: {
                from: 'characters',
                let: { charId: '$players' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$charId'] } } },
                  { $addFields: pipelinePieces.charSheetVirtualFields },
                  {
                    $lookup: {
                      from: 'augmentations',
                      localField: 'players._id',
                      foreignField: 'sheetId',
                      as: 'augmentations',
                    },
                  },
                  {
                    $lookup: {
                      from: 'weapons',
                      localField: 'players._id',
                      foreignField: 'sheetId',
                      as: 'weapons',
                    },
                  },
                  {
                    $lookup: {
                      from: 'wearables',
                      localField: 'players._id',
                      foreignField: 'sheetId',
                      as: 'wearables',
                    },
                  },
                  {
                    $lookup: {
                      from: 'consumables',
                      localField: 'players._id',
                      foreignField: 'sheetId',
                      as: 'consumables',
                    },
                  },
                  {
                    $lookup: {
                      from: 'usables',
                      localField: 'players._id',
                      foreignField: 'sheetId',
                      as: 'usables',
                    },
                  },
                ],
                as: 'players',
              },
            },
            {
              $group: {
                _id: '$_id',
                players: { $push: { $arrayElemAt: ['$players', 0] } },
                doc: { $first: '$$ROOT' },
              },
            },
            {
              $replaceRoot: { newRoot: { $mergeObjects: ['$doc', { players: '$players' }] } },
            },
          ]
        : []),
      {
        $lookup: {
          from: 'npcs',
          let: { currId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$sheetId', '$$currId'] } } },
            { $addFields: pipelinePieces.charSheetVirtualFields },
            {
              $lookup: {
                from: 'augmentations',
                localField: '_id',
                foreignField: 'npcId',
                as: 'augmentations',
              },
            },
            {
              $lookup: {
                from: 'weapons',
                localField: '_id',
                foreignField: 'npcId',
                as: 'weapons',
              },
            },
            {
              $lookup: {
                from: 'wearables',
                localField: '_id',
                foreignField: 'npcId',
                as: 'wearables',
              },
            },
            {
              $lookup: {
                from: 'consumables',
                localField: '_id',
                foreignField: 'npcId',
                as: 'consumables',
              },
            },
            {
              $lookup: {
                from: 'usables',
                localField: '_id',
                foreignField: 'npcId',
                as: 'usables',
              },
            },
          ],
          as: 'npcs',
        },
      },
      {
        $lookup: {
          from: 'invites',
          localField: '_id',
          foreignField: 'campSheetId',
          as: 'invites',
        },
      },
      {
        $lookup: {
          from: 'logs',
          localField: '_id',
          foreignField: 'sheetId',
          as: 'captainsLogs',
        },
      },
      {
        $lookup: {
          from: 'sessions',
          localField: '_id',
          foreignField: 'sheetId',
          as: 'sessions',
        },
      },
      {
        $lookup: {
          from: 'environments',
          localField: '_id',
          foreignField: 'sheetId',
          as: 'environments',
        },
      },
      {
        $lookup: {
          from: 'creatures',
          localField: '_id',
          foreignField: 'sheetId',
          as: 'creatures',
        },
      },
    ];
  }

  // Shared fields
  pipelineArr = [
    ...pipelineArr,
    {
      $lookup: {
        from: 'notes',
        localField: '_id',
        foreignField: 'sheetId',
        as: 'notes',
      },
    },
    {
      $lookup: {
        from: 'weapons',
        localField: '_id',
        foreignField: 'sheetId',
        as: 'weapons',
      },
    },
    {
      $lookup: {
        from: 'wearables',
        localField: '_id',
        foreignField: 'sheetId',
        as: 'wearables',
      },
    },
    {
      $lookup: {
        from: 'consumables',
        localField: '_id',
        foreignField: 'sheetId',
        as: 'consumables',
      },
    },
    {
      $lookup: {
        from: 'usables',
        localField: '_id',
        foreignField: 'sheetId',
        as: 'usables',
      },
    },
  ];

  const sheet = await req.SheetModel.aggregate([
    {
      $match: { _id: ObjectId(req.sheet.id) },
    },
    ...pipelineArr,
  ]);

  if (!sheet) {
    return next(new AppError(`An error occured during aggregation.`, 500));
  }

  // Send the response
  res.status(200).json({
    status: 'success',
    data: {
      sheet: sheet[0],
    },
  });
});

exports.updateSheet = catchAsync(async (req, res, next) => {
  // Specify specific fields allowed to be updated
  const filteredBody = filterObj(req.body, ...allowedFields[req.params.sheetType]);

  // Update document
  const updatedSheet = await req.SheetModel.findByIdAndUpdate(req.sheet.id, filteredBody, { new: true, runValidators: true });

  // Send the response
  res.status(200).json({
    status: 'success',
    data: {
      sheet: updatedSheet,
    },
  });
});

exports.deleteSheet = catchAsync(async (req, res, next) => {
  // Check if they are part of a campaign
  if (req.params.sheetType === 'characters' && req.sheet.campaign) {
    return next(
      new AppError('You cannot delete your character sheet while you belong to a campaign. If you still wish to delete your character sheet, first leave the campaign you are a part of.', 400)
    );
  }

  // Check if they have players in their campaign
  if (req.params.sheetType === 'campaigns' && req.sheet.players.length) {
    return next(
      new AppError('You cannot delete your campaign sheet while you have players who are a part of it. If you still wish to delete your campaign sheet, first remove any joined players.', 400)
    );
  }

  // Deleting a sheet requires the deletion of many other resources from many other collections
  let deletedCount = [];

  // if (req.params.sheetType === 'characters') {}

  if (req.params.sheetType === 'campaigns') {
    const sessions = await Session.deleteMany({ sheetId: req.sheet.id });
    const npcs = await Npc.deleteMany({ sheetId: req.sheet.id });
    const creatures = await Creature.deleteMany({ sheetId: req.sheet.id });
    const environments = await Environment.deleteMany({ sheetId: req.sheet.id });
    const invites = await Invite.deleteMany({ campSheetId: req.sheet.id });

    deletedCount = [...deletedCount, sessions, npcs, creatures, environments, invites];
  }

  const logs = await Log.deleteMany({ sheetId: req.sheet.id });
  const notes = await Note.deleteMany({ sheetId: req.sheet.id });
  const augmentations = await Augmentation.deleteMany({ sheetId: req.sheet.id });
  const weapons = await Weapon.deleteMany({ sheetId: req.sheet.id });
  const wearables = await Wearable.deleteMany({ sheetId: req.sheet.id });
  const consumables = await Consumable.deleteMany({ sheetId: req.sheet.id });
  const usables = await Usable.deleteMany({ sheetId: req.sheet.id });

  deletedCount = [...deletedCount, logs, notes, augmentations, weapons, wearables, consumables, usables];

  const deletedResources = deletedCount.reduce((prev, curr) => {
    return prev + curr.deletedCount;
  }, 0);

  // Finally, delete the sheet itself once all dependencies are deleted
  await await req.SheetModel.findByIdAndDelete(req.sheet.id);

  // Send the response
  res.status(200).json({
    status: 'success',
    data: {
      sheetsDeleted: 1,
      resourcesDeleted: deletedResources,
    },
  });
});
