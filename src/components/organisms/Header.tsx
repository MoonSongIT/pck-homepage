'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Phone, Mail, Sun, Moon, Instagram, Youtube, Facebook } from 'lucide-react'

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
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

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
                  aria-label={`${link.label} (새 창)`}
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
                aria-label="테마 전환"
              >
                <Sun className="size-3.5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute size-3.5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
              </Button>
            )}

            <div className="mx-1.5 h-3.5 w-px bg-border" />

            {/* 언어 토글 */}
            <div className="flex items-center gap-0.5 text-xs font-medium">
              <button className="rounded px-1.5 py-0.5 text-foreground">KO</button>
              <span className="text-border">|</span>
              <button className="rounded px-1.5 py-0.5 text-muted-foreground transition-colors hover:text-foreground">
                EN
              </button>
            </div>
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
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground',
                  pathname === item.href
                    ? 'text-peace-sky'
                    : 'text-foreground/80'
                )}
                {...(pathname === item.href ? { 'aria-current': 'page' as const } : {})}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 우측: 후원 CTA + 모바일 햄버거 */}
        <div className="flex items-center gap-2">
          <Button asChild className="bg-peace-orange text-white hover:bg-peace-orange/90">
            <Link href="/donate">후원하기</Link>
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
