/**
 * Kill Zone 4-Quadrant Matrix Component - Modern Pro SaaS Design
 * Mathematically sound, dual-axis thresholds ($20/mo & 3.0 stars), custom dark popover
 */
import React from 'react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import { FiCrosshair, FiAlertTriangle } from 'react-icons/fi'
import type { KillZoneDataPoint } from '../../services/dashboardService'
import { COST_THRESHOLD, VALUE_THRESHOLD } from '../../utils/calculations'

interface KillZoneChartProps {
  data: KillZoneDataPoint[]
  isLoading?: boolean
}

const KillZoneChart: React.FC<KillZoneChartProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-6 backdrop-blur-sm">
        <div className="h-80 flex items-center justify-center text-slate-500 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <span>Calculating matrix...</span>
          </div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-slate-400 mb-3">
          <FiCrosshair className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">No active subscriptions to analyze</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Add active subscriptions to unlock quadrant analysis and identify wasteful spending.
        </p>
      </div>
    )
  }

  // Point colors mapped strictly to quadrant
  const getPointColor = (quadrant: string) => {
    switch (quadrant) {
      case 'kill_zone':
        return '#f43f5e' // Rose-500 (Kill Zone)
      case 'silent_bleed':
        return '#f59e0b' // Amber-500 (Silent Bleed)
      case 'premium_investment':
        return '#6366f1' // Indigo-500 (Investment)
      case 'bargain':
        return '#10b981' // Emerald-500 (Bargain)
      default:
        return '#94a3b8' // Slate-400 (Neutral)
    }
  }

  // Custom high-end dark tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item: KillZoneDataPoint = payload[0].payload
      const isKillZone = item.quadrant === 'kill_zone'

      return (
        <div className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-3.5 min-w-[200px] text-xs">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <span className="font-bold text-white text-sm truncate">{item.name}</span>
            <span
              className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wider ${
                isKillZone
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {item.category}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2.5">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Monthly Cost</span>
              <span className="text-sm font-bold text-white">${item.cost.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Value Rating</span>
              <span className="text-sm font-bold text-amber-400">
                {item.value_score} / 5
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] font-medium leading-tight">
            <span
              className={
                isKillZone
                  ? 'text-rose-400 font-semibold'
                  : item.quadrant === 'silent_bleed'
                  ? 'text-amber-400'
                  : item.quadrant === 'bargain'
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-300'
              }
            >
              {item.recommendation}
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  // Count per quadrant
  const killZoneCount = data.filter((d) => d.quadrant === 'kill_zone').length
  const silentBleedCount = data.filter((d) => d.quadrant === 'silent_bleed').length
  const bargainCount = data.filter((d) => d.quadrant === 'bargain').length
  const investmentCount = data.filter((d) => d.quadrant === 'premium_investment').length

  return (
    <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <FiCrosshair className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Kill Zone Matrix (Cost vs Value)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            4-Quadrant analysis. High-cost, low-value subscriptions are priority targets for immediate cancellation.
          </p>
        </div>

        {killZoneCount > 0 && (
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
            <FiAlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            <span>{killZoneCount} Kill Zone Target{killZoneCount !== 1 ? 's' : ''} Detected</span>
          </div>
        )}
      </div>

      {/* Scatter Chart Area */}
      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 10 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" />

            <XAxis
              type="number"
              dataKey="cost"
              name="Monthly Cost"
              unit="$"
              domain={[0, (dataMax: number) => Math.max(80, Math.ceil((dataMax + 10) / 10) * 10)]}
              stroke="#64748b"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={{ stroke: '#334155' }}
            />

            <YAxis
              type="number"
              dataKey="value_score"
              name="Value Score"
              domain={[0.5, 5.5]}
              ticks={[1, 2, 3, 4, 5]}
              stroke="#64748b"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={{ stroke: '#334155' }}
            />

            {/* Threshold Reference Lines */}
            <ReferenceLine
              y={VALUE_THRESHOLD}
              stroke="#475569"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <ReferenceLine
              x={COST_THRESHOLD}
              stroke="#475569"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#475569' }} />

            <Scatter name="Subscriptions" data={data}>
              {data.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={getPointColor(entry.quadrant)}
                  stroke="#0f172a"
                  strokeWidth={2}
                  r={7}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Quadrant Legend Bar */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-start space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 shrink-0" />
          <div>
            <span className="font-bold text-white block">Kill Zone ({killZoneCount})</span>
            <span className="text-[11px] text-slate-400">High Cost (≥$20) + Low Value (≤2)</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-start space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 shrink-0" />
          <div>
            <span className="font-bold text-white block">Silent Bleeders ({silentBleedCount})</span>
            <span className="text-[11px] text-slate-400">Low Cost (&lt;$20) + Low Value (≤2)</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-start space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1 shrink-0" />
          <div>
            <span className="font-bold text-white block">Premium ({investmentCount})</span>
            <span className="text-[11px] text-slate-400">High Cost (≥$20) + High Value (≥4)</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-start space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
          <div>
            <span className="font-bold text-white block">Bargain Heroes ({bargainCount})</span>
            <span className="text-[11px] text-slate-400">Low Cost (&lt;$20) + High Value (≥4)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KillZoneChart
