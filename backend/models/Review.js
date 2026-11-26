const mongoose = require('mongoose');

// Defined in Week 2 for a complete database design. Review APIs come in Week 3.
const reviewSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    comment: { type: String, trim: true, maxlength: [500, 'Comment cannot be longer than 500 characters'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
