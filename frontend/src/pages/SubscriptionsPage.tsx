/**
 * Subscriptions Management Page — Minimal Toggl Style
 * Telemetry, real brand logos, time-usage evaluation, and quick actions
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
  FiClock,
} from 'react-icons/fi'
import { subscriptionService } from '../services/subscriptionService'
import type { Subscription, SubscriptionCreate, SubscriptionStatus } from '../types/subscription'
import SubscriptionList from '../components/subscriptions/SubscriptionList'
import SubscriptionForm from '../components/subscriptions/SubscriptionForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { exportSubscriptionsToCSV } from '../utils/csvExport'
import { getMonthlyCost, getMonthlyHours } from '../utils/calculations'

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
      toast.success(`เพิ่ม "${data.name}" เรียบร้อยแล้ว`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการสร้าง')
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
      toast.success(`อัปเดต "${data.name}" เรียบร้อยแล้ว`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการอัปเดต')
    },
  })

  // Cancel mutation (move to Graveyard)
  const cancelMutation = useMutation({
    mutationFn: subscriptionService.cancel,
    onSuccess: (data) => {
      invalidateAll()
      setConfirmDialog({ isOpen: false, subscriptionId: null, subscriptionName: null })
      toast.success(`"${data.name}" ถูกส่งไปที่ Graveyard แล้ว`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการยกเลิก')
    },
  })

  // Reactivate mutation
  const reactivateMutation = useMutation({
    mutationFn: subscriptionService.reactivate,
    onSuccess: (data) => {
      invalidateAll()
      toast.success(`กู้คืน "${data.name}" กลับมาใช้งานแล้ว`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการกู้คืน')
    },
  })

  // Delete permanently mutation
  const deleteMutation = useMutation({
    mutationFn: subscriptionService.delete,
    onSuccess: () => {
      invalidateAll()
      setDeleteDialog({ isOpen: false, subscriptionId: null, subscriptionName: null })
      toast.success('ลบข้อมูล Subscription ถาวรเรียบร้อย')
    },
    onError: (error: any) => {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการลบ')
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

  const totalMonthlyHours = activeSubs.reduce((sum, s) => sum + getMonthlyHours(s), 0)

  const totalMonthlySaved = cancelledSubs.reduce((sum, s) => sum + getMonthlyCost(s), 0)
  const totalYearlySaved = Math.round(totalMonthlySaved * 12 * 100) / 100

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2D2D2D]">
            Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-[#757575] mt-1 font-medium">
            จัดการรายการค่าบริการรายเดือนและตรวจสอบชั่วโมงการใช้งาน
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              try {
                exportSubscriptionsToCSV(subscriptions)
                toast.success('ส่งออกไฟล์ CSV เรียบร้อยแล้ว')
              } catch (error: any) {
                toast.error(error.message || 'ไม่สามารถส่งออก CSV ได้')
              }
            }}
            disabled={subscriptions.length === 0}
            className="btn-soft text-xs py-2 px-3.5 rounded-xl shadow-xs disabled:opacity-40"
          >
            <FiDownload className="w-3.5 h-3.5 shrink-0" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleAddNew}
            className="btn-berry text-xs py-2 px-4 rounded-xl shadow-xs"
          >
            <FiPlus className="w-3.5 h-3.5 shrink-0" />
            <span>เพิ่ม Subscription</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-minimal p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#757575] uppercase tracking-wider">
              บริการที่ใช้งานอยู่
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#FCE7F3] text-[#B02A82] flex items-center justify-center">
              <FiLayers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <div className="text-2xl font-extrabold text-[#2D2D2D] tracking-tight tabular">
              {activeSubs.length}
            </div>
            <span className="text-xs text-[#8A8A8A]">
              จากทั้งหมด {allSubscriptions.length} บริการ
            </span>
          </div>
          <p className="text-xs text-[#757575] mt-1 flex items-center gap-1">
            <FiClock className="w-3 h-3 text-[#B02A82]" />
            <span>เวลาใช้งานรวม {totalMonthlyHours} ชม./เดือน</span>
          </p>
        </div>

        <div className="card-minimal p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#757575] uppercase tracking-wider">
              ยอดจ่ายรายเดือน (Burn)
            </span>
            <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <FiDollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1">
            <div className="text-2xl font-extrabold text-[#2D2D2D] tracking-tight tabular">
              ${totalMonthlyBurn.toFixed(2)}
            </div>
            <span className="text-xs text-[#8A8A8A]">/เดือน</span>
          </div>
          <p className="text-xs text-[#757575] mt-1">
            ประมาณการ ${totalYearlyCost.toFixed(2)}/ปี
          </p>
        </div>

        <div className="card-minimal p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              เงินที่ประหยัดได้ (Graveyard)
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FiCheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1">
            <div className="text-2xl font-extrabold text-emerald-600 tracking-tight tabular">
              +${totalMonthlySaved.toFixed(2)}
            </div>
            <span className="text-xs text-[#8A8A8A]">/เดือน</span>
          </div>
          <p className="text-xs text-[#757575] mt-1">
            +${totalYearlySaved.toFixed(2)}/ปี จากการยกเลิก {cancelledSubs.length} บริการ
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-minimal p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="inline-flex p-1 bg-[#FFF5F5] border border-[#F0E6E6] rounded-xl gap-1">
          <button
            onClick={() => setStatusFilter('active')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              statusFilter === 'active'
                ? 'bg-white text-[#B02A82] shadow-xs'
                : 'text-[#757575] hover:text-[#2D2D2D]'
            }`}
          >
            <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>ใช้งานอยู่ ({activeSubs.length})</span>
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              statusFilter === 'cancelled'
                ? 'bg-white text-[#B02A82] shadow-xs'
                : 'text-[#757575] hover:text-[#2D2D2D]'
            }`}
          >
            <FiXCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Graveyard ({cancelledSubs.length})</span>
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-[#B02A82] shadow-xs'
                : 'text-[#757575] hover:text-[#2D2D2D]'
            }`}
          >
            <FiList className="w-3.5 h-3.5 text-indigo-600" />
            <span>ทั้งหมด ({allSubscriptions.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A8A8A]">
            <FiSearch className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="ค้นหาบริการหรือหมวดหมู่..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white border border-[#F0E6E6] rounded-xl text-xs text-[#2D2D2D] placeholder-[#A09898] focus:outline-none focus:border-[#B02A82] focus:ring-2 focus:ring-[#B02A82]/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
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
        onAddNew={handleAddNew}
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
        title="ย้ายไปที่ Graveyard (ยกเลิกบริการ)"
        message={`คุณแน่ใจหรือไม่ว่าต้องการยกเลิก "${confirmDialog.subscriptionName}"? บริการนี้จะถูกย้ายไปที่สุสาน Graveyard และนับเป็นเงินที่ประหยัดได้`}
        confirmText="ยกเลิกบริการ (ส่งไปสุสาน)"
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
        title="ลบข้อมูลถาวร"
        message={`คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูล "${deleteDialog.subscriptionName}" อย่างถาวร? การกระทำนี้ไม่สามารถย้อนกลับได้`}
        confirmText="ลบถาวร"
        confirmStyle="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

export default SubscriptionsPage
