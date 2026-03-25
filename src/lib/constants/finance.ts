import { type ExpenseCategory } from '@/generated/prisma/client'

// ─── 카테고리 한글 매핑 ─────────────────────────────────

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  PERSONNEL: '인건비',
  OFFICE: '사무비',
  EVENT: '행사비',
  TRANSPORT: '교통비',
  OTHER: '기타',
}

// ─── Recharts 차트 색상 ────────────────────────────────

export const EXPENSE_CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  PERSONNEL: '#4a90d9',
  OFFICE: '#6b8f47',
  EVENT: '#c9a84c',
  TRANSPORT: '#e8911a',
  OTHER: '#94a3b8',
}

// ─── 카테고리 순서 배열 ─────────────────────────────────

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'PERSONNEL',
  'OFFICE',
  'EVENT',
  'TRANSPORT',
  'OTHER',
]

// ─── 영수증 업로드 설정 ─────────────────────────────────

export const RECEIPT_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
  storageBucket: 'receipts',
} as const

// ─── 재정 페이지 설정 ───────────────────────────────────

export const FINANCE_CONFIG = {
  admin: {
    title: '재정 관리',
    subtitle: '제경비 · 예산 · 결산 관리',
  },
  transparency: {
    title: '재정 공개',
    subtitle: '투명한 재정 운용 현황',
  },
  emptyMessage: '등록된 재정 데이터가 없습니다',
} as const

// ─── 지출 상태 ──────────────────────────────────────────

export const EXPENSE_STATUS = {
  CONFIRMED: {
    label: '확정',
    color: 'bg-peace-olive/15 text-peace-olive',
  },
  PENDING_REVIEW: {
    label: '검토 대기',
    color: 'bg-peace-gold/15 text-peace-gold',
  },
} as const

export type ExpenseStatus = keyof typeof EXPENSE_STATUS
