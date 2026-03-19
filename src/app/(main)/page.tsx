import { HeroSection } from '@/components/organisms/HeroSection'
import { ImpactCounter } from '@/components/organisms/ImpactCounter'
import { DonationCTA } from '@/components/organisms/DonationCTA'
import { LatestNews } from '@/components/organisms/LatestNews'
import { WaveDivider } from '@/components/atoms/WaveDivider'
import { client } from '@/lib/sanity/client'
import { LATEST_POSTS_QUERY } from '@/lib/sanity/queries'
import type { Post } from '@/types/sanity'

export const revalidate = 3600 // ISR: 1시간마다 재검증

export default async function Home() {
  let posts: Post[] = []

  try {
    posts = await client.fetch<Post[]>(LATEST_POSTS_QUERY)
  } catch {
    // Sanity 연결 실패 시 빈 배열 → Skeleton 표시
    console.error('[Home] Sanity fetch failed — showing skeleton')
  }
  return (
    <>
      <HeroSection />

      <WaveDivider color="navy" />

      <ImpactCounter />

      <WaveDivider color="cream" flip />

      <DonationCTA />

      <WaveDivider color="cream" />

      <LatestNews posts={posts} />
    </>
  )
}
