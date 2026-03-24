'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { expenseSchema, updateExpenseSchema, budgetSchema, reportSchema } from '@/lib/validations/finance'
import { deleteReceipt } from '@/lib/supabase/storage'

export type ExpenseActionResult = {
  success: boolean
  message: string
  fieldErrors?: Record<string, string>
  expenseId?: string
  count?: number
}

export type BudgetActionResult = {
  success: boolean
  message: string
  fieldErrors?: Record<string, string>
}

export type ReportActionResult = {
  success: boolean
  message: string
}

const EXPENSES_PATH = '/admin/finance/expenses'
const BUDGET_PATH = '/admin/finance/budget'
const REPORTS_PATH = '/admin/finance/reports'

// ─── 헬퍼 ────────────────────────────────────────────

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login')
  }
  return session
}

function parseFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {}
  for (const issue of issues) {
    const key = issue.path[0]
    if (typeof key === 'string' && !fieldErrors[key]) {
      fieldErrors[key] = issue.message
    }
  }
  return fieldErrors
}

// ─── 지출 등록 ────────────────────────────────────────

export async function createExpense(
  _prev: ExpenseActionResult | null,
  formData: FormData,
): Promise<ExpenseActionResult> {
  await requireAdmin()

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

  const parsed = expenseSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: '입력 정보를 확인해 주세요',
      fieldErrors: parseFieldErrors(parsed.error.issues),
    }
  }

  const { date, description, category, amount, receipt, ocrConfidence, ocrRawText, note } =
    parsed.data

  try {
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

    revalidatePath(EXPENSES_PATH)
    return { success: true, message: '지출이 등록되었습니다', expenseId: expense.id }
  } catch (error: unknown) {
    console.error('[Finance] createExpense failed:', error)
    return { success: false, message: '저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }
  }
}

// ─── 지출 수정 ────────────────────────────────────────

export async function updateExpense(
  expenseId: string,
  _prev: ExpenseActionResult | null,
  formData: FormData,
): Promise<ExpenseActionResult> {
  await requireAdmin()

  const existing = await prisma.expense.findUnique({ where: { id: expenseId } })
  if (!existing) {
    return { success: false, message: '지출 항목을 찾을 수 없습니다' }
  }

  const amountRaw = formData.get('amount')

  const raw = {
    date: formData.get('date'),
    description: formData.get('description'),
    category: formData.get('category'),
    amount: amountRaw ? Number(amountRaw) : undefined,
    note: formData.get('note') || undefined,
  }

  const parsed = updateExpenseSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: '입력 정보를 확인해 주세요',
      fieldErrors: parseFieldErrors(parsed.error.issues),
    }
  }

  try {
    await prisma.expense.update({
      where: { id: expenseId },
      data: {
        date: parsed.data.date,
        description: parsed.data.description,
        category: parsed.data.category,
        amount: parsed.data.amount,
        note: parsed.data.note || null,
      },
    })

    revalidatePath(EXPENSES_PATH)
    return { success: true, message: '지출이 수정되었습니다', expenseId }
  } catch (error: unknown) {
    console.error('[Finance] updateExpense failed:', error)
    return { success: false, message: '수정 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }
  }
}

// ─── 지출 삭제 ────────────────────────────────────────

