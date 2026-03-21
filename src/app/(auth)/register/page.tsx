import type { Metadata } from 'next'
import { Suspense } from 'react'

import { RegisterForm } from './register-form'

export const metadata: Metadata = {
  title: '회원가입 | 팍스크리스티코리아',
  description: '팍스크리스티코리아 회원가입',
}

const RegisterPage = () => {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}

export default RegisterPage
