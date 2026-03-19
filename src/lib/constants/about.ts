import { Eye, Target, Bird, Scale, HandHeart, Leaf } from 'lucide-react'

// 비전·미션 데이터
export const VISION_MISSION = {
  vision: {
    title: '비전',
    description: '그리스도의 평화를 통한 한반도와 세계의 화해와 일치',
    icon: Eye,
  },
  mission: {
    title: '미션',
    description:
      '복음적 비폭력과 정의·평화·창조질서 보전을 실천하는 국제 가톨릭 평화운동',
    icon: Target,
  },
} as const

// 핵심가치 카드 데이터
export const CORE_VALUES = [
  {
    id: 'nonviolence',
    title: '비폭력',
    description:
      '복음적 비폭력 정신으로 모든 형태의 폭력에 맞서고, 대화와 화해를 통한 평화적 해결을 추구합니다.',
    icon: Bird,
  },
  {
    id: 'justice-peace',
    title: '정의와 평화',
    description:
      '사회 정의와 항구적 평화를 위해 불평등과 억압의 구조를 변혁하고, 모든 이의 존엄성을 옹호합니다.',
    icon: Scale,
  },
  {
    id: 'solidarity',
    title: '연대',
    description:
      '국제 팍스크리스티 네트워크와 연대하여 전 세계 평화운동에 함께하며, 한반도 평화를 위해 협력합니다.',
    icon: HandHeart,
  },
  {
    id: 'creation',
    title: '창조질서 보전',
    description:
      '하느님의 창조물을 보전하고, 기후 위기와 환경 파괴에 맞서 생태적 회심과 지속 가능한 삶을 실천합니다.',
    icon: Leaf,
  },
] as const

// About 페이지 설정
export const ABOUT_CONFIG = {
  hero: {
    title: '단체 소개',
    subtitle: '팍스크리스티코리아를 소개합니다',
  },
  historyLink: { label: '연혁 보기', href: '/about/history' },
  teamLink: { label: '임원진 보기', href: '/about/team' },
  introTitle: '팍스크리스티코리아란?',
  introTexts: [
    '팍스크리스티코리아(Pax Christi Korea)는 가톨릭 국제 평화운동 단체인 팍스크리스티 인터내셔널(Pax Christi International)의 한국 지부입니다. 2019년에 창립되어 복음적 비폭력, 정의와 평화, 인권 보호, 창조질서 보전을 위해 활동하고 있습니다.',
    '한반도의 평화와 화해, 동북아시아의 비핵화와 군축, 기후 정의와 생태적 회심 등 다양한 평화 의제에 대해 연구하고, 교육하며, 연대 활동을 펼치고 있습니다.',
    '팍스크리스티 인터내셔널은 1945년 프랑스에서 시작되어 현재 전 세계 50여 개국에 지부를 두고 있으며, 유엔 경제사회이사회(ECOSOC) 특별 협의 지위를 보유한 국제 NGO입니다.',
  ],
} as const

// About 서브 네비게이션
export const ABOUT_NAV = [
  { label: '소개', href: '/about' },
  { label: '연혁', href: '/about/history' },
  { label: '임원진', href: '/about/team' },
] as const

// History 타임라인 페이지 설정
export const HISTORY_CONFIG = {
  title: '팍스크리스티코리아 연혁',
  subtitle: '평화를 향한 발자취',
  yearRange: '2019 ~ 현재',
  emptyMessage: '아직 등록된 연혁이 없습니다.',
  emptyDescription: 'Sanity CMS에서 연혁 데이터를 추가해주세요.',
} as const

// Team 임원진 페이지 설정
export const TEAM_CONFIG = {
  title: '임원진 소개',
  subtitle: '팍스크리스티코리아와 함께하는 사람들',
  emptyMessage: '아직 등록된 임원진이 없습니다.',
  emptyDescription: 'Sanity CMS에서 임원진 데이터를 추가해주세요.',
} as const

export type CoreValue = (typeof CORE_VALUES)[number]
export type AboutNavItem = (typeof ABOUT_NAV)[number]
