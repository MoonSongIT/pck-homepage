import createMiddleware from 'next-intl/middleware'
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { routing } from '@/i18n/routing'

const handleI18nRouting = createMiddleware(routing)
const { auth } = NextAuth(authConfig)

export default auth((request) => {
  // 관리자 경로 및 Studio는 i18n 라우팅 스킵 (auth만 적용)
  if (
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/studio')
  ) {
    return
  }

  // i18n 라우팅 처리
  return handleI18nRouting(request)
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)',],
}
