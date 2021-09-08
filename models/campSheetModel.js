const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const campSheetSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.ObjectId,
    required: [true, 'A campaign sheet must have an associated playerId'],
  },
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
  createdAt: Date,
  slug: String,
});

// virtual properties
// campSheetSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7;
// });

// document middleware runs before save and create, but NOT update
campSheetSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = Date.now();
  next();
});

// campSheetSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// campSheetSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

campSheetSchema.post(/^find/, function (docs, next) {
  // console.log(docs);
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGATION MIDDLEWARE
// campSheetSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

const CampSheet = mongoose.model('Campaigns', campSheetSchema);

module.exports = CampSheet;
