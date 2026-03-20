'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Newspaper } from 'lucide-react'

import { NewsCard } from '@/components/molecules/NewsCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { NEWS_CATEGORIES, NEWS_PAGE_CONFIG } from '@/lib/constants/news'
import type { Post, PostCategory } from '@/types/sanity'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

const categories = Object.entries(NEWS_CATEGORIES) as [
  PostCategory,
  { label: string; color: string },
][]

const buildHref = (category?: string, page?: number) => {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (page && page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `/news?${qs}` : '/news'
}

const NewsListContent = ({
  posts,
  currentCategory,
  currentPage,
  totalPages,
}: {
  posts: Post[]
  currentCategory?: PostCategory
  currentPage: number
  totalPages: number
}) => {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const shouldReduceMotion = useReducedMotion()
  const activeVariants = shouldReduceMotion ? reducedItemVariants : itemVariants

  const isEmpty = posts.length === 0

  return (
    <div>
      {/* 히어로 배너 */}
      <section className="bg-peace-cream py-16 text-center dark:bg-peace-navy/30">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-bold text-peace-navy md:text-4xl dark:text-peace-cream">
            {NEWS_PAGE_CONFIG.hero.title}
          </h1>
          <p className="mt-3 text-lg text-peace-navy/70 dark:text-peace-cream/70">
            {NEWS_PAGE_CONFIG.hero.subtitle}
          </p>
        </div>
      </section>

      {/* 카테고리 필터 탭 */}
      <nav aria-label="뉴스 카테고리 필터" className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl overflow-x-auto px-4">
          <Link
            href="/news"
            className={cn(
              'shrink-0 border-b-2 px-5 py-3 text-sm font-medium transition-colors',
              !currentCategory
                ? 'border-peace-navy text-peace-navy dark:border-peace-sky dark:text-peace-sky'
                : 'border-transparent text-muted-foreground hover:border-peace-navy/30 hover:text-peace-navy dark:hover:border-peace-sky/30 dark:hover:text-peace-sky'
            )}
            aria-current={!currentCategory ? 'page' : undefined}
          >
            {NEWS_PAGE_CONFIG.allCategoryLabel}
          </Link>
          {categories.map(([key, { label }]) => {
            const isActive = currentCategory === key

            return (
              <Link
                key={key}
                href={buildHref(key)}
                className={cn(
                  'shrink-0 border-b-2 px-5 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-peace-navy text-peace-navy dark:border-peace-sky dark:text-peace-sky'
                    : 'border-transparent text-muted-foreground hover:border-peace-navy/30 hover:text-peace-navy dark:hover:border-peace-sky/30 dark:hover:text-peace-sky'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* 뉴스 카드 그리드 */}
      <section
        ref={ref}
        aria-label="뉴스 목록"
        className="py-12 md:py-16"
      >
        <div className="container mx-auto max-w-6xl px-4">
          {isEmpty ? (
            <div className="py-20 text-center">
              <Newspaper
                className="mx-auto mb-4 size-12 text-muted-foreground/40"
                aria-hidden="true"
              />
              <p className="text-lg font-medium text-muted-foreground">
                {NEWS_PAGE_CONFIG.emptyMessage}
              </p>
              <p className="mt-2 text-sm text-muted-foreground/70">
                {NEWS_PAGE_CONFIG.emptyDescription}
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {posts.map((post) => (
                <motion.div key={post._id} variants={activeVariants}>
                  <NewsCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              currentCategory={currentCategory}
            />
          )}
        </div>
      </section>
    </div>
  )
}

const Pagination = ({
  currentPage,
  totalPages,
  currentCategory,
}: {
  currentPage: number
  totalPages: number
  currentCategory?: PostCategory
}) => {
  const pages = generatePageNumbers(currentPage, totalPages)

  return (
    <nav
      aria-label="페이지 이동"
      className="mt-12 flex items-center justify-center gap-2"
    >
      {/* 이전 */}
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        asChild
        disabled={currentPage <= 1}
      >
        <Link
          href={buildHref(currentCategory, currentPage - 1)}
          aria-label="이전 페이지"
          aria-disabled={currentPage <= 1}
          className={cn(currentPage <= 1 && 'pointer-events-none opacity-50')}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          {NEWS_PAGE_CONFIG.pagination.prevLabel}
        </Link>
      </Button>

      {/* 페이지 번호 */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="px-1 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <Button
            key={p}
            variant={p === currentPage ? 'default' : 'outline'}
            size="sm"
            className="min-w-[36px]"
            asChild
          >
            <Link
              href={buildHref(currentCategory, p as number)}
              aria-label={`${p} 페이지`}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </Link>
          </Button>
        )
      )}

      {/* 다음 */}
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        asChild
        disabled={currentPage >= totalPages}
      >
        <Link
          href={buildHref(currentCategory, currentPage + 1)}
          aria-label="다음 페이지"
          aria-disabled={currentPage >= totalPages}
          className={cn(
            currentPage >= totalPages && 'pointer-events-none opacity-50'
          )}
        >
          {NEWS_PAGE_CONFIG.pagination.nextLabel}
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      </Button>
    </nav>
  )
}

const generatePageNumbers = (
  current: number,
  total: number
): (number | '...')[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = [1]

  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) pages.push('...')

  pages.push(total)

  return pages
}

export { NewsListContent }
