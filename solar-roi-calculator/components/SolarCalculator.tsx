'use client';

import { useState } from 'react';
import { CalculatorInputs, SolarCalculationResults } from '@/lib/types';
import { calculateSolarROI } from '@/lib/calculations';
import { getAllStates } from '@/lib/incentives';
import ResultsDisplay from './ResultsDisplay';
import LeadCaptureForm from './LeadCaptureForm';

export default function SolarCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    location: '',
    roofSize: 1500,
    monthlyEnergyBill: 150,
    systemCost: 20000,
    electricityRate: 0.13,
    state: 'CA',
    zipCode: ''
  });

  const [results, setResults] = useState<SolarCalculationResults | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const states = getAllStates();

  const handleInputChange = (field: keyof CalculatorInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedResults = calculateSolarROI(inputs);
    setResults(calculatedResults);

    // Show lead form after calculation
    setTimeout(() => {
      setShowLeadForm(true);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Solar Panel ROI Calculator
        </h1>
        <p className="text-xl text-gray-600">
          Calculate your solar investment return, payback period, and 25-year savings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Information
          </h2>

          <form onSubmit={handleCalculate} className="space-y-6">
            {/* State Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                value={inputs.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select your state</option>
                {states.map(state => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ZIP Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={inputs.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="Enter your ZIP code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Roof Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roof Size (sq ft)
              </label>
              <input
                type="number"
                value={inputs.roofSize}
                onChange={(e) => handleInputChange('roofSize', parseFloat(e.target.value))}
                min="100"
                step="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Typical home: 1,500-2,500 sq ft
              </p>
            </div>

            {/* Monthly Energy Bill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Energy Bill ($)
              </label>
              <input
                type="number"
                value={inputs.monthlyEnergyBill}
                onChange={(e) => handleInputChange('monthlyEnergyBill', parseFloat(e.target.value))}
                min="0"
                step="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Electricity Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Electricity Rate ($/kWh)
              </label>
              <input
                type="number"
                value={inputs.electricityRate}
                onChange={(e) => handleInputChange('electricityRate', parseFloat(e.target.value))}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Check your utility bill (avg: $0.13)
              </p>
            </div>

            {/* System Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated System Cost ($)
              </label>
              <input
                type="number"
                value={inputs.systemCost}
                onChange={(e) => handleInputChange('systemCost', parseFloat(e.target.value))}
                min="0"
                step="1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Average: $15,000-$25,000
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Calculate My Solar ROI
            </button>
          </form>
        </div>

        {/* Results Display */}
        <div>
          {results ? (
            <ResultsDisplay results={results} inputs={inputs} />
          ) : (
            <div className="bg-gray-50 rounded-lg shadow-lg p-8 h-full flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Enter your information
                </h3>
                <p className="mt-2 text-gray-600">
                  Fill out the form to see your personalized solar ROI analysis
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lead Capture Modal */}
      {showLeadForm && results && (
        <LeadCaptureForm
          onClose={() => setShowLeadForm(false)}
          results={results}
          inputs={inputs}
        />
      )}
    </div>
  );
}
