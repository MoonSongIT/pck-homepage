import { z } from 'zod/v4'

export const postSchema = z.object({
  title: z.string().min(2, '제목은 2자 이상이어야 합니다').max(200, '제목은 200자 이하여야 합니다'),
  content: z.string().min(10, '내용은 10자 이상이어야 합니다').max(10000, '내용은 10000자 이하여야 합니다'),
  boardType: z.enum(['FREE', 'PEACE_SHARING']),
})

export const commentSchema = z.object({
  content: z.string().min(1, '댓글을 입력해 주세요').max(1000, '댓글은 1000자 이하여야 합니다'),
})

export type PostInput = z.infer<typeof postSchema>
export type CommentInput = z.infer<typeof commentSchema>
