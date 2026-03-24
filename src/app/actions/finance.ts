'use server'

import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { expenseSchema } from '@/lib/validations/finance'

export type ExpenseActionResult = {
  success: boolean
  message: string
  fieldErrors?: Record<string, string>
  expenseId?: string
}

export async function createExpense(
  _prev: ExpenseActionResult | null,
  formData: FormData,
): Promise<ExpenseActionResult> {
  // 1) ADMIN 권한 재검증
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // 2) FormData 추출
  const amountRaw = formData.get('amount')
  const ocrConfidenceRaw = formData.get('ocrConfidence')

  const raw = {
    date: formData.get('date'),
    description: formData.get('description'),
    category: formData.get('category'),
    amount: amountRaw ? Number(amountRaw) : undefined,
    receipt: formData.get('receipt') || undefined,
    ocrConfidence: ocrConfidenceRaw ? Number(ocrConfidenceRaw) : undefined,
    ocrRawText: formData.get('ocrRawText') || undefined,
    note: formData.get('note') || undefined,
  }

  // 3) Zod 서버 재검증
  const parsed = expenseSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === 'string' && !fieldErrors[key]) {
        fieldErrors[key] = issue.message
      }
    }
    return { success: false, message: '입력 정보를 확인해 주세요', fieldErrors }
  }

  const { date, description, category, amount, receipt, ocrConfidence, ocrRawText, note } =
    parsed.data

  try {
    // 4) DB 저장 — OCR 경로면 PENDING_REVIEW, 수동 입력이면 CONFIRMED
    const status = ocrConfidence !== undefined ? 'PENDING_REVIEW' : 'CONFIRMED'

    const expense = await prisma.expense.create({
      data: {
        date,
        description,
        category,
        amount,
        receipt: receipt || null,
        ocrConfidence: ocrConfidence ?? null,
        ocrRawText: ocrRawText || null,
        status,
        note: note || null,
      },
    })

    return { success: true, message: '지출이 등록되었습니다', expenseId: expense.id }
  } catch (error: unknown) {
    console.error('[Finance] createExpense failed:', error)
    return {
      success: false,
      message: '저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    }
  }
}
