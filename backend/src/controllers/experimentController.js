const Experiment = require('../models/Experiment');
const Variant = require('../models/Variant');

// US-01: Create new experiment
exports.createExperiment = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Experiment name is required' 
      });
    }

    // Create experiment
    const experimentData = {
      name: name.trim(),
      description: description?.trim() || '',
      status: status || 'draft',
    };

    // Only add createdBy if user is authenticated
    if (req.user && req.user._id) {
      experimentData.createdBy = req.user._id;
    }

    const experiment = await Experiment.create(experimentData);

    res.status(201).json({
      success: true,
      data: experiment,
      message: 'Experiment created successfully',
    });
  } catch (error) {
    console.error('Error creating experiment:', error);
    next(error);
  }
};

// US-04: List all experiments
exports.getAllExperiments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { isDeleted: false };
    if (status) {
      query.status = status;
    }

    const experiments = await Experiment.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Experiment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: experiments,
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

// Get single experiment by ID
exports.getExperimentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const experiment = await Experiment.findOne({
      _id: id,
      isDeleted: false,
    }).populate('createdBy', 'name email');

    if (!experiment) {
      return res.status(404).json({
        success: false,
        error: 'Experiment not found',
      });
    }

    // Get variants for this experiment
    const variants = await Variant.find({ 
      experimentId: id,
      isDeleted: false 
    });

    res.status(200).json({
      success: true,
      data: {
        ...experiment.toObject(),
        variants,
      },
    });
  } catch (error) {
    next(error);
  }
};

// US-02: Update experiment status
exports.updateExperimentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const experiment = await Experiment.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!experiment) {
      return res.status(404).json({
        success: false,
        error: 'Experiment not found',
      });
    }

    // Validate status transition
    if (!experiment.canTransitionTo(status)) {
      return res.status(400).json({
        success: false,
        error: `Cannot transition from ${experiment.status} to ${status}`,
      });
    }

    experiment.status = status;
    await experiment.save();

    res.status(200).json({
      success: true,
      data: experiment,
      message: `Experiment status updated to ${status}`,
    });
  } catch (error) {
    next(error);
  }
};

// US-03: Soft delete experiment
exports.deleteExperiment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const experiment = await Experiment.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!experiment) {
      return res.status(404).json({
        success: false,
        error: 'Experiment not found',
      });
    }

    await experiment.softDelete();

    res.status(200).json({
      success: true,
      message: 'Experiment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Update experiment details
exports.updateExperiment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const experiment = await Experiment.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!experiment) {
      return res.status(404).json({
        success: false,
        error: 'Experiment not found',
      });
    }

    if (name) experiment.name = name.trim();
    if (description !== undefined) experiment.description = description.trim();

    await experiment.save();

    res.status(200).json({
      success: true,
      data: experiment,
      message: 'Experiment updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
