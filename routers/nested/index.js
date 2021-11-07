module.exports = {
  logRouter: require('./shared/log.router'),
  noteRouter: require('./shared/note.router'),
  inviteRouter: require('./shared/invite.router'),
  augmentationRouter: require('./shared/augmentation.router'),
  weaponRouter: require('./shared/belongings/weapon.router'),
  wearableRouter: require('./shared/belongings/wearable.router'),
  consumableRouter: require('./shared/belongings/consumable.router'),
  usableRouter: require('./shared/belongings/usable.router'),
  npcRouter: require('./campaigns/npc.router'),
  sessionRouter: require('./campaigns/session.router'),
  environmentRouter: require('./campaigns/interactables/environment.router'),
  creatureRouter: require('./campaigns/interactables/creature.router'),
};
