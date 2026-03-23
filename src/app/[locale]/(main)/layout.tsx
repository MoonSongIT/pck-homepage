import { setRequestLocale } from 'next-intl/server'

import { MainLayout } from '@/components/templates/MainLayout'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function MainGroupLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <MainLayout>{children}</MainLayout>
}
