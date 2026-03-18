export const NAV_ITEMS = [
  { label: '단체소개', href: '/about' },
  { label: '활동', href: '/activities' },
  { label: '교육', href: '/education' },
  { label: '뉴스', href: '/news' },
  { label: '네트워크', href: '/network' },
  { label: '재정공개', href: '/transparency' },
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
  representatives: '강우일 주교, 김미란, 이성훈, 정봉미(수녀)',
  businessNumber: '591-80-01356',
} as const

export const FOOTER_LINKS = [
  { label: '개인정보처리방침', href: '/privacy' },
  { label: '이용약관', href: '/terms' },
  { label: '사이트맵', href: '/sitemap' },
] as const

export type NavItem = (typeof NAV_ITEMS)[number]
export type SnsLink = (typeof SNS_LINKS)[number]
