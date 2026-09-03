/**
 * Kill Zone 4-Quadrant Matrix Component — Minimal Toggl Style
 * Evaluation: Monthly Cost ($) vs Usage Hours (ชม./เดือน)
 * "คุณใช้เวลากับบริการนี้กี่ชั่วโมง? ถ้าน้อย = ไม่คุ้ม"
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
import type { KillZoneDataPoint, QuadrantType } from '../../services/dashboardService'
import { COST_THRESHOLD, HOURS_THRESHOLD } from '../../utils/calculations'
import { BrandLogo } from '../common/BrandLogo'

interface KillZoneChartProps {
  data: KillZoneDataPoint[]
  isLoading?: boolean
}

const QUADRANT_CONFIG: Record<
  QuadrantType,
  { name: string; desc: string; color: string; bg: string; border: string }
> = {
  kill_zone: {
    name: 'Kill Zone (ไม่คุ้มค่าอย่างยิ่ง)',
    desc: 'จ่ายแพง (≥$20) + ใช้น้อย (<8 ชม./เดือน)',
    color: '#E11D48',
    bg: '#FFF1F2',
    border: '#FECDD3',
  },
  silent_bleed: {
    name: 'Silent Bleeders (เสี่ยงเสียเปล่า)',
    desc: 'จ่ายน้อย (<$20) + ใช้น้อย (<8 ชม./เดือน)',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  premium_investment: {
    name: 'Worth Every Penny (สมราคา)',
    desc: 'จ่ายสูง (≥$20) + ใช้งานบ่อย (≥8 ชม./เดือน)',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
  bargain: {
    name: 'Bargain Heroes (คุ้มค่ามาก)',
    desc: 'จ่ายน้อย (<$20) + ใช้งานบ่อย (≥8 ชม./เดือน)',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  neutral: {
    name: 'Moderate (ปานกลาง)',
    desc: 'ความคุ้มค่าระดับทั่วไป',
    color: '#6B7280',
    bg: '#F3F4F6',
    border: '#E5E7EB',
  },
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const item: KillZoneDataPoint = payload[0].payload
  const qConfig = QUADRANT_CONFIG[item.quadrant] || QUADRANT_CONFIG.bargain

  return (
    <div className="bg-white border border-[#F0E6E6] rounded-2xl shadow-modal p-4 min-w-[240px] text-xs pointer-events-none animate-scale-in">
      <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#F0E6E6]">
        <BrandLogo logoKey={item.logo_key} name={item.name} className="w-8 h-8 rounded-xl" size={16} />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-[#2D2D2D] text-sm truncate">{item.name}</p>
          <p className="text-[10px] text-[#8A8A8A]">{item.category || 'Subscription'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 my-3">
        <div className="bg-[#FFF5F5] rounded-xl p-2.5">
          <span className="text-[10px] text-[#8A8A8A] block font-semibold uppercase">ค่าบริการ/เดือน</span>
          <span className="text-base font-extrabold text-[#2D2D2D] tabular">
            ${item.cost.toFixed(2)}
          </span>
        </div>
        <div className="bg-[#FFF5F5] rounded-xl p-2.5">
          <span className="text-[10px] text-[#8A8A8A] block font-semibold uppercase">ชั่วโมงที่ใช้</span>
          <span className="text-base font-extrabold text-[#B02A82] tabular">
            {item.monthly_hours} ชม.
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-[#F0E6E6] space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#757575] font-medium">ต้นทุนเฉลี่ย:</span>
          <span className="font-extrabold text-[#2D2D2D] tabular">
            ${item.cost_per_hour.toFixed(2)} / ชม.
          </span>
        </div>
        <p
          className="text-[11px] font-semibold leading-relaxed pt-1"
          style={{ color: qConfig.color }}
        >
          {item.recommendation}
        </p>
      </div>
    </div>
  )
}

export const KillZoneChart: React.FC<KillZoneChartProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="card-minimal p-6">
        <div className="h-80 flex items-center justify-center text-[#8A8A8A] text-sm">
          กำลังคำนวณเมทริกซ์ความคุ้มค่า...
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="card-minimal p-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF5F5] border border-[#F7D6D0] mx-auto flex items-center justify-center text-[#B02A82] mb-3">
          <FiCrosshair className="w-6 h-6 shrink-0" />
        </div>
        <h3 className="text-base font-bold text-[#2D2D2D]">ยังไม่มีข้อมูลวิเคราะห์ความคุ้มค่า</h3>
        <p className="text-xs text-[#757575] mt-1 max-w-sm mx-auto">
          เพิ่ม Subscription พร้อมระบุชั่วโมงการใช้งาน เพื่อเริ่มแสดงกราฟเปรียบเทียบความคุ้มค่า
        </p>
      </div>
    )
  }

  const killZoneCount = data.filter((d) => d.quadrant === 'kill_zone').length
  const silentBleedCount = data.filter((d) => d.quadrant === 'silent_bleed').length
  const bargainCount = data.filter((d) => d.quadrant === 'bargain').length
  const investmentCount = data.filter((d) => d.quadrant === 'premium_investment').length

  const maxCost = Math.max(80, Math.ceil((Math.max(...data.map((d) => d.cost), 0) + 10) / 10) * 10)
  const maxHours = Math.max(60, Math.ceil((Math.max(...data.map((d) => d.monthly_hours), 0) + 10) / 10) * 10)

  return (
    <div className="card-minimal p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#FCE7F3] text-[#B02A82] flex items-center justify-center shrink-0">
              <FiCrosshair className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#2D2D2D] tracking-tight">
              Kill Zone Matrix (ค่าบริการ vs ชั่วโมงการใช้งานจริง)
            </h3>
          </div>
          <p className="text-xs text-[#757575] mt-1">
            เกณฑ์วัดความคุ้มค่า: จ่ายแพงแต่ใช้น้อย = เสียเปล่า (Kill Zone) | จ่ายน้อยแต่ใช้บ่อย = คุ้มค่าสูงสุด (Bargain)
          </p>
        </div>

        {killZoneCount > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shrink-0">
            <FiAlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>พบ {killZoneCount} บริการใน Kill Zone ที่ควรยกเลิก</span>
          </div>
        )}
      </div>

      {/* Scatter Chart */}
      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 25, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0E6E6" />

            {/* X-Axis: Cost ($) */}
            <XAxis
              type="number"
              dataKey="cost"
              name="ค่าบริการต่อเดือน ($)"
              unit="$"
              domain={[0, maxCost]}
              stroke="#8A8A8A"
              tick={{ fontSize: 11, fill: '#8A8A8A' }}
              tickLine={{ stroke: '#E5DADA' }}
              label={{
                value: 'ค่าบริการรายเดือน ($/mo) →',
                position: 'insideBottom',
                offset: -15,
                style: { fontSize: 11, fill: '#757575', fontWeight: 600 },
              }}
            />

            {/* Y-Axis: Hours used per month */}
            <YAxis
              type="number"
              dataKey="monthly_hours"
              name="ชั่วโมงที่ใช้งานต่อเดือน"
              domain={[0, maxHours]}
              stroke="#8A8A8A"
              tick={{ fontSize: 11, fill: '#8A8A8A' }}
              tickLine={{ stroke: '#E5DADA' }}
              label={{
                value: 'ชั่วโมงใช้งานจริงต่อเดือน (ชม.) →',
                angle: -90,
                position: 'insideLeft',
                offset: 15,
                style: { fontSize: 11, fill: '#757575', fontWeight: 600 },
              }}
            />

            {/* Threshold Reference Lines */}
            <ReferenceLine
              y={HOURS_THRESHOLD}
              stroke="#D495A2"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `เกณฑ์ขั้นต่ำ ${HOURS_THRESHOLD} ชม./ด.`,
                fill: '#B87281',
                fontSize: 10,
                position: 'insideTopLeft',
              }}
            />
            <ReferenceLine
              x={COST_THRESHOLD}
              stroke="#D495A2"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `เกณฑ์ราคา $${COST_THRESHOLD}/ด.`,
                fill: '#B87281',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#E2B4BD' }} />

            <Scatter name="Subscriptions" data={data}>
              {data.map((entry) => {
                const conf = QUADRANT_CONFIG[entry.quadrant] || QUADRANT_CONFIG.bargain
                return (
                  <Cell
                    key={entry.id}
                    fill={conf.color}
                    stroke="#FFFFFF"
                    strokeWidth={2.5}
                    r={8}
                    className="cursor-pointer hover:scale-125 transition-transform duration-200"
                  />
                )
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Quadrant Legend Tiles */}
      <div className="mt-6 pt-4 border-t border-[#F0E6E6] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {[
          { key: 'kill_zone', count: killZoneCount, ...QUADRANT_CONFIG.kill_zone },
          { key: 'silent_bleed', count: silentBleedCount, ...QUADRANT_CONFIG.silent_bleed },
          { key: 'premium_investment', count: investmentCount, ...QUADRANT_CONFIG.premium_investment },
          { key: 'bargain', count: bargainCount, ...QUADRANT_CONFIG.bargain },
        ].map((item) => (
          <div
            key={item.key}
            className="p-3 rounded-xl border flex items-start gap-2.5 transition-all"
            style={{ backgroundColor: item.bg, borderColor: item.border }}
          >
            <div
              className="w-3 h-3 rounded-full mt-0.5 shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0">
              <span className="font-bold text-[#2D2D2D] block leading-snug">
                {item.name} ({item.count})
              </span>
              <span className="text-[10px] text-[#757575] leading-tight block mt-0.5">
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KillZoneChart
