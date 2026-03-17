import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

export default NextAuth(authConfig).auth

export const config = {
  matcher: ['/community/:path*', '/admin/:path*', '/api/donate', '/api/finance/:path*'],
}
