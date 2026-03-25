import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

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
    if (!post) return { title: '게시글 없음' }

    const ogImageUrl = post.mainImage
      ? imagePresets.ogImage(post.mainImage).url()
      : `/api/og?title=${encodeURIComponent(post.title)}&category=${post.category}`

    return {
      title: post.title,
      description:
        post.excerpt || '팍스크리스티코리아의 소식과 활동을 전합니다.',
      openGraph: {
        title: post.title,
        description: post.excerpt || '팍스크리스티코리아의 소식과 활동을 전합니다.',
        type: 'article',
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
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  let post: Post | null = null

  try {
    post = await client.fetch<Post | null>(POST_QUERY, { slug })
  } catch {
    console.error('[NewsDetail] Sanity fetch failed')
  }

  if (!post) notFound()

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://paxchristikorea.org'
  const ogImageUrl = post.mainImage
    ? imagePresets.ogImage(post.mainImage).url()
    : `${BASE_URL}/api/og?title=${encodeURIComponent(post.title)}&category=${post.category}`

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || '',
    image: ogImageUrl,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: '팍스크리스티코리아',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: '팍스크리스티코리아',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/news/${post.slug?.current}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <NewsDetailContent post={post} />
    </>
  )
}
