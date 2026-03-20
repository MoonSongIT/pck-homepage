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

export const NEWS_PAGE_CONFIG = {
  hero: {
    title: '뉴스 & 활동',
    subtitle: '팍스크리스티코리아의 소식과 활동을 전합니다',
  },
  postsPerPage: 12,
  allCategoryLabel: '전체',
  emptyMessage: '아직 등록된 게시글이 없습니다.',
  emptyDescription: 'Sanity CMS에서 게시글을 추가해주세요.',
  pagination: {
    prevLabel: '이전',
    nextLabel: '다음',
  },
} as const

export const NEWS_DETAIL_CONFIG = {
  backLabel: '목록으로',
  backHref: '/news',
  relatedTitle: '관련 글',
  emptyMessage: '게시글을 찾을 수 없습니다.',
  emptyDescription: '요청하신 게시글이 존재하지 않거나 삭제되었습니다.',
} as const
