'use client'

import { useState, useTransition } from 'react'
import { Pencil, Trash2, Receipt, ExternalLink, CheckCheck } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import ExpenseEditDialog, { type ExpenseRow } from '@/components/organisms/ExpenseEditDialog'
import { deleteExpense, bulkConfirmExpenses } from '@/app/actions/finance'
import { EXPENSE_CATEGORY_LABELS, EXPENSE_STATUS } from '@/lib/constants/finance'

// ─── 타입 ───────────────────────────────────────────────

type Props = {
  expenses: ExpenseRow[]
}

// ─── 날짜 포맷 ───────────────────────────────────────────

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

// ─── 컴포넌트 ───────────────────────────────────────────

const ExpenseTable = ({ expenses }: Props) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<ExpenseRow | null>(null)
  const [isPending, startTransition] = useTransition()

  const pendingRows = expenses.filter((e) => e.status === 'PENDING_REVIEW')
  const allPendingSelected =
    pendingRows.length > 0 && pendingRows.every((e) => selectedIds.has(e.id))

  const toggleSelectAll = () => {
    if (allPendingSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(pendingRows.map((e) => e.id)))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleBulkConfirm = () => {
    const ids = Array.from(selectedIds)
    startTransition(async () => {
      const result = await bulkConfirmExpenses(ids)
      if (result.success) {
        toast.success(result.message)
        setSelectedIds(new Set())
      } else {
        toast.error(result.message)
      }
    })
  }

  const handleDelete = () => {
    if (!deleteTargetId) return
    const id = deleteTargetId
    setDeleteTargetId(null)
    startTransition(async () => {
      const result = await deleteExpense(id)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  // 빈 상태
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-gray-50 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <Receipt className="h-7 w-7 text-gray-400" />
        </div>
        <p className="font-medium text-gray-700">등록된 지출이 없습니다</p>
        <p className="text-sm text-gray-500">필터를 변경하거나 새 지출을 등록해 보세요</p>
      </div>
    )
  }

  return (
    <>
      {/* 일괄 확인 바 */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-peace-gold/30 bg-peace-gold/5 px-4 py-2.5">
          <span className="text-sm text-peace-gold">
            {selectedIds.size}건 선택됨
          </span>
          <Button
            size="sm"
            onClick={handleBulkConfirm}
            disabled={isPending}
            className="h-8 gap-1.5 bg-peace-gold text-white hover:bg-peace-gold/90"
          >
            <CheckCheck className="h-4 w-4" />
            {isPending ? '처리 중...' : `일괄 확인 (${selectedIds.size}건)`}
          </Button>
        </div>
      )}

      {/* 테이블 */}
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-10">
                <Checkbox
                  checked={allPendingSelected && pendingRows.length > 0}
                  onCheckedChange={toggleSelectAll}
                  disabled={pendingRows.length === 0}
                  aria-label="PENDING_REVIEW 전체 선택"
                />
              </TableHead>
              <TableHead className="w-28">날짜</TableHead>
              <TableHead>항목명</TableHead>
              <TableHead className="w-24">카테고리</TableHead>
              <TableHead className="w-28 text-right">금액</TableHead>
              <TableHead className="w-24">상태</TableHead>
              <TableHead className="w-16 text-center">신뢰도</TableHead>
              <TableHead className="w-12 text-center">영수증</TableHead>
              <TableHead className="w-20 text-center">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => {
              const isPending = expense.status === 'PENDING_REVIEW'
              const statusInfo = EXPENSE_STATUS[expense.status as keyof typeof EXPENSE_STATUS]
              const categoryLabel =
                EXPENSE_CATEGORY_LABELS[expense.category as keyof typeof EXPENSE_CATEGORY_LABELS] ??
                expense.category

              return (
                <TableRow key={expense.id} className={isPending ? 'bg-peace-gold/3' : undefined}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(expense.id)}
                      onCheckedChange={() => toggleSelect(expense.id)}
                      disabled={!isPending}
                      aria-label={`${expense.description} 선택`}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(expense.date)}
                  </TableCell>
                  <TableCell className="font-medium text-peace-navy">
                    {expense.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {categoryLabel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {expense.amount.toLocaleString()}원
                  </TableCell>
                  <TableCell>
                    {statusInfo && (
                      <Badge className={`text-xs ${statusInfo.color} hover:${statusInfo.color}`}>
                        {statusInfo.label}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-500">
                    {expense.ocrConfidence !== null
                      ? `${Math.round(expense.ocrConfidence * 100)}%`
                      : '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    {expense.receipt ? (
                      <a
                        href={expense.receipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-7 w-7 items-center justify-center rounded text-peace-sky hover:bg-peace-sky/10"
                        aria-label="영수증 보기"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-peace-navy"
                        onClick={() => setEditTarget(expense)}
                        aria-label="수정"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-red-500"
                        onClick={() => setDeleteTargetId(expense.id)}
                        aria-label="삭제"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* 수정 다이얼로그 */}
      <ExpenseEditDialog
        expense={editTarget}
        open={editTarget !== null}
        onOpenChange={(open) => { if (!open) setEditTarget(null) }}
      />

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteTargetId !== null} onOpenChange={(open) => { if (!open) setDeleteTargetId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>지출 항목 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 지출 항목을 삭제하면 영수증 파일도 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ExpenseTable
