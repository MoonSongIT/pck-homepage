'use client'

import { motion } from 'framer-motion'
import { FileText, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// ─── 타입 ──────────────────────────────────────────────

interface ReportSummary {
  id: string
  year: number
  totalIncome: number
  totalExpense: number
  pdfUrl: string | null
}

interface Props {
  reports: ReportSummary[]
}

// ─── 유틸 ──────────────────────────────────────────────

const formatKRW = (n: number) => n.toLocaleString('ko-KR') + '원'

// ─── 애니메이션 variants ───────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

// ─── 컴포넌트 ──────────────────────────────────────────

export const TransparencyContent = ({ reports }: Props) => {
  const t = useTranslations('Transparency')

  return (
    <div>
      {/* 히어로 */}
      <section className="bg-[var(--peace-navy)] py-16 text-white">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-white/10 p-4">
                <FileText className="h-10 w-10" />
              </div>
            </div>
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">{t('heroTitle')}</h1>
            <p className="mx-auto max-w-xl text-base text-white/80 md:text-lg">
              {t('heroSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 보고서 목록 */}
      <section className="py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-[var(--peace-navy)]">
              {t('sectionTitle')}
            </h2>
            <p className="text-sm text-muted-foreground">{t('sectionSubtitle')}</p>
          </div>

          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <FileText className="mb-4 h-12 w-12 opacity-30" />
              <p className="font-medium">{t('emptyTitle')}</p>
              <p className="mt-1 text-sm">{t('emptyDesc')}</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {reports.map((r) => {
                const balance = r.totalIncome - r.totalExpense
                const isDeficit = balance < 0

                return (
                  <motion.div key={r.id} variants={cardVariants}>
                    <Card className="group h-full border-border/60 transition-shadow hover:shadow-md">
                      <CardContent className="flex h-full flex-col p-5">
                        {/* 연도 뱃지 */}
                        <div className="mb-4 flex items-center justify-between">
                          <span className="rounded-full bg-[var(--peace-navy)]/10 px-3 py-1 text-sm font-bold text-[var(--peace-navy)]">
                            {r.year}년
                          </span>
                          {isDeficit ? (
                            <TrendingDown className="h-4 w-4 text-destructive" />
                          ) : balance === 0 ? (
                            <Minus className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-[var(--peace-olive)]" />
                          )}
                        </div>

                        {/* 수입/지출 */}
                        <div className="mb-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('incomeLabel')}</span>
                            <span className="font-medium text-[var(--peace-sky)]">
                              {formatKRW(r.totalIncome)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('expenseLabel')}</span>
                            <span className="font-medium text-[var(--peace-olive)]">
                              {formatKRW(r.totalExpense)}
                            </span>
                          </div>
                          <div className="border-t pt-2 flex justify-between">
                            <span className="font-medium">{t('balanceLabel')}</span>
                            <span
                              className={`font-bold ${isDeficit ? 'text-destructive' : 'text-[var(--peace-navy)]'}`}
                            >
                              {isDeficit ? '▼ ' : ''}
                              {formatKRW(Math.abs(balance))}
                            </span>
                          </div>
                        </div>

                        {/* 상세 보기 버튼 */}
                        <div className="mt-auto">
                          <Button
                            asChild
                            className="w-full bg-[var(--peace-navy)] text-white hover:bg-[var(--peace-navy)]/90"
                          >
                            <Link href={`/transparency/${r.year}`}>
                              {t('viewDetailLabel')}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
