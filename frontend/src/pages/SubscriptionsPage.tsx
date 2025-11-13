/**
 * Subscriptions Page
 * Main page for managing subscriptions
 */
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { subscriptionService } from '../services/subscriptionService'
import type { Subscription, SubscriptionCreate, SubscriptionStatus } from '../types/subscription'
import SubscriptionList from '../components/subscriptions/SubscriptionList'
import SubscriptionForm from '../components/subscriptions/SubscriptionForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { exportSubscriptionsToCSV } from '../utils/csvExport'

const SubscriptionsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'all'>('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    subscriptionId: string | null
    subscriptionName: string | null
  }>({
    isOpen: false,
    subscriptionId: null,
    subscriptionName: null,
  })

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    subscriptionId: string | null
    subscriptionName: string | null
  }>({
    isOpen: false,
    subscriptionId: null,
    subscriptionName: null,
  })

  // Fetch subscriptions based on filter
  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['subscriptions', statusFilter],
    queryFn: () =>
      subscriptionService.getAll(statusFilter === 'all' ? undefined : statusFilter),
  })

  // Fetch all subscriptions for accurate counts
  const { data: allSubscriptions = [] } = useQuery({
    queryKey: ['subscriptions', 'all'],
    queryFn: () => subscriptionService.getAll(),
  })

  // Create subscription mutation
  const createMutation = useMutation({
    mutationFn: subscriptionService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-kill-zone'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-category-breakdown'] })
      setIsFormOpen(false)
      setEditingSubscription(null)
      toast.success(`Subscription "${data.name}" created successfully!`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create subscription')
    },
  })

  // Update subscription mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubscriptionCreate }) =>
      subscriptionService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-kill-zone'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-category-breakdown'] })
      setIsFormOpen(false)
      setEditingSubscription(null)
      toast.success(`Subscription "${data.name}" updated successfully!`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update subscription')
    },
  })

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: subscriptionService.cancel,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-kill-zone'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-category-breakdown'] })
      setConfirmDialog({ isOpen: false, subscriptionId: null, subscriptionName: null })
      toast.success(`Subscription "${data.name}" cancelled successfully`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to cancel subscription')
    },
  })

  // Reactivate subscription mutation
  const reactivateMutation = useMutation({
    mutationFn: subscriptionService.reactivate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-kill-zone'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-category-breakdown'] })
      toast.success(`Subscription "${data.name}" reactivated successfully!`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to reactivate subscription')
    },
  })

  // Delete subscription permanently mutation
  const deleteMutation = useMutation({
    mutationFn: subscriptionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-kill-zone'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-category-breakdown'] })
      setDeleteDialog({ isOpen: false, subscriptionId: null, subscriptionName: null })
      toast.success('Subscription deleted permanently')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete subscription')
    },
  })

  const handleSubmit = async (data: SubscriptionCreate) => {
    if (editingSubscription) {
      await updateMutation.mutateAsync({ id: editingSubscription.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription)
    setIsFormOpen(true)
  }

  const handleCancelClick = (subscription: Subscription) => {
    setConfirmDialog({
      isOpen: true,
      subscriptionId: subscription.id,
      subscriptionName: subscription.name,
    })
  }

  const handleConfirmCancel = async () => {
    if (confirmDialog.subscriptionId) {
      await cancelMutation.mutateAsync(confirmDialog.subscriptionId)
    }
  }

  const handleAddNew = () => {
    setEditingSubscription(null)
    setIsFormOpen(true)
  }

  const handleReactivate = async (subscription: Subscription) => {
    await reactivateMutation.mutateAsync(subscription.id)
  }

  const handleDeleteClick = (subscription: Subscription) => {
    setDeleteDialog({
      isOpen: true,
      subscriptionId: subscription.id,
      subscriptionName: subscription.name,
    })
  }

  const handleConfirmDelete = async () => {
    if (deleteDialog.subscriptionId) {
      await deleteMutation.mutateAsync(deleteDialog.subscriptionId)
    }
  }

  // Filter subscriptions based on search query
  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch =
      searchQuery === '' ||
      subscription.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.category?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const activeCount = allSubscriptions.filter((s) => s.status === 'active').length
  const totalMonthlyBurn = allSubscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => {
      const cost = parseFloat(s.cost.toString())
      const monthlyCost = s.billing_cycle === 'monthly' ? cost : cost / 12
      return sum + (isNaN(monthlyCost) ? 0 : monthlyCost)
    }, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 animate-slideDown">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            My Subscriptions
          </h1>
          <p className="mt-2 text-base text-gray-700 font-medium">
            Manage all your recurring subscriptions in one place
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              try {
                exportSubscriptionsToCSV(subscriptions)
                toast.success('Subscriptions exported successfully!')
              } catch (error: any) {
                toast.error(error.message || 'Failed to export subscriptions')
              }
            }}
            disabled={subscriptions.length === 0}
            className="flex items-center space-x-2 px-5 py-3 bg-white border-2 border-gray-300 text-gray-800 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <span className="text-xl">+</span>
            <span>Add Subscription</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-slideUp">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border-2 border-blue-200 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-blue-800 uppercase tracking-wide">Active Subscriptions</div>
            <div className="text-3xl">📊</div>
          </div>
          <div className="text-4xl font-extrabold text-blue-900">{activeCount}</div>
          <div className="text-xs font-semibold text-blue-700 mt-1">Currently tracking</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg p-6 border-2 border-red-200 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-red-800 uppercase tracking-wide">Monthly Burn Rate</div>
            <div className="text-3xl">💸</div>
          </div>
          <div className="text-4xl font-extrabold text-red-900">
            ${totalMonthlyBurn.toFixed(2)}
          </div>
          <div className="text-xs font-semibold text-red-700 mt-1">
            ${(totalMonthlyBurn * 12).toFixed(2)}/year
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg p-6 border-2 border-yellow-200 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-yellow-800 uppercase tracking-wide">Average Value Score</div>
            <div className="text-3xl">⭐</div>
          </div>
          <div className="text-4xl font-extrabold text-yellow-900">
            {activeCount > 0
              ? (
                  allSubscriptions
                    .filter((s) => s.status === 'active')
                    .reduce((sum, s) => sum + s.value_score, 0) / activeCount
                ).toFixed(1)
              : '0'}
            /5
          </div>
          <div className="text-xs font-semibold text-yellow-700 mt-1">Overall satisfaction</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-5 border-2 border-gray-200 animate-fadeIn">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base font-medium text-gray-900 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-800 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-3 text-sm text-gray-700 font-semibold">
            Found {filteredSubscriptions.length} subscription{filteredSubscriptions.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </p>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden animate-scaleIn">
        <div className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <nav className="flex -mb-px">
            <button
              onClick={() => setStatusFilter('active')}
              className={`flex-1 px-6 py-4 text-sm font-bold border-b-4 transition-all ${
                statusFilter === 'active'
                  ? 'border-primary-600 text-primary-700 bg-primary-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              ✓ Active ({allSubscriptions.filter((s) => s.status === 'active').length})
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`flex-1 px-6 py-4 text-sm font-bold border-b-4 transition-all ${
                statusFilter === 'cancelled'
                  ? 'border-primary-600 text-primary-700 bg-primary-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              ✕ Cancelled ({allSubscriptions.filter((s) => s.status === 'cancelled').length})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 px-6 py-4 text-sm font-bold border-b-4 transition-all ${
                statusFilter === 'all'
                  ? 'border-primary-600 text-primary-700 bg-primary-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              📋 All ({allSubscriptions.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          <SubscriptionList
            subscriptions={filteredSubscriptions}
            onEdit={handleEdit}
            onCancel={handleCancelClick}
            onReactivate={handleReactivate}
            onDelete={handleDeleteClick}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Subscription Form Modal */}
      {isFormOpen && (
        <SubscriptionForm
          subscription={editingSubscription}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingSubscription(null)
          }}
        />
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() =>
          setConfirmDialog({ isOpen: false, subscriptionId: null, subscriptionName: null })
        }
        onConfirm={handleConfirmCancel}
        title="Cancel Subscription"
        message={`Are you sure you want to cancel "${confirmDialog.subscriptionName}"? This will mark it as cancelled and exclude it from your monthly burn calculations.`}
        confirmText="Yes, Cancel"
        confirmStyle="danger"
        isLoading={cancelMutation.isPending}
      />

      {/* Delete Permanently Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() =>
          setDeleteDialog({ isOpen: false, subscriptionId: null, subscriptionName: null })
        }
        onConfirm={handleConfirmDelete}
        title="Delete Subscription Permanently"
        message={`⚠️ Are you absolutely sure you want to PERMANENTLY delete "${deleteDialog.subscriptionName}"? This action CANNOT be undone and all data will be lost forever!`}
        confirmText="Yes, Delete Forever"
        confirmStyle="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

export default SubscriptionsPage
