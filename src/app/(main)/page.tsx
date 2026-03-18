import { WaveDivider } from '@/components/atoms/WaveDivider'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <>
      {/* Hero placeholder */}
      <section className="bg-peace-navy py-24 text-center text-peace-cream md:py-32">
        <div className="container mx-auto px-4">
          <p className="mb-4 text-sm font-medium tracking-widest text-peace-gold">
            PAX CHRISTI KOREA
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            그리스도의 평화
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-peace-cream/80">
            비폭력과 평화, 화해와 연대의 가치를 실천하는
            <br className="hidden sm:inline" />
            가톨릭 국제 평화운동 한국 지부
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" className="bg-peace-orange text-white hover:bg-peace-orange/90">
              후원하기
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-peace-cream/30 text-peace-cream hover:bg-peace-cream/10"
            >
              더 알아보기
            </Button>
          </div>
        </div>
      </section>

      <WaveDivider color="navy" />

      {/* Impact 영역 placeholder */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">함께하는 평화</h2>
          <p className="mt-4 text-muted-foreground">
            Phase 2-2에서 ImpactCounter 구현 예정
          </p>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: '창립', value: '2019' },
              { label: '회원', value: '200+' },
              { label: '활동 국가', value: '50' },
              { label: '캠페인', value: '15+' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-3xl font-bold text-peace-sky">{item.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider color="cream" flip />

      {/* 후원 CTA placeholder */}
      <section className="bg-peace-cream py-16 text-center dark:bg-muted md:py-20">
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

      {/* 뉴스 영역 placeholder */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">최신 소식</h2>
          <p className="mt-4 text-muted-foreground">
            Phase 2-2에서 LatestNews 구현 예정
          </p>
        </div>
      </section>
    </>
  )
}
