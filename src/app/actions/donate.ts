'use server'

import { nanoid } from 'nanoid'

import { prisma } from '@/lib/prisma'
import { donateSchema } from '@/lib/validations/donate'

export type DonateResult = {
  success: boolean
  message: string
  orderId?: string
  fieldErrors?: Record<string, string>
}

export async function createDonation(
  _prev: DonateResult | null,
  formData: FormData,
): Promise<DonateResult> {
  const raw = {
    donorName: formData.get('donorName'),
    donorEmail: formData.get('donorEmail'),
    phone: formData.get('phone'),
    amount: Number(formData.get('amount')),
    type: formData.get('type'),
    isAnonymous: formData.get('isAnonymous') === 'on',
    privacyAgreed: formData.get('privacyAgreed') === 'on',
  }

  const parsed = donateSchema.safeParse(raw)
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

  const { donorName, donorEmail, phone, amount, type, isAnonymous } =
    parsed.data

  const now = new Date()
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const orderId = `PCK-${dateStr}-${nanoid(8)}`

  try {
    await prisma.donation.create({
      data: {
        orderId,
        donorName,
        donorEmail: donorEmail.toLowerCase().trim(),
        phone,
        amount,
        type,
        isAnonymous,
        status: 'PENDING',
      },
    })

    return {
      success: true,
      message: '결제 준비가 완료되었습니다',
      orderId,
    }
  } catch (error: unknown) {
    console.error('[Donate] Create donation failed:', error)
    return {
      success: false,
      message: '후원 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    }
  }
}
