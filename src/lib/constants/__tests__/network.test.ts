import { describe, it, expect } from 'vitest'
import {
  MEMBER_COUNTRIES,
  CONTINENT_LABELS,
  NETWORK_CONFIG,
  getContinentStats,
} from '../network'
import type { Continent } from '../network'

describe('MEMBER_COUNTRIES', () => {
  it('49개 이상 회원국이 있다', () => {
    expect(MEMBER_COUNTRIES.length).toBeGreaterThanOrEqual(49)
  })

  it('모든 회원국에 필수 필드가 있다', () => {
    for (const member of MEMBER_COUNTRIES) {
      expect(member.id).toBeTruthy()
      expect(member.country).toBeTruthy()
      expect(member.countryEn).toBeTruthy()
      expect(member.iso3).toMatch(/^[A-Z]{3}$/)
      expect(member.coordinates).toHaveLength(2)
      expect(member.name).toBeTruthy()
      expect(member.nameEn).toBeTruthy()
      expect(member.continent).toBeTruthy()
    }
  })

  it('모든 id가 고유하다', () => {
    const ids = MEMBER_COUNTRIES.map((m) => m.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('모든 iso3 코드가 고유하다', () => {
    const codes = MEMBER_COUNTRIES.map((m) => m.iso3)
    const unique = new Set(codes)
    expect(unique.size).toBe(codes.length)
  })

  it('좌표가 유효한 범위 내에 있다 (경도 -180~180, 위도 -90~90)', () => {
    for (const member of MEMBER_COUNTRIES) {
      const [lng, lat] = member.coordinates
      expect(lng).toBeGreaterThanOrEqual(-180)
      expect(lng).toBeLessThanOrEqual(180)
      expect(lat).toBeGreaterThanOrEqual(-90)
      expect(lat).toBeLessThanOrEqual(90)
    }
  })

  it('한국이 isHighlighted로 표시되어 있다', () => {
    const korea = MEMBER_COUNTRIES.find((m) => m.id === 'kor')
    expect(korea).toBeDefined()
    expect(korea!.isHighlighted).toBe(true)
  })

  it('모든 continent 값이 유효하다', () => {
    const validContinents: Continent[] = ['asia', 'europe', 'americas', 'africa', 'oceania']
    for (const member of MEMBER_COUNTRIES) {
      expect(validContinents).toContain(member.continent)
    }
  })
})

describe('CONTINENT_LABELS', () => {
  it('5개 대륙 라벨이 모두 있다', () => {
    const continents: Continent[] = ['asia', 'europe', 'americas', 'africa', 'oceania']
    for (const c of continents) {
      expect(CONTINENT_LABELS[c]).toBeDefined()
      expect(CONTINENT_LABELS[c].label).toBeTruthy()
      expect(CONTINENT_LABELS[c].labelEn).toBeTruthy()
    }
  })
})

describe('getContinentStats', () => {
  it('모든 대륙의 합이 전체 회원국 수와 같다', () => {
    const stats = getContinentStats()
    let total = 0
    for (const count of stats.values()) {
      total += count
    }
    expect(total).toBe(MEMBER_COUNTRIES.length)
  })

  it('유럽 회원국이 가장 많다', () => {
    const stats = getContinentStats()
    const europeCount = stats.get('europe') || 0
    for (const [continent, count] of stats) {
      if (continent !== 'europe') {
        expect(europeCount).toBeGreaterThanOrEqual(count)
      }
    }
  })
})

describe('NETWORK_CONFIG', () => {
  it('mapCenter 좌표가 유효하다', () => {
    expect(NETWORK_CONFIG.mapCenter).toHaveLength(2)
  })

  it('pciInfo에 필수 정보가 있다', () => {
    expect(NETWORK_CONFIG.pciInfo.title).toBeTruthy()
    expect(NETWORK_CONFIG.pciInfo.founded).toBe(1945)
    expect(NETWORK_CONFIG.pciInfo.website).toMatch(/^https:\/\//)
  })
})
