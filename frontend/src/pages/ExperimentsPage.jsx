import React, { useState, useEffect } from 'react';
import { experimentsAPI, variantsAPI } from '../services/api';

function ExperimentsPage() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'create' | 'details'
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    setLoading(true);
    try {
      const response = await experimentsAPI.getAll();
      setExperiments(response.data.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch experiments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <CreateExperimentWizard
        onComplete={() => {
          fetchExperiments();
          setView('list');
        }}
        onCancel={() => setView('list')}
      />
    );
  }

  if (view === 'details' && selectedExperiment) {
    return (
      <ExperimentDetails
        experiment={selectedExperiment}
        onBack={() => {
          setView('list');
          setSelectedExperiment(null);
          fetchExperiments();
        }}
        onUpdate={fetchExperiments}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">A/B Testing Experiments</h1>
            <p className="text-gray-600 mt-2">Create and manage experiments with 2 variants (A and B)</p>
          </div>
          <button
            onClick={() => setView('create')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-md transition-colors"
          >
            + New Experiment
          </button>
        </div>
      </div>

      {/* Experiments Grid */}
      {experiments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🧪</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Experiments Yet</h3>
          <p className="text-gray-600 mb-6">Create your first A/B test to start optimizing</p>
          <button
            onClick={() => setView('create')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Create First Experiment
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((exp) => (
            <ExperimentCard
              key={exp._id}
              experiment={exp}
              onClick={() => {
                setSelectedExperiment(exp);
                setView('details');
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ExperimentCard({ experiment, onClick }) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    running: 'bg-green-100 text-green-700',
    paused: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-blue-100 text-blue-700',
  };

  const statusIcons = {
    draft: '📝',
    running: '▶️',
    paused: '⏸️',
    completed: '✅',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-200"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{experiment.name}</h3>
        <span className="text-2xl">{statusIcons[experiment.status]}</span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {experiment.description || 'No description'}
      </p>
      
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[experiment.status]}`}>
          {experiment.status.toUpperCase()}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(experiment.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

function CreateExperimentWizard({ onComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    variantA: { name: 'Variant A', allocation: 50, description: '', config: {} },
    variantB: { name: 'Variant B', allocation: 50, description: '', config: {} },
  });
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    try {
      console.log('Creating experiment with data:', formData);
      
      // Step 1: Create experiment
      const expResponse = await experimentsAPI.create({
        name: formData.name,
        description: formData.description,
        status: 'draft',
      });

      const experimentId = expResponse.data.data._id;
      console.log('Experiment created with ID:', experimentId);

      // Step 2: Create Variant A
      console.log('Creating Variant A...');
      await variantsAPI.create({
        experimentId,
        name: formData.variantA.name,
        allocation: formData.variantA.allocation,
        description: formData.variantA.description,
        config: formData.variantA.config,
      });
      console.log('Variant A created');

      // Step 3: Create Variant B
      console.log('Creating Variant B...');
      await variantsAPI.create({
        experimentId,
        name: formData.variantB.name,
        allocation: formData.variantB.allocation,
        description: formData.variantB.description,
        config: formData.variantB.config,
      });
      console.log('Variant B created');

      alert('✅ Experiment created successfully with Variant A and Variant B!');
      onComplete();
    } catch (error) {
      console.error('Error creating experiment:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.error || error.message || 'Failed to create experiment');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create A/B Test Experiment</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className={step >= 1 ? 'text-blue-600 font-semibold' : ''}>1. Details</span>
            <span>→</span>
            <span className={step >= 2 ? 'text-blue-600 font-semibold' : ''}>2. Variant A</span>
            <span>→</span>
            <span className={step >= 3 ? 'text-blue-600 font-semibold' : ''}>3. Variant B</span>
            <span>→</span>
            <span className={step >= 4 ? 'text-blue-600 font-semibold' : ''}>4. Review</span>
          </div>
        </div>

        {/* Step 1: Experiment Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Experiment Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Homepage CTA Button Test"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What are you testing and why?"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Step 2: Variant A */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-1">🅰️ Variant A (Control)</h3>
              <p className="text-sm text-blue-700">This is typically your current/original version</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <input
                type="text"
                value={formData.variantA.description}
                onChange={(e) => setFormData({
                  ...formData,
                  variantA: { ...formData.variantA, description: e.target.value }
                })}
                placeholder="e.g., Blue button with 'Get Started' text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Traffic Allocation (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.variantA.allocation}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setFormData({
                    ...formData,
                    variantA: { ...formData.variantA, allocation: val },
                    variantB: { ...formData.variantB, allocation: 100 - val },
                  });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Step 3: Variant B */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-green-900 mb-1">🅱️ Variant B (Treatment)</h3>
              <p className="text-sm text-green-700">This is your new version you want to test</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <input
                type="text"
                value={formData.variantB.description}
                onChange={(e) => setFormData({
                  ...formData,
                  variantB: { ...formData.variantB, description: e.target.value }
                })}
                placeholder="e.g., Green button with 'Start Free Trial' text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Traffic Allocation (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.variantB.allocation}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Automatically calculated (must sum to 100%)</p>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Experiment Details</h3>
              <p className="text-sm"><strong>Name:</strong> {formData.name}</p>
              <p className="text-sm"><strong>Description:</strong> {formData.description || 'None'}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">🅰️ Variant A</h4>
                <p className="text-sm text-gray-700 mb-2">{formData.variantA.description}</p>
                <p className="text-2xl font-bold text-blue-600">{formData.variantA.allocation}%</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">🅱️ Variant B</h4>
                <p className="text-sm text-gray-700 mb-2">{formData.variantB.description}</p>
                <p className="text-2xl font-bold text-green-600">{formData.variantB.allocation}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            onClick={step === 1 ? onCancel : () => setStep(step - 1)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !formData.name) ||
                (step === 2 && !formData.variantA.description) ||
                (step === 3 && !formData.variantB.description)
              }
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
            >
              {creating ? 'Creating...' : '✓ Create Experiment'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ExperimentDetails({ experiment, onBack, onUpdate }) {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVariants();
  }, []);

  const fetchVariants = async () => {
    try {
      const response = await variantsAPI.getByExperiment(experiment._id);
      setVariants(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    console.log('🚀 Attempting to change status:', {
      experimentId: experiment._id,
      currentStatus: experiment.status,
      newStatus,
      variantsCount: variants.length,
      totalAllocation
    });
    try {
      await experimentsAPI.updateStatus(experiment._id, newStatus);
      alert(`Experiment ${newStatus === 'running' ? 'started' : newStatus}!`);
      onUpdate();
      onBack();
    } catch (error) {
      console.error('❌ Status change error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this experiment? This cannot be undone.')) return;
    try {
      await experimentsAPI.delete(experiment._id);
      alert('Experiment deleted successfully');
      onBack();
    } catch (error) {
      alert('Failed to delete experiment');
    }
  };

  const variantA = variants.find(v => v.name === 'Variant A' || v.name === 'Control');
  const variantB = variants.find(v => v.name === 'Variant B' || v.name === 'Treatment');
  const totalAllocation = variants.reduce((sum, v) => sum + v.allocation, 0);

  console.log('🔍 Experiment Details Debug:', {
    experimentId: experiment._id,
    experimentName: experiment.name,
    status: experiment.status,
    variantsCount: variants.length,
    variants: variants.map(v => ({ name: v.name, allocation: v.allocation })),
    totalAllocation,
    canStart: totalAllocation === 100 && variants.length === 2
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button onClick={onBack} className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2">
          ← Back to Experiments
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{experiment.name}</h1>
            <p className="text-gray-600">{experiment.description || 'No description'}</p>
          </div>
          <div className="flex gap-2">
            {experiment.status === 'draft' && (
              <button
                onClick={() => handleStatusChange('running')}
                disabled={totalAllocation !== 100 || variants.length !== 2}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                title={totalAllocation !== 100 ? 'Traffic must sum to 100%' : variants.length !== 2 ? 'Need exactly 2 variants' : ''}
              >
                ▶️ Start Experiment
              </button>
            )}
            {experiment.status === 'running' && (
              <>
                <button
                  onClick={() => handleStatusChange('paused')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  ⏸️ Pause
                </button>
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  ✅ Mark as Completed
                </button>
              </>
            )}
            {experiment.status === 'paused' && (
              <>
                <button
                  onClick={() => handleStatusChange('running')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  ▶️ Resume
                </button>
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  ✅ Mark as Completed
                </button>
              </>
            )}
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div>Loading variants...</div>
      ) : (
        <div className="space-y-6">
          {/* Required IDs for Integration */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-4">📋 Required Information for API Integration</h3>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600 font-semibold">Current Status:</span>
                <p className="text-xl font-bold text-gray-900 capitalize">{experiment.status}</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Copy these IDs for your backend integration:</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-blue-700 font-semibold">Experiment ID:</span>
                    <div className="bg-white p-2 rounded border border-blue-300 font-mono text-sm break-all mt-1">
                      {experiment._id}
                    </div>
                  </div>
                  {variantA && (
                    <div>
                      <span className="text-xs text-blue-700 font-semibold">Variant A ID:</span>
                      <div className="bg-white p-2 rounded border border-blue-300 font-mono text-sm break-all mt-1">
                        {variantA._id}
                      </div>
                    </div>
                  )}
                  {variantB && (
                    <div>
                      <span className="text-xs text-blue-700 font-semibold">Variant B ID:</span>
                      <div className="bg-white p-2 rounded border border-blue-300 font-mono text-sm break-all mt-1">
                        {variantB._id}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-blue-700 mt-3">
                  💡 Use these IDs when calling the assignment and event tracking APIs in your application.
                </p>
              </div>
            </div>
          </div>

          {/* Variants Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Variant A */}
            {variantA && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4">🅰️ Variant A (Control)</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-blue-700 font-semibold">Description:</span>
                    <p className="text-gray-800">{variantA.description || 'No description'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-blue-700 font-semibold">Traffic Allocation:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-blue-200 rounded-full h-4">
                        <div
                          className="bg-blue-600 h-4 rounded-full"
                          style={{ width: `${variantA.allocation}%` }}
                        />
                      </div>
                      <span className="text-2xl font-bold text-blue-600">{variantA.allocation}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Variant B */}
            {variantB && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-900 mb-4">🅱️ Variant B (Treatment)</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-green-700 font-semibold">Description:</span>
                    <p className="text-gray-800">{variantB.description || 'No description'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-green-700 font-semibold">Traffic Allocation:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-green-200 rounded-full h-4">
                        <div
                          className="bg-green-600 h-4 rounded-full"
                          style={{ width: `${variantB.allocation}%` }}
                        />
                      </div>
                      <span className="text-2xl font-bold text-green-600">{variantB.allocation}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Warnings */}
          {variants.length !== 2 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">⚠️ This experiment needs exactly 2 variants (A and B) to run.</p>
            </div>
          )}
          {totalAllocation !== 100 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">❌ Traffic allocation must sum to 100% (currently: {totalAllocation}%)</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExperimentsPage;