export async function deleteExpense(expenseId: string): Promise<ExpenseActionResult> {
  await requireAdmin()

  const existing = await prisma.expense.findUnique({ where: { id: expenseId } })
  if (!existing) {
    return { success: false, message: '지출 항목을 찾을 수 없습니다' }
  }

  try {
    await prisma.expense.delete({ where: { id: expenseId } })

    // Supabase Storage 영수증 파일 정리
    if (existing.receipt) {
      try {
        await deleteReceipt(existing.receipt)
      } catch {
        console.warn('[Finance] deleteReceipt failed (non-critical):', existing.receipt)
      }
    }

    revalidatePath(EXPENSES_PATH)
    return { success: true, message: '지출이 삭제되었습니다' }
  } catch (error: unknown) {
    console.error('[Finance] deleteExpense failed:', error)
    return { success: false, message: '삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }
  }
}

// ─── 일괄 확인 (PENDING_REVIEW → CONFIRMED) ───────────

export async function bulkConfirmExpenses(ids: string[]): Promise<ExpenseActionResult> {
  await requireAdmin()

  if (ids.length === 0) {
    return { success: false, message: '선택된 항목이 없습니다' }
  }

  try {
    const result = await prisma.expense.updateMany({
      where: { id: { in: ids }, status: 'PENDING_REVIEW' },
      data: { status: 'CONFIRMED' },
    })

    revalidatePath(EXPENSES_PATH)
    return {
      success: true,
      message: `${result.count}건이 확정 처리되었습니다`,
      count: result.count,
    }
  } catch (error: unknown) {
    console.error('[Finance] bulkConfirmExpenses failed:', error)
    return { success: false, message: '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }
  }
}

// ─── 예산 등록/수정 (upsert) ──────────────────────────

export async function upsertBudget(
  _prev: BudgetActionResult | null,
  formData: FormData,
): Promise<BudgetActionResult> {
  await requireAdmin()

  const raw = {
    year: Number(formData.get('year')),
    category: formData.get('category'),
    amount: Number(formData.get('amount')),
  }

  const parsed = budgetSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: '입력 정보를 확인해 주세요',
      fieldErrors: parseFieldErrors(parsed.error.issues),
    }
  }

  try {
    await prisma.budgetItem.upsert({
      where: {
        year_category: {
          year: parsed.data.year,
          category: parsed.data.category,
        },
      },
      create: parsed.data,
      update: { amount: parsed.data.amount },
    })

    revalidatePath(BUDGET_PATH)
    return { success: true, message: '예산이 저장되었습니다' }
  } catch (error: unknown) {
    console.error('[Finance] upsertBudget failed:', error)
    return { success: false, message: '저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }
  }
}

// ─── 예산 삭제 ─────────────────────────────────────────

export async function deleteBudget(budgetId: string): Promise<BudgetActionResult> {
  await requireAdmin()

  try {
    await prisma.budgetItem.delete({ where: { id: budgetId } })
    revalidatePath(BUDGET_PATH)
    return { success: true, message: '예산이 삭제되었습니다' }
  } catch (error: unknown) {
    console.error('[Finance] deleteBudget failed:', error)
    return { success: false, message: '삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }
  }
}

// ─── 결산 보고서 생성/갱신 ────────────────────────────

export async function generateReport(year: number): Promise<ReportActionResult> {
  await requireAdmin()

  const parsed = reportSchema.shape.year.safeParse(year)
  if (!parsed.success) {
    return { success: false, message: '유효하지 않은 연도입니다' }
  }

  const yearStart = new Date(`${year}-01-01`)
  const yearEnd = new Date(`${year + 1}-01-01`)

  try {
    const [incomeAgg, expenseAgg] = await Promise.all([
      prisma.donation.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: yearStart, lt: yearEnd },
        },
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: {
          status: 'CONFIRMED',
          date: { gte: yearStart, lt: yearEnd },
        },
        _sum: { amount: true },
      }),
    ])

    const totalIncome = incomeAgg._sum.amount ?? 0
    const totalExpense = expenseAgg._sum.amount ?? 0

    await prisma.financeReport.upsert({
      where: { year },
      create: { year, totalIncome, totalExpense },
      update: { totalIncome, totalExpense },
    })

    revalidatePath(REPORTS_PATH)
    return {
      success: true,
      message: `${year}년 결산 보고서가 생성되었습니다 (수입 ${totalIncome.toLocaleString('ko-KR')}원 / 지출 ${totalExpense.toLocaleString('ko-KR')}원)`,
    }
  } catch (error: unknown) {
    console.error('[Finance] generateReport failed:', error)
    return { success: false, message: '보고서 생성 중 오류가 발생했습니다' }
  }
}

// ─── 결산 보고서 공개/비공개 토글 ──────────────────────

export async function toggleReportPublish(reportId: string): Promise<ReportActionResult> {
  await requireAdmin()

  try {
    const report = await prisma.financeReport.findUnique({ where: { id: reportId } })
    if (!report) {
      return { success: false, message: '보고서를 찾을 수 없습니다' }
    }

    await prisma.financeReport.update({
      where: { id: reportId },
      data: { isPublished: !report.isPublished },
    })

    revalidatePath(REPORTS_PATH)
    return {
      success: true,
      message: report.isPublished ? '비공개로 전환되었습니다' : '공개로 전환되었습니다',
    }
  } catch (error: unknown) {
    console.error('[Finance] toggleReportPublish failed:', error)
    return { success: false, message: '상태 변경 중 오류가 발생했습니다' }
  }
}

// ─── 결산 보고서 PDF URL 저장 ─────────────────────────

export async function updateReportPdfUrl(
  reportId: string,
  pdfUrl: string,
): Promise<ReportActionResult> {
  await requireAdmin()

  // URL 형식 검증 (빈 문자열은 삭제로 허용)
  if (pdfUrl) {
    const parsed = reportSchema.shape.pdfUrl.safeParse(pdfUrl)
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? '올바른 URL 형식이 아닙니다 (https://...)' }
    }
  }

  try {
    const report = await prisma.financeReport.findUnique({ where: { id: reportId } })
    if (!report) {
      return { success: false, message: '보고서를 찾을 수 없습니다' }
    }

    await prisma.financeReport.update({
      where: { id: reportId },
      data: { pdfUrl: pdfUrl || null },
    })

    revalidatePath(REPORTS_PATH)
    return { success: true, message: 'PDF URL이 저장되었습니다' }
  } catch (error: unknown) {
    console.error('[Finance] updateReportPdfUrl failed:', error)
    return { success: false, message: 'PDF URL 저장 중 오류가 발생했습니다' }
  }
}

// ─── 결산 보고서 삭제 ─────────────────────────────────

export async function deleteReport(reportId: string): Promise<ReportActionResult> {
  await requireAdmin()

  try {
    await prisma.financeReport.delete({ where: { id: reportId } })
    revalidatePath(REPORTS_PATH)
    return { success: true, message: '보고서가 삭제되었습니다' }
  } catch (error: unknown) {
    console.error('[Finance] deleteReport failed:', error)
    return { success: false, message: '삭제 중 오류가 발생했습니다' }
  }
}
