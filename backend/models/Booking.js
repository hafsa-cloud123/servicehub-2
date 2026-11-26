const mongoose = require('mongoose');

// The Booking model is defined now (Week 2) so the database design is complete.
// The booking APIs and business logic are built in Week 3.
const bookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    date: { type: Date, required: [true, 'Booking date is required'] },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      match: [/^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/, 'Time slot must look like 10:00-11:00'],
    },
    // Price is copied from the service at booking time so later price changes do not alter old bookings.
    price: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'rejected', 'cancelled'],
      default: 'pending',
    },
    notes: { type: String, trim: true, maxlength: 300 },
  },
  { timestamps: true }
);

// Database-level protection against double booking: the same provider cannot have two
// active (pending or confirmed) bookings for the same date and time slot.
bookingSchema.index(
  { provider: 1, date: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } } }
);
bookingSchema.index({ customer: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
