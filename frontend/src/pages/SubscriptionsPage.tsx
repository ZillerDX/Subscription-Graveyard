/**
 * Subscriptions Management Page - Modern Pro SaaS Design
 * Strict zero-emoji, exact financial calculations, pro dark theme
 */
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  FiPlus,
  FiDownload,
  FiSearch,
  FiX,
  FiLayers,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiList,
} from 'react-icons/fi'
import { subscriptionService } from '../services/subscriptionService'
import type { Subscription, SubscriptionCreate, SubscriptionStatus } from '../types/subscription'
import SubscriptionList from '../components/subscriptions/SubscriptionList'
import SubscriptionForm from '../components/subscriptions/SubscriptionForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { exportSubscriptionsToCSV } from '../utils/csvExport'
import { getMonthlyCost } from '../utils/calculations'

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

  // Fetch all subscriptions for accurate metric counters
  const { data: allSubscriptions = [] } = useQuery({
    queryKey: ['subscriptions', 'all'],
    queryFn: () => subscriptionService.getAll(),
  })

  // Invalidate queries helper
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard-kill-zone'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard-category-breakdown'] })
  }

  // Create mutation
  const createMutation = useMutation({
    mutationFn: subscriptionService.create,
    onSuccess: (data) => {
      invalidateAll()
      setIsFormOpen(false)
      setEditingSubscription(null)
      toast.success(`"${data.name}" added to active subscriptions.`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create subscription')
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubscriptionCreate }) =>
      subscriptionService.update(id, data),
    onSuccess: (data) => {
      invalidateAll()
      setIsFormOpen(false)
      setEditingSubscription(null)
      toast.success(`"${data.name}" updated successfully.`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update subscription')
    },
  })

  // Cancel mutation (move to Graveyard)
  const cancelMutation = useMutation({
    mutationFn: subscriptionService.cancel,
    onSuccess: (data) => {
      invalidateAll()
      setConfirmDialog({ isOpen: false, subscriptionId: null, subscriptionName: null })
      toast.success(`"${data.name}" moved to the Graveyard.`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel subscription')
    },
  })

  // Reactivate mutation
  const reactivateMutation = useMutation({
    mutationFn: subscriptionService.reactivate,
    onSuccess: (data) => {
      invalidateAll()
      toast.success(`"${data.name}" restored from Graveyard to Active.`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reactivate subscription')
    },
  })

  // Delete permanently mutation
  const deleteMutation = useMutation({
    mutationFn: subscriptionService.delete,
    onSuccess: () => {
      invalidateAll()
      setDeleteDialog({ isOpen: false, subscriptionId: null, subscriptionName: null })
      toast.success('Subscription deleted permanently.')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete subscription')
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
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      subscription.name.toLowerCase().includes(q) ||
      (subscription.category && subscription.category.toLowerCase().includes(q))
    )
  })

  // Accurate Metrics calculations
  const activeSubs = allSubscriptions.filter((s) => s.status === 'active')
  const cancelledSubs = allSubscriptions.filter((s) => s.status === 'cancelled')

  const totalMonthlyBurn = activeSubs.reduce((sum, s) => sum + getMonthlyCost(s), 0)
  const totalYearlyCost = Math.round(totalMonthlyBurn * 12 * 100) / 100

  const totalMonthlySaved = cancelledSubs.reduce((sum, s) => sum + getMonthlyCost(s), 0)
  const totalYearlySaved = Math.round(totalMonthlySaved * 12 * 100) / 100

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Manage your recurring commitments, monitor costs, and purge zombie subscriptions
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              try {
                exportSubscriptionsToCSV(subscriptions)
                toast.success('CSV export generated successfully.')
              } catch (error: any) {
                toast.error(error.message || 'Failed to export CSV')
              }
            }}
            disabled={subscriptions.length === 0}
            className="inline-flex items-center space-x-2 px-3.5 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <FiDownload className="w-3.5 h-3.5 shrink-0" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold tracking-wide shadow-sm hover:shadow-rose-500/20 transition-all cursor-pointer"
          >
            <FiPlus className="w-3.5 h-3.5 shrink-0" />
            <span>Add Subscription</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
              Active Subscriptions
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FiLayers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-white tracking-tight">{activeSubs.length}</div>
            <p className="text-xs text-slate-400 mt-0.5">
              out of {allSubscriptions.length} total recorded
            </p>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800/90 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
              Active Monthly Burn
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <FiDollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-white tracking-tight">
              ${totalMonthlyBurn.toFixed(2)}
              <span className="text-xs text-slate-500 font-normal ml-1">/mo</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Projected ${totalYearlyCost.toFixed(2)}/yr
            </p>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800/90 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
              Graveyard Savings
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FiCheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">
              +${totalMonthlySaved.toFixed(2)}
              <span className="text-xs text-slate-500 font-normal ml-1">/mo</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              +${totalYearlySaved.toFixed(2)}/yr from {cancelledSubs.length} killed subs
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-4 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        {/* Status Filter Tabs */}
        <div className="inline-flex p-1 bg-slate-950/70 border border-slate-800 rounded-xl">
          <button
            onClick={() => setStatusFilter('active')}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              statusFilter === 'active'
                ? 'bg-slate-800 text-white shadow-xs border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FiCheckCircle className="w-3 h-3 text-emerald-400" />
            <span>Active ({activeSubs.length})</span>
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              statusFilter === 'cancelled'
                ? 'bg-slate-800 text-white shadow-xs border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FiXCircle className="w-3 h-3 text-rose-400" />
            <span>Graveyard ({cancelledSubs.length})</span>
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white shadow-xs border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FiList className="w-3 h-3 text-indigo-400" />
            <span>All ({allSubscriptions.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <FiSearch className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-300"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Subscription Card Grid */}
      <SubscriptionList
        subscriptions={filteredSubscriptions}
        onEdit={handleEdit}
        onCancel={handleCancelClick}
        onReactivate={handleReactivate}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      {/* Add / Edit Modal */}
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
        title="Send Subscription to Graveyard"
        message={`Are you sure you want to cancel "${confirmDialog.subscriptionName}"? It will be moved to the Graveyard and marked as realized savings.`}
        confirmText="Kill Subscription"
        confirmStyle="danger"
        isLoading={cancelMutation.isPending}
      />

      {/* Permanent Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() =>
          setDeleteDialog({ isOpen: false, subscriptionId: null, subscriptionName: null })
        }
        onConfirm={handleConfirmDelete}
        title="Permanently Delete Record"
        message={`Are you sure you want to permanently delete "${deleteDialog.subscriptionName}"? This action cannot be reversed.`}
        confirmText="Delete Permanently"
        confirmStyle="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

export default SubscriptionsPage
