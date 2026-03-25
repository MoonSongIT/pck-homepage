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

export const DONATE_PAGE_CONFIG = {
  title: '후원하기',
  subtitle: '여러분의 따뜻한 마음이 평화를 만듭니다',
  tabRegular: '정기 후원',
  tabOneTime: '일시 후원',
  regularDescription: '매월 정기적으로 평화 활동을 후원합니다',
  oneTimeDescription: '원하시는 금액을 한 번 후원합니다',
  customAmountLabel: '직접 입력',
  customAmountPlaceholder: '금액을 입력하세요',
  minAmount: 1000,
  fields: {
    donorName: { label: '이름', placeholder: '홍길동' },
    donorEmail: { label: '이메일', placeholder: 'example@email.com' },
    phone: { label: '전화번호', placeholder: '01012345678' },
    isAnonymous: { label: '익명으로 후원하기' },
    privacyAgreed: {
      label: '개인정보처리방침에 동의합니다',
    },
  },
  submitText: '후원하기',
  submittingText: '결제 준비 중...',
  successTitle: '후원해 주셔서 감사합니다!',
  successDescription:
    '소중한 후원금은 평화 활동에 사용됩니다. 영수증이 이메일로 발송됩니다.',
  failTitle: '결제에 실패했습니다',
  failDescription: '잠시 후 다시 시도해 주세요.',
  retryText: '다시 시도하기',
} as const

export type DonationPlan = (typeof DONATION_PLANS)[number]
