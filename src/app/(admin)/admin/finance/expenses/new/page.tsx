import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import ExpenseNewTabs from './expense-new-tabs'

export const metadata: Metadata = {
  title: '지출 등록 | 관리자',
}

const ExpenseNewPage = () => {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/finance/expenses"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-peace-navy"
        >
          <ChevronLeft className="h-4 w-4" />
          목록으로
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-peace-navy">지출 등록</h1>
        <p className="mt-1 text-sm text-gray-500">
          영수증을 스캔하거나 직접 입력하여 제경비를 등록하세요
        </p>
      </div>

      {/* 탭 UI (클라이언트 컴포넌트) */}
      <ExpenseNewTabs />
    </div>
  )
}

export default ExpenseNewPage
