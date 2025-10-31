const Event = require('../models/Event');
const Experiment = require('../models/Experiment');
const Variant = require('../models/Variant');
const { hashUserId } = require('../utils/hashUtils');

// US-10: Log exposure event
exports.logExposure = async (req, res, next) => {
  try {
    const { experimentId, variantId, userId, metadata } = req.body;

    // Validation
    if (!experimentId || !variantId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Experiment ID, variant ID, and user ID are required',
      });
    }

    // Verify experiment and variant exist
    const experiment = await Experiment.findOne({
      _id: experimentId,
      isDeleted: false,
    });

    if (!experiment) {
      return res.status(404).json({
        success: false,
        error: 'Experiment not found',
      });
    }

    const variant = await Variant.findOne({
      _id: variantId,
      experimentId,
      isDeleted: false,
    });

    if (!variant) {
      return res.status(404).json({
        success: false,
        error: 'Variant not found',
      });
    }

    // Hash user ID (US-21)
    const hashedUserId = hashUserId(userId);

    // Create exposure event
    const event = await Event.create({
      experimentId,
      variantId,
      userId: hashedUserId,
      eventType: 'exposure',
      metadata: metadata || {},
    });

    res.status(201).json({
      success: true,
      data: event,
      message: 'Exposure logged successfully',
    });
  } catch (error) {
    next(error);
  }
};

// US-11: Track conversion event
exports.trackConversion = async (req, res, next) => {
  try {
    const { experimentId, variantId, userId, value, metadata } = req.body;

    // Validation
    if (!experimentId || !variantId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Experiment ID, variant ID, and user ID are required',
      });
    }

    // Verify experiment and variant exist
    const experiment = await Experiment.findOne({
      _id: experimentId,
      isDeleted: false,
    });

    if (!experiment) {
      return res.status(404).json({
        success: false,
        error: 'Experiment not found',
      });
    }

    const variant = await Variant.findOne({
      _id: variantId,
      experimentId,
      isDeleted: false,
    });

    if (!variant) {
      return res.status(404).json({
        success: false,
        error: 'Variant not found',
      });
    }

    // Hash user ID (US-21)
    const hashedUserId = hashUserId(userId);

    // Create conversion event
    const event = await Event.create({
      experimentId,
      variantId,
      userId: hashedUserId,
      eventType: 'conversion',
      value: value || 0,
      metadata: metadata || {},
    });

    res.status(201).json({
      success: true,
      data: event,
      message: 'Conversion tracked successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get all events for an experiment
exports.getEventsByExperiment = async (req, res, next) => {
  try {
    const { experimentId } = req.params;
    const { eventType, page = 1, limit = 50 } = req.query;

    const query = { experimentId };
    if (eventType) {
      query.eventType = eventType;
    }

    const events = await Event.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
