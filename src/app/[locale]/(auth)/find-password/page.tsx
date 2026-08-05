import type { Metadata } from 'next'
import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'

import { FindPasswordForm } from './find-password-form'

export const metadata: Metadata = {
  title: '비밀번호 찾기 | 팍스크리스티코리아',
  description: '팍스크리스티코리아 비밀번호 재설정',
}

const FindPasswordPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <Suspense>
      <FindPasswordForm />
    </Suspense>
  )
}

export default FindPasswordPage
