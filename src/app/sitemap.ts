import type { MetadataRoute } from 'next'

import { client } from '@/lib/sanity/client'
import { POST_SLUGS_QUERY } from '@/lib/sanity/queries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://paxchristikorea.org'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about/history`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/donate`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/education`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/network`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/transparency`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/community`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5,
    },
  ]

  // 영문 정적 페이지
  const enRoutes: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    ...route,
    url: route.url.replace(BASE_URL, `${BASE_URL}/en`),
    priority: (route.priority ?? 0.5) * 0.8,
  }))

  // Sanity 뉴스 동적 페이지
  let newsRoutes: MetadataRoute.Sitemap = []
  try {
    const slugs = await client.fetch<string[]>(POST_SLUGS_QUERY)
    newsRoutes = slugs.map((slug) => ({
      url: `${BASE_URL}/news/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch {
    console.error('[Sitemap] Sanity fetch failed — skipping news routes')
  }

  return [...staticRoutes, ...enRoutes, ...newsRoutes]
}
