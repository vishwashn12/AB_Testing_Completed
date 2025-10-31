import React, { useState, useEffect } from 'react';
import { experimentsAPI, analyticsAPI } from '../services/api';

function AnalyticsPage() {
  const [experiments, setExperiments] = useState([]);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      const response = await experimentsAPI.getAll({ status: 'running' });
      const allExperiments = response.data.data;
      setExperiments(allExperiments);
      if (allExperiments.length > 0) {
        setSelectedExperiment(allExperiments[0]);
        fetchAnalytics(allExperiments[0]._id);
      }
    } catch (error) {
      console.error('Error fetching experiments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (experimentId) => {
    try {
      const response = await analyticsAPI.getDetailed(experimentId);
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleExperimentChange = (experimentId) => {
    const experiment = experiments.find((e) => e._id === experimentId);
    setSelectedExperiment(experiment);
    fetchAnalytics(experimentId);
  };

  if (loading) {
    return <div className="text-center py-12">Loading analytics...</div>;
  }

  if (experiments.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Running Experiments</h2>
        <p className="text-gray-600">Start an experiment to see analytics data.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
        <div className="flex items-center gap-4">
          <label className="text-gray-700 font-medium">Select Experiment:</label>
          <select
            value={selectedExperiment?._id || ''}
            onChange={(e) => handleExperimentChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            {experiments.map((exp) => (
              <option key={exp._id} value={exp._id}>
                {exp.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {analytics ? (
        <div>
          {/* Experiment Info */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-2">{analytics.experiment.name}</h3>
            <div className="flex gap-6 text-sm text-gray-600">
              <span>
                Status: <span className="font-medium text-green-600">{analytics.experiment.status}</span>
              </span>
              <span>
                Created: {new Date(analytics.experiment.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Overall Metrics */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <MetricCard
              title="Total Exposures"
              value={analytics.totals.exposures.toLocaleString()}
              icon="👁️"
            />
            <MetricCard
              title="Total Conversions"
              value={analytics.totals.conversions.toLocaleString()}
              icon="✅"
            />
            <MetricCard
              title="Overall Conversion Rate"
              value={`${analytics.totals.conversionRate.toFixed(2)}%`}
              icon="📊"
            />
          </div>

          {/* Variants Comparison */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Variant Performance</h3>
            <div className="space-y-4">
              {analytics.variants.map((variant, index) => (
                <div key={variant.variantId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{variant.variantName}</h4>
                      <span className="text-sm text-gray-500">
                        Traffic Allocation: {variant.allocation}%
                      </span>
                    </div>
                    {index === 0 && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Control
                      </span>
                    )}
                  </div>

                  <div className="grid md:grid-cols-5 gap-4 mt-4">
                    <div>
                      <div className="text-sm text-gray-500">Exposures</div>
                      <div className="text-xl font-bold">{variant.exposures.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Conversions</div>
                      <div className="text-xl font-bold">{variant.conversions.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Conversion Rate</div>
                      <div className={`text-xl font-bold ${getConversionRateColor(variant.conversionRate, analytics.variants[0].conversionRate, index)}`}>
                        {variant.conversionRate.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Revenue</div>
                      <div className="text-xl font-bold">₹{variant.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Avg Value</div>
                      <div className="text-xl font-bold">₹{variant.averageValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                    </div>
                  </div>

                  {/* Conversion Rate Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-green-600'}`}
                        style={{ width: `${Math.min(variant.conversionRate, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Comparison with Control */}
                  {index > 0 && analytics.variants[0] && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">
                        Compared to Control:{' '}
                        {calculateImprovement(variant.conversionRate, analytics.variants[0].conversionRate) > 0 ? (
                          <span className="text-green-600 font-semibold">
                            +{calculateImprovement(variant.conversionRate, analytics.variants[0].conversionRate).toFixed(2)}% improvement
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            {calculateImprovement(variant.conversionRate, analytics.variants[0].conversionRate).toFixed(2)}% decrease
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">Loading analytics data...</div>
      )}
    </div>
  );
}

function MetricCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

function getConversionRateColor(rate, controlRate, index) {
  if (index === 0) return 'text-blue-600'; // Control
  if (rate > controlRate) return 'text-green-600'; // Better
  if (rate < controlRate) return 'text-red-600'; // Worse
  return 'text-gray-900'; // Same
}

function calculateImprovement(variantRate, controlRate) {
  if (controlRate === 0) return 0;
  return ((variantRate - controlRate) / controlRate) * 100;
}

export default AnalyticsPage;
