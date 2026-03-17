import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { authConfig } from '@/lib/auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: authConfig.providers.map((provider) => {
    if (provider.id === 'credentials') {
      return {
        ...provider,
        authorize: async (credentials: Record<string, unknown>) => {
          if (!credentials?.email || !credentials?.password) return null

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          })

          if (!user || !user.hashedPassword) return null

          const isValid = await bcrypt.compare(credentials.password as string, user.hashedPassword)

          if (!isValid) return null

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
          }
        },
      }
    }
    return provider
  }),
})
