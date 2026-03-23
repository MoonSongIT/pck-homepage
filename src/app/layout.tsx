import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '팍스크리스티코리아 | Pax Christi Korea',
  description: '그리스도의 평화 — 가톨릭 국제 평화 운동 한국 지부',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
