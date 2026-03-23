'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import { ArrowLeft, Calendar } from 'lucide-react'

import { NewsCard } from '@/components/molecules/NewsCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { NEWS_CATEGORIES, NEWS_DETAIL_CONFIG } from '@/lib/constants/news'
import { imagePresets } from '@/lib/sanity/image'
import { portableTextComponents } from '@/lib/sanity/portable-text-components'
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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const NewsDetailContent = ({ post }: { post: Post }) => {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const shouldReduceMotion = useReducedMotion()
  const activeVariants = shouldReduceMotion ? reducedItemVariants : itemVariants

  const category = NEWS_CATEGORIES[post.category]
  const heroImageUrl = post.mainImage
    ? imagePresets.hero(post.mainImage).url()
    : null
  const heroImageAlt = post.mainImage?.alt ?? post.title

  return (
    <article ref={ref}>
      {/* 히어로 이미지 */}
      {heroImageUrl && (
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-muted md:aspect-[3/1]">
          <Image
            src={heroImageUrl}
            alt={heroImageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      {/* 본문 영역 */}
      <div className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
        {/* 목록으로 돌아가기 */}
        <motion.div
          variants={activeVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 gap-1 text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href={NEWS_DETAIL_CONFIG.backHref}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              {NEWS_DETAIL_CONFIG.backLabel}
            </Link>
          </Button>
        </motion.div>

        {/* 헤더: 카테고리 + 제목 + 날짜 */}
        <motion.header
          variants={activeVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-10"
        >
          {category && (
            <Badge
              className={cn(
                'mb-4 border-0 text-xs font-semibold',
                category.color
              )}
            >
              {category.label}
            </Badge>
          )}

          <h1 className="text-2xl font-bold leading-tight text-peace-navy md:text-3xl lg:text-4xl dark:text-peace-cream">
            {post.title}
          </h1>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" aria-hidden="true" />
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </div>
        </motion.header>

        {/* Portable Text 본문 */}
        <motion.div
          variants={activeVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="prose-custom"
        >
          {post.body && (
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          )}
        </motion.div>
      </div>

      {/* 관련 글 */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <section
          aria-label={NEWS_DETAIL_CONFIG.relatedTitle}
          className="border-t bg-peace-cream/50 py-12 md:py-16 dark:bg-peace-navy/10"
        >
          <div className="container mx-auto max-w-6xl px-4">
            <motion.h2
              variants={activeVariants}
              initial="hidden"
              animate="visible"
              className="mb-8 text-2xl font-bold text-peace-navy dark:text-peace-cream"
            >
              {NEWS_DETAIL_CONFIG.relatedTitle}
            </motion.h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {post.relatedPosts.map((related) => (
                <motion.div key={related._id} variants={activeVariants}>
                  <NewsCard post={related as Post} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </article>
  )
}

export { NewsDetailContent }
