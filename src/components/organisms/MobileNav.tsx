'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Menu, Phone, Mail, LogIn, LogOut, User } from 'lucide-react'

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
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="메뉴 열기">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader className="px-4 pb-4">
          <SheetTitle>
            <Logo size="sm" />
          </SheetTitle>
          <SheetDescription className="sr-only">사이트 내비게이션 메뉴</SheetDescription>
        </SheetHeader>

        <nav aria-label="모바일 내비게이션" className="flex flex-col px-4">
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
              {item.label}
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
              커뮤니티
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
                {session.user?.name || '회원'}
              </span>
              <button
                onClick={() => {
                  setOpen(false)
                  signOut({ callbackUrl: '/' })
                }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="size-4" />
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-peace-sky transition-colors hover:text-peace-navy"
            >
              <LogIn className="size-4" />
              로그인 / 회원가입
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

        <div className="px-4 pt-6">
          <Button asChild className="w-full bg-peace-orange text-white hover:bg-peace-orange/90">
            <Link href="/donate" onClick={() => setOpen(false)}>
              후원하기
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { MobileNav }
