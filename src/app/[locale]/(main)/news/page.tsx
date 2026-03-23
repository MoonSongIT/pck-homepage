import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { client } from '@/lib/sanity/client'
import {
  POSTS_PAGINATED_QUERY,
  POSTS_BY_CATEGORY_PAGINATED_QUERY,
  POSTS_COUNT_QUERY,
  POSTS_COUNT_BY_CATEGORY_QUERY,
} from '@/lib/sanity/queries'
import { NEWS_CATEGORIES, NEWS_PAGE_CONFIG } from '@/lib/constants/news'
import { NewsListContent } from './news-list-content'
import type { Post, PostCategory } from '@/types/sanity'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '뉴스 & 활동 | 팍스크리스티코리아',
  description:
    '팍스크리스티코리아의 최신 뉴스, 활동 보고, 성명서, 보도자료를 확인하세요.',
}

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const resolvedSearchParams = await searchParams
  const category = resolvedSearchParams.category as PostCategory | undefined
  const validCategory =
    category && category in NEWS_CATEGORIES ? category : undefined
  const page = Math.max(1, Number(resolvedSearchParams.page) || 1)
  const limit = NEWS_PAGE_CONFIG.postsPerPage
  const start = (page - 1) * limit
  const end = start + limit

  let posts: Post[] = []
  let totalCount = 0

  try {
    if (validCategory) {
      ;[posts, totalCount] = await Promise.all([
        client.fetch<Post[]>(POSTS_BY_CATEGORY_PAGINATED_QUERY, {
          category: validCategory,
          start,
          end,
        }),
        client.fetch<number>(POSTS_COUNT_BY_CATEGORY_QUERY, {
          category: validCategory,
        }),
      ])
    } else {
      ;[posts, totalCount] = await Promise.all([
        client.fetch<Post[]>(POSTS_PAGINATED_QUERY, { start, end }),
        client.fetch<number>(POSTS_COUNT_QUERY),
      ])
    }
  } catch {
    console.error('[News] Sanity fetch failed — showing empty state')
  }

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <NewsListContent
      posts={posts}
      currentCategory={validCategory}
      currentPage={page}
      totalPages={totalPages}
    />
  )
}
