import {
  Eye,
  Target,
  Shield,
  Building2,
  GraduationCap,
  Users,
  Handshake,
  Megaphone,
  Link2,
  CalendarHeart,
} from 'lucide-react'

// 비전·목표 데이터
export const VISION_MISSION = {
  vision: {
    title: '비전',
    description:
      'Pax Christi International과 보조를 맞춰 한국 현실에 부합하는 평화 운동을 활발하게 전개하고, 모든 폭력에서 자유로운 세계, \'평화로운 세계 건설\'이라는 비전을 추구합니다.',
    icon: Eye,
  },
  mission: {
    title: '목표',
    description:
      '가톨릭교회의 모든 신원이 동등하게 수평적으로 평화와 화해를 추구하는 활동에 참여하는 비공인 가톨릭 평화운동 단체로서, 복음과 가톨릭 신앙에 바탕을 두고 기도·공부(연구)·실천을 방법적 원리로 삼아 활동합니다.',
    icon: Target,
  },
} as const

// 주요 활동 영역 (8개)
export const ACTIVITY_AREAS = [
  {
    id: 'conflict-transformation',
    title: '갈등 전환',
    description:
      '폭력적 갈등을 사전에 예방하기 위해 노력하고, 갈등이 진행 중인 경우 대안적 해결책을 제시합니다. 민족갈등, 교파분열을 중재하고 갈등지역 방문, 평화 캠페인, 활동을 수행합니다.',
    icon: Shield,
  },
  {
    id: 'peace-building',
    title: '평화 구축',
    description:
      '진리와 정의에 입각하여 화해와 평화를 실현하도록 돕는 평화구축(peace building)을 추구합니다.',
    icon: Building2,
  },
  {
    id: 'peace-education',
    title: '평화 교육과 청년활동 지원',
    description:
      '젊은이들의 교류, 대안적 평화 봉사, 자발적 평화 활동, 평화 주간(Peace Work)과 같이 평화 교육과 청년 활동을 지원합니다.',
    icon: GraduationCap,
  },
  {
    id: 'nonviolent-organizing',
    title: '비폭력 모임 조직',
    description:
      '비폭력적 방법을 통한 사회변화를 추구하기 위해 다양한 회의와 토론 모임을 조직합니다.',
    icon: Users,
  },
  {
    id: 'interfaith-dialogue',
    title: '종교간 대화와 협력',
    description:
      '평화를 위해 교파 분열을 중재하고 종교간 대화와 협력의 기회를 마련합니다.',
    icon: Handshake,
  },
  {
    id: 'advocacy',
    title: '각국 옹호(Advocacy) 활동 참여',
    description:
      '각 나라에 고유하고 그 나라의 사회정치적 맥락에 어울리는 옹호(Advocacy) 활동에 참여합니다.',
    icon: Megaphone,
  },
  {
    id: 'partner-exchange',
    title: '협력단체 교류',
    description:
      '협력단체들과 능력을 증진하고, 활동의 효과를 높이기 위해 협력단체들끼리의 교류를 주선하고, 자료도 제공합니다.',
    icon: Link2,
  },
  {
    id: 'peace-day',
    title: '평화의 날 담화 실천',
    description:
      '교황님의 평화의 날 담화를 숙고하고 실천하며 교회 내 전파를 위해 노력합니다.',
    icon: CalendarHeart,
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
  activitiesTitle: '주요 활동 영역',
  activitiesSubtitle:
    'PCI와 보조를 맞춰 한국 현실에 부합하는 평화운동 영역을 개척하고 있습니다',
  introTitle: '팍스크리스티코리아란?',
  introTexts: [
    '팍스크리스티코리아(Pax Christi Korea, PCK)는 1945년에 창립된 국제 가톨릭 평화운동 단체인 PCI(Pax Christi International)의 한국 지부로 2019년에 설립되었습니다.',
    'PCI는 가톨릭교회의 모든 신원이 동등하게 수평적으로 평화와 화해를 추구하는 활동에 참여하는 비공인 가톨릭 평화운동 단체입니다. 현재 전 세계 50여개 나라에서 120여개 단체가 함께 하고 있습니다. PCI는 복음과 가톨릭신앙에 바탕을 두고 기도·공부(연구)·실천을 방법적 원리로 삼아 \'평화로운 세계, 모든 폭력에서 자유로운 세계 건설\'이라는 비전(Vision)을 추구합니다.',
    'PCI는 세계, 대륙, 국가 단위에서 가맹단체들이 각자가 속한 지역 상황의 과제 또는 범지구적 과제들에 대응하여, 독자적으로 또는 가맹단체들끼리 연대하여 비폭력적 실천 증진, 인권 개선, 인간안보(human security) 증진, 비무장과 탈군사화 촉진, 정의로운 국제 질서 확립, 종교간 평화 실현 등의 활동에 앞장서고 있습니다. PCI는 UN, UNESCO, Africa Union, Europe Council 등과 같은 국제기구들에도 대표 자격으로 참여하고 있습니다.',
    'PCK는 가톨릭 신자 여러분의 참여를 기다리고 있습니다. 참여 자격은 개인을 원칙으로 합니다. 평신도, 수도자, 주교, 사제 누구든 우리 모임에 동의하시면 개별적으로 회원 가입을 신청해 주십시오.',
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

export type ActivityArea = (typeof ACTIVITY_AREAS)[number]
export type AboutNavItem = (typeof ABOUT_NAV)[number]
