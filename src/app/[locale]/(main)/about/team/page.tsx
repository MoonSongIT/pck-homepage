import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'

import { client } from '@/lib/sanity/client'
import { TEAM_MEMBERS_QUERY } from '@/lib/sanity/queries'
import { TeamGrid } from './team-grid'
import type { TeamMember } from '@/types/sanity'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '임원진 | 팍스크리스티코리아',
  description:
    '팍스크리스티코리아와 함께하는 임원진을 소개합니다.',
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('About')
  let members: TeamMember[] = []

  try {
    members = await client.fetch<TeamMember[]>(TEAM_MEMBERS_QUERY)
  } catch {
    console.error('[Team] Sanity fetch failed — showing empty state')
  }

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        {/* 페이지 헤더 */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-peace-navy dark:text-peace-cream md:text-3xl">
            {t('teamTitle')}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t('teamSubtitle')}
          </p>
        </div>

        {members.length > 0 ? (
          <TeamGrid members={members} />
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              {t('teamEmpty')}
            </p>
            <p className="mt-2 text-sm text-muted-foreground/70">
              {t('teamEmptyDesc')}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
