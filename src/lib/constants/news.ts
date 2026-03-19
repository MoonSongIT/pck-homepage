import type { PostCategory } from '@/types/sanity'

export const NEWS_CATEGORIES: Record<
  PostCategory,
  { label: string; color: string }
> = {
  news: { label: '뉴스', color: 'bg-peace-sky/15 text-peace-sky' },
  activity: { label: '활동', color: 'bg-peace-olive/15 text-peace-olive' },
  statement: { label: '성명서', color: 'bg-peace-gold/15 text-peace-gold dark:text-peace-gold' },
  press: { label: '보도자료', color: 'bg-peace-navy/10 text-peace-navy dark:bg-peace-cream/10 dark:text-peace-cream' },
}

export const LATEST_NEWS_CONFIG = {
  sectionTitle: '최신 소식',
  sectionSubtitle: '팍스크리스티코리아의 활동과 소식을 전합니다',
  viewAllText: '전체 보기',
  viewAllHref: '/news',
  displayCount: 3,
} as const
