import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { client } from '@/lib/sanity/client'
import { POST_QUERY, POST_SLUGS_QUERY } from '@/lib/sanity/queries'
import { imagePresets } from '@/lib/sanity/image'
import { NewsDetailContent } from './news-detail-content'
import type { Post } from '@/types/sanity'

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(POST_SLUGS_QUERY)
    return slugs.map((slug) => ({ slug }))
  } catch {
    console.error('[NewsDetail] generateStaticParams failed')
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  try {
    const post = await client.fetch<Post | null>(POST_QUERY, { slug })
    if (!post) return { title: '게시글 없음 | 팍스크리스티코리아' }

    const ogImageUrl = post.mainImage
      ? imagePresets.ogImage(post.mainImage).url()
      : `/api/og?title=${encodeURIComponent(post.title)}&category=${post.category}`

    return {
      title: `${post.title} | 팍스크리스티코리아`,
      description:
        post.excerpt || '팍스크리스티코리아의 소식과 활동을 전합니다.',
      openGraph: {
        title: post.title,
        description: post.excerpt || '',
        images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      },
    }
  } catch {
    return { title: '팍스크리스티코리아' }
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let post: Post | null = null

  try {
    post = await client.fetch<Post | null>(POST_QUERY, { slug })
  } catch {
    console.error('[NewsDetail] Sanity fetch failed')
  }

  if (!post) notFound()

  return <NewsDetailContent post={post} />
}
