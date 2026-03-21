'use server'

import { prisma } from '@/lib/prisma'
import { educationApplySchema, EDUCATION_CONFIG } from '@/lib/constants/education'

export type EducationResult = {
  success: boolean
  message: string
  fieldErrors?: Record<string, string>
}

export async function applyEducation(
  _prev: EducationResult | null,
  formData: FormData,
): Promise<EducationResult> {
  // 1) FormData → object
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    affiliation: formData.get('affiliation') || undefined,
    motivation: formData.get('motivation'),
    cohort: formData.get('cohort') || undefined,
    privacyAgreed: formData.get('privacyAgreed') === 'on',
  }

  // 2) Zod 서버 재검증
  const parsed = educationApplySchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === 'string' && !fieldErrors[key]) {
        fieldErrors[key] = issue.message
      }
    }
    return {
      success: false,
      message: '입력 정보를 확인해 주세요',
      fieldErrors,
    }
  }

  const { name, email, phone, affiliation, motivation, cohort } = parsed.data

  try {
    // 3) DB 저장
    await prisma.educationApplication.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        phone,
        affiliation: affiliation || null,
        motivation,
        cohort: cohort || null,
        status: 'PENDING',
      },
    })

    // 4) Resend 이메일 발송
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        // 신청자에게 확인 이메일
        await resend.emails.send({
          from: 'Pax Christi Korea <noreply@paxchristikorea.or.kr>',
          to: email,
          subject: '팍스크리스티코리아 평화학교 교육 신청 접수 확인',
          html: `
            <h2>${name}님, 교육 신청이 접수되었습니다</h2>
            <p>팍스크리스티코리아 평화학교에 관심을 가져주셔서 감사합니다.</p>
            <p>신청하신 내용을 검토한 후 안내 드리겠습니다.</p>
            <br />
            <p>— 팍스크리스티코리아 드림</p>
          `,
        })

        // 관리자에게 알림 이메일
        const adminEmail = process.env.ADMIN_EMAIL || 'paxchristikorea@gmail.com'
        await resend.emails.send({
          from: 'Pax Christi Korea <noreply@paxchristikorea.or.kr>',
          to: adminEmail,
          subject: `[평화학교] 새로운 교육 신청 - ${name}`,
          html: `
            <h2>새로운 교육 신청이 접수되었습니다</h2>
            <ul>
              <li><strong>이름:</strong> ${name}</li>
              <li><strong>이메일:</strong> ${email}</li>
              <li><strong>전화번호:</strong> ${phone}</li>
              ${affiliation ? `<li><strong>소속:</strong> ${affiliation}</li>` : ''}
              <li><strong>지원 동기:</strong> ${motivation}</li>
              ${cohort ? `<li><strong>기수:</strong> ${cohort}</li>` : ''}
            </ul>
          `,
        })
      } catch {
        console.error('[Education] Resend email failed')
      }
    }

    return {
      success: true,
      message: EDUCATION_CONFIG.successMessage,
    }
  } catch (error: unknown) {
    console.error('[Education] Apply failed:', error)
    return {
      success: false,
      message: '신청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    }
  }
}
