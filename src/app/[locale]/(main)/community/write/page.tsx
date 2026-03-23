import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { BOARD_TYPES } from '@/lib/constants/community'
import { WriteForm } from './write-form'
import type { BoardType } from '@/generated/prisma/client'

export const metadata: Metadata = {
  title: '글쓰기 | 커뮤니티 | 팍스크리스티코리아',
}

const WritePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ board?: string }>
}) => {
  const { locale } = await params
  setRequestLocale(locale)
  const session = await auth()
  if (!session?.user) redirect('/login')

  const resolvedSearchParams = await searchParams
  const board = (
    resolvedSearchParams.board && resolvedSearchParams.board in BOARD_TYPES ? resolvedSearchParams.board : 'FREE'
  ) as BoardType

  return <WriteForm defaultValues={{ title: '', content: '', boardType: board }} />
}

export default WritePage
