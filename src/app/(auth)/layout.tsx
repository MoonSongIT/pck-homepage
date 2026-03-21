import { Logo } from '@/components/atoms/Logo'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-peace-cream px-4 py-12 dark:bg-gray-950">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} 팍스크리스티코리아
      </p>
    </div>
  )
}

export default AuthLayout
