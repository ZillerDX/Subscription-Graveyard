/**
 * Kill Zone Chart Component
 * Scatter plot showing Cost vs Value Score
 * Helps identify subscriptions to cancel (high cost, low value)
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
  Label,
} from 'recharts'
import type { KillZoneDataPoint } from '../../services/dashboardService'

interface KillZoneChartProps {
  data: KillZoneDataPoint[]
  isLoading?: boolean
}

const KillZoneChart: React.FC<KillZoneChartProps> = ({ data, isLoading = false }) => {
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kill Zone Analysis</h3>
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-600">No active subscriptions to analyze</p>
            <p className="text-sm text-gray-500 mt-2">
              Add some subscriptions to see the Kill Zone chart
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3">
          <p className="font-bold text-gray-900 mb-1">{data.name}</p>
          <p className="text-sm text-gray-600">
            Cost: <span className="font-semibold">${data.cost.toFixed(2)}/month</span>
          </p>
          <p className="text-sm text-gray-600">
            Value: <span className="font-semibold">{data.value_score}/5</span>
          </p>
          {data.category && (
            <p className="text-xs text-gray-500 mt-1">Category: {data.category}</p>
          )}
        </div>
      )
    }
    return null
  }

  // Determine point colors based on quadrant with absolute thresholds
  const getPointColor = (cost: number, valueScore: number) => {
    // Calculate median cost for relative comparison
    const medianCost = [...data].sort((a, b) => a.cost - b.cost)[Math.floor(data.length / 2)]?.cost || 20

    // Absolute thresholds for better categorization
    const MINIMUM_HIGH_COST = 25 // $25/mo is objectively significant
    const EXTREME_HIGH_COST = 50 // $50/mo is definitely expensive
    const VALUE_THRESHOLD = 3 // 3 stars is the value divider

    // A subscription is "high cost" if:
    // 1. Above $50/mo (always expensive), OR
    // 2. Above median AND above $25/mo (relatively expensive)
    const isHighCost = cost > EXTREME_HIGH_COST || (cost > medianCost && cost > MINIMUM_HIGH_COST)
    const isLowValue = valueScore < VALUE_THRESHOLD

    // Categorize into 4 zones
    if (isHighCost && isLowValue) {
      return '#ef4444' // Red - HIGH COST, LOW VALUE (Kill Zone!)
    } else if (isHighCost && !isLowValue) {
      return '#f59e0b' // Orange - HIGH COST, HIGH VALUE (Expensive but worth it)
    } else if (!isHighCost && isLowValue) {
      return '#eab308' // Yellow - LOW COST, LOW VALUE (Cheap but meh)
    } else {
      return '#10b981' // Green - LOW COST, HIGH VALUE (Great value!)
    }
  }

  // Add color to data points
  const coloredData = data.map((point) => ({
    ...point,
    fill: getPointColor(point.cost, point.value_score),
  }))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Kill Zone Analysis</h3>
        <p className="text-sm text-gray-600 mt-1">
          Identify subscriptions to cancel: High cost, low value = Kill Zone 🎯
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            type="number"
            dataKey="cost"
            name="Monthly Cost"
            unit="$"
            domain={[0, 'auto']}
            stroke="#6b7280"
          >
            <Label
              value="Monthly Cost ($)"
              position="bottom"
              offset={40}
              style={{ fontSize: 14, fill: '#374151', fontWeight: 600 }}
            />
          </XAxis>

          <YAxis
            type="number"
            dataKey="value_score"
            name="Value Score"
            domain={[0, 5.5]}
            ticks={[1, 2, 3, 4, 5]}
            stroke="#6b7280"
          >
            <Label
              value="Value Score"
              angle={-90}
              position="left"
              offset={40}
              style={{ fontSize: 14, fill: '#374151', fontWeight: 600 }}
            />
          </YAxis>

          {/* Reference lines for quadrants */}
          <ReferenceLine
            y={3}
            stroke="#94a3b8"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{
              value: 'Value Threshold',
              position: 'right',
              fill: '#64748b',
              fontSize: 12,
            }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

          <Scatter
            name="Subscriptions"
            data={coloredData}
            fill="#8884d8"
            shape="circle"
          />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-700">Kill Zone (High cost, Low value)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-gray-700">Worth it (High cost, High value)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-gray-700">Meh (Low cost, Low value)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-700">Great Value (Low cost, High value)</span>
        </div>
      </div>
    </div>
  )
}

export default KillZoneChart
