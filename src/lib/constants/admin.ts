import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  FileBarChart,
  GraduationCap,
  Users,
  type LucideIcon,
} from 'lucide-react'

// ─── 사이드바 메뉴 ─────────────────────────────────────

export type AdminMenuItem = {
  label: string
  href: string
  icon: LucideIcon
}

export type AdminMenuGroup = {
  title: string
  items: AdminMenuItem[]
}

export const ADMIN_MENU: AdminMenuGroup[] = [
  {
    title: '대시보드',
    items: [
      { label: '대시보드', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: '재정 관리',
    items: [
      { label: '제경비 관리', href: '/admin/finance/expenses', icon: Receipt },
      { label: '예산 관리', href: '/admin/finance/budget', icon: PiggyBank },
      { label: '결산 보고서', href: '/admin/finance/reports', icon: FileBarChart },
    ],
  },
  {
    title: '운영 관리',
    items: [
      { label: '교육 관리', href: '/admin/education', icon: GraduationCap },
      { label: '회원 관리', href: '/admin/members', icon: Users },
    ],
  },
] as const

// ─── 관리자 페이지 설정 ─────────────────────────────────

export const ADMIN_CONFIG = {
  title: '관리자',
  subtitle: '팍스크리스티코리아',
  sidebarWidth: 240,
} as const
