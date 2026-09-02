/**
 * Subscriptions Page — Production-grade layout, eyebrow label, consistent metrics
 */
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  FiPlus, FiDownload, FiSearch, FiX,
  FiLayers, FiDollarSign, FiTrendingUp,
  FiCheckCircle, FiXCircle, FiList,
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
    isOpen: boolean; subscriptionId: string | null; subscriptionName: string | null
  }>({ isOpen: false, subscriptionId: null, subscriptionName: null })

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean; subscriptionId: string | null; subscriptionName: string | null
  }>({ isOpen: false, subscriptionId: null, subscriptionName: null })

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['subscriptions', statusFilter],
    queryFn: () => subscriptionService.getAll(statusFilter === 'all' ? undefined : statusFilter),
  })

  const { data: allSubscriptions = [] } = useQuery({
    queryKey: ['subscriptions', 'all'],
    queryFn: () => subscriptionService.getAll(),
  })

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard-kill-zone'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard-category-breakdown'] })
  }

  const createMutation = useMutation({
    mutationFn: subscriptionService.create,
    onSuccess: (data) => { invalidateAll(); setIsFormOpen(false); setEditingSubscription(null); toast.success(`"${data.name}" added!`) },
    onError: (error: any) => toast.error(error.message || 'Failed to create'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubscriptionCreate }) => subscriptionService.update(id, data),
    onSuccess: (data) => { invalidateAll(); setIsFormOpen(false); setEditingSubscription(null); toast.success(`"${data.name}" updated!`) },
    onError: (error: any) => toast.error(error.message || 'Failed to update'),
  })

  const cancelMutation = useMutation({
    mutationFn: subscriptionService.cancel,
    onSuccess: (data) => { invalidateAll(); setConfirmDialog({ isOpen: false, subscriptionId: null, subscriptionName: null }); toast.success(`"${data.name}" moved to Graveyard.`) },
    onError: (error: any) => toast.error(error.message || 'Failed to cancel'),
  })

  const reactivateMutation = useMutation({
    mutationFn: subscriptionService.reactivate,
    onSuccess: (data) => { invalidateAll(); toast.success(`"${data.name}" restored!`) },
    onError: (error: any) => toast.error(error.message || 'Failed to reactivate'),
  })

  const deleteMutation = useMutation({
    mutationFn: subscriptionService.delete,
    onSuccess: () => { invalidateAll(); setDeleteDialog({ isOpen: false, subscriptionId: null, subscriptionName: null }); toast.success('Deleted permanently.') },
    onError: (error: any) => toast.error(error.message || 'Failed to delete'),
  })

  const handleSubmit = async (data: SubscriptionCreate) => {
    if (editingSubscription) {
      await updateMutation.mutateAsync({ id: editingSubscription.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  const filteredSubscriptions = subscriptions.filter((s) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return s.name.toLowerCase().includes(q) || (s.category && s.category.toLowerCase().includes(q))
  })

  const activeSubs    = allSubscriptions.filter((s) => s.status === 'active')
  const cancelledSubs = allSubscriptions.filter((s) => s.status === 'cancelled')
  const totalMonthlyBurn   = activeSubs.reduce((sum, s) => sum + getMonthlyCost(s), 0)
  const totalMonthlySaved  = cancelledSubs.reduce((sum, s) => sum + getMonthlyCost(s), 0)
  const totalYearlySaved   = Math.round(totalMonthlySaved * 12 * 100) / 100

  const FILTER_TABS = [
    { key: 'active'    as const, label: `Active`,    count: activeSubs.length,        icon: FiCheckCircle, color: 'text-emerald-400' },
    { key: 'cancelled' as const, label: `Graveyard`, count: cancelledSubs.length,     icon: FiXCircle,     color: 'text-rose-400' },
    { key: 'all'       as const, label: `All`,       count: allSubscriptions.length,  icon: FiList,        color: 'text-indigo-400' },
  ]

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <p className="eyebrow mb-1.5">Recurring Expense Manager</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">Subscriptions</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage recurring commitments, monitor costs, and purge zombie expenses
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              try { exportSubscriptionsToCSV(subscriptions); toast.success('CSV exported.') }
              catch (e: any) { toast.error(e.message || 'Export failed') }
            }}
            disabled={subscriptions.length === 0}
            className="btn-outline text-xs py-2 px-3.5 rounded-lg"
          >
            <FiDownload className="w-3.5 h-3.5 shrink-0" />
            Export CSV
          </button>
          <button
            onClick={() => { setEditingSubscription(null); setIsFormOpen(true) }}
            className="btn-primary text-xs py-2 px-4 rounded-lg"
          >
            <FiPlus className="w-3.5 h-3.5 shrink-0" />
            Add Subscription
          </button>
        </div>
      </div>

      {/* Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up delay-75" data-stagger>
        {/* Active */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="h-0.5 bg-indigo-500" />
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Active Subscriptions</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/15 transition-colors">
                <FiLayers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight tabular">{activeSubs.length}</div>
            <p className="text-[11px] text-zinc-500 mt-0.5">of {allSubscriptions.length} total tracked</p>
          </div>
        </div>

        {/* Burn */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="h-0.5 bg-brand-500" />
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Monthly Burn</span>
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center group-hover:bg-rose-500/15 transition-colors">
                <FiDollarSign className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight tabular">
              ${totalMonthlyBurn.toFixed(2)}
              <span className="text-xs text-zinc-500 font-normal ml-1">/mo</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Projected ${(totalMonthlyBurn * 12).toFixed(2)}/yr
            </p>
          </div>
        </div>

        {/* Savings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="h-0.5 bg-emerald-500" />
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Graveyard Savings</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors">
                <FiTrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight tabular">
              +${totalMonthlySaved.toFixed(2)}
              <span className="text-xs text-zinc-500 font-normal ml-1">/mo</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              +${totalYearlySaved.toFixed(2)}/yr from {cancelledSubs.length} killed
            </p>
          </div>
        </div>
      </div>

      {/* Filter + Search Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up delay-150">
        {/* Filter tabs */}
        <div className="inline-flex p-1 bg-zinc-950/80 border border-zinc-800 rounded-xl gap-0.5">
          {FILTER_TABS.map(({ key, label, count, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 active:scale-[0.97] ${
                statusFilter === key
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/50'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60'
              }`}
            >
              <Icon className={`w-3 h-3 shrink-0 ${statusFilter === key ? color : ''}`} />
              {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                statusFilter === key ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-800/80 text-zinc-600'
              }`}>{count}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          </div>
          <input
            type="text"
            placeholder="Search by name or category…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-zinc-950/60 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <FiX className="w-3.5 h-3.5 shrink-0" />
            </button>
          )}
        </div>
      </div>

      {/* Cards */}
      <SubscriptionList
        subscriptions={filteredSubscriptions}
        onEdit={(s) => { setEditingSubscription(s); setIsFormOpen(true) }}
        onCancel={(s) => setConfirmDialog({ isOpen: true, subscriptionId: s.id, subscriptionName: s.name })}
        onReactivate={async (s) => { await reactivateMutation.mutateAsync(s.id) }}
        onDelete={(s) => setDeleteDialog({ isOpen: true, subscriptionId: s.id, subscriptionName: s.name })}
        isLoading={isLoading}
      />

      {/* Form Modal */}
      {isFormOpen && (
        <SubscriptionForm
          subscription={editingSubscription}
          onSubmit={handleSubmit}
          onCancel={() => { setIsFormOpen(false); setEditingSubscription(null) }}
        />
      )}

      {/* Cancel Confirm */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, subscriptionId: null, subscriptionName: null })}
        onConfirm={async () => { if (confirmDialog.subscriptionId) await cancelMutation.mutateAsync(confirmDialog.subscriptionId) }}
        title="Send to Graveyard"
        message={`Are you sure you want to cancel "${confirmDialog.subscriptionName}"? It will be moved to the Graveyard and counted as realized savings.`}
        confirmText="Cancel Subscription"
        confirmStyle="danger"
        isLoading={cancelMutation.isPending}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, subscriptionId: null, subscriptionName: null })}
        onConfirm={async () => { if (deleteDialog.subscriptionId) await deleteMutation.mutateAsync(deleteDialog.subscriptionId) }}
        title="Permanently Delete Record"
        message={`Are you sure you want to permanently delete "${deleteDialog.subscriptionName}"? This action cannot be undone.`}
        confirmText="Delete Permanently"
        confirmStyle="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

export default SubscriptionsPage
