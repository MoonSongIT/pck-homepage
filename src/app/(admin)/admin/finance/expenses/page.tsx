import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Receipt } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma'
import { EXPENSE_STATUS } from '@/lib/constants/finance'

export const metadata: Metadata = {
  title: '제경비 관리 | 관리자',
}

const ExpensesPage = async () => {
  const [totalCount, pendingCount] = await Promise.all([
    prisma.expense.count(),
    prisma.expense.count({ where: { status: 'PENDING_REVIEW' } }),
  ])

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-peace-navy">제경비 관리</h1>
          <p className="mt-1 text-sm text-gray-500">
            총 {totalCount.toLocaleString()}건
            {pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1">
                <Badge className={EXPENSE_STATUS.PENDING_REVIEW.color}>
                  검토 대기 {pendingCount}건
                </Badge>
              </span>
            )}
          </p>
        </div>
        <Button asChild className="bg-peace-navy hover:bg-peace-navy/90">
          <Link href="/admin/finance/expenses/new">
            <Plus className="mr-1.5 h-4 w-4" />
            새 지출 등록
          </Link>
        </Button>
      </div>

      {/* 목록 (Phase 3-2-4에서 구현 예정) */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Receipt className="h-8 w-8 text-gray-400" />
          </div>
          <p className="font-medium text-gray-700">제경비 목록</p>
          <p className="text-sm text-gray-500">
            Phase 3-2-4에서 목록/필터/상태관리가 구현됩니다
          </p>
          {totalCount > 0 && (
            <p className="text-sm text-peace-sky">
              현재 {totalCount.toLocaleString()}건의 지출이 등록되어 있습니다
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ExpensesPage
