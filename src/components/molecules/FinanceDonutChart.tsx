'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// ─── 타입 ──────────────────────────────────────────────

export interface DonutSlice {
  name: string
  value: number
  color: string
}

interface Props {
  data: DonutSlice[]
}

// ─── 포맷 유틸 ─────────────────────────────────────────

const formatKRW = (n: number) => n.toLocaleString('ko-KR') + '원'

// ─── 커스텀 툴팁 ───────────────────────────────────────

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: { name: string; value: number }[]
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-md">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-muted-foreground">{formatKRW(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

// ─── 컴포넌트 ──────────────────────────────────────────

export const FinanceDonutChart = ({ data }: Props) => {
  if (!data.length) return null

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((slice, index) => (
            <Cell key={`cell-${index}`} fill={slice.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span className="text-xs text-foreground">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
