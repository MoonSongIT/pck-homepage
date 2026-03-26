'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { useSession, signOut } from 'next-auth/react'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, Phone, Mail, LogIn, LogOut, User, Sun, Moon } from 'lucide-react'

import { Link, usePathname, useRouter } from '@/i18n/navigation'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Logo } from '@/components/atoms/Logo'
import { NAV_ITEMS, CONTACT_INFO } from '@/lib/constants/navigation'
import { cn } from '@/lib/utils'

const MobileNav = () => {
  const [open, setOpen] = useState(false)
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('Common.openMenu')}>
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader className="px-4 pb-4">
          <SheetTitle>
            <Logo size="sm" />
          </SheetTitle>
          <SheetDescription className="sr-only">{t('Common.siteNavigation')}</SheetDescription>
        </SheetHeader>

        <nav aria-label={t('Common.siteNavigation')} className="flex flex-col px-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'border-b border-border/50 py-3.5 text-base font-medium transition-colors hover:text-peace-sky',
                pathname === item.href
                  ? 'text-peace-sky'
                  : 'text-foreground'
              )}
              {...(pathname === item.href ? { 'aria-current': 'page' as const } : {})}
            >
              {t(`Nav.${item.labelKey}`)}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              href="/community"
              onClick={() => setOpen(false)}
              className={cn(
                'border-b border-border/50 py-3.5 text-base font-medium transition-colors hover:text-peace-sky',
                pathname.startsWith('/community')
                  ? 'text-peace-sky'
                  : 'text-foreground'
              )}
              {...(pathname.startsWith('/community') ? { 'aria-current': 'page' as const } : {})}
            >
              {t('Common.community')}
            </Link>
          )}
        </nav>

        <Separator className="mx-4 my-4" />

        {/* 로그인 상태 */}
        <div className="px-4">
          {isAuthenticated ? (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-foreground">
                <User className="size-4 text-peace-sky" />
                {session.user?.name || t('Common.member')}
              </span>
              <button
                onClick={() => {
                  setOpen(false)
                  signOut({ callbackUrl: '/' })
                }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="size-4" />
                {t('Common.logout')}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-peace-sky transition-colors hover:text-peace-navy"
            >
              <LogIn className="size-4" />
              {t('Common.login')} / {t('Common.register')}
            </Link>
          )}
        </div>

        <Separator className="mx-4 my-4" />

        <div className="space-y-3 px-4 text-sm text-muted-foreground">
          <a
            href={`tel:${CONTACT_INFO.phone}`}
            className="flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Phone className="size-4" />
            {CONTACT_INFO.phone}
          </a>
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Mail className="size-4" />
            {CONTACT_INFO.email}
          </a>
        </div>

        {/* 다크모드 토글 + 언어 토글 */}
        <div className="flex items-center gap-3 px-4 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={t('Common.themeToggle')}
            className="flex items-center gap-1.5"
          >
            <Sun className="size-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="ml-3 text-xs">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 px-4 pt-3">
          <button
            onClick={() => {
              router.replace(pathname, { locale: 'ko' })
              setOpen(false)
            }}
            className={cn(
              'rounded px-2 py-1 text-sm transition-colors',
              locale === 'ko' ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            KO
          </button>
          <span className="text-border">|</span>
          <button
            onClick={() => {
              router.replace(pathname, { locale: 'en' })
              setOpen(false)
            }}
            className={cn(
              'rounded px-2 py-1 text-sm transition-colors',
              locale === 'en' ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            EN
          </button>
        </div>

        <div className="px-4 pt-6">
          <Button asChild className="w-full bg-peace-orange text-white hover:bg-peace-orange/90">
            <Link href="/donate" onClick={() => setOpen(false)}>
              {t('Common.donate')}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { MobileNav }
