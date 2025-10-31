const Event = require('../models/Event');
const Variant = require('../models/Variant');
const Experiment = require('../models/Experiment');

// US-12: Get conversion rate for experiment
exports.getConversionRate = async (req, res, next) => {
  try {
    const { experimentId } = req.params;

    // Verify experiment exists
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

    // Get conversion rates by variant
    const conversionRates = await Event.getConversionRate(experimentId);

    res.status(200).json({
      success: true,
      data: {
        experimentId,
        experimentName: experiment.name,
        variants: conversionRates,
      },
    });
  } catch (error) {
    next(error);
  }
};

// US-13: Get summary metrics
exports.getSummaryMetrics = async (req, res, next) => {
  try {
    const { experimentId } = req.params;

    // Verify experiment exists
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

    // Get summary metrics
    const summary = await Event.getSummaryMetrics(experimentId);

    res.status(200).json({
      success: true,
      data: {
        experimentId,
        experimentName: experiment.name,
        experimentStatus: experiment.status,
        summary,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get detailed analytics for experiment
exports.getDetailedAnalytics = async (req, res, next) => {
  try {
    const { experimentId } = req.params;

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

    const variants = await Variant.find({
      experimentId,
      isDeleted: false,
    });

    // Get metrics for each variant
    const variantMetrics = await Promise.all(
      variants.map(async (variant) => {
        const exposures = await Event.countDocuments({
          experimentId,
          variantId: variant._id,
          eventType: 'exposure',
        });

        const conversions = await Event.countDocuments({
          experimentId,
          variantId: variant._id,
          eventType: 'conversion',
        });

        const totalValue = await Event.aggregate([
          {
            $match: {
              experimentId: experiment._id,
              variantId: variant._id,
              eventType: 'conversion',
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$value' },
            },
          },
        ]);

        const revenue = totalValue.length > 0 ? totalValue[0].total : 0;

        return {
          variantId: variant._id,
          variantName: variant.name,
          allocation: variant.allocation,
          exposures,
          conversions,
          conversionRate: exposures > 0 ? (conversions / exposures) * 100 : 0,
          revenue,
          averageValue: conversions > 0 ? revenue / conversions : 0,
        };
      })
    );

    // Calculate totals
    const totals = variantMetrics.reduce(
      (acc, v) => ({
        exposures: acc.exposures + v.exposures,
        conversions: acc.conversions + v.conversions,
        revenue: acc.revenue + v.revenue,
      }),
      { exposures: 0, conversions: 0, revenue: 0 }
    );

    res.status(200).json({
      success: true,
      data: {
        experiment: {
          id: experiment._id,
          name: experiment.name,
          status: experiment.status,
          createdAt: experiment.createdAt,
        },
        variants: variantMetrics,
        totals: {
          ...totals,
          conversionRate:
            totals.exposures > 0
              ? (totals.conversions / totals.exposures) * 100
              : 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
