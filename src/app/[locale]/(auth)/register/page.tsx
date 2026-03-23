import type { Metadata } from 'next'
import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'

import { RegisterForm } from './register-form'

export const metadata: Metadata = {
  title: '회원가입 | 팍스크리스티코리아',
  description: '팍스크리스티코리아 회원가입',
}

const RegisterPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}

export default RegisterPage
