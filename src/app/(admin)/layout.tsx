import { redirect } from 'next/navigation'
import { Inter, Noto_Sans_KR } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/lib/auth'
import { AdminSidebar } from '@/components/organisms/AdminSidebar'
import { Toaster } from '@/components/ui/sonner'

import '../globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const notoSansKR = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: '관리자 | 팍스크리스티코리아',
  description: '팍스크리스티코리아 관리자 대시보드',
}

const AdminLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  // ADMIN 권한 확인
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansKR.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
              <AdminSidebar userName={session.user.name || undefined} />

              {/* 메인 콘텐츠 영역 */}
              <div className="md:ml-60">
                <main className="min-h-screen p-4 pt-4 md:p-6">
                  {children}
                </main>
              </div>
            </div>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

export default AdminLayout
