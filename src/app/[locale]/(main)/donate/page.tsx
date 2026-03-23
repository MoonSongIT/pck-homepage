import { Suspense } from 'react'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { DonateForm } from './donate-form'

export const metadata: Metadata = {
  title: '후원하기 | 팍스크리스티코리아',
  description:
    '팍스크리스티코리아의 평화 활동을 후원해 주세요. 정기 후원과 일시 후원을 선택할 수 있습니다.',
}

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <Suspense>
      <DonateForm />
    </Suspense>
  )
}
