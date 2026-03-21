'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { postSchema, commentSchema } from '@/lib/validations/community'

export type CommunityResult = {
  success: boolean
  message: string
  fieldErrors?: Record<string, string>
}

// ─── 게시글 CRUD ───────────────────────────────────

export async function createPost(
  _prev: CommunityResult | null,
  formData: FormData
): Promise<CommunityResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: '로그인이 필요합니다.' }
  }

  const raw = {
    title: formData.get('title'),
    content: formData.get('content'),
    boardType: formData.get('boardType'),
  }

  const parsed = postSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (key && typeof key === 'string') {
        fieldErrors[key] = issue.message
      }
    }
    return { success: false, message: '입력 정보를 확인해 주세요.', fieldErrors }
  }

  const post = await prisma.communityPost.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      boardType: parsed.data.boardType,
      authorId: session.user.id,
    },
  })

  redirect(`/community/${post.id}`)
}

export async function updatePost(
  postId: string,
  _prev: CommunityResult | null,
  formData: FormData
): Promise<CommunityResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: '로그인이 필요합니다.' }
  }

  const existing = await prisma.communityPost.findUnique({ where: { id: postId } })
  if (!existing || existing.authorId !== session.user.id) {
    return { success: false, message: '수정 권한이 없습니다.' }
  }

  const raw = {
    title: formData.get('title'),
    content: formData.get('content'),
    boardType: formData.get('boardType'),
  }

  const parsed = postSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (key && typeof key === 'string') {
        fieldErrors[key] = issue.message
      }
    }
    return { success: false, message: '입력 정보를 확인해 주세요.', fieldErrors }
  }

  await prisma.communityPost.update({
    where: { id: postId },
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      boardType: parsed.data.boardType,
    },
  })

  redirect(`/community/${postId}`)
}

export async function deletePost(postId: string): Promise<CommunityResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: '로그인이 필요합니다.' }
  }

  const existing = await prisma.communityPost.findUnique({ where: { id: postId } })
  if (!existing || existing.authorId !== session.user.id) {
    return { success: false, message: '삭제 권한이 없습니다.' }
  }

  await prisma.communityPost.delete({ where: { id: postId } })

  redirect('/community')
}

// ─── 댓글 CRUD ─────────────────────────────────────

export async function createComment(
  postId: string,
  _prev: CommunityResult | null,
  formData: FormData
): Promise<CommunityResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: '로그인이 필요합니다.' }
  }

  const raw = { content: formData.get('content') }

  const parsed = commentSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  await prisma.comment.create({
    data: {
      content: parsed.data.content,
      postId,
      authorId: session.user.id,
    },
  })

  revalidatePath(`/community/${postId}`)
  return { success: true, message: '댓글이 등록되었습니다.' }
}

export async function deleteComment(
  commentId: string,
  postId: string
): Promise<CommunityResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: '로그인이 필요합니다.' }
  }

  const existing = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!existing || existing.authorId !== session.user.id) {
    return { success: false, message: '삭제 권한이 없습니다.' }
  }

  await prisma.comment.delete({ where: { id: commentId } })

  revalidatePath(`/community/${postId}`)
  return { success: true, message: '댓글이 삭제되었습니다.' }
}
