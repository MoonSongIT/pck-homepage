import { MainLayout } from '@/components/templates/MainLayout'

export default function MainGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}
