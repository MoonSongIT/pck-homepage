import { Suspense } from 'react'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { ApplyForm } from './apply-form'

export const metadata: Metadata = {
  title: '교육 신청 | 팍스크리스티코리아',
  description:
    '팍스크리스티코리아 평화학교 교육 프로그램에 신청하세요.',
}

export default async function EducationApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <Suspense>
      <ApplyForm />
    </Suspense>
  )
}
