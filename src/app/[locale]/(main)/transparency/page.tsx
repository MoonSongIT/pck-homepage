import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { prisma } from '@/lib/prisma'
import { TransparencyContent } from './transparency-content'

export const metadata: Metadata = {
  title: '재정 투명성 | 팍스크리스티코리아',
  description: '팍스크리스티코리아 연도별 결산 보고서를 공개합니다. 후원금의 투명한 관리를 약속합니다.',
}

export const revalidate = 3600 // 1시간 ISR

const TransparencyPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  setRequestLocale(locale)

  const reports = await prisma.financeReport.findMany({
    where: { isPublished: true },
    orderBy: { year: 'desc' },
    select: {
      id: true,
      year: true,
      totalIncome: true,
      totalExpense: true,
      pdfUrl: true,
    },
  })

  const serialized = reports.map((r) => ({
    id: r.id,
    year: r.year,
    totalIncome: r.totalIncome,
    totalExpense: r.totalExpense,
    pdfUrl: r.pdfUrl,
  }))

  return <TransparencyContent reports={serialized} />
}

export default TransparencyPage
