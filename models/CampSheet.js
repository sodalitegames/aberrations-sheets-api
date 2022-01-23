const mongoose = require('mongoose');
const slugify = require('slugify');

const campSheetSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.ObjectId,
      required: [true, 'A campaign sheet must have an associated playerId'],
    },
    ccName: {
      type: String,
      required: [true, 'A campaign sheet must have a specified ccName'],
    },
    ccNickname: String,
    name: {
      type: String,
      required: [true, 'A campaign sheet must have a name'],
    },
    overview: {
      type: String,
      required: [true, 'A campaign sheet must have an overview'],
    },
    details: {
      type: String,
      required: [true, 'A campaign sheet must have details'],
    },
    memos: {
      type: [String],
      default: [`Hello from your first memo! You can easily delete this and create more whenever you'd like`],
    },
    players: [{ type: mongoose.Schema.ObjectId, ref: 'Characters' }],
    slug: String,
  },
  { timestamps: true }
);

// Document middleware
campSheetSchema.pre('save', function (next) {
  // Runs before save and create, but NOT update
  this.slug = slugify(this.name, { lower: true });
  next();
});

campSheetSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

campSheetSchema.pre(/^find/, function (next) {
  // Populate the players' basic details
  this.populate({ path: 'players', select: 'playerName playerNickname characterName -campaign' });
  next();
});

campSheetSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

const CampSheet = mongoose.model('Campaigns', campSheetSchema);

module.exports = CampSheet;
