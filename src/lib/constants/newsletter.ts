import { Mail } from 'lucide-react'

export const NEWSLETTER_CONFIG = {
  sectionTitle: '평화 소식을 받아보세요',
  sectionSubtitle:
    '팍스크리스티코리아의 활동 소식, 평화 칼럼, 교육 일정을 이메일로 전해드립니다.',
  placeholder: 'your@email.com',
  buttonText: '구독하기',
  loadingText: '처리 중...',
  successMessage: '구독이 완료되었습니다! 평화 소식을 곧 받아보실 수 있습니다.',
  errorMessage: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  duplicateMessage: '이미 구독 중인 이메일입니다.',
  invalidMessage: '올바른 이메일 주소를 입력해주세요.',
  icon: Mail,
} as const
