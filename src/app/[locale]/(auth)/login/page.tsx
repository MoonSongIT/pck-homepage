import type { Metadata } from 'next'
import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'

import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: '로그인 | 팍스크리스티코리아',
  description: '팍스크리스티코리아 회원 로그인',
}

const LoginPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

export default LoginPage
