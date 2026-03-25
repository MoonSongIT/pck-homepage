'use client'

import { useState, useTransition } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BudgetEditDialog } from '@/components/organisms/BudgetEditDialog'
import { deleteBudget } from '@/app/actions/finance'

// ─── 타입 ──────────────────────────────────────────────

export interface BudgetRow {
  category: string
  categoryLabel: string
  categoryColor: string
  budgetId: string | null
  budgetAmount: number
  actualAmount: number
}

interface Props {
  year: number
  rows: BudgetRow[]
}

// ─── 유틸 ──────────────────────────────────────────────

const formatKRW = (n: number) => n.toLocaleString('ko-KR') + '원'

const usageRate = (actual: number, budget: number) =>
  budget > 0 ? Math.min(Math.round((actual / budget) * 100), 100) : 0

// ─── 컴포넌트 ──────────────────────────────────────────

export const BudgetTable = ({ year, rows }: Props) => {
  const [editTarget, setEditTarget] = useState<BudgetRow | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!deleteTargetId) return
    startTransition(async () => {
      const result = await deleteBudget(deleteTargetId)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
      setDeleteTargetId(null)
    })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-[var(--peace-navy)] hover:bg-[var(--peace-navy)]">
            <TableHead className="text-white">카테고리</TableHead>
            <TableHead className="text-right text-white">예산</TableHead>
            <TableHead className="text-right text-white">집행</TableHead>
            <TableHead className="text-right text-white">잔여</TableHead>
            <TableHead className="w-40 text-white">집행률</TableHead>
            <TableHead className="w-20 text-center text-white">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const rate = usageRate(row.actualAmount, row.budgetAmount)
            const remaining = row.budgetAmount - row.actualAmount
            const isOver = remaining < 0

            return (
              <TableRow key={row.category}>
                {/* 카테고리 */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: row.categoryColor }}
                    />
                    <span className="font-medium">{row.categoryLabel}</span>
                  </div>
                </TableCell>

                {/* 예산 */}
                <TableCell className="text-right">
                  {row.budgetAmount > 0 ? (
                    formatKRW(row.budgetAmount)
                  ) : (
                    <span className="text-muted-foreground text-sm">미설정</span>
                  )}
                </TableCell>

                {/* 집행 */}
                <TableCell className="text-right font-medium">
                  {formatKRW(row.actualAmount)}
                </TableCell>

                {/* 잔여 */}
                <TableCell className={`text-right ${isOver ? 'text-destructive font-semibold' : ''}`}>
                  {row.budgetAmount > 0 ? (
                    <>
                      {isOver && '▲ '}
                      {formatKRW(Math.abs(remaining))}
                      {isOver && <span className="ml-1 text-xs">(초과)</span>}
                    </>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>

                {/* 집행률 + 프로그레스바 */}
                <TableCell>
                  {row.budgetAmount > 0 ? (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{rate}%</span>
                      </div>
                      <Progress
                        value={rate}
                        className="h-2"
                        style={
                          {
                            '--progress-color': isOver ? '#ef4444' : row.categoryColor,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>

                {/* 관리 버튼 */}
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      title="예산 수정"
                      onClick={() => setEditTarget(row)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    {row.budgetId && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        title="예산 삭제"
                        onClick={() => setDeleteTargetId(row.budgetId!)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* 수정 다이얼로그 */}
      {editTarget && (
        <BudgetEditDialog
          year={year}
          category={editTarget.category}
          categoryLabel={editTarget.categoryLabel}
          currentAmount={editTarget.budgetAmount}
          open={!!editTarget}
          onOpenChange={(open) => { if (!open) setEditTarget(null) }}
        />
      )}

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => { if (!open) setDeleteTargetId(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>예산 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 카테고리의 예산 설정을 삭제합니다. 실제 지출 데이터는 유지됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
