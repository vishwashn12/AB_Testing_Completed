const mongoose = require('mongoose');

/**
 * US-01: Experiment Schema
 * Stores A/B test experiment configurations
 */
const experimentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Experiment name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: false, // Made optional for MVP
    trim: true,
    default: '',
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'running', 'paused', 'completed'],
      message: '{VALUE} is not a valid status',
    },
    default: 'draft',
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false, // US-03: Soft delete flag
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual populate variants
experimentSchema.virtual('variants', {
  ref: 'Variant',
  localField: '_id',
  foreignField: 'experimentId',
});

// US-02: Status transition validation
experimentSchema.methods.canTransitionTo = function (newStatus) {
  const validTransitions = {
    draft: ['running', 'completed'],
    running: ['paused', 'completed'],
    paused: ['running', 'completed'],
    completed: [], // Cannot transition from completed
  };

  return validTransitions[this.status]?.includes(newStatus) || false;
};

// US-03: Soft delete method
experimentSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

// Query helper to exclude deleted experiments
experimentSchema.query.active = function () {
  return this.where({ isDeleted: false });
};

// Pre-save middleware for validation
experimentSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.name = this.name.trim();
  }
  next();
});

const Experiment = mongoose.model('Experiment', experimentSchema);

module.exports = Experiment;
