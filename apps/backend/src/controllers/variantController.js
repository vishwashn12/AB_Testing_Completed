const Variant = require('../models/Variant');
const Experiment = require('../models/Experiment');

// US-06: Add variants to experiment (MVP: Max 2 variants - A and B)
exports.createVariant = async (req, res, next) => {
  try {
    const { experimentId, name, allocation, description, config } = req.body;

    // Validation
    if (!experimentId || !name) {
      return res.status(400).json({
        success: false,
        error: 'Experiment ID and variant name are required',
      });
    }

    // Check if experiment exists
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

    // MVP: Enforce maximum 2 variants per experiment
    const existingVariants = await Variant.countDocuments({
      experimentId,
      isDeleted: false,
    });

    if (existingVariants >= 2) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 2 variants allowed per experiment (A/B testing). Delete an existing variant first.',
      });
    }

    // Create variant
    const variant = await Variant.create({
      experimentId,
      name: name.trim(),
      allocation: allocation || 50, // Default 50/50 split
      description: description?.trim() || '',
      config: config || {},
    });

    res.status(201).json({
      success: true,
      data: variant,
      message: 'Variant created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get all variants for an experiment
exports.getVariantsByExperiment = async (req, res, next) => {
  try {
    const { experimentId } = req.params;

    const variants = await Variant.find({
      experimentId,
      isDeleted: false,
    }).sort({ createdAt: 1 });

    console.log('🔍 Fetching variants for experiment:', experimentId);
    console.log('📊 Found variants:', variants.length);
    variants.forEach(v => {
      console.log('  - Variant:', v.name, '| Allocation:', v.allocation, '| ID:', v._id);
    });

    res.status(200).json({
      success: true,
      data: variants,
    });
  } catch (error) {
    next(error);
  }
};

// Get single variant
exports.getVariantById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const variant = await Variant.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!variant) {
      return res.status(404).json({
        success: false,
        error: 'Variant not found',
      });
    }

    res.status(200).json({
      success: true,
      data: variant,
    });
  } catch (error) {
    next(error);
  }
};

// US-07: Update variant allocation
exports.updateVariantAllocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { allocation } = req.body;

    if (allocation === undefined || allocation < 0 || allocation > 100) {
      return res.status(400).json({
        success: false,
        error: 'Allocation must be between 0 and 100',
      });
    }

    const variant = await Variant.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!variant) {
      return res.status(404).json({
        success: false,
        error: 'Variant not found',
      });
    }

    variant.allocation = allocation;
    await variant.save();

    res.status(200).json({
      success: true,
      data: variant,
      message: 'Variant allocation updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Update variant details
exports.updateVariant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, config } = req.body;

    const variant = await Variant.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!variant) {
      return res.status(404).json({
        success: false,
        error: 'Variant not found',
      });
    }

    if (name) variant.name = name.trim();
    if (description !== undefined) variant.description = description.trim();
    if (config) variant.config = config;

    await variant.save();

    res.status(200).json({
      success: true,
      data: variant,
      message: 'Variant updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Delete variant
exports.deleteVariant = async (req, res, next) => {
  try {
    const { id } = req.params;

    const variant = await Variant.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!variant) {
      return res.status(404).json({
        success: false,
        error: 'Variant not found',
      });
    }

    variant.isDeleted = true;
    variant.deletedAt = new Date();
    await variant.save();

    res.status(200).json({
      success: true,
      message: 'Variant deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
