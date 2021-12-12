const CharSheet = require('../../models/CharSheet');
const CampSheet = require('../../models/CampSheet');

const Invite = require('../../models/shared/Invite');

const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const filterObj = require('../../utils/filterObj');
const factory = require('../../utils/handlerFactory');

const addPlayerToCampaign = async (charId, campId) => {
  const updatedCharSheet = await CharSheet.findByIdAndUpdate(charId, { campaign: campId }, { new: true, runValidators: true });

  if (!updatedCharSheet) {
    return false;
  }

  const updatedCampSheet = await CampSheet.findByIdAndUpdate(campId, { $push: { players: charId } }, { new: true, runValidators: true });

  // Rollback changes to character sheet if camp sheet update was unsuccessful
  if (!updatedCampSheet) {
    await CharSheet.findByIdAndUpdate(charId, { campaign: null }, { new: true, runValidators: true });
    return false;
  }

  if (updatedCharSheet && updatedCampSheet) return true;

  return false;
};

exports.getInvitesForSheet = factory.getAllForSheet(Invite);
exports.createInviteForSheet = factory.createOneForSheet(Invite);
exports.getInvite = factory.getOne(Invite); // optional: populateOptions {path: 'reviews'}
exports.deleteInvite = factory.deleteOne(Invite);

exports.updateInvite = catchAsync(async (req, res, next) => {
  // Specify specific fields allowed to be updated
  const filteredBody = filterObj.setAllowedFields(req.body, 'status', 'message');

  // If the invite has been
  if (filteredBody.status === 'Accepted') inviteAccepted = true;

  // Get the invite
  const invite = await Invite.findById(req.params.inviteId);

  // If status has not been changed
  if (filteredBody.status && filteredBody.status === invite.status) {
    return next(new AppError(`Invite has already been ${invite.status}`, 400));
  }

  // Update the invite
  const updatedInvite = await Invite.findByIdAndUpdate(req.params.inviteId, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!updatedInvite) {
    return next(new AppError(`No invite found with id ${req.params.inviteId}`, 404));
  }

  let success;

  switch (updatedInvite.status) {
    case 'Accepted':
      success = await addPlayerToCampaign(updatedInvite.charSheetId, updatedInvite.sheetId);
      break;
    case 'Revoked':
    // send a message to the character sheet
    case 'Declined':
      // send a message to the campaign sheet
      break;
    default:
      break;
  }

  // If updating the character and campaign sheets was unsuccessful
  // then set the invite status to error
  if (updatedInvite.status === 'Accepted' && !success) {
    const updatedInvite = await Invite.findByIdAndUpdate(
      req.params.inviteId,
      { status: 'Error' },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'fail',
      data: {
        doc: updatedInvite,
        message: 'An error occurred updating the invite status.',
      },
    });
    return;
  }

  if (updatedInvite.status === 'Accepted' && success) {
    // Fetch the necessary info from the new campaign
    const campaign = await CampSheet.findById(updatedInvite.sheetId);

    res.status(200).json({
      status: 'success',
      data: {
        doc: updatedInvite,
        campaign: {
          name: campaign.name,
          ccName: campaign.ccName,
          ccNickname: campaign.ccNickname,
          players: campaign.players,
        },
        message: `Invite has been successfully accepted. Welcome to the newest member of the campaign!`,
      },
    });
    return;
  }

  // Send the response
  res.status(200).json({
    status: 'success',
    data: {
      doc: updatedInvite,
    },
  });
});
