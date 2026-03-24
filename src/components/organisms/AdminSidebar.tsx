'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Menu, LogOut, Shield } from 'lucide-react'

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
import { cn } from '@/lib/utils'
import { ADMIN_MENU, ADMIN_CONFIG } from '@/lib/constants/admin'

// ─── 사이드바 내비게이션 (공용) ────────────────────────

const SidebarNav = ({
  onItemClick,
}: {
  onItemClick?: () => void
}) => {
  const pathname = usePathname()

  return (
    <nav aria-label="관리자 메뉴" className="flex flex-col gap-1">
      {ADMIN_MENU.map((group) => (
        <div key={group.title} className="mb-2">
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-white/50">
            {group.title}
          </p>
          {group.items.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white',
                )}
                {...(isActive ? { 'aria-current': 'page' as const } : {})}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

// ─── 사이드바 하단 (로고 + 로그아웃) ───────────────────

const SidebarFooter = ({ userName }: { userName?: string }) => (
  <div className="mt-auto border-t border-white/10 pt-4">
    <div className="mb-3 flex items-center gap-2 px-3">
      <Shield className="size-4 text-peace-gold" />
      <div>
        <p className="text-sm font-medium text-white">
          {userName || '관리자'}
        </p>
        <p className="text-xs text-white/50">{ADMIN_CONFIG.subtitle}</p>
      </div>
    </div>
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
    >
      <LogOut className="size-4" />
      로그아웃
    </button>
  </div>
)

// ─── 데스크톱 사이드바 ─────────────────────────────────

const DesktopSidebar = ({ userName }: { userName?: string }) => (
  <aside
    className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-[#1a3a5c] p-4 md:flex"
    aria-label="관리자 사이드바"
  >
    {/* 로고 영역 */}
    <div className="mb-6 flex items-center gap-2 px-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-white/15">
        <span className="text-sm font-bold text-white">P</span>
      </div>
      <div>
        <p className="text-sm font-bold text-white">{ADMIN_CONFIG.title}</p>
        <p className="text-xs text-white/50">PCK Admin</p>
      </div>
    </div>

    <SidebarNav />
    <SidebarFooter userName={userName} />
  </aside>
)

// ─── 모바일 헤더 + Sheet 사이드바 ──────────────────────

const MobileAdminHeader = ({ userName }: { userName?: string }) => {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-[#1a3a5c] px-4 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            aria-label="메뉴 열기"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[260px] border-none bg-[#1a3a5c] p-4"
        >
          <SheetHeader className="mb-4">
            <SheetTitle className="text-left text-white">
              {ADMIN_CONFIG.title}
            </SheetTitle>
            <SheetDescription className="sr-only">
              관리자 메뉴
            </SheetDescription>
          </SheetHeader>
          <SidebarNav onItemClick={() => setOpen(false)} />
          <SidebarFooter userName={userName} />
        </SheetContent>
      </Sheet>

      <span className="text-sm font-bold text-white">
        {ADMIN_CONFIG.title}
      </span>
    </header>
  )
}

// ─── 통합 export ───────────────────────────────────────

const AdminSidebar = ({ userName }: { userName?: string }) => (
  <>
    <DesktopSidebar userName={userName} />
    <MobileAdminHeader userName={userName} />
  </>
)

export { AdminSidebar }
