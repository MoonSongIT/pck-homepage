'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { KeyRound, Loader2, Mail, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { requestPasswordReset, verifyResetCode, resetPassword } from '@/app/actions/password-reset'
import type { AuthResult } from '@/app/actions/auth'

type Step = 'email' | 'code' | 'password'

export const FindPasswordForm = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  const [requestState, dispatchRequest, isRequestPending] = useActionState<AuthResult | null, FormData>(
    requestPasswordReset,
    null
  )
  const [verifyState, dispatchVerify, isVerifyPending] = useActionState<AuthResult | null, FormData>(
    verifyResetCode,
    null
  )
  const [resetState, dispatchReset, isResetPending] = useActionState<AuthResult | null, FormData>(
    resetPassword,
    null
  )

  // step은 각 단계 서버 액션의 성공 여부로부터 파생되는 값이라 별도 state로 관리하지 않는다.
  const step: Step = verifyState?.success ? 'password' : requestState?.success ? 'code' : 'email'

  useEffect(() => {
    if (resetState?.success) {
      router.push('/login')
    }
  }, [resetState, router])

  const handleRequestSubmit = (formData: FormData) => {
    setEmail((formData.get('email') as string) ?? '')
    dispatchRequest(formData)
  }

  const handleVerifySubmit = (formData: FormData) => {
    setCode((formData.get('code') as string) ?? '')
    dispatchVerify(formData)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h1 className="mb-2 text-center text-2xl font-bold text-peace-navy dark:text-white">
        비밀번호 찾기
      </h1>
      <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
        아이디는 가입 시 사용한 이메일입니다. 비밀번호를 잊으셨다면 아래에서 재설정해 주세요.
      </p>

      {step === 'email' && (
        <>
          {requestState && !requestState.success && (
            <div
              role="alert"
              className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400"
            >
              {requestState.message}
            </div>
          )}
          <form action={handleRequestSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                autoComplete="email"
                required
                aria-invalid={!!requestState?.fieldErrors?.email}
              />
              {requestState?.fieldErrors?.email && (
                <p className="text-sm text-red-500">{requestState.fieldErrors.email}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-peace-navy text-white hover:bg-peace-navy/90"
              disabled={isRequestPending}
            >
              {isRequestPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  발송 중...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  인증 코드 받기
                </>
              )}
            </Button>
          </form>
        </>
      )}

      {step === 'code' && (
        <>
          {requestState?.success && (
            <div className="mb-4 rounded-lg bg-peace-sky/10 p-3 text-sm text-peace-navy dark:text-peace-sky">
              {requestState.message}
            </div>
          )}
          {verifyState && !verifyState.success && (
            <div
              role="alert"
              className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400"
            >
              {verifyState.message}
            </div>
          )}
          <form action={handleVerifySubmit} className="space-y-4">
            <input type="hidden" name="email" value={email} />
            <div className="space-y-2">
              <Label htmlFor="code">인증 코드</Label>
              <Input
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="숫자 6자리"
                autoComplete="one-time-code"
                required
                aria-invalid={!!verifyState?.fieldErrors?.code}
              />
              {verifyState?.fieldErrors?.code && (
                <p className="text-sm text-red-500">{verifyState.fieldErrors.code}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-peace-navy text-white hover:bg-peace-navy/90"
              disabled={isVerifyPending}
            >
              {isVerifyPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  확인 중...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  코드 확인
                </>
              )}
            </Button>
          </form>
        </>
      )}

      {step === 'password' && (
        <>
          {resetState && !resetState.success && (
            <div
              role="alert"
              className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400"
            >
              {resetState.message}
            </div>
          )}
          <form action={dispatchReset} className="space-y-4">
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="code" value={code} />
            <div className="space-y-2">
              <Label htmlFor="newPassword">새 비밀번호</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="8자 이상 입력하세요"
                autoComplete="new-password"
                required
                aria-invalid={!!resetState?.fieldErrors?.newPassword}
              />
              {resetState?.fieldErrors?.newPassword && (
                <p className="text-sm text-red-500">{resetState.fieldErrors.newPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                autoComplete="new-password"
                required
                aria-invalid={!!resetState?.fieldErrors?.confirmPassword}
              />
              {resetState?.fieldErrors?.confirmPassword && (
                <p className="text-sm text-red-500">{resetState.fieldErrors.confirmPassword}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-peace-navy text-white hover:bg-peace-navy/90"
              disabled={isResetPending}
            >
              {isResetPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  변경 중...
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  비밀번호 변경
                </>
              )}
            </Button>
          </form>
        </>
      )}

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <Link href="/login" className="font-medium text-peace-sky hover:underline">
          로그인으로 돌아가기
        </Link>
      </p>
    </div>
  )
}
