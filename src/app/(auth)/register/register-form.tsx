'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Loader2, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerUser, type AuthResult } from '@/app/actions/auth'

export const RegisterForm = () => {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState<AuthResult | null, FormData>(
    registerUser,
    null
  )

  useEffect(() => {
    if (state?.success) {
      // 가입 성공 → 자동 로그인 시도
      const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]')
      const passwordInput = document.querySelector<HTMLInputElement>('input[name="password"]')
      const email = emailInput?.value
      const password = passwordInput?.value

      if (email && password) {
        signIn('credentials', {
          email,
          password,
          redirect: false,
        }).then((result) => {
          if (!result?.error) {
            router.push('/')
            router.refresh()
          } else {
            router.push('/login')
          }
        })
      } else {
        router.push('/login')
      }
    }
  }, [state?.success, router])

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h1 className="mb-6 text-center text-2xl font-bold text-peace-navy dark:text-white">
        회원가입
      </h1>

      {state && !state.success && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400"
        >
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="홍길동"
            autoComplete="name"
            required
            aria-invalid={!!state?.fieldErrors?.name}
          />
          {state?.fieldErrors?.name && (
            <p className="text-sm text-red-500">{state.fieldErrors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            autoComplete="email"
            required
            aria-invalid={!!state?.fieldErrors?.email}
          />
          {state?.fieldErrors?.email && (
            <p className="text-sm text-red-500">{state.fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="8자 이상 입력하세요"
            autoComplete="new-password"
            required
            aria-invalid={!!state?.fieldErrors?.password}
          />
          {state?.fieldErrors?.password && (
            <p className="text-sm text-red-500">{state.fieldErrors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            autoComplete="new-password"
            required
            aria-invalid={!!state?.fieldErrors?.confirmPassword}
          />
          {state?.fieldErrors?.confirmPassword && (
            <p className="text-sm text-red-500">{state.fieldErrors.confirmPassword}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-peace-navy hover:bg-peace-navy/90"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              가입 중...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              회원가입
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        이미 회원이신가요?{' '}
        <Link
          href="/login"
          className="font-medium text-peace-sky hover:underline"
        >
          로그인
        </Link>
      </p>
    </div>
  )
}
