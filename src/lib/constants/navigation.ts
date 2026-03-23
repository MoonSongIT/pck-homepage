export const NAV_ITEMS = [
  { labelKey: 'about' as const, href: '/about' },
  { labelKey: 'activities' as const, href: '/activities' },
  { labelKey: 'education' as const, href: '/education' },
  { labelKey: 'news' as const, href: '/news' },
  { labelKey: 'network' as const, href: '/network' },
  { labelKey: 'transparency' as const, href: '/transparency' },
] as const

export const SNS_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/paxchristikorea',
    icon: 'Instagram' as const,
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@paxchristikorea',
    icon: 'Youtube' as const,
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/paxchristikorea',
    icon: 'Facebook' as const,
  },
] as const

export const CONTACT_INFO = {
  phone: '010-9689-2027',
  email: 'paxchristikorea@gmail.com',
  address: '서울 마포구 토정로2길 33 (국제카톨릭형제회한국본부) 210호',
} as const

export const ORG_INFO = {
  name: '팍스크리스티코리아',
  nameEn: 'Pax Christi Korea',
  representatives: '강우일 주교, 김미란, 이성훈, 정봉미(수녀)',
  representativesEn: 'Bishop Kang Woo-il, Kim Mi-ran, Lee Sung-hoon, Jeong Bong-mi (Sr.)',
  businessNumber: '591-80-01356',
} as const

export const FOOTER_LINKS = [
  { labelKey: 'privacy' as const, href: '/privacy' },
  { labelKey: 'terms' as const, href: '/terms' },
  { labelKey: 'sitemap' as const, href: '/sitemap' },
] as const

export type NavItem = (typeof NAV_ITEMS)[number]
export type SnsLink = (typeof SNS_LINKS)[number]
