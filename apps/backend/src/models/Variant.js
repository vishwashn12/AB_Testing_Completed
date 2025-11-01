const mongoose = require('mongoose');

/**
 * US-06: Variant Schema
 * Stores experiment variants with traffic allocation
 * MVP: Supports exactly 2 variants (A and B) per experiment
 */
const variantSchema = new mongoose.Schema({
  experimentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experiment',
    required: [true, 'Experiment ID is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Variant name is required'],
    trim: true,
    enum: {
      values: ['Variant A', 'Variant B', 'Control', 'Treatment'],
      message: 'Variant name must be "Variant A", "Variant B", "Control", or "Treatment"'
    },
  },
  allocation: {
    type: Number,
    required: [true, 'Traffic allocation is required'],
    min: [0, 'Allocation cannot be negative'],
    max: [100, 'Allocation cannot exceed 100'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [300, 'Description cannot exceed 300 characters'],
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
}, {
  timestamps: true,
});

// Compound index for unique variant names per experiment
variantSchema.index({ experimentId: 1, name: 1 }, { unique: true });

// Soft delete method
variantSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

// Query helper to exclude deleted variants
variantSchema.query.active = function () {
  return this.where({ isDeleted: false });
};

// US-07: Static method to validate allocation sum = 100%
variantSchema.statics.validateAllocationSum = async function (experimentId, excludeVariantId = null) {
  const query = { experimentId };
  if (excludeVariantId) {
    query._id = { $ne: excludeVariantId };
  }

  const variants = await this.find(query);
  const totalAllocation = variants.reduce((sum, variant) => sum + variant.allocation, 0);

  return {
    isValid: totalAllocation === 100,
    currentTotal: totalAllocation,
    variants: variants.length,
  };
};

// US-07: Pre-save validation for allocation
variantSchema.pre('save', async function (next) {
  if (this.isModified('allocation') || this.isNew) {
    const otherVariants = await this.constructor.find({
      experimentId: this.experimentId,
      _id: { $ne: this._id },
    });

    const totalAllocation = otherVariants.reduce((sum, v) => sum + v.allocation, 0) + this.allocation;

    if (totalAllocation > 100) {
      const error = new Error(`Total allocation would be ${totalAllocation}%. Cannot exceed 100%`);
      error.statusCode = 400;
      return next(error);
    }
  }
  next();
});

const Variant = mongoose.model('Variant', variantSchema);

module.exports = Variant;
