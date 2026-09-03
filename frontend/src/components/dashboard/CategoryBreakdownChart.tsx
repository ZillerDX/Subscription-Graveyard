/**
 * Category Breakdown Component — Minimal Toggl Style
 * Clean progress bars and spending distribution
 */
import React from 'react'
import { FiPieChart, FiFolder } from 'react-icons/fi'
import type { CategoryBreakdown } from '../../services/dashboardService'

interface CategoryBreakdownChartProps {
  data: CategoryBreakdown[]
  isLoading?: boolean
}

const CATEGORY_COLORS = [
  '#B02A82', // Toggl Berry
  '#E2B4BD', // Mauve
  '#F7D6D0', // Peach
  '#4F46E5', // Indigo
  '#0EA5E9', // Sky
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
]

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  data,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="card-minimal p-6">
        <div className="h-64 flex items-center justify-center text-[#8A8A8A] text-sm">
          กำลังโหลดข้อมูลหมวดหมู่...
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="card-minimal p-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF5F5] border border-[#F7D6D0] mx-auto flex items-center justify-center text-[#B02A82] mb-3">
          <FiFolder className="w-6 h-6 shrink-0" />
        </div>
        <h3 className="text-base font-bold text-[#2D2D2D]">ยังไม่มีข้อมูลหมวดหมู่</h3>
        <p className="text-xs text-[#757575] mt-1 max-w-sm mx-auto">
          เพิ่ม Subscription และกำหนดหมวดหมู่เพื่อดูสัดส่วนการใช้จ่าย
        </p>
      </div>
    )
  }

  const totalMonthly = data.reduce((sum, item) => sum + item.monthly_cost, 0)

  return (
    <div className="card-minimal p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#FCE7F3] text-[#B02A82] flex items-center justify-center shrink-0">
              <FiPieChart className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#2D2D2D] tracking-tight">
              สัดส่วนค่าใช้จ่ายตามหมวดหมู่ (Category Breakdown)
            </h3>
          </div>
          <p className="text-xs text-[#757575] mt-1">
            สัดส่วนเปอร์เซ็นต์และยอดค่าบริการรายเดือนในแต่ละหมวดหมู่
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-[#8A8A8A] block font-medium">ยอดรวมทุกหมวดหมู่</span>
          <span className="text-lg font-extrabold text-[#2D2D2D] tabular">
            ${totalMonthly.toFixed(2)}/ด.
          </span>
        </div>
      </div>

      {/* Category Progress Bars */}
      <div className="space-y-3.5 mb-6">
        {data.map((item, index) => {
          const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length]
          return (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-semibold text-[#2D2D2D]">{item.category}</span>
                  <span className="text-[#8A8A8A] text-[11px]">
                    ({item.count} บริการ)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#757575] font-medium tabular">{item.percentage}%</span>
                  <span className="font-bold text-[#2D2D2D] tabular">
                    ${item.monthly_cost.toFixed(2)}/ด.
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full bg-[#FFF5F5] rounded-full h-2 overflow-hidden border border-[#F0E6E6]/60">
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
      <div className="overflow-x-auto pt-3 border-t border-[#F0E6E6]">
        <table className="min-w-full divide-y divide-[#F0E6E6] text-xs">
          <thead>
            <tr className="text-[#8A8A8A] uppercase tracking-wider text-[10px]">
              <th className="py-2.5 text-left font-semibold">หมวดหมู่</th>
              <th className="py-2.5 text-right font-semibold">ยอดรายเดือน</th>
              <th className="py-2.5 text-right font-semibold">ประมาณการรายปี</th>
              <th className="py-2.5 text-right font-semibold">สัดส่วน</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0E6E6]/60">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-[#FFF5F5]/60 transition-colors">
                <td className="py-2.5 font-medium text-[#2D2D2D]">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                    />
                    <span>{item.category}</span>
                  </div>
                </td>
                <td className="py-2.5 text-right font-bold text-[#2D2D2D] tabular">
                  ${item.monthly_cost.toFixed(2)}
                </td>
                <td className="py-2.5 text-right text-[#757575] tabular">
                  ${item.yearly_cost.toFixed(2)}
                </td>
                <td className="py-2.5 text-right font-semibold text-[#B02A82] tabular">
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
