'use server'

import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations/auth'

export type AuthResult = {
  success: boolean
  message: string
  fieldErrors?: Record<string, string>
}

export async function registerUser(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  }

  // 1) Zod 검증
  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (key && typeof key === 'string') {
        fieldErrors[key] = issue.message
      }
    }
    return { success: false, message: '입력 정보를 확인해 주세요.', fieldErrors }
  }

  const { name, email, password } = parsed.data

  try {
    // 2) 이메일 중복 확인
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (existing) {
      return {
        success: false,
        message: '이미 등록된 이메일입니다.',
        fieldErrors: { email: '이미 등록된 이메일입니다.' },
      }
    }

    // 3) 비밀번호 해시 + 사용자 생성
    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        hashedPassword,
      },
    })

    return { success: true, message: '회원가입이 완료되었습니다. 로그인해 주세요.' }
  } catch (error) {
    console.error('[Auth] Register failed:', error)
    return { success: false, message: '회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }
  }
}
