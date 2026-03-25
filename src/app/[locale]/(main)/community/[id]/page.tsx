import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BOARD_TYPES } from '@/lib/constants/community'
import { PostDetail } from './post-detail'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const post = await prisma.communityPost.findUnique({
    where: { id },
    select: { title: true },
  })

  if (!post) return { title: '게시글을 찾을 수 없습니다' }

  return {
    title: `${post.title} | 커뮤니티`,
    description: `팍스크리스티코리아 커뮤니티 게시글 — ${post.title}`,
    openGraph: {
      title: `${post.title} | 커뮤니티`,
      description: `팍스크리스티코리아 커뮤니티 게시글 — ${post.title}`,
    },
  }
}

const PostPage = async ({ params }: { params: Promise<{ locale: string; id: string }> }) => {
  const { locale, id } = await params
  setRequestLocale(locale)
  const session = await auth()

  const post = await prisma.communityPost.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true } },
      comments: {
        include: {
          author: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!post) notFound()

  const serializedPost = {
    id: post.id,
    title: post.title,
    content: post.content,
    boardType: post.boardType,
    boardLabel: BOARD_TYPES[post.boardType].label,
    authorId: post.author.id,
    authorName: post.author.name || '익명',
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    comments: post.comments.map((c) => ({
      id: c.id,
      content: c.content,
      authorId: c.author.id,
      authorName: c.author.name || '익명',
      createdAt: c.createdAt.toISOString(),
    })),
  }

  return (
    <PostDetail
      post={serializedPost}
      currentUserId={session?.user?.id}
    />
  )
}

export default PostPage
