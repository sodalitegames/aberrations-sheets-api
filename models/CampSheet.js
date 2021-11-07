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
  memos: {
    type: [String],
    default: [`Hello from your first memo! You can easily delete this and create more whenever you'd like`],
  },
  createdAt: Date,
  slug: String,
});

// document middleware runs before save and create, but NOT update
campSheetSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = Date.now();
  next();
});

// campSheetSchema.post(/^find/, function (docs, next) {
//   // console.log(docs);
//   console.log(`Query took ${Date.now() - this.start} milliseconds`);
//   next();
// });

const CampSheet = mongoose.model('Campaigns', campSheetSchema);

module.exports = CampSheet;
