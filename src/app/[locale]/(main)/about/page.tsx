import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { AboutContent } from './about-content'

export const metadata: Metadata = {
  title: '단체 소개 | 팍스크리스티코리아',
  description:
    '팍스크리스티코리아의 비전, 미션, 핵심가치를 소개합니다. 복음적 비폭력과 정의·평화·창조질서 보전을 실천하는 국제 가톨릭 평화운동 단체입니다.',
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <AboutContent />
}
