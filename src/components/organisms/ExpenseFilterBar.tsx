'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EXPENSE_CATEGORY_LABELS, EXPENSE_STATUS } from '@/lib/constants/finance'

const ExpenseFilterBar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') ?? ''
  const currentStatus = searchParams.get('status') ?? ''
  const currentMonth = searchParams.get('month') ?? ''

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`/admin/finance/expenses?${params.toString()}`)
  }

  const hasFilter = currentCategory || currentStatus || currentMonth

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 카테고리 필터 */}
      <Select value={currentCategory} onValueChange={(v) => updateFilter('category', v === 'all' ? '' : v)}>
        <SelectTrigger className="h-9 w-36">
          <SelectValue placeholder="카테고리" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 카테고리</SelectItem>
          {(Object.entries(EXPENSE_CATEGORY_LABELS) as [string, string][]).map(([value, label]) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 상태 필터 */}
      <Select value={currentStatus} onValueChange={(v) => updateFilter('status', v === 'all' ? '' : v)}>
        <SelectTrigger className="h-9 w-32">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 상태</SelectItem>
          {(Object.entries(EXPENSE_STATUS) as [string, { label: string; color: string }][]).map(
            ([value, { label }]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ),
          )}
        </SelectContent>
      </Select>

      {/* 월 필터 */}
      <input
        type="month"
        value={currentMonth}
        onChange={(e) => updateFilter('month', e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
      />

      {/* 초기화 */}
      {hasFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/finance/expenses')}
          className="h-9 gap-1 text-gray-500"
        >
          <X className="h-3.5 w-3.5" />
          초기화
        </Button>
      )}
    </div>
  )
}

export default ExpenseFilterBar
