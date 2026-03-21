'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BOARD_TYPES, COMMUNITY_CONFIG } from '@/lib/constants/community'
import { createPost, updatePost, type CommunityResult } from '@/app/actions/community'
import type { BoardType } from '@/generated/prisma/client'

const { form } = COMMUNITY_CONFIG

export const WriteForm = ({
  mode = 'create',
  postId,
  defaultValues,
}: {
  mode?: 'create' | 'edit'
  postId?: string
  defaultValues?: { title: string; content: string; boardType: BoardType }
}) => {
  const action = mode === 'edit' && postId
    ? updatePost.bind(null, postId)
    : createPost

  const [state, formAction, isPending] = useActionState<CommunityResult | null, FormData>(
    action,
    null
  )

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-6">
        <Link
          href="/community"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-peace-sky dark:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Link>
      </div>

      <h1 className="mb-8 text-2xl font-bold text-peace-navy dark:text-white">
        {mode === 'edit' ? '글 수정' : '글쓰기'}
      </h1>

      {state && !state.success && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400"
        >
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="boardType">{form.boardLabel}</Label>
          <Select name="boardType" defaultValue={defaultValues?.boardType || 'FREE'}>
            <SelectTrigger id="boardType">
              <SelectValue placeholder={form.boardPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(BOARD_TYPES) as BoardType[]).map((board) => (
                <SelectItem key={board} value={board}>
                  {BOARD_TYPES[board].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state?.fieldErrors?.boardType && (
            <p className="text-sm text-red-500">{state.fieldErrors.boardType}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">{form.titleLabel}</Label>
          <Input
            id="title"
            name="title"
            placeholder={form.titlePlaceholder}
            defaultValue={defaultValues?.title}
            required
            aria-invalid={!!state?.fieldErrors?.title}
          />
          {state?.fieldErrors?.title && (
            <p className="text-sm text-red-500">{state.fieldErrors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">{form.contentLabel}</Label>
          <Textarea
            id="content"
            name="content"
            placeholder={form.contentPlaceholder}
            defaultValue={defaultValues?.content}
            rows={12}
            required
            aria-invalid={!!state?.fieldErrors?.content}
          />
          {state?.fieldErrors?.content && (
            <p className="text-sm text-red-500">{state.fieldErrors.content}</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild>
            <Link href="/community">취소</Link>
          </Button>
          <Button
            type="submit"
            className="bg-peace-navy hover:bg-peace-navy/90"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {form.submitting}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {mode === 'edit' ? form.submitUpdate : form.submitCreate}
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  )
}
