'use client'

import dynamic from 'next/dynamic'
import { ArrowLeft, Download, FileX } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DonutSlice } from '@/components/molecules/FinanceDonutChart'

// SSR 비활성화 (Recharts는 브라우저 전용)
const FinanceDonutChart = dynamic(
  () =>
    import('@/components/molecules/FinanceDonutChart').then(
      (m) => m.FinanceDonutChart,
    ),
  { ssr: false },
)

// ─── 타입 ──────────────────────────────────────────────

type ExpenseCategory = 'PERSONNEL' | 'OFFICE' | 'EVENT' | 'TRANSPORT' | 'OTHER'

interface ReportDetail {
  id: string
  year: number
  totalIncome: number
  totalExpense: number
  pdfUrl: string | null
}

interface BreakdownItem {
  category: ExpenseCategory
  amount: number
}

interface Props {
  report: ReportDetail
  breakdown: BreakdownItem[]
}

// ─── 유틸 ──────────────────────────────────────────────

const formatKRW = (n: number) => n.toLocaleString('ko-KR') + '원'

// 카테고리별 차트 색상
const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  PERSONNEL:  '#4a90d9', // peace-sky
  OFFICE:     '#6b8f47', // peace-olive
  EVENT:      '#c9a84c', // peace-gold
  TRANSPORT:  '#1a3a5c', // peace-navy
  OTHER:      '#e8911a', // peace-orange
}

// ─── 컴포넌트 ──────────────────────────────────────────

export const YearDetailContent = ({ report, breakdown }: Props) => {
  const t = useTranslations('Transparency')

  const balance = report.totalIncome - report.totalExpense
  const isDeficit = balance < 0

  // 지출 카테고리별 번역 이름
  const categoryLabel: Record<ExpenseCategory, string> = {
    PERSONNEL:  t('categoryPersonnel'),
    OFFICE:     t('categoryOffice'),
    EVENT:      t('categoryEvent'),
    TRANSPORT:  t('categoryTransport'),
    OTHER:      t('categoryOther'),
  }

  // 도넛 차트 데이터 — 지출 breakdown
  const expenseSlices: DonutSlice[] = breakdown
    .filter((b) => b.amount > 0)
    .map((b) => ({
      name:  categoryLabel[b.category],
      value: b.amount,
      color: CATEGORY_COLORS[b.category],
    }))

  // 수입 차트 데이터 — 단일 "기부금 수입"
  const incomeSlices: DonutSlice[] = report.totalIncome > 0
    ? [{ name: t('incomeType'), value: report.totalIncome, color: '#4a90d9' }]
    : []

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      {/* 뒤로 가기 */}
      <Button variant="ghost" asChild className="mb-6 -ml-2">
        <Link href="/transparency">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          {t('backLabel')}
        </Link>
      </Button>

      {/* 제목 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--peace-navy)]">
          {t('detailTitle', { year: report.year })}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('detailSubtitle')}</p>
      </div>

      {/* 요약 카드 3개 */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="border-[var(--peace-sky)]/30 bg-[var(--peace-sky)]/5">
          <CardContent className="pt-5">
            <p className="mb-1 text-xs text-muted-foreground">{t('totalIncome')}</p>
            <p className="text-xl font-bold text-[var(--peace-sky)]">
              {formatKRW(report.totalIncome)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--peace-olive)]/30 bg-[var(--peace-olive)]/5">
          <CardContent className="pt-5">
            <p className="mb-1 text-xs text-muted-foreground">{t('totalExpense')}</p>
            <p className="text-xl font-bold text-[var(--peace-olive)]">
              {formatKRW(report.totalExpense)}
            </p>
          </CardContent>
        </Card>

        <Card
          className={
            isDeficit
              ? 'border-destructive/30 bg-destructive/5'
              : 'border-[var(--peace-navy)]/30 bg-[var(--peace-navy)]/5'
          }
        >
          <CardContent className="pt-5">
            <p className="mb-1 text-xs text-muted-foreground">
              {isDeficit ? t('deficit') : t('surplus')}
            </p>
            <p
              className={`text-xl font-bold ${
                isDeficit ? 'text-destructive' : 'text-[var(--peace-navy)]'
              }`}
            >
              {isDeficit ? '▼ ' : ''}
              {formatKRW(Math.abs(balance))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 차트 영역 */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {/* 수입 차트 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('incomeLabel')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incomeSlices.length > 0 ? (
              <FinanceDonutChart data={incomeSlices} />
            ) : (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                데이터 없음
              </div>
            )}
          </CardContent>
        </Card>

        {/* 지출 차트 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('expenseLabel')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenseSlices.length > 0 ? (
              <FinanceDonutChart data={expenseSlices} />
            ) : (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                데이터 없음
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 지출 항목별 내역 테이블 */}
      {breakdown.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">{t('breakdownTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--peace-navy)] text-white">
                  <th className="px-4 py-2 text-left font-medium">항목</th>
                  <th className="px-4 py-2 text-right font-medium">금액</th>
                  <th className="px-4 py-2 text-right font-medium">비율</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((b) => (
                  <tr key={b.category} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[b.category] }}
                        />
                        {categoryLabel[b.category]}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-[var(--peace-olive)]">
                      {formatKRW(b.amount)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">
                      {report.totalExpense > 0
                        ? `${((b.amount / report.totalExpense) * 100).toFixed(1)}%`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* PDF 다운로드 */}
      <div className="flex justify-center">
        {report.pdfUrl ? (
          <Button
            asChild
            size="lg"
            className="bg-[var(--peace-navy)] text-white hover:bg-[var(--peace-navy)]/90"
          >
            <a href={report.pdfUrl} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              {t('downloadPdf')}
            </a>
          </Button>
        ) : (
          <Button size="lg" disabled variant="outline">
            <FileX className="mr-2 h-4 w-4" />
            {t('noPdf')}
          </Button>
        )}
      </div>
    </div>
  )
}
