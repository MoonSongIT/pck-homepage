import {
  DollarSign,
  Receipt,
  Users,
  GraduationCap,
  AlertCircle,
} from 'lucide-react'

import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// ─── 대시보드 데이터 조회 ───────────────────────────────

const getDashboardData = async () => {
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    donationResult,
    expenseResult,
    memberCount,
    educationCount,
    pendingReviewCount,
  ] = await Promise.all([
    // 총 후원금 (COMPLETED 상태)
    prisma.donation.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    // 총 지출 (CONFIRMED 상태)
    prisma.expense.aggregate({
      where: { status: 'CONFIRMED' },
      _sum: { amount: true },
    }),
    // 전체 회원 수
    prisma.user.count(),
    // 이번 달 교육 신청
    prisma.educationApplication.count({
      where: { createdAt: { gte: thisMonthStart } },
    }),
    // OCR 검토 대기 건수
    prisma.expense.count({
      where: { status: 'PENDING_REVIEW' },
    }),
  ])

  return {
    totalDonation: donationResult._sum.amount || 0,
    totalExpense: expenseResult._sum.amount || 0,
    memberCount,
    educationCount,
    pendingReviewCount,
  }
}

// ─── 통계 카드 타입 ─────────────────────────────────────

type StatCard = {
  title: string
  value: string
  icon: React.ElementType
  iconColor: string
  description: string
}

// ─── 페이지 ─────────────────────────────────────────────

const AdminDashboardPage = async () => {
  const data = await getDashboardData()

  const stats: StatCard[] = [
    {
      title: '총 후원금',
      value: `${data.totalDonation.toLocaleString()}원`,
      icon: DollarSign,
      iconColor: 'text-peace-olive',
      description: '승인된 후원 총액',
    },
    {
      title: '총 지출',
      value: `${data.totalExpense.toLocaleString()}원`,
      icon: Receipt,
      iconColor: 'text-peace-orange',
      description: '확정된 지출 총액',
    },
    {
      title: '회원 수',
      value: `${data.memberCount.toLocaleString()}명`,
      icon: Users,
      iconColor: 'text-peace-sky',
      description: '전체 등록 회원',
    },
    {
      title: '이번 달 교육 신청',
      value: `${data.educationCount}건`,
      icon: GraduationCap,
      iconColor: 'text-peace-gold',
      description: `${new Date().getMonth() + 1}월 신청 건수`,
    },
  ]

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            대시보드
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            팍스크리스티코리아 관리 현황
          </p>
        </div>

        {/* OCR 검토 대기 뱃지 */}
        {data.pendingReviewCount > 0 && (
          <Badge
            variant="outline"
            className="gap-1.5 border-peace-gold/30 bg-peace-gold/10 px-3 py-1.5 text-peace-gold"
          >
            <AlertCircle className="size-3.5" />
            영수증 검토 대기 {data.pendingReviewCount}건
          </Badge>
        )}
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`size-5 ${stat.iconColor}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 빠른 링크 */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
            빠른 작업
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <QuickLink
              href="/admin/finance/expenses"
              label="제경비 등록"
              description="영수증 스캔 또는 수동 입력"
            />
            <QuickLink
              href="/admin/finance/budget"
              label="예산 현황"
              description="연도별 편성/집행 확인"
            />
            <QuickLink
              href="/admin/finance/reports"
              label="결산 보고서"
              description="연도별 수입/지출 집계"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── 빠른 링크 컴포넌트 ─────────────────────────────────

const QuickLink = ({
  href,
  label,
  description,
}: {
  href: string
  label: string
  description: string
}) => (
  <a
    href={href}
    className="group rounded-lg border border-gray-200 p-4 transition-colors hover:border-peace-sky/30 hover:bg-peace-sky/5 dark:border-gray-800 dark:hover:border-peace-sky/30 dark:hover:bg-peace-sky/5"
  >
    <p className="font-medium text-gray-900 group-hover:text-peace-sky dark:text-gray-100">
      {label}
    </p>
    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
      {description}
    </p>
  </a>
)

export default AdminDashboardPage
