import { Header } from '@/components/organisms/Header'
import { Footer } from '@/components/organisms/Footer'

const MainLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-peace-orange focus:px-4 focus:py-2 focus:text-white"
      >
        본문으로 건너뛰기
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export { MainLayout }
