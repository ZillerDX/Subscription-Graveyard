/**
 * Category Breakdown Chart Component
 * Bar chart showing spending by category
 */
import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { CategoryBreakdown } from '../../services/dashboardService'

interface CategoryBreakdownChartProps {
  data: CategoryBreakdown[]
  isLoading?: boolean
}

const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  data,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-96 flex items-center justify-center">
          <div className="text-gray-500">Loading chart...</div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-600">No category data to display</p>
            <p className="text-sm text-gray-500 mt-2">
              Add categories to your subscriptions to see breakdown
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Color palette for categories
  const COLORS = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Orange
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#84cc16', // Lime
  ]

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3">
          <p className="font-bold text-gray-900 mb-1">{data.category}</p>
          <p className="text-sm text-gray-600">
            Monthly: <span className="font-semibold">${data.monthly_cost.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Count: <span className="font-semibold">{data.count} subscription{data.count !== 1 ? 's' : ''}</span>
          </p>
          <p className="text-sm text-gray-600">
            Yearly: <span className="font-semibold">${(data.monthly_cost * 12).toFixed(2)}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
        <p className="text-sm text-gray-600 mt-1">
          Monthly spending breakdown across all categories
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="category"
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            stroke="#6b7280"
            style={{ fontSize: 12 }}
          />

          <YAxis
            stroke="#6b7280"
            label={{
              value: 'Monthly Cost ($)',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 14, fill: '#374151', fontWeight: 600 },
            }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />

          <Bar dataKey="monthly_cost" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Summary Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yearly
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Count
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900">{item.category}</span>
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right text-sm text-gray-900">
                  ${item.monthly_cost.toFixed(2)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right text-sm text-gray-600">
                  ${(item.monthly_cost * 12).toFixed(2)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right text-sm text-gray-600">
                  {item.count}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-4 py-2 text-sm text-gray-900">Total</td>
              <td className="px-4 py-2 text-right text-sm text-gray-900">
                ${data.reduce((sum, item) => sum + item.monthly_cost, 0).toFixed(2)}
              </td>
              <td className="px-4 py-2 text-right text-sm text-gray-900">
                ${(data.reduce((sum, item) => sum + item.monthly_cost, 0) * 12).toFixed(2)}
              </td>
              <td className="px-4 py-2 text-right text-sm text-gray-900">
                {data.reduce((sum, item) => sum + item.count, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoryBreakdownChart
