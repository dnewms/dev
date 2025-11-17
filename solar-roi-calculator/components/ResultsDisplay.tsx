'use client';

import { SolarCalculationResults, CalculatorInputs } from '@/lib/types';
import { formatCurrency, formatNumber } from '@/lib/calculations';
import { getStateIncentive } from '@/lib/incentives';
import SolarCharts from './SolarCharts';
import { generatePDF } from '@/lib/pdfGenerator';

interface ResultsDisplayProps {
  results: SolarCalculationResults;
  inputs: CalculatorInputs;
}

export default function ResultsDisplay({ results, inputs }: ResultsDisplayProps) {
  const stateIncentive = getStateIncentive(inputs.state);

  const handleDownloadPDF = () => {
    generatePDF(results, inputs);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Your Solar Analysis
        </h2>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <p className="text-sm text-green-700 font-medium">25-Year Savings</p>
            <p className="text-3xl font-bold text-green-900">
              {formatCurrency(results.savings25Years)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <p className="text-sm text-blue-700 font-medium">ROI</p>
            <p className="text-3xl font-bold text-blue-900">
              {results.roi}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <p className="text-sm text-purple-700 font-medium">Payback Period</p>
            <p className="text-3xl font-bold text-purple-900">
              {results.paybackPeriod} years
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
            <p className="text-sm text-orange-700 font-medium">System Size</p>
            <p className="text-3xl font-bold text-orange-900">
              {results.systemSize} kW
            </p>
          </div>
        </div>

        {/* System Details */}
        <div className="border-t border-gray-200 pt-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Details</h3>

          <div className="flex justify-between">
            <span className="text-gray-600">Annual Production</span>
            <span className="font-semibold">{formatNumber(results.yearlyProduction)} kWh</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Annual Value</span>
            <span className="font-semibold">{formatCurrency(results.yearlyValue)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">System Cost</span>
            <span className="font-semibold">{formatCurrency(inputs.systemCost)}</span>
          </div>
        </div>

        {/* Incentives */}
        <div className="border-t border-gray-200 pt-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Incentives & Tax Credits
          </h3>

          <div className="flex justify-between text-green-700">
            <span>Federal Tax Credit (30%)</span>
            <span className="font-semibold">{formatCurrency(results.federalTaxCredit)}</span>
          </div>

          {results.stateTaxCredit > 0 && (
            <div className="flex justify-between text-green-700">
              <span>State Tax Credit</span>
              <span className="font-semibold">{formatCurrency(results.stateTaxCredit)}</span>
            </div>
          )}

          {results.localRebates > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Local Rebates</span>
              <span className="font-semibold">{formatCurrency(results.localRebates)}</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-green-800 pt-2 border-t">
            <span>Total Incentives</span>
            <span>{formatCurrency(results.totalIncentives)}</span>
          </div>

          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Net System Cost</span>
            <span>{formatCurrency(results.netSystemCost)}</span>
          </div>
        </div>

        {/* State Benefits */}
        {stateIncentive && stateIncentive.exemptions.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {stateIncentive.stateName} Benefits
            </h3>
            <ul className="space-y-2">
              {stateIncentive.exemptions.map((exemption, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">{exemption}</span>
                </li>
              ))}
              {stateIncentive.utilityPrograms.map((program, index) => (
                <li key={`util-${index}`} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">{program}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          className="w-full mt-6 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download Full Report (PDF)
        </button>
      </div>

      {/* Charts */}
      <div className="border-t border-gray-200 pt-8">
        <SolarCharts results={results} />
      </div>
    </div>
  );
}
