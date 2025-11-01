require('dotenv').config();
const mongoose = require('mongoose');
const Experiment = require('../models/Experiment');
const Variant = require('../models/Variant');
const Event = require('../models/Event');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('🌱 Starting to seed database...');

    // Clear existing data
    await Experiment.deleteMany({});
    await Variant.deleteMany({});
    await Event.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@abtest.com',
        password: 'Admin123!',
        role: 'admin',
      },
      {
        name: 'Test User',
        email: 'user@abtest.com',
        password: 'User123!',
        role: 'user',
      },
    ]);
    console.log('✅ Created users');

    // Create experiments
    const experiments = await Experiment.create([
      {
        name: 'Product Page "Add to Cart" Button',
        description: 'Testing different CTA button styles on electronics product pages',
        status: 'running',
        createdBy: users[0]._id,
      },
      {
        name: 'Festive Sale Banner Position',
        description: 'Testing banner placement for Diwali sale - top vs sidebar',
        status: 'running',
        createdBy: users[0]._id,
      },
      {
        name: 'UPI vs COD Default Selection',
        description: 'Testing default payment method selection in checkout',
        status: 'running',
        createdBy: users[0]._id,
      },
      {
        name: 'Free Delivery Threshold Message',
        description: 'Testing different messaging for ₹499 free delivery threshold',
        status: 'completed',
        createdBy: users[0]._id,
      },
    ]);
    console.log('✅ Created experiments');

    // Create variants for Experiment 1 (Product Page CTA) - A/B Test
    const exp1Variants = await Variant.create([
      {
        experimentId: experiments[0]._id,
        name: 'Variant A',
        allocation: 50,
        description: 'Control - Standard orange "Add to Cart" button',
        config: { buttonColor: 'orange', buttonText: 'Add to Cart', style: 'standard' },
      },
      {
        experimentId: experiments[0]._id,
        name: 'Variant B',
        allocation: 50,
        description: 'Treatment - Green "Buy Now" button with cart icon',
        config: { buttonColor: 'green', buttonText: 'Buy Now', style: 'icon' },
      },
    ]);
    console.log('✅ Created variants for Product Page CTA Test');

    // Create variants for Experiment 2 (Festive Banner) - A/B Test
    const exp2Variants = await Variant.create([
      {
        experimentId: experiments[1]._id,
        name: 'Variant A',
        allocation: 50,
        description: 'Control - Banner at top of page',
        config: { position: 'top', animation: 'slide' },
      },
      {
        experimentId: experiments[1]._id,
        name: 'Variant B',
        allocation: 50,
        description: 'Treatment - Sticky sidebar banner',
        config: { position: 'sidebar', animation: 'fade' },
      },
    ]);
    console.log('✅ Created variants for Festive Banner Test');

    // Create variants for Experiment 3 (Payment Default) - A/B Test
    const exp3Variants = await Variant.create([
      {
        experimentId: experiments[2]._id,
        name: 'Variant A',
        allocation: 50,
        description: 'Control - UPI selected by default',
        config: { defaultPayment: 'UPI', showBenefits: false },
      },
      {
        experimentId: experiments[2]._id,
        name: 'Variant B',
        allocation: 50,
        description: 'Treatment - COD selected with trust badges',
        config: { defaultPayment: 'COD', showBenefits: true },
      },
    ]);
    console.log('✅ Created variants for Payment Default Test');

    // Create sample events (exposure and conversion)
    const events = [];
    
    // Generate events for Product Page CTA Test (Experiment 1)
    // Electronics products with realistic Indian pricing
    const productPrices = [1299, 2499, 3999, 5499, 7999, 12999, 15999, 24999, 34999, 49999];
    
    for (let i = 0; i < 250; i++) {
      const variantIndex = i % 2;
      const variant = exp1Variants[variantIndex];
      
      // Exposure event
      events.push({
        experimentId: experiments[0]._id,
        variantId: variant._id,
        userId: `user_${i}`,
        eventType: 'exposure',
        timestamp: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000), // Random time in last 10 days
      });

      // Conversions: Control 28%, Treatment 35% (Buy Now performs better)
      const conversionRate = variantIndex === 0 ? 0.28 : 0.35;
      if (Math.random() < conversionRate) {
        const price = productPrices[Math.floor(Math.random() * productPrices.length)];
        events.push({
          experimentId: experiments[0]._id,
          variantId: variant._id,
          userId: `user_${i}`,
          eventType: 'conversion',
          value: price, // Rupees
          metadata: { 
            source: 'product_page',
            category: 'electronics',
            city: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'][Math.floor(Math.random() * 7)]
          },
          timestamp: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
        });
      }
    }

    // Generate events for Festive Banner Test (Experiment 2)
    for (let i = 250; i < 450; i++) {
      const variantIndex = i % 2;
      const variant = exp2Variants[variantIndex];
      
      events.push({
        experimentId: experiments[1]._id,
        variantId: variant._id,
        userId: `user_${i}`,
        eventType: 'exposure',
        timestamp: new Date(Date.now() - Math.random() * 8 * 24 * 60 * 60 * 1000),
      });

      // Top banner 22%, Sidebar 31% (sidebar catches more attention)
      const conversionRate = variantIndex === 0 ? 0.22 : 0.31;
      if (Math.random() < conversionRate) {
        // Festive sale - fashion and home items
        const festivalPrices = [599, 899, 1499, 1999, 2999, 3499, 4999, 6999];
        const price = festivalPrices[Math.floor(Math.random() * festivalPrices.length)];
        events.push({
          experimentId: experiments[1]._id,
          variantId: variant._id,
          userId: `user_${i}`,
          eventType: 'conversion',
          value: price,
          metadata: { 
            source: 'festive_sale',
            category: ['fashion', 'home_decor', 'kitchen'][Math.floor(Math.random() * 3)],
            city: ['Mumbai', 'Delhi', 'Bangalore', 'Ahmedabad', 'Jaipur'][Math.floor(Math.random() * 5)]
          },
          timestamp: new Date(Date.now() - Math.random() * 8 * 24 * 60 * 60 * 1000),
        });
      }
    }

    // Generate events for Payment Default Test (Experiment 3)
    for (let i = 450; i < 600; i++) {
      const variantIndex = i % 2;
      const variant = exp3Variants[variantIndex];
      
      events.push({
        experimentId: experiments[2]._id,
        variantId: variant._id,
        userId: `user_${i}`,
        eventType: 'exposure',
        timestamp: new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000),
      });

      // UPI default 38%, COD default 42% (COD still preferred in India)
      const conversionRate = variantIndex === 0 ? 0.38 : 0.42;
      if (Math.random() < conversionRate) {
        // Mixed cart values
        const cartValues = [799, 1299, 1899, 2499, 3499, 4999, 6499, 8999, 12999];
        const price = cartValues[Math.floor(Math.random() * cartValues.length)];
        events.push({
          experimentId: experiments[2]._id,
          variantId: variant._id,
          userId: `user_${i}`,
          eventType: 'conversion',
          value: price,
          metadata: { 
            source: 'checkout',
            paymentMethod: variantIndex === 0 ? 'UPI' : 'COD',
            city: ['Pune', 'Bangalore', 'Hyderabad', 'Delhi', 'Mumbai', 'Chennai'][Math.floor(Math.random() * 6)]
          },
          timestamp: new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000),
        });
      }
    }

    await Event.create(events);
    console.log(`✅ Created ${events.length} events (exposures and conversions)`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Experiments: ${experiments.length}`);
    console.log(`   - Variants: ${exp1Variants.length + exp2Variants.length + exp3Variants.length} (A/B pairs)`);
    console.log(`   - Events: ${events.length}`);
    console.log('\n✅ You can now login with:');
    console.log('   Email: admin@abtest.com');
    console.log('   Password: Admin123!');
    console.log('\n💡 Note: Each experiment has exactly 2 variants (A and B) for A/B testing');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seed
connectDB().then(() => seedData());
