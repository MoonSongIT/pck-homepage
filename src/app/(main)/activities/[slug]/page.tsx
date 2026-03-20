import { redirect } from 'next/navigation'

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  redirect(`/news/${slug}`)
}
