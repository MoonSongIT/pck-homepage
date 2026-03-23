'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Loader2, LogIn, MessageCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginSchema } from '@/lib/validations/auth'

export const LoginForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const formData = new FormData(e.currentTarget)
    const raw = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    // 클라이언트 Zod 검증
    const parsed = loginSchema.safeParse(raw)
    if (!parsed.success) {
      const errors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (key && typeof key === 'string') {
          errors[key] = issue.message
        }
      }
      setFieldErrors(errors)
      return
    }

    setIsPending(true)

    try {
      const result = await signIn('credentials', {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setIsPending(false)
    }
  }

  const handleKakaoLogin = () => {
    signIn('kakao', { callbackUrl })
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h1 className="mb-6 text-center text-2xl font-bold text-peace-navy dark:text-white">
        로그인
      </h1>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            autoComplete="email"
            required
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && (
            <p className="text-sm text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            required
            aria-invalid={!!fieldErrors.password}
          />
          {fieldErrors.password && (
            <p className="text-sm text-red-500">{fieldErrors.password}</p>
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
              로그인 중...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              로그인
            </>
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            또는
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-yellow-400 bg-yellow-300 text-gray-900 hover:bg-yellow-400"
        onClick={handleKakaoLogin}
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        카카오로 로그인
      </Button>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        아직 회원이 아니신가요?{' '}
        <Link
          href="/register"
          className="font-medium text-peace-sky hover:underline"
        >
          회원가입
        </Link>
      </p>
    </div>
  )
}
