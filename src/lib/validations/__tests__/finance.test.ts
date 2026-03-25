import { describe, it, expect } from 'vitest'
import { expenseSchema, budgetSchema, reportSchema } from '../finance'

describe('expenseSchema', () => {
  const validExpense = {
    date: '2026-03-25',
    description: '사무실 임대료',
    category: 'OFFICE' as const,
    amount: 500000,
  }

  it('유효한 지출 입력을 통과시킨다', () => {
    const result = expenseSchema.safeParse(validExpense)
    expect(result.success).toBe(true)
  })

  it('모든 카테고리를 통과시킨다', () => {
    const categories = ['PERSONNEL', 'OFFICE', 'EVENT', 'TRANSPORT', 'OTHER'] as const
    for (const category of categories) {
      const result = expenseSchema.safeParse({ ...validExpense, category })
      expect(result.success).toBe(true)
    }
  })

  it('0 이하 금액을 거부한다', () => {
    const result = expenseSchema.safeParse({ ...validExpense, amount: 0 })
    expect(result.success).toBe(false)
  })

  it('음수 금액을 거부한다', () => {
    const result = expenseSchema.safeParse({ ...validExpense, amount: -1000 })
    expect(result.success).toBe(false)
  })

  it('설명이 2자 미만이면 거부한다', () => {
    const result = expenseSchema.safeParse({ ...validExpense, description: '임' })
    expect(result.success).toBe(false)
  })

  it('선택적 receipt URL 유효성을 검증한다', () => {
    const valid = expenseSchema.safeParse({
      ...validExpense,
      receipt: 'https://example.com/receipt.jpg',
    })
    expect(valid.success).toBe(true)

    const invalid = expenseSchema.safeParse({
      ...validExpense,
      receipt: 'not-a-url',
    })
    expect(invalid.success).toBe(false)
  })

  it('잘못된 카테고리를 거부한다', () => {
    const result = expenseSchema.safeParse({ ...validExpense, category: 'FOOD' })
    expect(result.success).toBe(false)
  })
})

describe('budgetSchema', () => {
  it('유효한 예산 입력을 통과시킨다', () => {
    const result = budgetSchema.safeParse({
      year: 2026,
      category: 'PERSONNEL',
      amount: 1000000,
    })
    expect(result.success).toBe(true)
  })

  it('2019년 이전 연도를 거부한다', () => {
    const result = budgetSchema.safeParse({
      year: 2018,
      category: 'OFFICE',
      amount: 500000,
    })
    expect(result.success).toBe(false)
  })

  it('2030년 이후 연도를 거부한다', () => {
    const result = budgetSchema.safeParse({
      year: 2031,
      category: 'OFFICE',
      amount: 500000,
    })
    expect(result.success).toBe(false)
  })
})

describe('reportSchema', () => {
  it('유효한 보고서 입력을 통과시킨다', () => {
    const result = reportSchema.safeParse({
      year: 2025,
      isPublished: true,
      pdfUrl: 'https://example.com/report.pdf',
    })
    expect(result.success).toBe(true)
  })

  it('빈 pdfUrl도 통과시킨다', () => {
    const result = reportSchema.safeParse({
      year: 2025,
      isPublished: false,
      pdfUrl: '',
    })
    expect(result.success).toBe(true)
  })

  it('pdfUrl 생략도 통과시킨다', () => {
    const result = reportSchema.safeParse({
      year: 2025,
      isPublished: false,
    })
    expect(result.success).toBe(true)
  })

  it('잘못된 pdfUrl 형식을 거부한다', () => {
    const result = reportSchema.safeParse({
      year: 2025,
      isPublished: true,
      pdfUrl: 'not-a-url',
    })
    expect(result.success).toBe(false)
  })
})
