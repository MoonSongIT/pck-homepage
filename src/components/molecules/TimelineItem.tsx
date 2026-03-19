import { cn } from '@/lib/utils'

type TimelineItemProps = {
  year: number
  title: string
  description?: string
  position: 'left' | 'right'
  className?: string
}

const TimelineItem = ({
  year,
  title,
  description,
  position,
  className,
}: TimelineItemProps) => {
  const isLeft = position === 'left'

  return (
    <div
      aria-label={`${year}년`}
      className={cn(
        'relative flex items-start gap-4 md:gap-6',
        // 데스크톱: 좌우 교대 배치
        isLeft ? 'md:flex-row-reverse' : 'md:flex-row',
        // 모바일: 항상 오른쪽 정렬
        'flex-row',
        className
      )}
    >
      {/* 연도 뱃지 */}
      <div className="z-10 flex shrink-0 items-center justify-center rounded-full bg-peace-navy px-3 py-1.5 text-sm font-bold text-white shadow-md dark:bg-peace-sky">
        {year}
      </div>

      {/* 카드 본체 */}
      <div
        className={cn(
          'flex-1 rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:bg-background',
          // 데스크톱: 좌우에 따라 텍스트 정렬
          isLeft ? 'md:text-right' : 'md:text-left',
          'text-left'
        )}
      >
        <h3 className="text-base font-semibold text-peace-navy dark:text-peace-cream">
          {title}
        </h3>
        {description && (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

export { TimelineItem }
export type { TimelineItemProps }
