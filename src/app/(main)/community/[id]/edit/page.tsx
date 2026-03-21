import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { WriteForm } from '../../write/write-form'

export const metadata: Metadata = {
  title: '글 수정 | 커뮤니티 | 팍스크리스티코리아',
}

const EditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { id } = await params

  const post = await prisma.communityPost.findUnique({
    where: { id },
    select: { id: true, title: true, content: true, boardType: true, authorId: true },
  })

  if (!post) notFound()
  if (post.authorId !== session.user.id) notFound()

  return (
    <WriteForm
      mode="edit"
      postId={post.id}
      defaultValues={{
        title: post.title,
        content: post.content,
        boardType: post.boardType,
      }}
    />
  )
}

export default EditPage
