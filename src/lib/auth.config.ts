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
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = nextUrl

      // 관리자 전용 경로
      if (pathname.startsWith('/admin') || pathname.startsWith('/api/finance')) {
        return isLoggedIn && auth?.user?.role === 'ADMIN'
      }

      // 로그인 필수 경로
      if (pathname.startsWith('/community') || pathname.startsWith('/api/donate')) {
        return isLoggedIn
      }

      return true
    },
  },
} satisfies NextAuthConfig
