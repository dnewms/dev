'use client';

import { SolarCalculationResults } from '@/lib/types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { formatCurrency } from '@/lib/calculations';

interface SolarChartsProps {
  results: SolarCalculationResults;
}

export default function SolarCharts({ results }: SolarChartsProps) {
  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold text-gray-900">Visual Analysis</h3>

      {/* Monthly Production Chart */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Solar Production & Savings
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={results.monthlyBreakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'production') {
                  return [`${value.toFixed(0)} kWh`, 'Production'];
                }
                return [formatCurrency(value), 'Savings'];
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="production"
              fill="#3b82f6"
              name="Production (kWh)"
            />
            <Bar
              yAxisId="right"
              dataKey="savings"
              fill="#10b981"
              name="Savings ($)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 25-Year Savings Chart */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          25-Year Cumulative Savings
        </h4>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={results.yearlyBreakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="cumulativeSavings"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              name="Cumulative Savings"
            />
            <Area
              type="monotone"
              dataKey="cumulativeCost"
              stackId="2"
              stroke="#ef4444"
              fill="#ef4444"
              name="Cumulative Cost"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Net Position Chart (Break-even point) */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Net Position Over Time (Break-even Analysis)
        </h4>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={results.yearlyBreakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="netPosition"
              stroke="#8b5cf6"
              strokeWidth={3}
              name="Net Position"
              dot={{ r: 2 }}
            />
            {/* Zero line */}
            <Line
              type="monotone"
              dataKey={() => 0}
              stroke="#6b7280"
              strokeWidth={1}
              strokeDasharray="5 5"
              name="Break-even"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-4 text-sm text-gray-600">
          The break-even point is where the line crosses zero - that&apos;s when your savings exceed your investment!
        </p>
      </div>
    </div>
  );
}
