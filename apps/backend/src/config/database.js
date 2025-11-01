const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE, 10) || 50, // US-22 Performance
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Register models first
    require('../models/Experiment');
    require('../models/Variant');
    require('../models/Event');
    require('../models/User');

    // Create indexes for performance (US-22)
    await createIndexes();
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    // Experiment indexes (US-01, US-04)
    const Experiment = mongoose.model('Experiment');
    await Experiment.collection.createIndex({ name: 1 }, { unique: true });
    await Experiment.collection.createIndex({ status: 1 });
    await Experiment.collection.createIndex({ isDeleted: 1 });

    // Variant indexes (US-06)
    const Variant = mongoose.model('Variant');
    await Variant.collection.createIndex({ experimentId: 1 });
    await Variant.collection.createIndex({ experimentId: 1, name: 1 }, { unique: true });

    // Event indexes (US-10, US-11)
    const Event = mongoose.model('Event');
    await Event.collection.createIndex({ experimentId: 1, variantId: 1 });
    await Event.collection.createIndex({ userId: 1, experimentId: 1 });
    await Event.collection.createIndex({ timestamp: -1 });

    console.log('✅ Database indexes created');
  } catch (error) {
    // Indexes may already exist, ignore error
    if (error.code !== 11000) {
      console.warn('⚠️ Index creation warning:', error.message);
    }
  }
};

// Graceful shutdown
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

module.exports = { connectDB };
