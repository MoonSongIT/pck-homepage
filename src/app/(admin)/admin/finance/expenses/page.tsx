import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import ExpenseFilterBar from '@/components/organisms/ExpenseFilterBar'
import ExpenseTable from '@/components/organisms/ExpenseTable'
import { prisma } from '@/lib/prisma'
import { EXPENSE_CATEGORY_LABELS, EXPENSE_STATUS } from '@/lib/constants/finance'
import type { ExpenseRow } from '@/components/organisms/ExpenseEditDialog'

export const metadata: Metadata = {
  title: '제경비 관리 | 관리자',
}

const PAGE_SIZE = 20

type SearchParams = {
  category?: string
  status?: string
  month?: string
  page?: string
}

const ExpensesPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams
  const page = Math.max(1, Number(params.page ?? 1))

  // Prisma where 조건 생성
  const where: Record<string, unknown> = {}
  if (params.category && params.category in EXPENSE_CATEGORY_LABELS) {
    where.category = params.category
  }
  if (params.status && params.status in EXPENSE_STATUS) {
    where.status = params.status
  }
  if (params.month) {
    const [year, month] = params.month.split('-').map(Number)
    if (year && month) {
      where.date = {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      }
    }
  }

  const [expenses, totalCount, pendingCount, confirmedSum, pendingSum] = await Promise.all([
    prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.expense.count({ where }),
    prisma.expense.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.expense.aggregate({
      where: { ...where, status: 'CONFIRMED' },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: { ...where, status: 'PENDING_REVIEW' },
      _sum: { amount: true },
    }),
  ])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Date → string 직렬화 (클라이언트 컴포넌트 전달용)
  const expenseRows: ExpenseRow[] = expenses.map((e) => ({
    id: e.id,
    date: e.date.toISOString(),
    description: e.description,
    category: e.category,
    amount: e.amount,
    status: e.status,
    receipt: e.receipt,
    ocrConfidence: e.ocrConfidence,
    note: e.note,
  }))

  const confirmedTotal = confirmedSum._sum.amount ?? 0
  const pendingTotal = pendingSum._sum.amount ?? 0

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-peace-navy">제경비 관리</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>총 {totalCount.toLocaleString()}건</span>
            {pendingCount > 0 && (
              <Badge className={`${EXPENSE_STATUS.PENDING_REVIEW.color} hover:${EXPENSE_STATUS.PENDING_REVIEW.color}`}>
                검토 대기 {pendingCount}건
              </Badge>
            )}
          </div>
        </div>
        <Button asChild className="shrink-0 bg-peace-navy hover:bg-peace-navy/90">
          <Link href="/admin/finance/expenses/new">
            <Plus className="mr-1.5 h-4 w-4" />
            새 지출 등록
          </Link>
        </Button>
      </div>

      {/* 합계 카드 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-peace-olive/20">
          <CardContent className="pt-5">
            <p className="text-xs text-gray-500">확정 지출 합계</p>
            <p className="mt-1 text-2xl font-bold text-peace-olive">
              {confirmedTotal.toLocaleString()}원
            </p>
          </CardContent>
        </Card>
        <Card className="border-peace-gold/20">
          <CardContent className="pt-5">
            <p className="text-xs text-gray-500">검토 대기 합계</p>
            <p className="mt-1 text-2xl font-bold text-peace-gold">
              {pendingTotal.toLocaleString()}원
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 */}
      <Suspense fallback={<Skeleton className="h-9 w-80" />}>
        <ExpenseFilterBar />
      </Suspense>

      {/* 목록 테이블 */}
      <ExpenseTable expenses={expenseRows} />

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/finance/expenses?${buildPageUrl(params, page - 1)}`}>
                이전
              </Link>
            </Button>
          )}
          <span className="text-sm text-gray-500">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/finance/expenses?${buildPageUrl(params, page + 1)}`}>
                다음
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function buildPageUrl(params: SearchParams, page: number) {
  const p = new URLSearchParams()
  if (params.category) p.set('category', params.category)
  if (params.status) p.set('status', params.status)
  if (params.month) p.set('month', params.month)
  p.set('page', String(page))
  return p.toString()
}

export default ExpensesPage
