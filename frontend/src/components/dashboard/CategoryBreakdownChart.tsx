/**
 * Category Breakdown Component - Modern Pro SaaS Design
 * Clear horizontal distribution bars, percentage share, zero emojis
 */
import React from 'react'
import { FiPieChart, FiFolder } from 'react-icons/fi'
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
      <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-6 backdrop-blur-sm">
        <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading categories...</span>
          </div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-slate-400 mb-3">
          <FiFolder className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">No category data</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Add subscriptions with categories to view spending distribution.
        </p>
      </div>
    )
  }

  // Refined modern colors for categories
  const COLORS = [
    '#6366f1', // Indigo
    '#f43f5e', // Rose
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#38bdf8', // Sky
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#14b8a6', // Teal
  ]

  const totalMonthly = data.reduce((sum, item) => sum + item.monthly_cost, 0)

  return (
    <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FiPieChart className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Spending by Category
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Percentage share and monthly run rate across all expense categories
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block uppercase">Total Burn</span>
          <span className="text-base font-bold text-white">${totalMonthly.toFixed(2)}/mo</span>
        </div>
      </div>

      {/* Category Progress Bars */}
      <div className="space-y-3.5 mb-6">
        {data.map((item, index) => {
          const color = COLORS[index % COLORS.length]
          return (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-semibold text-slate-200">{item.category}</span>
                  <span className="text-slate-500 text-[11px]">
                    ({item.count} sub{item.count !== 1 ? 's' : ''})
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400 font-medium">{item.percentage}%</span>
                  <span className="font-bold text-white">${item.monthly_cost.toFixed(2)}/mo</span>
                </div>
              </div>

              {/* Bar track */}
              <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(item.percentage, 3)}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Structured Category Table */}
      <div className="overflow-x-auto pt-2 border-t border-slate-800/80">
        <table className="min-w-full divide-y divide-slate-800 text-xs">
          <thead>
            <tr className="text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-2.5 text-left font-semibold">Category</th>
              <th className="py-2.5 text-right font-semibold">Monthly</th>
              <th className="py-2.5 text-right font-semibold">Projected Annual</th>
              <th className="py-2.5 text-right font-semibold">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 font-medium text-slate-300">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{item.category}</span>
                  </div>
                </td>
                <td className="py-2.5 text-right font-semibold text-white">
                  ${item.monthly_cost.toFixed(2)}
                </td>
                <td className="py-2.5 text-right text-slate-400">
                  ${item.yearly_cost.toFixed(2)}
                </td>
                <td className="py-2.5 text-right font-medium text-slate-300">
                  {item.percentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoryBreakdownChart
