import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { prisma } from '@/lib/prisma'
import { YearDetailContent } from './year-detail-content'

export const revalidate = 3600

// ─── 동적 메타데이터 ────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; year: string }>
}): Promise<Metadata> {
  const { year } = await params
  return {
    title: `${year}년 결산 보고서 | 팍스크리스티코리아`,
    description: `팍스크리스티코리아 ${year}년도 수입·지출 결산 보고서`,
  }
}

// ─── 페이지 ────────────────────────────────────────────

const TransparencyYearPage = async ({
  params,
}: {
  params: Promise<{ locale: string; year: string }>
}) => {
  const { locale, year: yearStr } = await params
  setRequestLocale(locale)

  const year = Number(yearStr)
  if (!Number.isInteger(year) || year < 2019 || year > 2030) notFound()

  const yearStart = new Date(`${year}-01-01`)
  const yearEnd = new Date(`${year + 1}-01-01`)

  const [report, expenseBreakdown] = await Promise.all([
    prisma.financeReport.findFirst({
      where: { year, isPublished: true },
      select: {
        id: true,
        year: true,
        totalIncome: true,
        totalExpense: true,
        pdfUrl: true,
      },
    }),
    prisma.expense.groupBy({
      by: ['category'],
      where: {
        status: 'CONFIRMED',
        date: { gte: yearStart, lt: yearEnd },
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
    }),
  ])

  if (!report) notFound()

  const breakdown = expenseBreakdown.map((b) => ({
    category: b.category,
    amount: b._sum.amount ?? 0,
  }))

  return <YearDetailContent report={report} breakdown={breakdown} />
}

export default TransparencyYearPage
