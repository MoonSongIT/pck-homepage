import Link from 'next/link'
import Image from 'next/image'

import { cn } from '@/lib/utils'

const sizeMap = {
  sm: { width: 120, height: 75, className: 'h-[36px] w-auto' },
  md: { width: 160, height: 100, className: 'h-[48px] w-auto' },
  lg: { width: 200, height: 124, className: 'h-[60px] w-auto' },
} as const

const Logo = ({
  size = 'md',
  variant = 'default',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'white'
  className?: string
}) => {
  const { width, height, className: sizeClass } = sizeMap[size]
  const src = variant === 'white' ? '/images/logo-white.svg' : '/images/logo.svg'

  return (
    <Link
      href="/"
      className={cn('inline-flex items-center', className)}
      aria-label="팍스크리스티코리아 홈"
    >
      <Image
        src={src}
        alt="팍스크리스티코리아 로고"
        width={width}
        height={height}
        className={sizeClass}
        priority
      />
    </Link>
  )
}

export { Logo }
