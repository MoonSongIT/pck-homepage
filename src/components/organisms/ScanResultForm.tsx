'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, AlertCircle, RotateCcw, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createExpense } from '@/app/actions/finance'
import { EXPENSE_CATEGORY_LABELS } from '@/lib/constants/finance'
import type { ScanResult } from '@/components/organisms/ReceiptUploader'

// ─── 타입 ───────────────────────────────────────────────

type Props = {
  scanResult: ScanResult
  onReset: () => void
}

// ─── 신뢰도 뱃지 ────────────────────────────────────────

const ConfidenceBadge = ({ confidence }: { confidence: number }) => {
  if (confidence >= 0.85) {
    return (
      <Badge className="gap-1 bg-peace-olive/15 text-peace-olive hover:bg-peace-olive/15">
        <CheckCircle className="h-3 w-3" />
        높음 ({Math.round(confidence * 100)}%)
      </Badge>
    )
  }
  if (confidence >= 0.6) {
    return (
      <Badge className="gap-1 bg-peace-gold/15 text-peace-gold hover:bg-peace-gold/15">
        <AlertCircle className="h-3 w-3" />
        보통 ({Math.round(confidence * 100)}%) — 확인 권장
      </Badge>
    )
  }
  return (
    <Badge className="gap-1 bg-peace-orange/15 text-peace-orange hover:bg-peace-orange/15">
      <AlertCircle className="h-3 w-3" />
      낮음 ({Math.round(confidence * 100)}%) — 수동 확인 필요
    </Badge>
  )
}

// ─── 폼 컴포넌트 ─────────────────────────────────────────

const ScanResultForm = ({ scanResult, onReset }: Props) => {
  const router = useRouter()
  const { receiptUrl, ocr } = scanResult
  const [state, formAction, isPending] = useActionState(createExpense, null)

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message)
      router.push('/admin/finance/expenses')
    }
  }, [state, router])

  // OcrResult에서 date (string | null) → input value용 변환
  const defaultDate = ocr.date ?? ''
  // amount (number | null) → string
  const defaultAmount = ocr.amount !== null ? String(ocr.amount) : ''

  return (
    <div className="space-y-6">
      {/* 헤더: 신뢰도 + 돌아가기 */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">OCR 분석 결과</p>
          <ConfidenceBadge confidence={ocr.confidence} />
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          다시 스캔
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 영수증 미리보기 */}
        <div className="space-y-2">
          <Label>영수증 이미지</Label>
          <div className="overflow-hidden rounded-lg border bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={receiptUrl}
              alt="업로드된 영수증"
              className="h-48 w-full object-contain p-2"
            />
          </div>
          <a
            href={receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-peace-sky hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            새 탭에서 열기
          </a>
        </div>

        {/* OCR 원문 */}
        {ocr.note && (
          <div className="space-y-2">
            <Label>OCR 추출 원문</Label>
            <div className="h-48 overflow-auto rounded-lg border bg-gray-50 p-3 text-xs text-gray-600 whitespace-pre-wrap">
              {ocr.note}
            </div>
          </div>
        )}
      </div>

      {/* 서버 에러 */}
      {state && !state.success && !state.fieldErrors && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.message}
        </p>
      )}

      <form action={formAction} className="space-y-4">
        {/* Hidden 필드 */}
        <input type="hidden" name="receipt" value={receiptUrl} />
        <input type="hidden" name="ocrConfidence" value={String(ocr.confidence)} />
        {ocr.note && <input type="hidden" name="ocrRawText" value={ocr.note} />}

        <div className="grid gap-4 sm:grid-cols-2">
          {/* 날짜 */}
          <div className="space-y-1.5">
            <Label htmlFor="date">날짜 *</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={defaultDate}
              required
            />
            {state?.fieldErrors?.date && (
              <p className="text-xs text-red-500">{state.fieldErrors.date}</p>
            )}
          </div>

          {/* 카테고리 */}
          <div className="space-y-1.5">
            <Label htmlFor="category">카테고리 *</Label>
            <Select name="category" defaultValue={ocr.category}>
              <SelectTrigger id="category">
                <SelectValue placeholder="선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(EXPENSE_CATEGORY_LABELS) as [string, string][]).map(
                  ([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
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
          <Label htmlFor="description">항목명 *</Label>
          <Input
            id="description"
            name="description"
            defaultValue={ocr.description}
            placeholder="지출 항목을 입력하세요"
            required
          />
          {state?.fieldErrors?.description && (
            <p className="text-xs text-red-500">{state.fieldErrors.description}</p>
          )}
        </div>

        {/* 금액 */}
        <div className="space-y-1.5">
          <Label htmlFor="amount">금액 (원) *</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            defaultValue={defaultAmount}
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
          <Label htmlFor="note">메모</Label>
          <Textarea
            id="note"
            name="note"
            defaultValue={ocr.note ?? ''}
            placeholder="추가 정보를 입력하세요 (선택)"
            rows={3}
          />
          {state?.fieldErrors?.note && (
            <p className="text-xs text-red-500">{state.fieldErrors.note}</p>
          )}
        </div>

        {/* 제출 */}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onReset} disabled={isPending}>
            취소
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-peace-navy hover:bg-peace-navy/90"
          >
            {isPending ? '저장 중...' : '지출 등록'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ScanResultForm
