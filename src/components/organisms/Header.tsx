'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import { useTranslations, useLocale } from 'next-intl'
import { useSession, signOut } from 'next-auth/react'
import { Phone, Mail, Sun, Moon, Instagram, Youtube, Facebook, LogIn, User } from 'lucide-react'

import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/atoms/Logo'
import { MobileNav } from '@/components/organisms/MobileNav'
import { NAV_ITEMS, SNS_LINKS, CONTACT_INFO } from '@/lib/constants/navigation'
import { cn } from '@/lib/utils'

const SNS_ICON_MAP = {
  Instagram,
  Youtube,
  Facebook,
} as const

const emptySubscribe = () => () => {}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/95 shadow-sm backdrop-blur-sm dark:bg-[#0f1a2e]/95'
          : 'bg-white dark:bg-[#0f1a2e]'
      )}
    >
      {/* TopBar — 데스크톱 전용 */}
      <div className="hidden border-b border-border/50 md:block">
        <div className="container mx-auto flex items-center justify-between px-4 py-1.5 text-xs">
          {/* 좌측: 연락처 */}
          <div className="flex items-center gap-4 text-muted-foreground">
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Phone className="size-3" />
              {CONTACT_INFO.phone}
            </a>
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Mail className="size-3" />
              {CONTACT_INFO.email}
            </a>
          </div>

          {/* 우측: SNS + 다크모드 + 언어 */}
          <div className="flex items-center gap-1">
            {SNS_LINKS.map((link) => {
              const Icon = SNS_ICON_MAP[link.icon]
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={t('Common.newWindow', { label: link.label })}
                >
                  <Icon className="size-3.5" />
                </a>
              )
            })}

            <div className="mx-1.5 h-3.5 w-px bg-border" />

            {/* 다크모드 토글 */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={t('Common.themeToggle')}
              >
                <Sun className="size-3.5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute size-3.5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
              </Button>
            )}

            <div className="mx-1.5 h-3.5 w-px bg-border" />

            {/* 언어 토글 */}
            <div className="flex items-center gap-0.5 text-xs font-medium">
              <button
                onClick={() => router.replace(pathname, { locale: 'ko' })}
                className={cn(
                  'rounded px-1.5 py-0.5 transition-colors',
                  locale === 'ko' ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                KO
              </button>
              <span className="text-border">|</span>
              <button
                onClick={() => router.replace(pathname, { locale: 'en' })}
                className={cn(
                  'rounded px-1.5 py-0.5 transition-colors',
                  locale === 'en' ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                EN
              </button>
            </div>

            <div className="mx-1.5 h-3.5 w-px bg-border" />

            {/* 로그인/사용자 정보 */}
            {mounted && (
              isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="size-3" />
                    {session.user?.name || t('Common.member')}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="rounded px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t('Common.logout')}
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LogIn className="size-3" />
                  {t('Common.login')}
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {/* MainNav */}
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* 로고 */}
        <Logo size="md" />

        {/* 데스크톱 메뉴 */}
        <ul className="hidden items-center gap-1 md:flex" role="menubar">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} role="none">
              <Link
                href={item.href}
                role="menuitem"
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-peace-sky',
                  pathname === item.href
                    ? 'text-peace-sky'
                    : 'text-peace-navy dark:text-foreground/80'
                )}
                {...(pathname === item.href ? { 'aria-current': 'page' as const } : {})}
              >
                {t(`Nav.${item.labelKey}`)}
              </Link>
            </li>
          ))}
          {isAuthenticated && (
            <li role="none">
              <Link
                href="/community"
                role="menuitem"
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-peace-sky',
                  pathname.startsWith('/community')
                    ? 'text-peace-sky'
                    : 'text-peace-navy dark:text-foreground/80'
                )}
                {...(pathname.startsWith('/community') ? { 'aria-current': 'page' as const } : {})}
              >
                {t('Common.community')}
              </Link>
            </li>
          )}
        </ul>

        {/* 우측: 로그인 + 후원 CTA + 모바일 햄버거 */}
        <div className="flex items-center gap-2">
          {/* 데스크톱: 미로그인 시 로그인 버튼 */}
          {mounted && !isAuthenticated && (
            <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
              <Link href="/login">
                <LogIn className="mr-1.5 size-3.5" />
                {t('Common.login')}
              </Link>
            </Button>
          )}
          <Button asChild className="bg-peace-orange text-white hover:bg-peace-orange/90">
            <Link href="/donate">{t('Common.donate')}</Link>
          </Button>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </nav>
    </header>
  )
}

export { Header }
