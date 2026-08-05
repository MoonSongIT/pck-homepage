import { describe, it, expect, vi, beforeEach } from 'vitest'

// Prisma mock
const mockFindUnique = vi.fn()
const mockUserUpdate = vi.fn()
const mockTokenDeleteMany = vi.fn()
const mockTokenCreate = vi.fn()
const mockTokenFindFirst = vi.fn()
const mockTokenUpdate = vi.fn()
const mockTransaction = vi.fn()

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      update: (...args: unknown[]) => mockUserUpdate(...args),
    },
    passwordResetToken: {
      deleteMany: (...args: unknown[]) => mockTokenDeleteMany(...args),
      create: (...args: unknown[]) => mockTokenCreate(...args),
      findFirst: (...args: unknown[]) => mockTokenFindFirst(...args),
      update: (...args: unknown[]) => mockTokenUpdate(...args),
    },
    $transaction: (...args: unknown[]) => mockTransaction(...args),
  },
}))

// Rate limit mock
const mockCheckRateLimit = vi.fn()
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...args: unknown[]) => mockCheckRateLimit(...args),
  passwordResetRequestRateLimit: null,
  passwordResetVerifyRateLimit: null,
}))

// bcryptjs mock
const mockBcryptHash = vi.fn()
const mockBcryptCompare = vi.fn()
vi.mock('bcryptjs', () => ({
  default: {
    hash: (...args: unknown[]) => mockBcryptHash(...args),
    compare: (...args: unknown[]) => mockBcryptCompare(...args),
  },
}))

// mock 설정 이후에 import
import { requestPasswordReset, verifyResetCode, resetPassword } from '../password-reset'

describe('requestPasswordReset', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCheckRateLimit.mockResolvedValue({ success: true })
    delete process.env.RESEND_API_KEY
  })

  it('잘못된 이메일 형식이면 실패한다', async () => {
    const formData = new FormData()
    formData.set('email', 'not-an-email')

    const result = await requestPasswordReset(null, formData)

    expect(result.success).toBe(false)
    expect(result.fieldErrors?.email).toBeDefined()
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('Rate Limit 초과 시 실패한다', async () => {
    mockCheckRateLimit.mockResolvedValueOnce({ success: false })
    const formData = new FormData()
    formData.set('email', 'test@example.com')

    const result = await requestPasswordReset(null, formData)

    expect(result.success).toBe(false)
    expect(result.message).toContain('요청이 너무 많습니다')
  })

  it('존재하지 않는 이메일이어도 동일한 성공 메시지를 반환한다 (열거 공격 방지)', async () => {
    mockFindUnique.mockResolvedValueOnce(null)
    const formData = new FormData()
    formData.set('email', 'noone@example.com')

    const result = await requestPasswordReset(null, formData)

    expect(result.success).toBe(true)
    expect(mockTokenCreate).not.toHaveBeenCalled()
  })

  it('카카오 전용 계정(비밀번호 없음)은 코드 발급 없이 동일한 성공 메시지를 반환한다', async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: 'u1',
      email: 'kakao@example.com',
      name: '카카오유저',
      hashedPassword: null,
    })
    const formData = new FormData()
    formData.set('email', 'kakao@example.com')

    const result = await requestPasswordReset(null, formData)

    expect(result.success).toBe(true)
    expect(mockTokenCreate).not.toHaveBeenCalled()
  })

  it('정상 계정이면 이전 토큰을 무효화하고 새 토큰을 생성한다', async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: 'u1',
      email: 'test@example.com',
      name: '홍길동',
      hashedPassword: 'hashed',
    })
    mockBcryptHash.mockResolvedValueOnce('code-hash')
    const formData = new FormData()
    formData.set('email', 'test@example.com')

    const result = await requestPasswordReset(null, formData)

    expect(result.success).toBe(true)
    expect(mockTokenDeleteMany).toHaveBeenCalledWith({
      where: { userId: 'u1', consumedAt: null },
    })
    expect(mockTokenCreate).toHaveBeenCalledTimes(1)
  })
})

