import { describe, it, expect } from 'vitest'
import { NAV_ITEMS, SNS_LINKS, CONTACT_INFO, ORG_INFO, FOOTER_LINKS } from '../navigation'

describe('NAV_ITEMS', () => {
  it('모든 항목에 labelKey와 href가 있다', () => {
    for (const item of NAV_ITEMS) {
      expect(item.labelKey).toBeTruthy()
      expect(item.href).toMatch(/^\//)
    }
  })

  it('최소 5개 이상의 네비게이션 항목이 있다', () => {
    expect(NAV_ITEMS.length).toBeGreaterThanOrEqual(5)
  })

  it('href가 슬래시로 시작한다', () => {
    for (const item of NAV_ITEMS) {
      expect(item.href.startsWith('/')).toBe(true)
    }
  })
})

describe('SNS_LINKS', () => {
  it('모든 SNS 링크에 필수 필드가 있다', () => {
    for (const link of SNS_LINKS) {
      expect(link.label).toBeTruthy()
      expect(link.href).toMatch(/^https:\/\//)
      expect(link.icon).toBeTruthy()
    }
  })
})

describe('CONTACT_INFO', () => {
  it('전화번호, 이메일, 주소가 있다', () => {
    expect(CONTACT_INFO.phone).toBeTruthy()
    expect(CONTACT_INFO.email).toMatch(/@/)
    expect(CONTACT_INFO.address).toBeTruthy()
  })
})

describe('ORG_INFO', () => {
  it('한/영 이름과 사업자번호가 있다', () => {
    expect(ORG_INFO.name).toBeTruthy()
    expect(ORG_INFO.nameEn).toBeTruthy()
    expect(ORG_INFO.businessNumber).toMatch(/^\d{3}-\d{2}-\d{5}$/)
  })
})

describe('FOOTER_LINKS', () => {
  it('모든 항목에 labelKey와 href가 있다', () => {
    for (const link of FOOTER_LINKS) {
      expect(link.labelKey).toBeTruthy()
      expect(link.href).toMatch(/^\//)
    }
  })
})
