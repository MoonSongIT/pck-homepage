import { Calendar, Users, Globe, Megaphone } from 'lucide-react'

const CURRENT_YEAR = new Date().getFullYear()

export const IMPACT_STATS = [
  {
    id: 1,
    label: '창립',
    value: 2019,
    startFrom: CURRENT_YEAR,
    suffix: '',
    icon: Calendar,
  },
  {
    id: 2,
    label: '회원',
    value: 200,
    suffix: '+',
    icon: Users,
  },
  {
    id: 3,
    label: '활동 국가',
    value: 50,
    suffix: '',
    icon: Globe,
  },
  {
    id: 4,
    label: '캠페인',
    value: 15,
    suffix: '+',
    icon: Megaphone,
  },
] as const

export const IMPACT_CONFIG = {
  animationDuration: 2,
  sectionTitle: '함께하는 평화',
  sectionSubtitle: '팍스크리스티코리아는 비폭력과 평화의 가치를 전 세계와 함께 실천합니다',
} as const

export type ImpactStat = (typeof IMPACT_STATS)[number]
