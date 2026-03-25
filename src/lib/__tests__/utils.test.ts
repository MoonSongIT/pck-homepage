import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn (className merge utility)', () => {
  it('단일 클래스를 반환한다', () => {
    expect(cn('text-red-500')).toBe('text-red-500')
  })

  it('여러 클래스를 병합한다', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
  })

  it('조건부 클래스를 처리한다', () => {
    expect(cn('base', false && 'hidden', true && 'visible')).toBe('base visible')
  })

  it('undefined/null 값을 무시한다', () => {
    expect(cn('base', undefined, null)).toBe('base')
  })

  it('Tailwind 충돌을 해소한다 (twMerge)', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('빈 호출 시 빈 문자열을 반환한다', () => {
    expect(cn()).toBe('')
  })
})
