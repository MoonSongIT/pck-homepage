// 비밀번호 재설정(이메일 인증 코드) 관련 서버 액션
'use server'

import { randomInt } from 'crypto'
import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'
import {
  requestResetSchema,
  verifyResetCodeSchema,
  resetPasswordSchema,
} from '@/lib/validations/auth'
import {
  checkRateLimit,
  passwordResetRequestRateLimit,
  passwordResetVerifyRateLimit,
} from '@/lib/rate-limit'
import type { AuthResult } from './auth'

// TODO: paxchristikorea.org 도메인이 Resend에 인증되면 noreply@paxchristikorea.org로 교체할 것
// (가비아 DNS 접근 권한 미확보로 임시로 Resend 기본 도메인 사용 중, Docs/4.02 참고)
const FROM_ADDRESS = 'Pax Christi Korea <onboarding@resend.dev>'

const CODE_EXPIRY_MINUTES = 10
const MAX_VERIFY_ATTEMPTS = 5
const GENERIC_REQUEST_MESSAGE =
  '입력하신 이메일로 인증 코드를 발송했습니다. 이메일을 확인해 주세요.'
const GENERIC_VERIFY_ERROR = '인증 코드가 올바르지 않거나 만료되었습니다.'

const generateResetCode = (): string => randomInt(0, 1_000_000).toString().padStart(6, '0')

const sendResetCodeEmail = async (email: string, name: string | null, code: string) => {
  if (!process.env.RESEND_API_KEY) return

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: '팍스크리스티코리아 비밀번호 재설정 인증 코드',
      html: `
        <meta charset="utf-8" />
        <h2>${name ?? '회원'}님, 비밀번호 재설정 인증 코드입니다</h2>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
        <p>이 코드는 ${CODE_EXPIRY_MINUTES}분간 유효합니다.</p>
        <p>본인이 요청하지 않았다면 이 이메일을 무시해 주세요.</p>
        <br />
        <p>— 팍스크리스티코리아 드림</p>
      `,
    })
  } catch {
    console.error('[PasswordReset] Reset code email failed')
  }
}

const sendKakaoOnlyNoticeEmail = async (email: string, name: string | null) => {
  if (!process.env.RESEND_API_KEY) return

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: '팍스크리스티코리아 비밀번호 재설정 안내',
      html: `
        <meta charset="utf-8" />
        <h2>${name ?? '회원'}님, 이 계정은 카카오 로그인으로 가입되어 있습니다</h2>
        <p>비밀번호가 설정되어 있지 않아 재설정할 수 없습니다. 로그인 페이지에서 카카오 로그인을 이용해 주세요.</p>
        <br />
        <p>— 팍스크리스티코리아 드림</p>
      `,
    })
  } catch {
    console.error('[PasswordReset] Kakao-only notice email failed')
  }
}

export async function requestPasswordReset(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const raw = { email: formData.get('email') }

  const parsed = requestResetSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (key && typeof key === 'string') fieldErrors[key] = issue.message
    }
    return { success: false, message: '입력 정보를 확인해 주세요.', fieldErrors }
  }

  const email = parsed.data.email.toLowerCase().trim()

  const rateLimitResult = await checkRateLimit(passwordResetRequestRateLimit, email)
  if (!rateLimitResult.success) {
    return { success: false, message: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' }
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    // 계정 존재 여부와 무관하게 항상 동일한 성공 메시지를 반환한다 (이메일 열거 공격 방지).
    if (!user) {
      return { success: true, message: GENERIC_REQUEST_MESSAGE }
    }

    if (!user.hashedPassword) {
      await sendKakaoOnlyNoticeEmail(user.email, user.name)
      return { success: true, message: GENERIC_REQUEST_MESSAGE }
    }

    const code = generateResetCode()
    const codeHash = await bcrypt.hash(code, 12)
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000)

    // 사용자당 활성 토큰은 1개만 유지 (재발급 시 이전 토큰 무효화).
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, consumedAt: null },
    })
    await prisma.passwordResetToken.create({
      data: { userId: user.id, codeHash, expiresAt },
    })

    await sendResetCodeEmail(user.email, user.name, code)

    return { success: true, message: GENERIC_REQUEST_MESSAGE }
  } catch (error) {
    console.error('[PasswordReset] Request failed:', error)
    return {
      success: false,
      message: '요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    }
  }
}

export async function verifyResetCode(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const raw = { email: formData.get('email'), code: formData.get('code') }

  const parsed = verifyResetCodeSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (key && typeof key === 'string') fieldErrors[key] = issue.message
    }
    return { success: false, message: '입력 정보를 확인해 주세요.', fieldErrors }
  }

  const email = parsed.data.email.toLowerCase().trim()
  const { code } = parsed.data

  const rateLimitResult = await checkRateLimit(passwordResetVerifyRateLimit, email)
  if (!rateLimitResult.success) {
    return { success: false, message: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' }
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return {
        success: false,
        message: GENERIC_VERIFY_ERROR,
        fieldErrors: { code: GENERIC_VERIFY_ERROR },
      }
    }

    const token = await prisma.passwordResetToken.findFirst({
      where: { userId: user.id, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    })

    if (!token || token.expiresAt < new Date() || token.attempts >= MAX_VERIFY_ATTEMPTS) {
      return {
        success: false,
        message: GENERIC_VERIFY_ERROR,
        fieldErrors: { code: GENERIC_VERIFY_ERROR },
      }
    }

    const isMatch = await bcrypt.compare(code, token.codeHash)
    if (!isMatch) {
      await prisma.passwordResetToken.update({
        where: { id: token.id },
        data: { attempts: { increment: 1 } },
      })
      return {
        success: false,
        message: GENERIC_VERIFY_ERROR,
        fieldErrors: { code: GENERIC_VERIFY_ERROR },
      }
    }

    return { success: true, message: '인증되었습니다. 새 비밀번호를 설정해 주세요.' }
  } catch (error) {
    console.error('[PasswordReset] Verify failed:', error)
    return {
      success: false,
      message: '인증 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    }
  }
}

export async function resetPassword(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const raw = {
    email: formData.get('email'),
    code: formData.get('code'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  }

  const parsed = resetPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (key && typeof key === 'string') fieldErrors[key] = issue.message
    }
    return { success: false, message: '입력 정보를 확인해 주세요.', fieldErrors }
  }

  const email = parsed.data.email.toLowerCase().trim()
  const { code, newPassword } = parsed.data

  const rateLimitResult = await checkRateLimit(passwordResetVerifyRateLimit, email)
  if (!rateLimitResult.success) {
    return { success: false, message: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' }
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return { success: false, message: GENERIC_VERIFY_ERROR }
    }

    const token = await prisma.passwordResetToken.findFirst({
      where: { userId: user.id, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    })

    if (!token || token.expiresAt < new Date() || token.attempts >= MAX_VERIFY_ATTEMPTS) {
      return { success: false, message: GENERIC_VERIFY_ERROR }
    }

    const isMatch = await bcrypt.compare(code, token.codeHash)
    if (!isMatch) {
      await prisma.passwordResetToken.update({
        where: { id: token.id },
        data: { attempts: { increment: 1 } },
      })
      return { success: false, message: GENERIC_VERIFY_ERROR }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { hashedPassword } }),
      prisma.passwordResetToken.update({
        where: { id: token.id },
        data: { consumedAt: new Date() },
      }),
    ])

    return {
      success: true,
      message: '비밀번호가 재설정되었습니다. 새 비밀번호로 다시 로그인해 주세요.',
    }
  } catch (error) {
    console.error('[PasswordReset] Reset failed:', error)
    return {
      success: false,
      message: '비밀번호 재설정 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    }
  }
}
