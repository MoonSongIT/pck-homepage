import { z } from 'zod/v4'

// ─── 카테고리 enum ──────────────────────────────────────

const expenseCategoryEnum = z.enum([
  'PERSONNEL',
  'OFFICE',
  'EVENT',
  'TRANSPORT',
  'OTHER',
])

// ─── 지출 스키마 ────────────────────────────────────────

export const expenseSchema = z.object({
  date: z.coerce.date(),
  description: z
    .string()
    .min(2, '항목명은 2자 이상이어야 합니다')
    .max(200, '항목명은 200자 이하여야 합니다'),
  category: expenseCategoryEnum,
  amount: z.number().int().positive('금액은 0보다 커야 합니다'),
  receipt: z.string().url('올바른 URL 형식이 아닙니다').optional(),
  ocrConfidence: z.number().min(0).max(1).optional(),
  ocrRawText: z.string().max(2000).optional(),
  note: z.string().max(500).optional(),
})

export type ExpenseInput = z.infer<typeof expenseSchema>

// ─── 지출 수정 스키마 (OCR 필드 제외) ────────────────────

export const updateExpenseSchema = z.object({
  date: z.coerce.date(),
  description: z
    .string()
    .min(2, '항목명은 2자 이상이어야 합니다')
    .max(200, '항목명은 200자 이하여야 합니다'),
  category: expenseCategoryEnum,
  amount: z.number().int().positive('금액은 0보다 커야 합니다'),
  note: z.string().max(500).optional(),
})

export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>

// ─── 예산 스키마 ────────────────────────────────────────

export const budgetSchema = z.object({
  year: z
    .number()
    .int()
    .min(2019, '2019년 이후만 가능합니다')
    .max(2030, '2030년까지만 가능합니다'),
  category: expenseCategoryEnum,
  amount: z.number().int().positive('금액은 0보다 커야 합니다'),
})

export type BudgetInput = z.infer<typeof budgetSchema>

// ─── 결산 보고서 스키마 ─────────────────────────────────

export const reportSchema = z.object({
  year: z
    .number()
    .int()
    .min(2019, '2019년 이후만 가능합니다')
    .max(2030, '2030년까지만 가능합니다'),
  isPublished: z.boolean().default(false),
})

export type ReportInput = z.infer<typeof reportSchema>
