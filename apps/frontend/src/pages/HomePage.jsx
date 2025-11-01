import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-3">A/B Testing Platform</h1>
        <p className="text-xl opacity-90 mb-6">
          Run experiments with exactly 2 variants. Track user behavior. Make data-driven decisions.
        </p>
        <div className="flex gap-4">
          <Link
            to="/experiments"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Create Experiment
          </Link>
          <Link
            to="/analytics"
            className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition border-2 border-white"
          >
            View Analytics
          </Link>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🔄 How A/B Testing Works</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <StepCard
            number="1"
            title="Create Experiment"
            description="Define your hypothesis and create exactly 2 variants: Variant A (control) and Variant B (treatment). Set traffic allocation (e.g., 50/50 split)."
            icon="🧪"
            color="blue"
          />
          
          {/* Step 2 */}
          <StepCard
            number="2"
            title="Assign Users"
            description="Users are deterministically assigned to either A or B using hashing. Same user always gets the same variant for consistency."
            icon="👥"
            color="green"
          />
          
          {/* Step 3 */}
          <StepCard
            number="3"
            title="Track & Analyze"
            description="Log exposures and conversions via public API. Compare performance between variants and identify the winner."
            icon="📊"
            color="purple"
          />
        </div>
      </div>

      {/* Admin Workflow */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">👨‍💼 Admin Workflow</h2>
        <div className="space-y-4">
          <WorkflowStep
            number="1"
            title="Create Experiment"
            description="Go to Experiments page and use the 4-step wizard to create a new A/B test"
            action={<Link to="/experiments" className="text-blue-600 hover:underline">Create Now →</Link>}
          />
          <WorkflowStep
            number="2"
            title="Define Variants"
            description="Specify Variant A (baseline) and Variant B (new feature) with descriptions and traffic splits"
          />
          <WorkflowStep
            number="3"
            title="Start Experiment"
            description="Set status to 'running' to begin collecting data from users"
          />
          <WorkflowStep
            number="4"
            title="Monitor Results"
            description="View real-time analytics comparing A vs B performance"
            action={<Link to="/analytics" className="text-blue-600 hover:underline">View Analytics →</Link>}
          />
        </div>
      </div>

      {/* Developer Integration */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">👨‍💻 Backend Integration Guide</h2>
        <p className="text-gray-600 mb-6">
          After creating an experiment, use these IDs to implement A/B testing in your backend:
        </p>

        {/* Step 1: Get IDs */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">📋 Step 1: Get Your IDs from the Dashboard</h4>
          <p className="text-sm text-blue-800 mb-3">
            After creating an experiment, copy these IDs from the Experiments page:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-blue-800">
            <li><strong>Experiment ID</strong> - Main identifier for your test</li>
            <li><strong>Variant A ID</strong> - Control version identifier</li>
            <li><strong>Variant B ID</strong> - Treatment version identifier</li>
          </ul>
        </div>

        {/* Step 2: Implementation Flow */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🔄 Step 2: Implementation Flow</h3>
          
          <div className="space-y-4">
            {/* Substep 1 */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">1️⃣ Assign User to Variant</h4>
              <p className="text-sm text-gray-600 mb-3">Call assignment API with your experiment ID and user's ID:</p>
              <CodeBlock
                title="GET /api/v1/assignment/:experimentId/:userId"
                example={`// Example: Node.js/Express backend
const experimentId = '672345abcdef123456'; // From dashboard
const userId = req.user.id; // Your user's ID (NOT admin ID)

const response = await fetch(
  \`${API_BASE_URL}/v1/assignment/\${experimentId}/\${userId}\`
);
const assignment = await response.json();

// assignment.data.variant contains:
// - id: "672346xyz987654321" (Variant A or B ID)
// - name: "Variant A" or "Variant B"
const variantId = assignment.data.variant.id;
const variantName = assignment.data.variant.name;`}
              />
            </div>

            {/* Substep 2 */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">2️⃣ Show Variant to User & Track Exposure</h4>
              <p className="text-sm text-gray-600 mb-3">Render the assigned variant and log the exposure:</p>
              <CodeBlock
                title="Show variant + Track exposure"
                example={`// Show variant to user
if (variantName === 'Variant B') {
  // Show treatment version
  res.render('page', { ctaText: 'Buy Now - 20% Off!' });
} else {
  // Show control version (Variant A)
  res.render('page', { ctaText: 'Add to Cart' });
}

// Track that user saw this variant
await fetch('${API_BASE_URL}/v1/events/exposure', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    experimentId: '672345abcdef123456',
    variantId: variantId, // From assignment response
    userId: userId
  })
});`}
              />
            </div>

            {/* Substep 3 */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">3️⃣ Track Conversion When User Completes Goal</h4>
              <p className="text-sm text-gray-600 mb-3">Log conversion when user takes the desired action:</p>
              <CodeBlock
                title="Track conversion event"
                example={`// When user completes purchase/signup/goal
app.post('/checkout', async (req, res) => {
  const orderTotal = req.body.total;
  
  // Track conversion with optional revenue value
  await fetch('${API_BASE_URL}/v1/events/conversion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      experimentId: '672345abcdef123456',
      variantId: variantId, // Same variant ID from assignment
      userId: userId,
      value: orderTotal // Optional: track revenue per conversion
    })
  });
  
  // Continue with checkout...
});`}
              />
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-6">
          <h4 className="font-semibold text-green-900 mb-2">✅ Quick Reference</h4>
          <div className="text-sm text-green-800 space-y-2">
            <p><strong>What you need:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Experiment ID (copy from dashboard after creating experiment)</li>
              <li>User ID (your user's ID from your system)</li>
            </ul>
            <p className="mt-3"><strong>API calls required:</strong></p>
            <ol className="list-decimal list-inside ml-4 space-y-1">
              <li>GET assignment → returns variant ID</li>
              <li>POST exposure → logs user saw the variant</li>
              <li>POST conversion → logs user completed goal</li>
            </ol>
            <p className="mt-3 text-xs">
              💡 <strong>Important:</strong> Variant IDs are returned automatically from the assignment API - you don't need to hardcode them!
            </p>
          </div>
        </div>
        
        {/* Important Notes */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes:</h4>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li><strong>Experiment must be "running"</strong> - Assignment API only works for experiments with status = "running"</li>
            <li><strong>Use real user IDs</strong> - userId should be your actual user/session ID, not test values or admin IDs</li>
            <li><strong>User IDs are hashed</strong> - Plain userId is sent by you, but SHA-256 hashed before storage (privacy)</li>
            <li><strong>Same user = same variant</strong> - Deterministic hashing ensures consistency across sessions</li>
          </ul>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <FeatureCard
          icon="🔒"
          title="Deterministic Assignment"
          description="Users always get the same variant using SHA-256 hashing. No randomness, ensuring consistent experience."
        />
        <FeatureCard
          icon="🌐"
          title="Public Tracking APIs"
          description="No authentication required for assignment and event tracking. Integrate from web, mobile, or any platform - just HTTP requests!"
        />
        <FeatureCard
          icon="📈"
          title="Real-Time Analytics"
          description="See live comparison between Variant A and B with conversion rates, revenue, and statistical insights."
        />
        <FeatureCard
          icon="⚡"
          title="Simple & Fast"
          description="MVP-focused design. Create experiments in 4 steps. Start testing in minutes, not hours."
        />
      </div>
    </div>
  );
}

function StepCard({ number, title, description, icon, color }) {
  const colors = {
    blue: 'border-blue-500 text-blue-600',
    green: 'border-green-500 text-green-600',
    purple: 'border-purple-500 text-purple-600',
  };

  return (
    <div className="border-2 rounded-lg p-6 hover:shadow-lg transition">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-2 ${colors[color]} font-bold text-xl mb-4`}>
        {number}
      </div>
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function WorkflowStep({ number, title, description, action }) {
  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
          {number}
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}

function CodeBlock({ title, example }) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-300">
        {title}
      </div>
      <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
        {example}
      </pre>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold mb-2">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
}

export default HomePage;
