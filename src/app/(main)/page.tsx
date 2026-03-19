import { HeroSection } from '@/components/organisms/HeroSection'
import { ImpactCounter } from '@/components/organisms/ImpactCounter'
import { LatestNews } from '@/components/organisms/LatestNews'
import { WaveDivider } from '@/components/atoms/WaveDivider'
import { Button } from '@/components/ui/button'
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

      {/* 후원 CTA placeholder */}
      <section className="bg-peace-cream py-12 text-center dark:bg-muted md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            평화를 위한 한 걸음
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            여러분의 후원이 한반도와 세계의 평화를 만듭니다
          </p>
          <Button
            size="lg"
            className="mt-8 bg-peace-orange text-white hover:bg-peace-orange/90"
          >
            후원 참여하기
          </Button>
        </div>
      </section>

      <WaveDivider color="cream" />

      <LatestNews posts={posts} />
    </>
  )
}
