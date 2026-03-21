import { z } from 'zod/v4'

// ─── Zod 스키마 ────────────────────────────────────────────────

export const educationApplySchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다').max(50),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  phone: z.string().regex(
    /^01[016789]-?\d{3,4}-?\d{4}$/,
    '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)',
  ),
  affiliation: z.string().max(100).optional(),
  motivation: z.string()
    .min(10, '지원 동기는 10자 이상이어야 합니다')
    .max(500, '지원 동기는 500자 이내로 작성해 주세요'),
  cohort: z.string().optional(),
  privacyAgreed: z.literal(true, {
    message: '개인정보처리방침에 동의해야 합니다',
  }),
})

export type EducationApplyInput = z.infer<typeof educationApplySchema>

// ─── 상수 ──────────────────────────────────────────────────────

export const EDUCATION_STATUS = {
  recruiting: { label: '모집 중', color: 'bg-peace-olive/15 text-peace-olive border-peace-olive/30' },
  closed: { label: '모집 마감', color: 'bg-muted text-muted-foreground border-muted' },
  upcoming: { label: '예정', color: 'bg-peace-sky/15 text-peace-sky border-peace-sky/30' },
} as const

export type EducationStatus = keyof typeof EDUCATION_STATUS

export const EDUCATION_CONFIG = {
  hero: {
    title: '평화학교',
    subtitle: '비폭력 평화를 배우고 실천합니다',
  },
  intro: {
    title: '팍스크리스티 평화학교란?',
    paragraphs: [
      '팍스크리스티코리아 평화학교는 가톨릭 사회교리와 비폭력 평화사상을 체계적으로 배우고, 일상에서 평화를 실천하는 방법을 훈련하는 교육 프로그램입니다.',
      '평화학교는 강의와 토론, 묵상과 나눔을 통해 참가자들이 평화의 가치를 내면화하고, 자신의 삶의 자리에서 평화의 도구가 될 수 있도록 돕습니다.',
    ],
  },
  applyTitle: '교육 신청',
  applySubtitle: '아래 양식을 작성하여 교육에 신청해 주세요',
  successMessage: '교육 신청이 완료되었습니다!',
  successDescription: '입력하신 이메일로 확인 메일이 발송됩니다. 감사합니다.',
  emptyMessage: '현재 모집 중인 교육이 없습니다',
  emptyDescription: '새로운 교육 프로그램이 개설되면 뉴스레터를 통해 안내드리겠습니다.',
  fields: {
    name: { label: '이름', placeholder: '홍길동' },
    email: { label: '이메일', placeholder: 'example@email.com' },
    phone: { label: '전화번호', placeholder: '010-1234-5678' },
    affiliation: { label: '소속', placeholder: '교구/단체명 (선택)', help: '소속이 있는 경우 입력해 주세요' },
    motivation: { label: '지원 동기', placeholder: '평화학교에 참여하고 싶은 이유를 작성해 주세요', help: '10~500자' },
    privacyAgreed: { label: '개인정보처리방침에 동의합니다' },
  },
  motivationMaxLength: 500,
} as const
