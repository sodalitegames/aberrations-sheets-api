const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const charSheetSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.ObjectId,
    required: [true, 'A character sheet must have an associated playerId'],
  },
  playerName: {
    type: String,
    required: [true, 'A character sheet must have a playerName'],
  },
  characterName: {
    type: String,
    required: [true, 'A character sheet mmust have a characterName'],
  },
  // speciesId: {
  //   type: mongoose.ObjectId,
  //   required: [true, 'A character sheet must have an associated speciesId'],
  // },
  charBackground: {
    type: String,
    required: [true, 'A character sheet must have a charBackground'],
  },
  charDescription: {
    type: String,
    required: [true, 'A character sheet must have a charDescription'],
  },
  lifeKredits: Number,
  createdAt: Date,
  slug: String,
});

// virtual properties
// charSheetSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7;
// });

// document middleware runs before save and create, but NOT update
charSheetSchema.pre('save', function (next) {
  this.slug = slugify(this.characterName, { lower: true });
  this.createdAt = Date.now();
  next();
});

// charSheetSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// charSheetSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

charSheetSchema.post(/^find/, function (docs, next) {
  // console.log(docs);
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGATION MIDDLEWARE
// charSheetSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

const CharSheet = mongoose.model('Characters', charSheetSchema);

module.exports = CharSheet;
