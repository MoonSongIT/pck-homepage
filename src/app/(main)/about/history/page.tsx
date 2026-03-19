import type { Metadata } from 'next'

import { client } from '@/lib/sanity/client'
import { TIMELINE_QUERY } from '@/lib/sanity/queries'
import { HISTORY_CONFIG } from '@/lib/constants/about'
import { HistoryTimeline } from './history-timeline'
import type { TimelineEvent } from '@/types/sanity'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '연혁 | 팍스크리스티코리아',
  description:
    '팍스크리스티코리아의 창립부터 현재까지의 연혁을 소개합니다.',
}

export default async function HistoryPage() {
  let events: TimelineEvent[] = []

  try {
    events = await client.fetch<TimelineEvent[]>(TIMELINE_QUERY)
  } catch {
    console.error('[History] Sanity fetch failed — showing empty state')
  }

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto max-w-4xl px-4">
        {/* 페이지 헤더 */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-peace-navy dark:text-peace-cream md:text-3xl">
            {HISTORY_CONFIG.title}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {HISTORY_CONFIG.subtitle}
          </p>
          <p className="mt-1 text-sm text-peace-sky">
            {HISTORY_CONFIG.yearRange}
          </p>
        </div>

        {events.length > 0 ? (
          <HistoryTimeline events={events} />
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              {HISTORY_CONFIG.emptyMessage}
            </p>
            <p className="mt-2 text-sm text-muted-foreground/70">
              {HISTORY_CONFIG.emptyDescription}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
