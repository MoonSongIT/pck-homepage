'use client'

import { useActionState, useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, MessageSquare, Loader2, X, Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { COMMUNITY_CONFIG } from '@/lib/constants/community'
import {
  deletePost,
  createComment,
  deleteComment,
  type CommunityResult,
} from '@/app/actions/community'

type PostData = {
  id: string
  title: string
  content: string
  boardType: string
  boardLabel: string
  authorId: string
  authorName: string
  createdAt: string
  updatedAt: string
  comments: CommentData[]
}

type CommentData = {
  id: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
}

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const PostDetail = ({
  post,
  currentUserId,
}: {
  post: PostData
  currentUserId?: string
}) => {
  const isAuthor = currentUserId === post.authorId
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await deletePost(post.id)
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      {/* 뒤로가기 */}
      <div className="mb-6">
        <Link
          href="/community"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-peace-sky dark:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Link>
      </div>

      {/* 게시글 헤더 */}
      <div className="mb-6">
        <span className="mb-2 inline-block rounded-full bg-peace-navy/10 px-3 py-1 text-xs font-medium text-peace-navy dark:bg-peace-sky/20 dark:text-peace-sky">
          {post.boardLabel}
        </span>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
          {post.title}
        </h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">{post.authorName}</span>
          <span>{formatDate(post.createdAt)}</span>
          {post.createdAt !== post.updatedAt && (
            <span className="text-xs">(수정됨)</span>
          )}
        </div>
      </div>

      {/* 수정/삭제 버튼 */}
      {isAuthor && (
        <div className="mb-6 flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/community/${post.id}/edit`}>
              <Edit className="mr-1 h-3 w-3" />
              수정
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                <Trash2 className="mr-1 h-3 w-3" />
                삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{COMMUNITY_CONFIG.deleteConfirm.title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {COMMUNITY_CONFIG.deleteConfirm.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{COMMUNITY_CONFIG.deleteConfirm.cancel}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {COMMUNITY_CONFIG.deleteConfirm.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <Separator />

      {/* 본문 */}
      <div className="py-8">
        <p className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
          {post.content}
        </p>
      </div>

      <Separator />

      {/* 댓글 섹션 */}
      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
          <MessageSquare className="h-5 w-5" />
          {COMMUNITY_CONFIG.comment.label}
          <span className="text-sm font-normal text-gray-500">({post.comments.length})</span>
        </h2>

        {/* 댓글 입력 */}
        {currentUserId && (
          <CommentForm postId={post.id} />
        )}

        {/* 댓글 목록 */}
        {post.comments.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
            {COMMUNITY_CONFIG.comment.empty}
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {post.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={post.id}
                isAuthor={currentUserId === comment.authorId}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── 댓글 입력 폼 ──────────────────────────────────

const CommentForm = ({ postId }: { postId: string }) => {
  const boundAction = createComment.bind(null, postId)
  const [state, formAction, isPending] = useActionState<CommunityResult | null, FormData>(
    boundAction,
    null
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="flex gap-2">
      <Textarea
        name="content"
        placeholder={COMMUNITY_CONFIG.comment.placeholder}
        rows={2}
        className="flex-1 resize-none"
        required
      />
      <Button
        type="submit"
        size="sm"
        className="self-end bg-peace-navy hover:bg-peace-navy/90"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  )
}

// ─── 댓글 아이템 ───────────────────────────────────

const CommentItem = ({
  comment,
  postId,
  isAuthor,
}: {
  comment: CommentData
  postId: string
  isAuthor: boolean
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteComment(comment.id, postId)
  }

  return (
    <div className="rounded-lg border border-gray-100 p-4 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-900 dark:text-white">
            {comment.authorName}
          </span>
          <span className="text-gray-400 dark:text-gray-500">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        {isAuthor && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-500 disabled:opacity-50"
            aria-label="댓글 삭제"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
        {comment.content}
      </p>
    </div>
  )
}
