'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { NewsCard } from '@/components/molecules/NewsCard'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { LATEST_NEWS_CONFIG } from '@/lib/constants/news'
import type { Post } from '@/types/sanity'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
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

const NewsCardSkeleton = () => (
  <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
    <Skeleton className="aspect-[3/2] w-full rounded-none" />
    <div className="flex flex-col gap-2 p-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="mt-1 h-3 w-24" />
    </div>
  </div>
)

const LatestNews = ({
  posts,
  className,
}: {
  posts: Post[]
  className?: string
}) => {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldReduceMotion = useReducedMotion()
  const activeVariants = shouldReduceMotion ? reducedItemVariants : itemVariants

  const isEmpty = posts.length === 0

  return (
    <section
      ref={ref}
      aria-label="최신 소식"
      className={cn('py-12 md:py-20', className)}
    >
      <div className="container mx-auto px-4">
        {/* 섹션 헤더 */}
        <motion.div
          variants={activeVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-10 flex items-end justify-between md:mb-12"
        >
          <div>
            <h2 className="text-2xl font-bold text-peace-navy dark:text-peace-cream md:text-3xl">
              {LATEST_NEWS_CONFIG.sectionTitle}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {LATEST_NEWS_CONFIG.sectionSubtitle}
            </p>
          </div>
          <Link
            href={LATEST_NEWS_CONFIG.viewAllHref}
            className="group/link hidden items-center gap-1 text-sm font-medium text-peace-sky transition-colors hover:text-peace-sky/80 sm:flex"
          >
            {LATEST_NEWS_CONFIG.viewAllText}
            <ArrowRight
              className="size-4 transition-transform group-hover/link:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </motion.div>

        {/* 뉴스 카드 그리드 */}
        {isEmpty ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: LATEST_NEWS_CONFIG.displayCount }).map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
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

        {/* 모바일 "전체 보기" 링크 */}
        <motion.div
          variants={activeVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-8 text-center sm:hidden"
        >
          <Link
            href={LATEST_NEWS_CONFIG.viewAllHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-peace-sky transition-colors hover:text-peace-sky/80"
          >
            {LATEST_NEWS_CONFIG.viewAllText}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export { LatestNews }
