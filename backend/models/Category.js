const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [40, 'Category name cannot be longer than 40 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot be longer than 200 characters'],
    },
  },
  { timestamps: true }
);

// Unique name, ignoring upper/lower case ("Tutor" and "tutor" count as the same).
categorySchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

module.exports = mongoose.model('Category', categorySchema);
