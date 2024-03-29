const mongoose = require('mongoose');

const CharSheet = require('../models/CharSheet');
const CampSheet = require('../models/CampSheet');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');

// Import the following models to be used when deleting a character sheet
const Log = require('../models/shared/Log');
const Note = require('../models/shared/Note');
const Invite = require('../models/shared/Invite');
const Transaction = require('../models/shared/Transaction');
const Augmentation = require('../models/shared/Augmentation');
const Weapon = require('../models/shared/belongings/Weapon');
const Wearable = require('../models/shared/belongings/Wearable');
const Consumable = require('../models/shared/belongings/Consumable');
const Usable = require('../models/shared/belongings/Usable');
const Npc = require('../models/campaigns/Npc');
const Session = require('../models/campaigns/Session');
const Combat = require('../models/campaigns/Combat');
const Creature = require('../models/campaigns/interactables/Creature');
const Environment = require('../models/campaigns/interactables/Environment');

const SheetModels = {
  characters: CharSheet,
  campaigns: CampSheet,
};

const allowedFields = {
  characters: [
    'characterName',
    'playerNickname',
    'charDescription',
    'charBackground',
    'currentHp',
    'maxHp',
    'experience',
    'milestones',
    'wallet',
    'conditions',
    'strength',
    'agility',
    'persona',
    'aptitude',
    'spentUpgradePoints',
    'mortality',
    'active',
    'modifiers',
  ],
  campaigns: ['name', 'overview', 'details', 'ccNickname', 'memos', 'wallet'],
};

exports.restrictTo =
  (...sheetTypes) =>
  (req, res, next) => {
    if (!sheetTypes.includes(req.params.sheetType)) {
      return next(new AppError(`This route does not exist for ${req.params.sheetType}. Did you mean to use ${sheetTypes}?`, 404));
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

exports.requireAuthorization = catchAsync(async (req, res, next) => {
  // req.player comes from authController.requireAuthorization
  if (!req.player || !req.sheet) {
    return next(new AppError('Cannot authorize. Player and/or Sheet are undefined.', 400));
  }

  // req.player comes from authController.requireAuthorization
  if (req.player.id.toString() !== req.sheet.playerId.toString()) {
    // Check if it is a character sheet and it has a campaign
    if (req.params.sheetType === 'characters' && req.sheet.campaign) {
      // Fetch the campaign of the character sheet
      const campSheet = await CampSheet.findById(req.sheet.campaign);
      // Give access to the sheet if they are the campaign captain
      if (req.player.id.toString() === campSheet.playerId.toString()) {
        req.isCC = true;
        return next();
      }
    }

    // Return authorization error if they are not the player or the campaign captain
    return next(new AppError('You are not authorized to request this route.', 401));
  }

  next();
});

const pipelinePieces = {
  charSheetVirtualFields: {
    speed: 3,
    shieldValue: 0,
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
    playerNickname: 1,
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
                      localField: '_id',
                      foreignField: 'sheetId',
                      as: 'augmentations',
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
          pipeline: [{ $match: { $expr: { $eq: ['$sheetId', '$$currId'] } } }, { $addFields: pipelinePieces.charSheetVirtualFields }],
          as: 'npcs',
        },
      },
      {
        $lookup: {
          from: 'invites',
          localField: '_id',
          foreignField: 'sheetId',
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
          from: 'combats',
          localField: '_id',
          foreignField: 'sheetId',
          as: 'combats',
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
        from: 'transactions',
        localField: '_id',
        foreignField: 'sheetId',
        as: 'transactions.sent',
      },
    },
    {
      $lookup: {
        from: 'transactions',
        localField: '_id',
        foreignField: 'receivingSheetId',
        as: 'transactions.received',
      },
    },
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
      $match: { _id: mongoose.Types.ObjectId(req.sheet.id) },
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
      permissions: req.isCC
        ? {
            isCC: req.isCC,
          }
        : undefined,
    },
  });
});

exports.updateSheet = catchAsync(async (req, res, next) => {
  // Specify specific fields allowed to be updated
  const filteredBody = filterObj.setAllowedFields(req.body, ...allowedFields[req.params.sheetType]);

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
    const combats = await Combat.deleteMany({ sheetId: req.sheet.id });
    const npcs = await Npc.deleteMany({ sheetId: req.sheet.id });
    const creatures = await Creature.deleteMany({ sheetId: req.sheet.id });
    const environments = await Environment.deleteMany({ sheetId: req.sheet.id });
    const invites = await Invite.deleteMany({ campSheetId: req.sheet.id });

    deletedCount = [...deletedCount, sessions, combats, npcs, creatures, environments, invites];
  }

  const logs = await Log.deleteMany({ sheetId: req.sheet.id });
  const notes = await Note.deleteMany({ sheetId: req.sheet.id });
  const augmentations = await Augmentation.deleteMany({ sheetId: req.sheet.id });
  const weapons = await Weapon.deleteMany({ sheetId: req.sheet.id });
  const wearables = await Wearable.deleteMany({ sheetId: req.sheet.id });
  const consumables = await Consumable.deleteMany({ sheetId: req.sheet.id });
  const usables = await Usable.deleteMany({ sheetId: req.sheet.id });
  const transactions = await Transaction.deleteMany({ sheetId: req.sheet.id });

  deletedCount = [...deletedCount, logs, notes, augmentations, weapons, wearables, consumables, usables, transactions];

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

const removePlayerFromCampaign = async (charId, campId) => {
  const updatedCharSheet = await CharSheet.findByIdAndUpdate(charId, { campaign: null }, { new: true, runValidators: true });

  if (!updatedCharSheet) {
    return false;
  }

  const updatedCampSheet = await CampSheet.findByIdAndUpdate(campId, { $pull: { players: charId } }, { new: true, runValidators: true });

  // Rollback changes to character sheet if camp sheet update was unsuccessful
  if (!updatedCampSheet) {
    await CharSheet.findByIdAndUpdate(charId, { campaign: campId }, { new: true, runValidators: true });
    return false;
  }

  if (updatedCharSheet && updatedCampSheet) return true;

  return false;
};

// Only Character Sheets can hit this route
exports.leaveCampaign = catchAsync(async (req, res, next) => {
  if (!req.sheet.campaign) {
    return next(new AppError('You are not a member of any campaign to leave.', 400));
  }

  const success = await removePlayerFromCampaign(req.sheet.id, req.sheet.campaign);

  if (!success) {
    return next(new AppError('An error occured removing you from the campaign. Please try again later.', 500));
  }

  res.status(200).json({
    status: 'success',
    data: {
      message: 'You have successfully left the campaign.',
    },
    metadata: {
      charId: req.sheet.id,
      campId: req.sheet.campaign._id,
    },
  });
});

// Only Campaign Sheets can hit this route
exports.removePlayer = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.body.charId)) {
    return next(new AppError('The provided charId is not a valid id.', 400));
  }

  if (!req.sheet.players.find(player => player.id === req.body.charId)) {
    return next(new AppError('This player is not a member of your campaign.', 400));
  }

  const success = await removePlayerFromCampaign(req.body.charId, req.sheet.id);

  if (!success) {
    return next(new AppError('An error occured removing the player from the campaign. Please try again later.', 500));
  }

  res.status(200).json({
    status: 'success',
    data: {
      message: 'You have successfully removed the player from the campaign.',
    },
    metadata: {
      charId: req.body.charId,
      campId: req.sheet.id,
    },
  });
});
