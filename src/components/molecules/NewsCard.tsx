import Image from 'next/image'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { NEWS_CATEGORIES } from '@/lib/constants/news'
import { imagePresets } from '@/lib/sanity/image'
import type { Post } from '@/types/sanity'

const PLACEHOLDER_IMAGE = '/images/news/placeholder-1.svg'

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const NewsCard = ({ post, className }: { post: Post; className?: string }) => {
  const category = NEWS_CATEGORIES[post.category]
  const slug = post.slug?.current ?? ''
  const thumbnailUrl = post.mainImage
    ? imagePresets.thumbnail(post.mainImage).url()
    : PLACEHOLDER_IMAGE
  const thumbnailAlt = post.mainImage?.alt ?? post.title

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-shadow hover:shadow-lg dark:hover:shadow-peace-sky/5',
        className
      )}
    >
      <Link href={`/news/${slug}`} className="block">
        {/* 썸네일 */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={thumbnailUrl}
            alt={thumbnailAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* 카테고리 뱃지 */}
          {category && (
            <div className="absolute left-3 top-3">
              <Badge
                className={cn(
                  'border-0 text-xs font-semibold shadow-sm backdrop-blur-sm',
                  category.color
                )}
              >
                {category.label}
              </Badge>
            </div>
          )}
        </div>

        {/* 콘텐츠 */}
        <div className="flex flex-col gap-2 p-4">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-peace-sky md:text-lg">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )}

          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground/70">
            <Calendar className="size-3.5" aria-hidden="true" />
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </div>
        </div>
      </Link>
    </article>
  )
}

export { NewsCard }
