import { describe, it, expect } from 'vitest'
import { donateSchema } from '../donate'

describe('donateSchema', () => {
  const validInput = {
    donorName: '홍길동',
    donorEmail: 'hong@example.com',
    phone: '01012345678',
    amount: 10000,
    type: 'ONE_TIME' as const,
    isAnonymous: false,
    privacyAgreed: true as const,
  }

  it('유효한 후원 입력을 통과시킨다', () => {
    const result = donateSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('정기 후원도 통과시킨다', () => {
    const result = donateSchema.safeParse({ ...validInput, type: 'REGULAR' })
    expect(result.success).toBe(true)
  })

  it('이름이 2자 미만이면 거부한다', () => {
    const result = donateSchema.safeParse({ ...validInput, donorName: '홍' })
    expect(result.success).toBe(false)
  })

  it('잘못된 이메일 형식을 거부한다', () => {
    const result = donateSchema.safeParse({ ...validInput, donorEmail: 'bad' })
    expect(result.success).toBe(false)
  })

  it('잘못된 전화번호 형식을 거부한다', () => {
    const cases = ['02-1234-5678', '1234567890', '010-1234', 'abc']
    for (const phone of cases) {
      const result = donateSchema.safeParse({ ...validInput, phone })
      expect(result.success).toBe(false)
    }
  })

  it('올바른 전화번호 형식을 통과시킨다', () => {
    const cases = ['01012345678', '01112345678', '01612345678', '0191234567']
    for (const phone of cases) {
      const result = donateSchema.safeParse({ ...validInput, phone })
      expect(result.success).toBe(true)
    }
  })

  it('금액이 1000원 미만이면 거부한다', () => {
    const result = donateSchema.safeParse({ ...validInput, amount: 999 })
    expect(result.success).toBe(false)
  })

  it('소수점 금액을 거부한다', () => {
    const result = donateSchema.safeParse({ ...validInput, amount: 1000.5 })
    expect(result.success).toBe(false)
  })

  it('개인정보 미동의 시 거부한다', () => {
    const result = donateSchema.safeParse({ ...validInput, privacyAgreed: false })
    expect(result.success).toBe(false)
  })

  it('잘못된 type 값을 거부한다', () => {
    const result = donateSchema.safeParse({ ...validInput, type: 'MONTHLY' })
    expect(result.success).toBe(false)
  })
})
