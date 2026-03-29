import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import Kakao from 'next-auth/providers/kakao'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { authConfig } from '@/lib/auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: '이메일 로그인',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: (credentials.email as string).toLowerCase().trim() },
        })

        if (!user || !user.hashedPassword) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        )

        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        }
      },
    }),
    Kakao({
      clientId: process.env.AUTH_KAKAO_ID,
      clientSecret: process.env.AUTH_KAKAO_SECRET,
    }),
  ],
  events: {
    // 카카오 최초 가입 시: 닉네임/프로필 이미지 DB 저장
    async createUser({ user }) {
      if (!user.id) return
      const account = await prisma.account.findFirst({
        where: { userId: user.id, provider: 'kakao' },
      })
      if (!account) return

      // Kakao provider가 넘긴 name/image가 있으면 이미 저장됨
      // 없는 경우만 kakaoId 동기화
      await prisma.user.update({
        where: { id: user.id },
        data: {
          kakaoId: account.providerAccountId,
        },
      })
    },
    // 카카오 재로그인 시: name/image가 비어있으면 카카오 프로필로 채움
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'kakao' || !user.id) return

      const kakaoProfile = profile as {
        kakao_account?: {
          profile?: { nickname?: string; profile_image_url?: string }
        }
      } | undefined
      const nickname = kakaoProfile?.kakao_account?.profile?.nickname
      const profileImage = kakaoProfile?.kakao_account?.profile?.profile_image_url

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true, image: true, kakaoId: true },
      })

      if (!dbUser) return

      const updateData: Record<string, string> = {}
      if (!dbUser.name && nickname) updateData.name = nickname
      if (!dbUser.image && profileImage) updateData.image = profileImage
      if (!dbUser.kakaoId) updateData.kakaoId = account.providerAccountId

      if (Object.keys(updateData).length > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        })
      }
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    // 카카오 이메일 미제공 케이스 차단
    async signIn({ user, account }) {
      if (account?.provider === 'kakao' && !user.email) {
        return '/login?error=EmailRequired'
      }
      return true
    },
    // 최초 로그인 시 DB에서 실제 role 조회 (카카오 OAuth role 버그 수정)
    async jwt({ token, user, account }) {
      if (account && user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id as string },
          select: { role: true },
        })
        token.role = dbUser?.role ?? 'MEMBER'
        token.id = user.id as string
      }
      return token
    },
  },
})
