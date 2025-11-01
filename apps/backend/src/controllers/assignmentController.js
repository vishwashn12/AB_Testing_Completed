const Variant = require('../models/Variant');
const Experiment = require('../models/Experiment');
const { assignVariant } = require('../utils/hashUtils');

// US-08: Get variant assignment for user
exports.getAssignment = async (req, res, next) => {
  try {
    const { experimentId, userId } = req.body;

    console.log('🎯 Assignment Request:', { experimentId, userId });

    // Validation
    if (!experimentId || !userId) {
      console.log('❌ Missing experimentId or userId');
      return res.status(400).json({
        success: false,
        error: 'Experiment ID and user ID are required',
      });
    }

    // Check if experiment exists and is running
    const experiment = await Experiment.findOne({
      _id: experimentId,
      isDeleted: false,
    });

    console.log('📊 Experiment found:', experiment ? experiment.name : 'NOT FOUND');
    console.log('📊 Experiment status:', experiment?.status);

    if (!experiment) {
      return res.status(404).json({
        success: false,
        error: 'Experiment not found',
      });
    }

    if (experiment.status !== 'running') {
      return res.status(400).json({
        success: false,
        error: `Experiment is ${experiment.status}, not running`,
      });
    }

    // Get all variants for this experiment
    const variants = await Variant.find({
      experimentId,
      isDeleted: false,
    });

    console.log('🎯 Variants found:', variants.length);

    if (variants.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No variants found for this experiment',
      });
    }

    // Validate allocation sums to 100
    const totalAllocation = variants.reduce((sum, v) => sum + v.allocation, 0);
    console.log('📊 Total allocation:', totalAllocation);
    
    if (totalAllocation !== 100) {
      return res.status(400).json({
        success: false,
        error: `Variant allocations must sum to 100% (current: ${totalAllocation}%)`,
      });
    }

    // Deterministic assignment based on user ID
    console.log('🎲 Calling assignVariant...');
    const assignedVariant = assignVariant(userId, experimentId, variants);
    console.log('✅ Assigned variant:', assignedVariant.name);

    res.status(200).json({
      success: true,
      data: {
        experimentId,
        experimentName: experiment.name,
        variant: {
          id: assignedVariant._id,
          name: assignedVariant.name,
          config: assignedVariant.config,
          allocation: assignedVariant.allocation,
        },
        userId, // Original userId (not hashed for client)
      },
      message: 'Variant assigned successfully',
    });
  } catch (error) {
    console.error('❌ Assignment Error:', error.message);
    console.error('❌ Stack:', error.stack);
    next(error);
  }
};
