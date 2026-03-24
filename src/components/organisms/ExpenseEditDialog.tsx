'use client'

import { useActionState, useEffect } from 'react'
import { ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateExpense } from '@/app/actions/finance'
import { EXPENSE_CATEGORY_LABELS } from '@/lib/constants/finance'

// ─── 타입 ───────────────────────────────────────────────

export type ExpenseRow = {
  id: string
  date: string        // ISO string
  description: string
  category: string
  amount: number
  status: string
  receipt: string | null
  ocrConfidence: number | null
  note: string | null
}

type Props = {
  expense: ExpenseRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ─── 컴포넌트 ───────────────────────────────────────────

const ExpenseEditDialog = ({ expense, open, onOpenChange }: Props) => {
  const boundAction = expense ? updateExpense.bind(null, expense.id) : updateExpense.bind(null, '')
  const [state, formAction, isPending] = useActionState(boundAction, null)

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message)
      onOpenChange(false)
    }
  }, [state, onOpenChange])

  if (!expense) return null

  // ISO → input[type=date] 형식 (YYYY-MM-DD)
  const dateValue = expense.date.slice(0, 10)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>지출 수정</DialogTitle>
        </DialogHeader>

        {state && !state.success && !state.fieldErrors && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.message}</p>
        )}

        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* 날짜 */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-date">날짜 *</Label>
              <Input id="edit-date" name="date" type="date" defaultValue={dateValue} required />
              {state?.fieldErrors?.date && (
                <p className="text-xs text-red-500">{state.fieldErrors.date}</p>
              )}
            </div>

            {/* 카테고리 */}
            <div className="space-y-1.5">
              <Label>카테고리 *</Label>
              <Select name="category" defaultValue={expense.category}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(EXPENSE_CATEGORY_LABELS) as [string, string][]).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              {state?.fieldErrors?.category && (
                <p className="text-xs text-red-500">{state.fieldErrors.category}</p>
              )}
            </div>
          </div>

          {/* 항목명 */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-description">항목명 *</Label>
            <Input
              id="edit-description"
              name="description"
              defaultValue={expense.description}
              required
            />
            {state?.fieldErrors?.description && (
              <p className="text-xs text-red-500">{state.fieldErrors.description}</p>
            )}
          </div>

          {/* 금액 */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-amount">금액 (원) *</Label>
            <Input
              id="edit-amount"
              name="amount"
              type="number"
              defaultValue={String(expense.amount)}
              min={1}
              required
            />
            {state?.fieldErrors?.amount && (
              <p className="text-xs text-red-500">{state.fieldErrors.amount}</p>
            )}
          </div>

          {/* 메모 */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-note">메모</Label>
            <Textarea
              id="edit-note"
              name="note"
              defaultValue={expense.note ?? ''}
              rows={2}
            />
          </div>

          {/* 영수증 링크 (읽기 전용) */}
          {expense.receipt && (
            <div className="space-y-1.5">
              <Label>영수증</Label>
              <a
                href={expense.receipt}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-peace-sky hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                영수증 보기
              </a>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              취소
            </Button>
            <Button type="submit" disabled={isPending} className="bg-peace-navy hover:bg-peace-navy/90">
              {isPending ? '저장 중...' : '저장'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ExpenseEditDialog
