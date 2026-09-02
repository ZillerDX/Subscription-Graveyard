/**
 * Category Breakdown — Animated progress bars, zinc surface, data table
 */
import React, { useEffect, useRef } from 'react'
import { FiPieChart, FiFolder } from 'react-icons/fi'
import type { CategoryBreakdown } from '../../services/dashboardService'

interface CategoryBreakdownChartProps {
  data: CategoryBreakdown[]
  isLoading?: boolean
}

const COLORS = [
  '#6366f1', '#f43f5e', '#10b981', '#f59e0b',
  '#38bdf8', '#a855f7', '#ec4899', '#14b8a6',
]

/* ── Animated bar ─────────────────────────────────────────── */
function AnimatedBar({ percentage, color, delay }: { percentage: number; color: string; delay: number }) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = barRef.current
    if (!el) return
    el.style.width = '0%'
    const tid = setTimeout(() => {
      el.style.transition = `width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
      el.style.width = `${Math.max(percentage, 2)}%`
    }, 50)
    return () => clearTimeout(tid)
  }, [percentage, delay])

  return (
    <div className="w-full bg-zinc-800/60 rounded-full h-1.5 overflow-hidden">
      <div
        ref={barRef}
        className="h-full rounded-full"
        style={{ backgroundColor: color, width: '0%' }}
      />
    </div>
  )
}

const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="h-64 flex items-center justify-center">
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin shrink-0" />
            Loading categories…
          </div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
        <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 mx-auto flex items-center justify-center text-zinc-500 mb-4">
          <FiFolder className="w-6 h-6 shrink-0" />
        </div>
        <h3 className="text-sm font-semibold text-white">No category data yet</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
          Add subscriptions with categories to view spending distribution.
        </p>
      </div>
    )
  }

  const totalMonthly = data.reduce((sum, item) => sum + item.monthly_cost, 0)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <p className="eyebrow mb-1">Expense Distribution</p>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <FiPieChart className="w-4 h-4 text-indigo-400 shrink-0" />
            Spending by Category
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Monthly run rate and percentage share across all expense categories
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Total Monthly</p>
          <p className="text-xl font-bold text-white tabular">${totalMonthly.toFixed(2)}</p>
          <p className="text-[11px] text-zinc-500">per month</p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 mb-6">
        {data.map((item, index) => {
          const color = COLORS[index % COLORS.length]
          return (
            <div key={item.category} className="group">
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm shrink-0 mt-0.5" style={{ backgroundColor: color }} />
                  <span className="font-semibold text-zinc-200">{item.category}</span>
                  <span className="text-zinc-600 text-[10px]">
                    {item.count} sub{item.count !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 tabular">{item.percentage}%</span>
                  <span className="font-bold text-white tabular">${item.monthly_cost.toFixed(2)}/mo</span>
                </div>
              </div>
              <AnimatedBar percentage={item.percentage} color={color} delay={index * 60} />
            </div>
          )
        })}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto pt-4 border-t border-zinc-800/80">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="text-zinc-600 uppercase tracking-widest text-[10px]">
              <th className="py-2 text-left font-semibold">Category</th>
              <th className="py-2 text-right font-semibold">Monthly</th>
              <th className="py-2 text-right font-semibold">Annual</th>
              <th className="py-2 text-right font-semibold">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {data.map((item, index) => (
              <tr key={item.category} className="hover:bg-zinc-800/30 transition-colors group">
                <td className="py-2.5 font-medium text-zinc-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    {item.category}
                  </div>
                </td>
                <td className="py-2.5 text-right font-bold text-white tabular">${item.monthly_cost.toFixed(2)}</td>
                <td className="py-2.5 text-right text-zinc-400 tabular">${item.yearly_cost.toFixed(2)}</td>
                <td className="py-2.5 text-right font-semibold text-zinc-400 tabular">{item.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoryBreakdownChart
