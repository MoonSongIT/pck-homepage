'use server'

import { z } from 'zod/v4'
import { prisma } from '@/lib/prisma'
import { NEWSLETTER_CONFIG } from '@/lib/constants/newsletter'

const emailSchema = z.string().email()

export type NewsletterResult = {
  success: boolean
  message: string
}

export async function subscribeNewsletter(
  _prev: NewsletterResult | null,
  formData: FormData
): Promise<NewsletterResult> {
  const rawEmail = formData.get('email')

  // 1) Zod 이메일 검증
  const parsed = emailSchema.safeParse(rawEmail)
  if (!parsed.success) {
    return { success: false, message: NEWSLETTER_CONFIG.invalidMessage }
  }

  const email = parsed.data.toLowerCase().trim()

  try {
    // 2) DB 저장
    await prisma.newsletterSubscriber.create({
      data: { email },
    })

    // 3) Resend 환영 이메일 (API Key 있을 때만)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'Pax Christi Korea <noreply@paxchristikorea.or.kr>',
          to: email,
          subject: '팍스크리스티코리아 뉴스레터 구독을 환영합니다',
          html: `
            <h2>환영합니다!</h2>
            <p>팍스크리스티코리아의 평화 소식을 받아보실 수 있게 되었습니다.</p>
            <p>비폭력과 평화, 화해와 연대의 가치를 함께 실천해주세요.</p>
            <br />
            <p>— 팍스크리스티코리아 드림</p>
          `,
        })
      } catch {
        // 이메일 발송 실패해도 구독 자체는 성공 처리
        console.error('[Newsletter] Resend email failed')
      }
    }

    return { success: true, message: NEWSLETTER_CONFIG.successMessage }
  } catch (error: unknown) {
    // unique constraint violation (이미 구독 중)
    if (
      error instanceof Error &&
      error.message.includes('Unique constraint')
    ) {
      return { success: false, message: NEWSLETTER_CONFIG.duplicateMessage }
    }

    console.error('[Newsletter] Subscribe failed:', error)
    return { success: false, message: NEWSLETTER_CONFIG.errorMessage }
  }
}
