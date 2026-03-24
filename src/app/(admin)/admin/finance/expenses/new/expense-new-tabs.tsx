'use client'

import { useState, useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ReceiptUploader, { type ScanResult } from '@/components/organisms/ReceiptUploader'
import ScanResultForm from '@/components/organisms/ScanResultForm'
import { createExpense } from '@/app/actions/finance'
import { EXPENSE_CATEGORY_LABELS } from '@/lib/constants/finance'

// ─── 수동 입력 폼 ─────────────────────────────────────

const ManualExpenseForm = () => {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createExpense, null)

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message)
      router.push('/admin/finance/expenses')
    }
  }, [state, router])

  // 오늘 날짜를 기본값으로
  const today = new Date().toISOString().slice(0, 10)

  return (
    <form action={formAction} className="space-y-4">
      {state && !state.success && !state.fieldErrors && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.message}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* 날짜 */}
        <div className="space-y-1.5">
          <Label htmlFor="manual-date">날짜 *</Label>
          <Input id="manual-date" name="date" type="date" defaultValue={today} required />
          {state?.fieldErrors?.date && (
            <p className="text-xs text-red-500">{state.fieldErrors.date}</p>
          )}
        </div>

        {/* 카테고리 */}
        <div className="space-y-1.5">
          <Label>카테고리 *</Label>
          <Select name="category" defaultValue="OTHER">
            <SelectTrigger>
              <SelectValue placeholder="선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(EXPENSE_CATEGORY_LABELS) as [string, string][]).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state?.fieldErrors?.category && (
            <p className="text-xs text-red-500">{state.fieldErrors.category}</p>
          )}
        </div>
      </div>

      {/* 항목명 */}
      <div className="space-y-1.5">
        <Label htmlFor="manual-description">항목명 *</Label>
        <Input
          id="manual-description"
          name="description"
          placeholder="지출 항목을 입력하세요"
          required
        />
        {state?.fieldErrors?.description && (
          <p className="text-xs text-red-500">{state.fieldErrors.description}</p>
        )}
      </div>

      {/* 금액 */}
      <div className="space-y-1.5">
        <Label htmlFor="manual-amount">금액 (원) *</Label>
        <Input
          id="manual-amount"
          name="amount"
          type="number"
          placeholder="0"
          min={1}
          required
        />
        {state?.fieldErrors?.amount && (
          <p className="text-xs text-red-500">{state.fieldErrors.amount}</p>
        )}
      </div>

      {/* 메모 */}
      <div className="space-y-1.5">
        <Label htmlFor="manual-note">메모</Label>
        <Textarea id="manual-note" name="note" placeholder="추가 정보 (선택)" rows={3} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/finance/expenses')}
          disabled={isPending}
        >
          취소
        </Button>
        <Button type="submit" disabled={isPending} className="bg-peace-navy hover:bg-peace-navy/90">
          {isPending ? '저장 중...' : '지출 등록'}
        </Button>
      </div>
    </form>
  )
}

// ─── 탭 조합 컴포넌트 ─────────────────────────────────

const ExpenseNewTabs = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)

  return (
    <Tabs defaultValue="scan">
      <TabsList className="w-full">
        <TabsTrigger value="scan" className="flex-1">영수증 스캔</TabsTrigger>
        <TabsTrigger value="manual" className="flex-1">수동 입력</TabsTrigger>
      </TabsList>

      {/* 영수증 스캔 탭 */}
      <TabsContent value="scan">
        <Card>
          <CardContent className="pt-6">
            {scanResult === null ? (
              <ReceiptUploader
                onScanComplete={setScanResult}
                onError={() => setScanResult(null)}
              />
            ) : (
              <ScanResultForm
                scanResult={scanResult}
                onReset={() => setScanResult(null)}
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* 수동 입력 탭 */}
      <TabsContent value="manual">
        <Card>
          <CardContent className="pt-6">
            <ManualExpenseForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default ExpenseNewTabs
