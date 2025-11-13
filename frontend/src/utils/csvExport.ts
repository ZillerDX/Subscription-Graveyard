/**
 * CSV Export Utilities
 * Functions for exporting data to CSV format
 */
import type { Subscription } from '../types/subscription'

/**
 * Convert subscriptions to CSV format and download
 */
export const exportSubscriptionsToCSV = (subscriptions: Subscription[]) => {
  if (subscriptions.length === 0) {
    throw new Error('No subscriptions to export')
  }

  // Define CSV headers
  const headers = [
    'Name',
    'Cost',
    'Billing Cycle',
    'Monthly Cost',
    'Yearly Cost',
    'Value Score',
    'Category',
    'Status',
    'Created Date',
  ]

  // Convert subscriptions to CSV rows
  const rows = subscriptions.map((sub) => {
    const monthlyCost =
      sub.billing_cycle === 'monthly' ? sub.cost : (sub.cost / 12).toFixed(2)
    const yearlyCost =
      sub.billing_cycle === 'yearly' ? sub.cost : (sub.cost * 12).toFixed(2)

    return [
      sub.name,
      sub.cost,
      sub.billing_cycle,
      monthlyCost,
      yearlyCost,
      sub.value_score,
      sub.category || 'Uncategorized',
      sub.status,
      new Date(sub.created_at).toLocaleDateString(),
    ]
  })

  // Build CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${cell}"`).join(',')
    ),
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute(
    'download',
    `subscriptions_${new Date().toISOString().split('T')[0]}.csv`
  )
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export dashboard stats to CSV
 */
export const exportDashboardStatsToCSV = (data: {
  monthly_burn: number
  yearly_cost: number
  active_count: number
  total_count: number
}) => {
  const headers = ['Metric', 'Value']
  const rows = [
    ['Monthly Burn Rate', `$${data.monthly_burn.toFixed(2)}`],
    ['Yearly Cost', `$${data.yearly_cost.toFixed(2)}`],
    ['Active Subscriptions', data.active_count],
    ['Total Subscriptions', data.total_count],
    ['Export Date', new Date().toLocaleDateString()],
  ]

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute(
    'download',
    `dashboard_stats_${new Date().toISOString().split('T')[0]}.csv`
  )
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
