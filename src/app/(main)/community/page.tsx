import type { Metadata } from 'next'

import { prisma } from '@/lib/prisma'
import { COMMUNITY_CONFIG, BOARD_TYPES } from '@/lib/constants/community'
import { CommunityList } from './community-list'
import type { BoardType } from '@/generated/prisma/client'

export const metadata: Metadata = {
  title: '커뮤니티 | 팍스크리스티코리아',
  description: '팍스크리스티코리아 회원 커뮤니티 — 자유게시판, 평화 나눔',
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ board?: string; page?: string }>
}) {
  const params = await searchParams
  const boardType = (
    params.board && params.board in BOARD_TYPES ? params.board : 'FREE'
  ) as BoardType
  const page = Math.max(1, Number(params.page) || 1)
  const limit = COMMUNITY_CONFIG.postsPerPage
  const skip = (page - 1) * limit

  const [posts, totalCount] = await Promise.all([
    prisma.communityPost.findMany({
      where: { boardType },
      include: {
        author: { select: { name: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.communityPost.count({ where: { boardType } }),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  const serializedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    boardType: post.boardType,
    authorName: post.author.name || '익명',
    commentCount: post._count.comments,
    createdAt: post.createdAt.toISOString(),
  }))

  return (
    <CommunityList
      posts={serializedPosts}
      currentBoard={boardType}
      currentPage={page}
      totalPages={totalPages}
    />
  )
}
