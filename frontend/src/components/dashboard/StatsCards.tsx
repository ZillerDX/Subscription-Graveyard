/**
 * Dashboard Stat Cards — Animated counters, staggered entrance, accent borders
 */
import React, { useEffect, useRef, useState } from 'react'
import { FiDollarSign, FiLayers, FiAlertTriangle, FiTrendingUp } from 'react-icons/fi'
import type { DashboardStats } from '../../services/dashboardService'

/* ── Animated counter hook ────────────────────────────────── */
function useCountUp(target: number, duration = 800, enabled = true) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!enabled || target === 0) { setValue(target); return }
    const start = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(parseFloat((eased * target).toFixed(2)))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration, enabled])

  return value
}

/* ── Single metric card ───────────────────────────────────── */
interface MetricCardProps {
  label: string
  value: string
  sub: string
  subValue?: string
  icon: React.ReactNode
  accent: 'rose' | 'indigo' | 'amber' | 'emerald'
  delay: number
  isLoading?: boolean
}

const ACCENT_MAP = {
  rose:    { top: 'bg-rose-500',    icon: 'bg-rose-500/10 border-rose-500/20 text-rose-400', glow: 'group-hover:shadow-glow-rose' },
  indigo:  { top: 'bg-indigo-500',  icon: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400', glow: 'group-hover:shadow-glow-indigo' },
  amber:   { top: 'bg-amber-500',   icon: 'bg-amber-500/10 border-amber-500/20 text-amber-400', glow: '' },
  emerald: { top: 'bg-emerald-500', icon: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', glow: 'group-hover:shadow-glow-emerald' },
}

function MetricCard({ label, value, sub, subValue, icon, accent, delay, isLoading }: MetricCardProps) {
  const colors = ACCENT_MAP[accent]

  if (isLoading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="h-0.5 skeleton" />
        <div className="p-5">
          <div className="h-3 skeleton w-1/3 mb-4" />
          <div className="h-7 skeleton w-2/3 mb-3" />
          <div className="h-2.5 skeleton w-1/2" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200 ${colors.glow}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top accent line */}
      <div className={`h-0.5 w-full ${colors.top}`} />

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">{label}</span>
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${colors.icon} group-hover:scale-110 duration-200`}>
            {icon}
          </div>
        </div>

        <div className="text-2xl font-bold tracking-tight text-white tabular animate-count-up" style={{ animationDelay: `${delay + 100}ms` }}>
          {value}
        </div>

        {sub && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60">
            <span className="text-[11px] text-zinc-500">{sub}</span>
            {subValue && (
              <span className="text-[11px] font-semibold text-zinc-400 tabular">{subValue}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── StatsCards ───────────────────────────────────────────── */
interface StatsCardsProps {
  stats: DashboardStats
  isLoading?: boolean
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading = false }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t) }, [])

  const monthlyBurn   = useCountUp(stats?.monthly_burn ?? 0, 900, mounted && !isLoading)
  const killZoneWaste = useCountUp(stats?.kill_zone_monthly_waste ?? 0, 900, mounted && !isLoading)
  const savings       = useCountUp(stats?.realized_monthly_savings ?? 0, 900, mounted && !isLoading)

  const avgCost = stats && stats.active_count > 0
    ? (stats.monthly_burn / stats.active_count).toFixed(2)
    : '0.00'

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-stagger>
        {[1, 2, 3, 4].map((i) => (
          <MetricCard
            key={i}
            label="" value="" sub=""
            icon={null} accent="rose" delay={0}
            isLoading
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-stagger>
      <MetricCard
        label="Monthly Burn"
        value={`$${monthlyBurn.toFixed(2)}`}
        sub="Projected Annual"
        subValue={`$${stats.yearly_cost.toFixed(2)}`}
        icon={<FiDollarSign className="w-4 h-4 shrink-0" />}
        accent="rose"
        delay={0}
      />
      <MetricCard
        label="Active Subscriptions"
        value={String(stats.active_count)}
        sub="Average cost"
        subValue={`$${avgCost}/mo`}
        icon={<FiLayers className="w-4 h-4 shrink-0" />}
        accent="indigo"
        delay={60}
      />
      <MetricCard
        label="Kill Zone Waste"
        value={`$${killZoneWaste.toFixed(2)}/mo`}
        sub="Cancel candidates"
        subValue={`${stats.kill_zone_count} target${stats.kill_zone_count !== 1 ? 's' : ''}`}
        icon={<FiAlertTriangle className="w-4 h-4 shrink-0" />}
        accent="amber"
        delay={120}
      />
      <MetricCard
        label="Graveyard Savings"
        value={`+$${savings.toFixed(2)}/mo`}
        sub="Annual recovered"
        subValue={`+$${stats.realized_yearly_savings.toFixed(2)}/yr`}
        icon={<FiTrendingUp className="w-4 h-4 shrink-0" />}
        accent="emerald"
        delay={180}
      />
    </div>
  )
}

export default StatsCards
