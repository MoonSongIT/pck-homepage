import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Kakao from 'next-auth/providers/kakao'

export const authConfig = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: '이메일 로그인',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      // authorize는 auth.ts에서 오버라이드
      authorize: () => null,
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || 'MEMBER'
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      // locale prefix 제거 (ko, en 모두 prefix 사용)
      const pathname = request.nextUrl.pathname.replace(/^\/(ko|en)(?=\/|$)/, '') || '/'

      // 관리자 전용 경로
      if (pathname.startsWith('/admin') || pathname.startsWith('/api/finance')) {
        // CLI 스크립트용 API Key 헤더 허용 (route.ts에서 재검증)
        if (request.headers.get('x-api-key')) return true
        return isLoggedIn && auth?.user?.role === 'ADMIN'
      }

      // Studio 경로: ADMIN + EDITOR 접근 허용
      if (pathname.startsWith('/studio')) {
        return isLoggedIn && (auth?.user?.role === 'ADMIN' || auth?.user?.role === 'EDITOR')
      }

      // 로그인 필수 경로
      if (pathname.startsWith('/community') || pathname.startsWith('/api/donate')) {
        return isLoggedIn
      }

      return true
    },
  },
} satisfies NextAuthConfig
