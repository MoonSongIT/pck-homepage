import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  registerSchema,
  requestResetSchema,
  verifyResetCodeSchema,
  resetPasswordSchema,
} from '../auth'

describe('loginSchema', () => {
  it('유효한 로그인 입력을 통과시킨다', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('잘못된 이메일 형식을 거부한다', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('빈 이메일을 거부한다', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('빈 비밀번호를 거부한다', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  const validInput = {
    name: '홍길동',
    email: 'hong@example.com',
    password: 'securepass1',
    confirmPassword: 'securepass1',
  }

  it('유효한 회원가입 입력을 통과시킨다', () => {
    const result = registerSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('이름이 2자 미만이면 거부한다', () => {
    const result = registerSchema.safeParse({ ...validInput, name: '홍' })
    expect(result.success).toBe(false)
  })

  it('이름이 50자 초과이면 거부한다', () => {
    const result = registerSchema.safeParse({ ...validInput, name: '홍'.repeat(51) })
    expect(result.success).toBe(false)
  })

  it('비밀번호가 8자 미만이면 거부한다', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      password: '1234567',
      confirmPassword: '1234567',
    })
    expect(result.success).toBe(false)
  })

  it('비밀번호 불일치 시 거부한다', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      confirmPassword: 'differentpass',
    })
    expect(result.success).toBe(false)
  })
})

describe('requestResetSchema', () => {
  it('유효한 이메일을 통과시킨다', () => {
    const result = requestResetSchema.safeParse({ email: 'test@example.com' })
    expect(result.success).toBe(true)
  })

  it('잘못된 이메일 형식을 거부한다', () => {
    const result = requestResetSchema.safeParse({ email: 'not-an-email' })
    expect(result.success).toBe(false)
  })
})

describe('verifyResetCodeSchema', () => {
  it('숫자 6자리 코드를 통과시킨다', () => {
    const result = verifyResetCodeSchema.safeParse({ email: 'test@example.com', code: '123456' })
    expect(result.success).toBe(true)
  })

  it('6자리가 아닌 코드를 거부한다', () => {
    const result = verifyResetCodeSchema.safeParse({ email: 'test@example.com', code: '12345' })
    expect(result.success).toBe(false)
  })

  it('숫자가 아닌 코드를 거부한다', () => {
    const result = verifyResetCodeSchema.safeParse({ email: 'test@example.com', code: 'abcdef' })
    expect(result.success).toBe(false)
  })
})

describe('resetPasswordSchema', () => {
  const validInput = {
    email: 'test@example.com',
    code: '123456',
    newPassword: 'newpassword123',
    confirmPassword: 'newpassword123',
  }

  it('유효한 입력을 통과시킨다', () => {
    const result = resetPasswordSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('새 비밀번호가 8자 미만이면 거부한다', () => {
    const result = resetPasswordSchema.safeParse({
      ...validInput,
      newPassword: '1234567',
      confirmPassword: '1234567',
    })
    expect(result.success).toBe(false)
  })

  it('비밀번호 확인이 일치하지 않으면 거부한다', () => {
    const result = resetPasswordSchema.safeParse({
      ...validInput,
      confirmPassword: 'differentpass',
    })
    expect(result.success).toBe(false)
  })
})
