import { setRequestLocale } from 'next-intl/server'

import { redirect } from 'next/navigation'

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  redirect(`/news/${slug}`)
}