describe('verifyResetCode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCheckRateLimit.mockResolvedValue({ success: true })
  })

  it('코드 형식이 잘못되면 실패한다', async () => {
    const formData = new FormData()
    formData.set('email', 'test@example.com')
    formData.set('code', 'abc')

    const result = await verifyResetCode(null, formData)

    expect(result.success).toBe(false)
    expect(result.fieldErrors?.code).toBeDefined()
  })

  it('활성 토큰이 없으면 실패한다', async () => {
    mockFindUnique.mockResolvedValueOnce({ id: 'u1', email: 'test@example.com' })
    mockTokenFindFirst.mockResolvedValueOnce(null)
    const formData = new FormData()
    formData.set('email', 'test@example.com')
    formData.set('code', '123456')

    const result = await verifyResetCode(null, formData)

    expect(result.success).toBe(false)
  })

  it('시도 횟수를 초과한 토큰은 실패 처리하고 코드를 비교하지 않는다', async () => {
    mockFindUnique.mockResolvedValueOnce({ id: 'u1', email: 'test@example.com' })
    mockTokenFindFirst.mockResolvedValueOnce({
      id: 't1',
      attempts: 5,
      expiresAt: new Date(Date.now() + 60_000),
      codeHash: 'hash',
    })
    const formData = new FormData()
    formData.set('email', 'test@example.com')
    formData.set('code', '123456')

    const result = await verifyResetCode(null, formData)

    expect(result.success).toBe(false)
    expect(mockBcryptCompare).not.toHaveBeenCalled()
  })

  it('코드가 일치하지 않으면 시도 횟수를 증가시키고 실패한다', async () => {
    mockFindUnique.mockResolvedValueOnce({ id: 'u1', email: 'test@example.com' })
    mockTokenFindFirst.mockResolvedValueOnce({
      id: 't1',
      attempts: 0,
      expiresAt: new Date(Date.now() + 60_000),
      codeHash: 'hash',
    })
    mockBcryptCompare.mockResolvedValueOnce(false)
    const formData = new FormData()
    formData.set('email', 'test@example.com')
    formData.set('code', '123456')

    const result = await verifyResetCode(null, formData)

    expect(result.success).toBe(false)
    expect(mockTokenUpdate).toHaveBeenCalledWith({
      where: { id: 't1' },
      data: { attempts: { increment: 1 } },
    })
  })

  it('코드가 일치하면 성공한다', async () => {
    mockFindUnique.mockResolvedValueOnce({ id: 'u1', email: 'test@example.com' })
    mockTokenFindFirst.mockResolvedValueOnce({
      id: 't1',
      attempts: 0,
      expiresAt: new Date(Date.now() + 60_000),
      codeHash: 'hash',
    })
    mockBcryptCompare.mockResolvedValueOnce(true)
    const formData = new FormData()
    formData.set('email', 'test@example.com')
    formData.set('code', '123456')

    const result = await verifyResetCode(null, formData)

    expect(result.success).toBe(true)
  })
})

describe('resetPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCheckRateLimit.mockResolvedValue({ success: true })
  })

  it('비밀번호 확인이 일치하지 않으면 실패한다', async () => {
    const formData = new FormData()
    formData.set('email', 'test@example.com')
    formData.set('code', '123456')
    formData.set('newPassword', 'password123')
    formData.set('confirmPassword', 'different123')

    const result = await resetPassword(null, formData)

    expect(result.success).toBe(false)
    expect(result.fieldErrors?.confirmPassword).toBeDefined()
  })

  it('코드가 유효하지 않으면 비밀번호를 변경하지 않는다', async () => {
    mockFindUnique.mockResolvedValueOnce({ id: 'u1', email: 'test@example.com' })
    mockTokenFindFirst.mockResolvedValueOnce({
      id: 't1',
      attempts: 0,
      expiresAt: new Date(Date.now() + 60_000),
      codeHash: 'hash',
    })
    mockBcryptCompare.mockResolvedValueOnce(false)

    const formData = new FormData()
    formData.set('email', 'test@example.com')
    formData.set('code', '123456')
    formData.set('newPassword', 'newpassword123')
    formData.set('confirmPassword', 'newpassword123')

    const result = await resetPassword(null, formData)

    expect(result.success).toBe(false)
    expect(mockTransaction).not.toHaveBeenCalled()
  })

  it('코드가 유효하면 비밀번호를 갱신하고 토큰을 소비 처리한다', async () => {
    mockFindUnique.mockResolvedValueOnce({ id: 'u1', email: 'test@example.com' })
    mockTokenFindFirst.mockResolvedValueOnce({
      id: 't1',
      attempts: 0,
      expiresAt: new Date(Date.now() + 60_000),
      codeHash: 'hash',
    })
    mockBcryptCompare.mockResolvedValueOnce(true)
    mockBcryptHash.mockResolvedValueOnce('new-hashed-password')
    mockTransaction.mockResolvedValueOnce([{}, {}])

    const formData = new FormData()
    formData.set('email', 'test@example.com')
    formData.set('code', '123456')
    formData.set('newPassword', 'newpassword123')
    formData.set('confirmPassword', 'newpassword123')

    const result = await resetPassword(null, formData)

    expect(result.success).toBe(true)
    expect(mockUserUpdate).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: { hashedPassword: 'new-hashed-password' },
    })
    expect(mockTransaction).toHaveBeenCalledTimes(1)
  })
})
