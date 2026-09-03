/**
 * Kill Zone 4-Quadrant Matrix Component — Minimal Toggl Style
 * Evaluation: Monthly Cost ($) vs Usage Hours (ชม./เดือน)
 * Dual-Language support
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
import { BASE_COST_THRESHOLD, BASE_HOURS_THRESHOLD } from '../../utils/calculations'
import { BrandLogo } from '../common/BrandLogo'
import { useLanguage } from '../../context/LanguageContext'

interface KillZoneChartProps {
  data: KillZoneDataPoint[]
  isLoading?: boolean
}

const getQuadrantConfigs = (lang: 'th' | 'en') => ({
  kill_zone: {
    name: lang === 'th' ? 'Kill Zone (ไม่คุ้มค่าอย่างยิ่ง)' : 'Kill Zone (Extreme Waste)',
    desc: lang === 'th' ? 'จ่ายแพง + ใช้น้อย (เป้าหมายยกเลิก)' : 'High cost + low engagement (Cancel target)',
    color: '#E11D48',
    bg: '#FFF1F2',
    border: '#FECDD3',
  },
  silent_bleed: {
    name: lang === 'th' ? 'Silent Bleeders (เสี่ยงเสียเปล่า)' : 'Silent Bleeders (Low Usage)',
    desc: lang === 'th' ? 'จ่ายน้อย + ใช้น้อย (ลืมยกเลิก)' : 'Low cost + low usage (Leaking cash)',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  premium_investment: {
    name: lang === 'th' ? 'Worth Every Penny (สมราคา)' : 'Worth Every Penny (Core Tool)',
    desc: lang === 'th' ? 'จ่ายสูง + ใช้งานบ่อย (คุ้มค่า)' : 'High cost + high engagement (Keep)',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
  bargain: {
    name: lang === 'th' ? 'Bargain Heroes (คุ้มค่ามาก)' : 'Bargain Heroes (Best Value)',
    desc: lang === 'th' ? 'จ่ายน้อย + ใช้งานหนัก (คุ้มค่าสูงสุด)' : 'Low cost + high engagement (Great ROI)',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  neutral: {
    name: lang === 'th' ? 'Moderate (ปานกลาง)' : 'Moderate Value',
    desc: lang === 'th' ? 'ความคุ้มค่าระดับทั่วไป' : 'Acceptable utility',
    color: '#6B7280',
    bg: '#F3F4F6',
    border: '#E5E7EB',
  },
})

const CustomTooltip = ({ active, payload, lang }: any) => {
  if (!active || !payload?.length) return null
  const item: KillZoneDataPoint = payload[0].payload
  const configs = getQuadrantConfigs(lang)
  const qConfig = configs[item.quadrant] || configs.bargain

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
          <span className="text-[10px] text-[#8A8A8A] block font-semibold uppercase">
            {lang === 'th' ? 'ค่าบริการ/เดือน' : 'Cost/mo'}
          </span>
          <span className="text-base font-extrabold text-[#2D2D2D] tabular">
            ${item.cost.toFixed(2)}
          </span>
        </div>
        <div className="bg-[#FFF5F5] rounded-xl p-2.5">
          <span className="text-[10px] text-[#8A8A8A] block font-semibold uppercase">
            {lang === 'th' ? 'ชั่วโมงที่ใช้' : 'Usage'}
          </span>
          <span className="text-base font-extrabold text-[#B02A82] tabular">
            {item.monthly_hours} {lang === 'th' ? 'ชม.' : 'hrs'}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-[#F0E6E6] space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#757575] font-medium">
            {lang === 'th' ? 'ต้นทุนเฉลี่ย:' : 'Cost per hour:'}
          </span>
          <span className="font-extrabold text-[#2D2D2D] tabular">
            ${item.cost_per_hour.toFixed(2)} {lang === 'th' ? '/ ชม.' : '/ hr'}
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
  const { language } = useLanguage()
  const configs = getQuadrantConfigs(language)

  if (isLoading) {
    return (
      <div className="card-minimal p-6">
        <div className="h-80 flex items-center justify-center text-[#8A8A8A] text-sm">
          {language === 'th' ? 'กำลังคำนวณเมทริกซ์ความคุ้มค่า...' : 'Calculating Value Matrix...'}
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
        <h3 className="text-base font-bold text-[#2D2D2D]">
          {language === 'th' ? 'ยังไม่มีข้อมูลวิเคราะห์ความคุ้มค่า' : 'No subscription data yet'}
        </h3>
        <p className="text-xs text-[#757575] mt-1 max-w-sm mx-auto">
          {language === 'th'
            ? 'เพิ่ม Subscription พร้อมระบุชั่วโมงการใช้งาน เพื่อเริ่มแสดงกราฟเปรียบเทียบความคุ้มค่า'
            : 'Add subscriptions with estimated usage to visualize the personalized Value Matrix'}
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
              {language === 'th'
                ? 'Kill Zone Matrix (ค่าบริการ vs ชั่วโมงการใช้งานจริง)'
                : 'Kill Zone Matrix (Monthly Cost vs Engagement Hours)'}
            </h3>
          </div>
          <p className="text-xs text-[#757575] mt-1">
            {language === 'th'
              ? 'เกณฑ์วัดตามหลักการเงิน 50/30/20: จ่ายแพงแต่ใช้น้อย = เสียเปล่า (Kill Zone) | จ่ายน้อยใช้บ่อย = คุ้มค่าสูงสุด'
              : 'Grounded in 50/30/20 financial benchmark: High cost + low engagement = Zombie spend'}
          </p>
        </div>

        {killZoneCount > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shrink-0">
            <FiAlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>
              {language === 'th'
                ? `พบ ${killZoneCount} บริการใน Kill Zone ที่ควรยกเลิก`
                : `${killZoneCount} subscriptions in Kill Zone`}
            </span>
          </div>
        )}
      </div>

      {/* Scatter Chart */}
      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 25, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0E6E6" />

            <XAxis
              type="number"
              dataKey="cost"
              name={language === 'th' ? 'ค่าบริการต่อเดือน ($)' : 'Cost ($/mo)'}
              unit="$"
              domain={[0, maxCost]}
              stroke="#8A8A8A"
              tick={{ fontSize: 11, fill: '#8A8A8A' }}
              tickLine={{ stroke: '#E5DADA' }}
              label={{
                value: language === 'th' ? 'ค่าบริการรายเดือน ($/mo) →' : 'Monthly Cost ($/mo) →',
                position: 'insideBottom',
                offset: -15,
                style: { fontSize: 11, fill: '#757575', fontWeight: 600 },
              }}
            />

            <YAxis
              type="number"
              dataKey="monthly_hours"
              name={language === 'th' ? 'ชั่วโมงที่ใช้ต่อเดือน' : 'Hours used'}
              domain={[0, maxHours]}
              stroke="#8A8A8A"
              tick={{ fontSize: 11, fill: '#8A8A8A' }}
              tickLine={{ stroke: '#E5DADA' }}
              label={{
                value:
                  language === 'th'
                    ? 'ชั่วโมงใช้งานจริงต่อเดือน (ชม.) →'
                    : 'Monthly Engagement (hrs) →',
                angle: -90,
                position: 'insideLeft',
                offset: 15,
                style: { fontSize: 11, fill: '#757575', fontWeight: 600 },
              }}
            />

            <ReferenceLine
              y={BASE_HOURS_THRESHOLD}
              stroke="#D495A2"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value:
                  language === 'th'
                    ? `เกณฑ์มาตรฐาน ${BASE_HOURS_THRESHOLD} ชม./ด.`
                    : `Baseline ${BASE_HOURS_THRESHOLD} hrs/mo`,
                fill: '#B87281',
                fontSize: 10,
                position: 'insideTopLeft',
              }}
            />
            <ReferenceLine
              x={BASE_COST_THRESHOLD}
              stroke="#D495A2"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value:
                  language === 'th'
                    ? `เกณฑ์ราคา $${BASE_COST_THRESHOLD}/ด.`
                    : `Cost divider $${BASE_COST_THRESHOLD}/mo`,
                fill: '#B87281',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            <Tooltip
              content={<CustomTooltip lang={language} />}
              cursor={{ strokeDasharray: '3 3', stroke: '#E2B4BD' }}
            />

            <Scatter name="Subscriptions" data={data}>
              {data.map((entry) => {
                const conf = configs[entry.quadrant] || configs.bargain
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
          { key: 'kill_zone', count: killZoneCount, ...configs.kill_zone },
          { key: 'silent_bleed', count: silentBleedCount, ...configs.silent_bleed },
          { key: 'premium_investment', count: investmentCount, ...configs.premium_investment },
          { key: 'bargain', count: bargainCount, ...configs.bargain },
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
