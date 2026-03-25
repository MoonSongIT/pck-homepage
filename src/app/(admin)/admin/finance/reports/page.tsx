import type { Metadata } from 'next'
import { FileBarChart } from 'lucide-react'

import { prisma } from '@/lib/prisma'
import { ReportForm } from './report-form'

export const metadata: Metadata = {
  title: '결산 보고서 | 관리자',
}

const ReportsPage = async () => {
  const [reports, pendingCount] = await Promise.all([
    prisma.financeReport.findMany({ orderBy: { year: 'desc' } }),
    prisma.expense.count({ where: { status: 'PENDING_REVIEW' } }),
  ])

  const serialized = reports.map((r) => ({
    id: r.id,
    year: r.year,
    totalIncome: r.totalIncome,
    totalExpense: r.totalExpense,
    pdfUrl: r.pdfUrl,
    isPublished: r.isPublished,
    updatedAt: r.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <div className="flex items-center gap-2">
          <FileBarChart className="h-6 w-6 text-[var(--peace-navy)]" />
          <h1 className="text-2xl font-bold text-[var(--peace-navy)]">결산 보고서</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          연도별 수입/지출 자동 집계 및 공개 관리
        </p>
      </div>

      <ReportForm reports={serialized} pendingCount={pendingCount} />
    </div>
  )
}

export default ReportsPage
