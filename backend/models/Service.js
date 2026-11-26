const mongoose = require('mongoose');

const { DAYS, TIME_REGEX } = require('../utils/constants');

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const serviceSchema = new mongoose.Schema(
  {
    // Relationships: a service belongs to one provider (User) and one Category.
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Provider is required'] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, 'Category is required'] },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot be longer than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot be longer than 1000 characters'],
    },
    price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [15, 'Duration must be at least 15 minutes'],
      max: [480, 'Duration cannot be more than 480 minutes'],
    },
    city: { type: String, required: [true, 'City is required'], trim: true },
    workingDays: {
      type: [String],
      enum: { values: DAYS, message: '{VALUE} is not a valid day' },
      validate: { validator: (arr) => arr.length > 0, message: 'Select at least one working day' },
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [TIME_REGEX, 'Start time must be in HH:MM format'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [TIME_REGEX, 'End time must be in HH:MM format'],
    },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Business rule: working hours must make sense and be long enough for one booking.
serviceSchema.pre('validate', function () {
  if (TIME_REGEX.test(this.startTime) && TIME_REGEX.test(this.endTime)) {
    const window = toMinutes(this.endTime) - toMinutes(this.startTime);
    if (window <= 0) {
      this.invalidate('endTime', 'End time must be after start time');
    } else if (this.durationMinutes && this.durationMinutes > window) {
      this.invalidate('durationMinutes', 'Duration is longer than the working hours');
    }
  }
});

serviceSchema.index({ category: 1, city: 1 });

module.exports = mongoose.model('Service', serviceSchema);
