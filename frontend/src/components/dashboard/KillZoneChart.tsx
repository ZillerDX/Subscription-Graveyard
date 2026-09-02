/**
 * Kill Zone 4-Quadrant Matrix — Premium redesign
 * Zinc surface, animated tooltip, branded quadrant legend
 */
import React from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'
import { FiCrosshair, FiAlertTriangle } from 'react-icons/fi'
import type { KillZoneDataPoint } from '../../services/dashboardService'
import { COST_THRESHOLD, VALUE_THRESHOLD } from '../../utils/calculations'

interface KillZoneChartProps {
  data: KillZoneDataPoint[]
  isLoading?: boolean
}

const QUADRANT_COLORS: Record<string, string> = {
  kill_zone:          '#f43f5e',
  silent_bleed:       '#f59e0b',
  premium_investment: '#6366f1',
  bargain:            '#10b981',
  neutral:            '#71717a',
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const item: KillZoneDataPoint = payload[0].payload
  const isKillZone = item.quadrant === 'kill_zone'

  return (
    <div className="bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-modal p-3.5 min-w-[210px] text-xs pointer-events-none">
      <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-zinc-800">
        <span className="font-bold text-white text-sm truncate">{item.name}</span>
        {item.category && (
          <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-widest border ${
            isKillZone
              ? 'bg-rose-500/15 text-rose-300 border-rose-500/25'
              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
          }`}>
            {item.category}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 my-2.5">
        <div>
          <span className="text-[10px] text-zinc-500 block uppercase tracking-wider mb-0.5">Monthly Cost</span>
          <span className="text-sm font-bold text-white tabular">${item.cost.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 block uppercase tracking-wider mb-0.5">Value Rating</span>
          <span className="text-sm font-bold text-amber-400 tabular">{item.value_score} / 5</span>
        </div>
      </div>

      <div className="pt-2.5 border-t border-zinc-800">
        <div className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: QUADRANT_COLORS[item.quadrant] ?? '#71717a' }}
          />
          <span className="text-[11px] font-semibold leading-tight" style={{ color: QUADRANT_COLORS[item.quadrant] ?? '#a1a1aa' }}>
            {item.recommendation}
          </span>
        </div>
      </div>
    </div>
  )
}

const KillZoneChart: React.FC<KillZoneChartProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="h-80 flex items-center justify-center">
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin shrink-0" />
            Calculating matrix…
          </div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
        <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 mx-auto flex items-center justify-center text-zinc-500 mb-4">
          <FiCrosshair className="w-6 h-6 shrink-0" />
        </div>
        <h3 className="text-sm font-semibold text-white">No subscriptions to analyze</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
          Add active subscriptions to unlock quadrant analysis and identify wasteful spending.
        </p>
      </div>
    )
  }

  const killZoneCount    = data.filter((d) => d.quadrant === 'kill_zone').length
  const silentBleedCount = data.filter((d) => d.quadrant === 'silent_bleed').length
  const bargainCount     = data.filter((d) => d.quadrant === 'bargain').length
  const investmentCount  = data.filter((d) => d.quadrant === 'premium_investment').length

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <p className="eyebrow mb-1">Cost vs. Value Analysis</p>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <FiCrosshair className="w-4 h-4 text-brand-400 shrink-0" />
            Kill Zone Matrix
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            4-quadrant scatter. High-cost, low-value subs are prime cancellation targets.
          </p>
        </div>
        {killZoneCount > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold shrink-0">
            <FiAlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            {killZoneCount} Kill Zone Target{killZoneCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 10 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="#27272a" />

            <XAxis
              type="number"
              dataKey="cost"
              name="Monthly Cost"
              unit="$"
              domain={[0, (dataMax: number) => Math.max(80, Math.ceil((dataMax + 10) / 10) * 10)]}
              stroke="#52525b"
              tick={{ fontSize: 11, fill: '#71717a' }}
              tickLine={{ stroke: '#3f3f46' }}
              label={{ value: 'Monthly Cost ($)', position: 'insideBottom', offset: -15, style: { fontSize: 11, fill: '#52525b' } }}
            />

            <YAxis
              type="number"
              dataKey="value_score"
              name="Value Score"
              domain={[0.5, 5.5]}
              ticks={[1, 2, 3, 4, 5]}
              stroke="#52525b"
              tick={{ fontSize: 11, fill: '#71717a' }}
              tickLine={{ stroke: '#3f3f46' }}
              label={{ value: 'Value (1–5)', angle: -90, position: 'insideLeft', offset: 15, style: { fontSize: 11, fill: '#52525b' } }}
            />

            <ReferenceLine y={VALUE_THRESHOLD} stroke="#3f3f46" strokeDasharray="5 3" strokeWidth={1.5} />
            <ReferenceLine x={COST_THRESHOLD}  stroke="#3f3f46" strokeDasharray="5 3" strokeWidth={1.5} />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: '3 3', stroke: '#3f3f46' }}
            />

            <Scatter name="Subscriptions" data={data} isAnimationActive>
              {data.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={QUADRANT_COLORS[entry.quadrant] ?? '#71717a'}
                  stroke="#09090b"
                  strokeWidth={2}
                  r={7}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Quadrant Legend */}
      <div className="mt-6 pt-5 border-t border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {[
          { color: '#f43f5e', label: 'Kill Zone',        count: killZoneCount,    desc: 'Cost ≥$20 + Value ≤2' },
          { color: '#f59e0b', label: 'Silent Bleeders',  count: silentBleedCount, desc: 'Cost <$20 + Value ≤2' },
          { color: '#6366f1', label: 'Premium',          count: investmentCount,  desc: 'Cost ≥$20 + Value ≥4' },
          { color: '#10b981', label: 'Bargain Heroes',   count: bargainCount,     desc: 'Cost <$20 + Value ≥4' },
        ].map(({ color, label, count, desc }) => (
          <div key={label} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 flex items-start gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full mt-0.5 shrink-0" style={{ backgroundColor: color }} />
            <div>
              <span className="font-bold text-zinc-200 block leading-snug">
                {label} <span className="text-zinc-500 font-normal">({count})</span>
              </span>
              <span className="text-[10px] text-zinc-600">{desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KillZoneChart
