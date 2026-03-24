import Link from 'next/link'
import { ChevronLeft, ChevronRight, PiggyBank, TrendingDown, TrendingUp, Wallet } from 'lucide-react'

import { prisma } from '@/lib/prisma'
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_COLORS,
} from '@/lib/constants/finance'
import { BudgetTable, type BudgetRow } from '@/components/organisms/BudgetTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// ─── 유틸 ──────────────────────────────────────────────

const formatKRW = (n: number) => n.toLocaleString('ko-KR') + '원'

// ─── 페이지 ────────────────────────────────────────────

const BudgetPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>
}) => {
  const params = await searchParams
  const currentYear = new Date().getFullYear()
  const year = Number(params.year) || currentYear

  // 예산 항목 조회
  const budgetItems = await prisma.budgetItem.findMany({ where: { year } })

  // 카테고리별 실제 집행액 (CONFIRMED 지출만)
  const actualByCategory = await prisma.expense.groupBy({
    by: ['category'],
    where: {
      status: 'CONFIRMED',
      date: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
    _sum: { amount: true },
  })

  // 5개 카테고리 행 구성
  const rows: BudgetRow[] = EXPENSE_CATEGORIES.map((category) => {
    const budget = budgetItems.find((b) => b.category === category)
    const actual = actualByCategory.find((a) => a.category === category)
    return {
      category,
      categoryLabel: EXPENSE_CATEGORY_LABELS[category],
      categoryColor: EXPENSE_CATEGORY_COLORS[category],
      budgetId: budget?.id ?? null,
      budgetAmount: budget?.amount ?? 0,
      actualAmount: actual?._sum.amount ?? 0,
    }
  })

  // 요약 합계
  const totalBudget = rows.reduce((s, r) => s + r.budgetAmount, 0)
  const totalActual = rows.reduce((s, r) => s + r.actualAmount, 0)
  const totalRemaining = totalBudget - totalActual
  const usageRate =
    totalBudget > 0 ? Math.round((totalActual / totalBudget) * 100) : 0

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--peace-navy)]">예산 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">
            연도별 카테고리 예산 편성 및 집행 현황
          </p>
        </div>

        {/* 연도 선택기 */}
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <Link href={`/admin/finance/budget?year=${year - 1}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <span className="w-16 text-center font-semibold text-lg">{year}년</span>
          <Button asChild variant="outline" size="icon">
            <Link href={`/admin/finance/budget?year=${year + 1}`}>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">총 예산</CardTitle>
            <PiggyBank className="h-4 w-4 text-[var(--peace-navy)]" />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-[var(--peace-navy)]">
              {totalBudget > 0 ? formatKRW(totalBudget) : '미설정'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">총 집행액</CardTitle>
            <Wallet className="h-4 w-4 text-[var(--peace-sky)]" />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-[var(--peace-sky)]">
              {formatKRW(totalActual)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">잔여 예산</CardTitle>
            {totalRemaining >= 0 ? (
              <TrendingDown className="h-4 w-4 text-[var(--peace-olive)]" />
            ) : (
              <TrendingUp className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <p
              className={`text-xl font-bold ${
                totalRemaining < 0 ? 'text-destructive' : 'text-[var(--peace-olive)]'
              }`}
            >
              {totalBudget > 0
                ? (totalRemaining < 0 ? '▲ ' : '') + formatKRW(Math.abs(totalRemaining))
                : '—'}
            </p>
            {totalRemaining < 0 && (
              <p className="text-xs text-destructive mt-0.5">예산 초과</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">집행률</CardTitle>
            <span className="text-xs font-bold text-muted-foreground">%</span>
          </CardHeader>
          <CardContent>
            <p
              className={`text-xl font-bold ${
                usageRate > 100
                  ? 'text-destructive'
                  : usageRate > 80
                    ? 'text-[var(--peace-gold)]'
                    : 'text-[var(--peace-navy)]'
              }`}
            >
              {totalBudget > 0 ? `${usageRate}%` : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 예산 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {year}년 카테고리별 예산 현황
            <span className="ml-2 text-xs text-muted-foreground font-normal">
              (연필 아이콘 클릭으로 예산 설정/수정)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <BudgetTable year={year} rows={rows} />
        </CardContent>
      </Card>
    </div>
  )
}

export default BudgetPage
