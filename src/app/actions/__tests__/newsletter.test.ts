import { describe, it, expect, vi, beforeEach } from 'vitest'

// Prisma mock
const mockCreate = vi.fn()
vi.mock('@/lib/prisma', () => ({
  prisma: {
    newsletterSubscriber: {
      create: (...args: unknown[]) => mockCreate(...args),
    },
  },
}))

// Newsletter config mock
vi.mock('@/lib/constants/newsletter', () => ({
  NEWSLETTER_CONFIG: {
    successMessage: '구독이 완료되었습니다!',
    duplicateMessage: '이미 구독 중인 이메일입니다.',
    invalidMessage: '올바른 이메일 형식이 아닙니다.',
    errorMessage: '오류가 발생했습니다. 다시 시도해 주세요.',
  },
}))

// subscribeNewsletter를 import하기 전에 mock 설정 필요
import { subscribeNewsletter } from '../newsletter'

describe('subscribeNewsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.RESEND_API_KEY
  })

  it('유효한 이메일로 구독 성공', async () => {
    mockCreate.mockResolvedValueOnce({ id: '1', email: 'test@example.com' })

    const formData = new FormData()
    formData.set('email', 'test@example.com')

    const result = await subscribeNewsletter(null, formData)
    expect(result.success).toBe(true)
    expect(result.message).toBe('구독이 완료되었습니다!')
    expect(mockCreate).toHaveBeenCalledWith({
      data: { email: 'test@example.com' },
    })
  })

  it('잘못된 이메일 형식 시 실패', async () => {
    const formData = new FormData()
    formData.set('email', 'not-valid')

    const result = await subscribeNewsletter(null, formData)
    expect(result.success).toBe(false)
    expect(result.message).toBe('올바른 이메일 형식이 아닙니다.')
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('이메일을 소문자로 변환한다', async () => {
    mockCreate.mockResolvedValueOnce({ id: '2', email: 'test@example.com' })

    const formData = new FormData()
    formData.set('email', 'TEST@EXAMPLE.COM')

    await subscribeNewsletter(null, formData)
    expect(mockCreate).toHaveBeenCalledWith({
      data: { email: 'test@example.com' },
    })
  })

  it('중복 이메일 시 적절한 메시지를 반환한다', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Unique constraint failed'))

    const formData = new FormData()
    formData.set('email', 'dup@example.com')

    const result = await subscribeNewsletter(null, formData)
    expect(result.success).toBe(false)
    expect(result.message).toBe('이미 구독 중인 이메일입니다.')
  })

  it('DB 오류 시 일반 에러 메시지를 반환한다', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Connection failed'))

    const formData = new FormData()
    formData.set('email', 'test@example.com')

    const result = await subscribeNewsletter(null, formData)
    expect(result.success).toBe(false)
    expect(result.message).toBe('오류가 발생했습니다. 다시 시도해 주세요.')
  })
})
