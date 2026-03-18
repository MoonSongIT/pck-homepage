import { cn } from '@/lib/utils'

const colorMap = {
  navy: 'fill-peace-navy dark:fill-[#0f1a2e]',
  cream: 'fill-peace-cream dark:fill-[#1e293b]',
  sky: 'fill-peace-sky dark:fill-[#2563eb]',
} as const

const WaveDivider = ({
  color = 'navy',
  flip = false,
  className,
}: {
  color?: 'navy' | 'cream' | 'sky'
  flip?: boolean
  className?: string
}) => {
  return (
    <div
      className={cn(
        'w-full overflow-hidden leading-[0]',
        flip && 'rotate-180',
        className
      )}
      aria-hidden="true"
      role="presentation"
    >
      <svg
        className={cn('h-[40px] w-full md:h-[60px] lg:h-[80px]', colorMap[color])}
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,20 C240,55 480,0 720,35 C960,70 1200,10 1440,25 L1440,60 L0,60 Z" />
      </svg>
    </div>
  )
}

export { WaveDivider }
