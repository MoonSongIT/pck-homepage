import { z } from 'zod/v4'

export const donateSchema = z.object({
  donorName: z
    .string()
    .min(2, '이름은 2자 이상이어야 합니다')
    .max(50, '이름은 50자 이하여야 합니다'),
  donorEmail: z.string().email('올바른 이메일 형식이 아닙니다'),
  phone: z
    .string()
    .regex(/^01[016789]\d{7,8}$/, '올바른 전화번호 형식이 아닙니다'),
  amount: z
    .number()
    .int()
    .min(1000, '최소 1,000원 이상이어야 합니다'),
  type: z.enum(['REGULAR', 'ONE_TIME']),
  isAnonymous: z.boolean().default(false),
  privacyAgreed: z.literal(true, '개인정보처리방침에 동의해야 합니다'),
})

export type DonateInput = z.infer<typeof donateSchema>
