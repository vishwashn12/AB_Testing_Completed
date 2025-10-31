const mongoose = require('mongoose');

/**
 * US-10, US-11: Event Schema
 * Tracks exposure and conversion events for analytics
 */
const eventSchema = new mongoose.Schema({
  experimentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experiment',
    required: [true, 'Experiment ID is required'],
    index: true,
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variant',
    required: [true, 'Variant ID is required'],
    index: true,
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true,
  },
  eventType: {
    type: String,
    enum: {
      values: ['exposure', 'conversion'],
      message: '{VALUE} is not a valid event type',
    },
    required: [true, 'Event type is required'],
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  value: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

// Compound indexes for analytics queries (US-12)
eventSchema.index({ experimentId: 1, variantId: 1, eventType: 1 });
eventSchema.index({ userId: 1, experimentId: 1, timestamp: -1 });

// US-12: Static method to compute conversion rate
eventSchema.statics.getConversionRate = async function (experimentId, variantId) {
  const exposures = await this.countDocuments({
    experimentId,
    variantId,
    eventType: 'exposure',
  });

  const conversions = await this.countDocuments({
    experimentId,
    variantId,
    eventType: 'conversion',
  });

  const conversionRate = exposures > 0 ? (conversions / exposures) * 100 : 0;

  return {
    exposures,
    conversions,
    conversionRate: Math.round(conversionRate * 100) / 100, // Round to 2 decimals
  };
};

// US-13: Static method to get summary metrics
eventSchema.statics.getSummaryMetrics = async function (experimentId) {
  const pipeline = [
    { $match: { experimentId: new mongoose.Types.ObjectId(experimentId) } },
    {
      $group: {
        _id: {
          variantId: '$variantId',
          eventType: '$eventType',
        },
        count: { $sum: 1 },
        totalValue: { $sum: '$value' },
      },
    },
    {
      $group: {
        _id: '$_id.variantId',
        exposures: {
          $sum: {
            $cond: [{ $eq: ['$_id.eventType', 'exposure'] }, '$count', 0],
          },
        },
        conversions: {
          $sum: {
            $cond: [{ $eq: ['$_id.eventType', 'conversion'] }, '$count', 0],
          },
        },
        totalValue: { $sum: '$totalValue' },
      },
    },
    {
      $project: {
        variantId: '$_id',
        exposures: 1,
        conversions: 1,
        conversionRate: {
          $cond: [
            { $gt: ['$exposures', 0] },
            { $multiply: [{ $divide: ['$conversions', '$exposures'] }, 100] },
            0,
          ],
        },
        totalValue: 1,
      },
    },
  ];

  return this.aggregate(pipeline);
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
