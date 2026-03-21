import type { Metadata } from 'next'

import { client } from '@/lib/sanity/client'
import { EDUCATIONS_QUERY } from '@/lib/sanity/queries'
import { EducationContent } from './education-content'
import type { Education } from '@/types/sanity'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '평화학교 | 팍스크리스티코리아',
  description:
    '팍스크리스티코리아 평화학교는 비폭력 평화사상을 체계적으로 배우고 실천하는 교육 프로그램입니다.',
}

export default async function EducationPage() {
  let educations: Education[] = []

  try {
    educations = await client.fetch<Education[]>(EDUCATIONS_QUERY, {
      limit: 20,
    })
  } catch {
    console.error('[Education] Sanity fetch failed — showing empty state')
  }

  return <EducationContent educations={educations} />
}
