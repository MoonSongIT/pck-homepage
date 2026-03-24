'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { upsertBudget } from '@/app/actions/finance'

// ─── 타입 ──────────────────────────────────────────────

interface Props {
  year: number
  category: string
  categoryLabel: string
  currentAmount: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ─── 컴포넌트 ──────────────────────────────────────────

export const BudgetEditDialog = ({
  year,
  category,
  categoryLabel,
  currentAmount,
  open,
  onOpenChange,
}: Props) => {
  const [state, action, isPending] = useActionState(upsertBudget, null)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success(state.message)
      onOpenChange(false)
    } else {
      toast.error(state.message)
    }
  }, [state, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {year}년 {categoryLabel} 예산 설정
          </DialogTitle>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <input type="hidden" name="year" value={year} />
          <input type="hidden" name="category" value={category} />

          <div className="space-y-1.5">
            <Label htmlFor="budget-amount">예산 금액 (원)</Label>
            <Input
              id="budget-amount"
              name="amount"
              type="number"
              min={1}
              defaultValue={currentAmount || ''}
              placeholder="예: 1000000"
              required
            />
            {state?.fieldErrors?.amount && (
              <p className="text-sm text-destructive">{state.fieldErrors.amount}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[var(--peace-navy)] text-white hover:bg-[var(--peace-navy)]/90"
            >
              {isPending ? '저장 중...' : '저장'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
