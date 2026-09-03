/**
 * Value Zone Matrix Component — Minimal Toggl Style
 * Binary Visualization: Zone คุ้มค่า (Worth It Zone) vs Zone ไม่คุ้มค่า (Waste Zone)
 * Dual-Language support
 */
import React, { useState } from 'react'
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
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiActivity,
  FiPieChart,
} from 'react-icons/fi'
import type { KillZoneDataPoint } from '../../services/dashboardService'
import {
  BASE_COST_THRESHOLD,
  BASE_HOURS_THRESHOLD,
  isWasteZone,
  isWorthItZone,
} from '../../utils/calculations'
import { BrandLogo } from '../common/BrandLogo'
import { useLanguage } from '../../context/LanguageContext'

interface KillZoneChartProps {
  data: KillZoneDataPoint[]
  isLoading?: boolean
  onCancel?: (id: string) => void
  isCancelling?: boolean
}

const CustomTooltip = ({ active, payload, lang }: any) => {
  if (!active || !payload?.length) return null
  const item: KillZoneDataPoint = payload[0].payload
  const isWaste = isWasteZone(item.quadrant)

  return (
    <div className="bg-white border border-[#F0E6E6] rounded-2xl shadow-modal p-4 min-w-[240px] text-xs pointer-events-none animate-scale-in">
      <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#F0E6E6]">
        <BrandLogo logoKey={item.logo_key} name={item.name} className="w-8 h-8 rounded-xl" size={16} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isWaste ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <p className="font-bold text-[#2D2D2D] text-sm truncate">{item.name}</p>
          </div>
          <span
            className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded-md mt-0.5 ${
              isWaste
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {isWaste
              ? lang === 'th'
                ? 'Zone ไม่คุ้มค่า (Waste)'
                : 'Waste Zone'
              : lang === 'th'
              ? 'Zone คุ้มค่า (Worth It)'
              : 'Worth It Zone'}
          </span>
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
          className={`text-[11px] font-semibold leading-relaxed pt-1 ${
            isWaste ? 'text-rose-600' : 'text-emerald-600'
          }`}
        >
          {item.recommendation}
        </p>
      </div>
    </div>
  )
}

export const KillZoneChart: React.FC<KillZoneChartProps> = ({
  data,
  isLoading = false,
  onCancel,
  isCancelling = false,
}) => {
  const { t, language } = useLanguage()
  const [zoneFilter, setZoneFilter] = useState<'all' | 'waste' | 'worth'>('all')

  if (isLoading) {
    return (
      <div className="card-minimal p-6">
        <div className="h-80 flex items-center justify-center text-[#8A8A8A] text-sm">
          {language === 'th' ? 'กำลังวิเคราะห์ Zone ความคุ้มค่า...' : 'Evaluating Value Zones...'}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="card-minimal p-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF5F5] border border-[#F7D6D0] mx-auto flex items-center justify-center text-[#B02A82] mb-3">
          <FiPieChart className="w-6 h-6 shrink-0" />
        </div>
        <h3 className="text-base font-bold text-[#2D2D2D]">
          {language === 'th' ? 'ยังไม่มีข้อมูลวิเคราะห์ความคุ้มค่า' : 'No subscription data yet'}
        </h3>
        <p className="text-xs text-[#757575] mt-1 max-w-sm mx-auto">
          {language === 'th'
            ? 'เพิ่ม Subscription พร้อมระบุชั่วโมงการใช้งาน เพื่อเริ่มแสดงการวิเคราะห์ Zone คุ้มค่า vs ไม่คุ้มค่า'
            : 'Add subscriptions with estimated usage to visualize Worth It vs Waste Zones'}
        </p>
      </div>
    )
  }

  // Binary Separation
  const wasteSubs = data.filter((d) => isWasteZone(d.quadrant))
  const worthSubs = data.filter((d) => isWorthItZone(d.quadrant))

  const totalWasteMonthly = wasteSubs.reduce((sum, s) => sum + s.cost, 0)
  const totalWasteYearly = Math.round(totalWasteMonthly * 12 * 100) / 100

  const totalWorthMonthly = worthSubs.reduce((sum, s) => sum + s.cost, 0)
  const totalWorthHours = worthSubs.reduce((sum, s) => sum + s.monthly_hours, 0)
  const avgWorthCph =
    totalWorthHours > 0 ? Math.round((totalWorthMonthly / totalWorthHours) * 100) / 100 : 0

  // Filtered Points for Scatter Chart
  const filteredData =
    zoneFilter === 'waste' ? wasteSubs : zoneFilter === 'worth' ? worthSubs : data

  const maxCost = Math.max(80, Math.ceil((Math.max(...data.map((d) => d.cost), 0) + 10) / 10) * 10)
  const maxHours = Math.max(
    60,
    Math.ceil((Math.max(...data.map((d) => d.monthly_hours), 0) + 10) / 10) * 10
  )

  return (
    <div className="space-y-6">
      {/* ── Main Chart Card ── */}
      <div className="card-minimal p-6">
        {/* Header & Zone Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FCE7F3] text-[#B02A82] flex items-center justify-center shrink-0">
                <FiActivity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#2D2D2D] tracking-tight">
                  {t('zone.matrixTitle')}
                </h3>
                <p className="text-xs text-[#757575] mt-0.5">{t('zone.matrixSubtitle')}</p>
              </div>
            </div>
          </div>

          {/* Interactive Zone Filter Tabs */}
          <div className="inline-flex p-1 bg-[#FFF5F5] border border-[#F0E6E6] rounded-xl gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setZoneFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                zoneFilter === 'all'
                  ? 'bg-white text-[#B02A82] shadow-xs'
                  : 'text-[#757575] hover:text-[#2D2D2D]'
              }`}
            >
              {t('zone.filterAll')} ({data.length})
            </button>
            <button
              type="button"
              onClick={() => setZoneFilter('waste')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                zoneFilter === 'waste'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>
                {t('zone.wasteTitle')} ({wasteSubs.length})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setZoneFilter('worth')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                zoneFilter === 'worth'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>
                {t('zone.worthTitle')} ({worthSubs.length})
              </span>
            </button>
          </div>
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
                  value:
                    language === 'th' ? 'ค่าบริการรายเดือน ($/mo) →' : 'Monthly Cost ($/mo) →',
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

              {/* Threshold Dividers */}
              <ReferenceLine
                y={BASE_HOURS_THRESHOLD}
                stroke="#D495A2"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value:
                    language === 'th'
                      ? `เกณฑ์เวลามาตรฐาน ${BASE_HOURS_THRESHOLD} ชม./ด.`
                      : `Usage divider ${BASE_HOURS_THRESHOLD} hrs/mo`,
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

              <Scatter name="Subscriptions" data={filteredData}>
                {filteredData.map((entry) => {
                  const isWaste = isWasteZone(entry.quadrant)
                  return (
                    <Cell
                      key={entry.id}
                      fill={isWaste ? '#E11D48' : '#10B981'}
                      stroke="#FFFFFF"
                      strokeWidth={2.5}
                      r={isWaste ? 9 : 7}
                      className="cursor-pointer hover:scale-125 transition-transform duration-200"
                    />
                  )
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Two-Zone Actionable Breakdown Cards (Zone คุ้ม vs Zone ไม่คุ้ม) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 🔴 CARD 1: ZONE ไม่คุ้มค่า (Waste Zone) */}
        <div className="card-minimal p-6 border-rose-200/90 bg-gradient-to-b from-white to-rose-50/20 shadow-xs flex flex-col justify-between">
          <div>
            {/* Zone Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-rose-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <FiXCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-extrabold text-rose-950 tracking-tight">
                      {t('zone.wasteTitle')}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                      {wasteSubs.length} {language === 'th' ? 'รายการ' : 'subs'}
                    </span>
                  </div>
                  <p className="text-xs text-rose-800/80 mt-0.5">{t('zone.wasteDesc')}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-lg font-extrabold text-rose-600 tabular">
                  ${totalWasteMonthly.toFixed(2)}
                </span>
                <span className="text-[10px] text-rose-700/80 block font-semibold">
                  {t('zone.wasteYearly', { val: `$${totalWasteYearly.toFixed(2)}` })}
                </span>
              </div>
            </div>

            {/* List of Waste Subscriptions */}
            <div className="mt-4 space-y-2.5">
              {wasteSubs.length > 0 ? (
                wasteSubs.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 bg-white border border-rose-150 rounded-2xl flex items-center justify-between gap-3 hover:border-rose-300 transition-colors shadow-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BrandLogo
                        logoKey={sub.logo_key}
                        name={sub.name}
                        className="w-8 h-8 rounded-xl shrink-0"
                        size={16}
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-[#2D2D2D] text-xs truncate">{sub.name}</p>
                        <p className="text-[10px] text-[#8A8A8A] flex items-center gap-1 mt-0.5">
                          <FiClock className="w-3 h-3 text-rose-500" />
                          <span>
                            {language === 'th'
                              ? `ใช้ ${sub.monthly_hours} ชม./ด. (ตก $${sub.cost_per_hour.toFixed(2)}/ชม.)`
                              : `${sub.monthly_hours}h/mo ($${sub.cost_per_hour.toFixed(2)}/hr)`}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-extrabold text-rose-600 tabular">
                        ${sub.cost.toFixed(2)}
                        <span className="text-[10px] text-[#8A8A8A] font-normal">/ด.</span>
                      </span>

                      {onCancel && (
                        <button
                          type="button"
                          onClick={() => onCancel(sub.id)}
                          disabled={isCancelling}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 text-[11px] font-bold transition-all flex items-center gap-1 active:scale-[0.97]"
                        >
                          <FiXCircle className="w-3.5 h-3.5" />
                          <span>{t('zone.killBtn')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-rose-50/40 border border-dashed border-rose-200 rounded-2xl text-xs text-rose-700 font-medium">
                  <FiCheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                  <span>{t('zone.noWaste')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🟢 CARD 2: ZONE คุ้มค่า (Worth It Zone) */}
        <div className="card-minimal p-6 border-emerald-200/90 bg-gradient-to-b from-white to-emerald-50/20 shadow-xs flex flex-col justify-between">
          <div>
            {/* Zone Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-emerald-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <FiCheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-extrabold text-emerald-950 tracking-tight">
                      {t('zone.worthTitle')}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      {worthSubs.length} {language === 'th' ? 'รายการ' : 'subs'}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800/80 mt-0.5">{t('zone.worthDesc')}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-lg font-extrabold text-emerald-600 tabular">
                  ${totalWorthMonthly.toFixed(2)}
                </span>
                <span className="text-[10px] text-emerald-700/80 block font-semibold">
                  {t('zone.worthUsage', { val: totalWorthHours })} (${avgWorthCph.toFixed(2)}/hr)
                </span>
              </div>
            </div>

            {/* List of Worth It Subscriptions */}
            <div className="mt-4 space-y-2.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
              {worthSubs.length > 0 ? (
                worthSubs.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 bg-white border border-emerald-150 rounded-2xl flex items-center justify-between gap-3 hover:border-emerald-300 transition-colors shadow-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BrandLogo
                        logoKey={sub.logo_key}
                        name={sub.name}
                        className="w-8 h-8 rounded-xl shrink-0"
                        size={16}
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-[#2D2D2D] text-xs truncate">{sub.name}</p>
                        <p className="text-[10px] text-[#8A8A8A] flex items-center gap-1 mt-0.5">
                          <FiClock className="w-3 h-3 text-emerald-600" />
                          <span>
                            {language === 'th'
                              ? `ใช้ ${sub.monthly_hours} ชม./ด. (ตกเพียง $${sub.cost_per_hour.toFixed(2)}/ชม.)`
                              : `${sub.monthly_hours}h/mo (just $${sub.cost_per_hour.toFixed(2)}/hr)`}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-xs font-extrabold text-[#2D2D2D] tabular">
                        ${sub.cost.toFixed(2)}
                        <span className="text-[10px] text-[#8A8A8A] font-normal">/ด.</span>
                      </span>

                      <span className="px-2 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        {language === 'th' ? 'คุ้มค่า' : 'Worth It'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-xs text-[#757575]">
                  {t('zone.noWorth')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KillZoneChart
