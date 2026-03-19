'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ABOUT_CONFIG, ABOUT_NAV } from '@/lib/constants/about'

const AboutLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  return (
    <div>
      {/* 히어로 배너 */}
      <section className="bg-peace-cream py-16 text-center dark:bg-peace-navy/30">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-bold text-peace-navy md:text-4xl dark:text-peace-cream">
            {ABOUT_CONFIG.hero.title}
          </h1>
          <p className="mt-3 text-lg text-peace-navy/70 dark:text-peace-cream/70">
            {ABOUT_CONFIG.hero.subtitle}
          </p>
        </div>
      </section>

      {/* 서브 네비게이션 */}
      <nav
        aria-label="단체 소개 메뉴"
        className="border-b bg-background"
      >
        <div className="mx-auto flex max-w-4xl overflow-x-auto px-4">
          {ABOUT_NAV.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'shrink-0 border-b-2 px-6 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-peace-navy text-peace-navy dark:border-peace-sky dark:text-peace-sky'
                    : 'border-transparent text-muted-foreground hover:border-peace-navy/30 hover:text-peace-navy dark:hover:border-peace-sky/30 dark:hover:text-peace-sky'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* 페이지 콘텐츠 */}
      {children}
    </div>
  )
}

export default AboutLayout
