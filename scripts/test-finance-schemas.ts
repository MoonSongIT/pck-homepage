/**
 * Phase 3-2-1 Zod 스키마 테스트 스크립트
 * 실행: npx tsx scripts/test-finance-schemas.ts
 */

import { expenseSchema, budgetSchema, reportSchema } from '../src/lib/validations/finance'

console.log('=== Zod 스키마 테스트 ===\n')

// ── 1. expenseSchema 성공 케이스 ──
const validExpense = expenseSchema.safeParse({
  date: '2026-03-23',
  description: '사무용품 구매',
  category: 'OFFICE',
  amount: 35000,
  receipt: 'https://example.com/receipt.jpg',
  ocrConfidence: 0.92,
  ocrRawText: '다이소 A4용지 10박스',
  note: 'A4용지 10박스',
})
console.log('1) expenseSchema 유효한 데이터:', validExpense.success ? '✅ 통과' : '❌ 실패')
if (validExpense.success) {
  console.log('   → 파싱 결과:', JSON.stringify(validExpense.data, null, 2))
}

// ── 2. expenseSchema 실패 케이스 ──
const invalidExpense = expenseSchema.safeParse({
  date: '2026-03-23',
  description: 'A', // 2자 미만
  category: 'INVALID', // 잘못된 카테고리
  amount: -100, // 음수
})
console.log('\n2) expenseSchema 잘못된 데이터:', !invalidExpense.success ? '✅ 에러 감지' : '❌ 통과됨(문제)')
if (!invalidExpense.success) {
  console.log('   → 에러 수:', invalidExpense.error.issues.length)
  invalidExpense.error.issues.forEach((issue, i) => {
    console.log(`   → [${i + 1}] ${issue.path.join('.')}: ${issue.message}`)
  })
}

// ── 3. budgetSchema 테스트 ──
const validBudget = budgetSchema.safeParse({
  year: 2026,
  category: 'PERSONNEL',
  amount: 5000000,
})
console.log('\n3) budgetSchema 유효한 데이터:', validBudget.success ? '✅ 통과' : '❌ 실패')

const invalidBudget = budgetSchema.safeParse({
  year: 2015, // 2019 미만
  category: 'OFFICE',
  amount: 0, // 0은 양수가 아님
})
console.log('4) budgetSchema 잘못된 데이터:', !invalidBudget.success ? '✅ 에러 감지' : '❌ 통과됨(문제)')
if (!invalidBudget.success) {
  invalidBudget.error.issues.forEach((issue, i) => {
    console.log(`   → [${i + 1}] ${issue.path.join('.')}: ${issue.message}`)
  })
}

// ── 4. reportSchema 테스트 ──
const validReport = reportSchema.safeParse({
  year: 2025,
  isPublished: true,
})
console.log('\n5) reportSchema 유효한 데이터:', validReport.success ? '✅ 통과' : '❌ 실패')

console.log('\n=== 테스트 완료 ===')
