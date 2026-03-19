import { Heart, HandHeart, Globe, Sparkles } from 'lucide-react'

export const DONATION_PLANS = [
  {
    id: 'monthly-10k',
    amount: 10000,
    label: '평화의 씨앗',
    description: '뉴스레터와 평화 교육 자료를 제작합니다',
    icon: Heart,
    popular: false,
  },
  {
    id: 'monthly-30k',
    amount: 30000,
    label: '평화의 동반자',
    description: '비폭력 평화 워크숍을 운영합니다',
    icon: HandHeart,
    popular: true,
  },
  {
    id: 'monthly-50k',
    amount: 50000,
    label: '평화의 일꾼',
    description: '국제 평화 연대 활동에 참여합니다',
    icon: Globe,
    popular: false,
  },
  {
    id: 'monthly-100k',
    amount: 100000,
    label: '평화의 후원자',
    description: '한반도 평화 캠페인을 이끌어갑니다',
    icon: Sparkles,
    popular: false,
  },
] as const

export const DONATION_CONFIG = {
  sectionTitle: '평화를 위한 한 걸음',
  sectionSubtitle: '여러분의 후원이 한반도와 세계의 평화를 만듭니다',
  ctaText: '후원 참여하기',
  monthlyLabel: '월',
  currencyUnit: '원',
  popularBadge: '추천',
} as const

export type DonationPlan = (typeof DONATION_PLANS)[number]
