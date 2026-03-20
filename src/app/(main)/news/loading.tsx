import { Skeleton } from '@/components/ui/skeleton'

export default function NewsLoading() {
  return (
    <div>
      {/* 히어로 배너 스켈레톤 */}
      <div className="bg-peace-cream py-16 dark:bg-peace-navy/30">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Skeleton className="mx-auto h-9 w-48" />
          <Skeleton className="mx-auto mt-3 h-6 w-80" />
        </div>
      </div>

      {/* 카테고리 탭 스켈레톤 */}
      <div className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl gap-2 px-4 py-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 shrink-0" />
          ))}
        </div>
      </div>

      {/* 카드 그리드 스켈레톤 */}
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
            >
              <Skeleton className="aspect-[3/2] w-full rounded-none" />
              <div className="flex flex-col gap-2 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="mt-1 h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
