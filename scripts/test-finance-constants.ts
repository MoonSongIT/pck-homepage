/**
 * Phase 3-2-1 상수 파일 테스트 스크립트
 * 실행: npx tsx scripts/test-finance-constants.ts
 */

import {
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_COLORS,
  RECEIPT_CONFIG,
  FINANCE_CONFIG,
  EXPENSE_STATUS,
} from '../src/lib/constants/finance'

console.log('=== 재정 상수 테스트 ===\n')

// 1. 카테고리 매핑
console.log('1) 카테고리 라벨:')
Object.entries(EXPENSE_CATEGORY_LABELS).forEach(([key, label]) => {
  const color = EXPENSE_CATEGORY_COLORS[key as keyof typeof EXPENSE_CATEGORY_COLORS]
  console.log(`   ${key} → ${label} (${color})`)
})

// 2. 영수증 설정
console.log('\n2) 영수증 업로드 설정:')
console.log(`   최대 파일 크기: ${RECEIPT_CONFIG.maxFileSize / 1024 / 1024}MB`)
console.log(`   허용 타입: ${RECEIPT_CONFIG.allowedTypes.join(', ')}`)
console.log(`   Storage 버킷: ${RECEIPT_CONFIG.storageBucket}`)

// 3. 재정 페이지 설정
console.log('\n3) 페이지 설정:')
console.log(`   관리자: ${FINANCE_CONFIG.admin.title} — ${FINANCE_CONFIG.admin.subtitle}`)
console.log(`   공개: ${FINANCE_CONFIG.transparency.title} — ${FINANCE_CONFIG.transparency.subtitle}`)

// 4. 상태 매핑
console.log('\n4) 지출 상태:')
Object.entries(EXPENSE_STATUS).forEach(([key, val]) => {
  console.log(`   ${key} → ${val.label} (${val.color})`)
})

// 5. 타입 체크 (컴파일 타임)
const testCategory: keyof typeof EXPENSE_CATEGORY_LABELS = 'OFFICE'
console.log(`\n5) 타입 체크: ${testCategory} = ${EXPENSE_CATEGORY_LABELS[testCategory]} ✅`)

console.log('\n=== 테스트 완료 ===')
