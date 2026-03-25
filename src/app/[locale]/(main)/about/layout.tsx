'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const AboutLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const t = useTranslations('About')

  const navItems = [
    { labelKey: 'navAbout' as const, href: '/about' },
    { labelKey: 'navHistory' as const, href: '/about/history' },
    { labelKey: 'navTeam' as const, href: '/about/team' },
    { labelKey: 'navLocation' as const, href: '/about/location' },
  ]

  return (
    <div>
      {/* 히어로 배너 */}
      <section className="bg-peace-cream py-16 text-center dark:bg-peace-navy/30">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-bold text-peace-navy md:text-4xl dark:text-peace-cream">
            {t('heroTitle')}
          </h1>
          <p className="mt-3 text-lg text-peace-navy/70 dark:text-peace-cream/70">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* 서브 네비게이션 */}
      <nav
        aria-label={t('navAriaLabel')}
        className="border-b bg-background"
      >
        <div className="mx-auto flex max-w-4xl overflow-x-auto px-4">
          {navItems.map((item) => {
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
                {t(item.labelKey)}
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
