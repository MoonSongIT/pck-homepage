'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { MessageSquare, PenLine, Users, ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { WaveDivider } from '@/components/atoms/WaveDivider'
import { BOARD_TYPES, COMMUNITY_CONFIG } from '@/lib/constants/community'
import type { BoardType } from '@/generated/prisma/client'

type PostSummary = {
  id: string
  title: string
  boardType: BoardType
  authorName: string
  commentCount: number
  createdAt: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const formatDate = (iso: string) => {
  const d = new Date(iso)
  const now = new Date()
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()

  if (isToday) {
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export const CommunityList = ({
  posts,
  currentBoard,
  currentPage,
  totalPages,
}: {
  posts: PostSummary[]
  currentBoard: BoardType
  currentPage: number
  totalPages: number
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const shouldReduceMotion = useReducedMotion()
  const variants = shouldReduceMotion ? reducedItemVariants : itemVariants

  const handleBoardChange = (board: BoardType) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('board', board)
    params.delete('page')
    router.push(`/community?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/community?${params.toString()}`)
  }

  return (
    <>
      {/* 히어로 배너 */}
      <section className="bg-peace-navy py-16 text-white dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Users className="mx-auto mb-4 h-12 w-12 text-peace-gold" />
            <h1 className="text-3xl font-bold md:text-4xl">
              {COMMUNITY_CONFIG.hero.title}
            </h1>
            <p className="mt-3 text-lg text-gray-300">
              {COMMUNITY_CONFIG.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <WaveDivider color="navy" />

      {/* 메인 콘텐츠 */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        {/* 탭 + 글쓰기 버튼 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-2">
            {(Object.keys(BOARD_TYPES) as BoardType[]).map((board) => (
              <button
                key={board}
                onClick={() => handleBoardChange(board)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  currentBoard === board
                    ? 'bg-peace-navy text-white dark:bg-peace-sky'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {BOARD_TYPES[board].label}
              </button>
            ))}
          </div>

          <Button asChild className="bg-peace-orange hover:bg-peace-orange/90">
            <Link href={`/community/write?board=${currentBoard}`}>
              <PenLine className="mr-2 h-4 w-4" />
              {COMMUNITY_CONFIG.writeButton}
            </Link>
          </Button>
        </div>

        {/* 게시판 설명 */}
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {BOARD_TYPES[currentBoard].description}
        </p>

        {posts.length === 0 ? (
          /* 빈 상태 */
          <div className="py-20 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">
              {COMMUNITY_CONFIG.emptyMessage}
            </p>
            <Button asChild className="mt-4 bg-peace-orange hover:bg-peace-orange/90">
              <Link href="/community/write">첫 글을 작성해 보세요</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* 데스크톱: 테이블 */}
            <motion.div
              className="hidden md:block"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">제목</TableHead>
                    <TableHead className="w-[15%]">작성자</TableHead>
                    <TableHead className="w-[15%]">날짜</TableHead>
                    <TableHead className="w-[10%] text-center">댓글</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <motion.tr
                      key={post.id}
                      variants={variants}
                      className="cursor-pointer border-b transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      onClick={() => router.push(`/community/${post.id}`)}
                    >
                      <TableCell className="font-medium">
                        <Link
                          href={`/community/${post.id}`}
                          className="hover:text-peace-sky"
                        >
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {post.authorName}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(post.createdAt)}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-500">
                        {post.commentCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-peace-sky">
                            <MessageSquare className="h-3 w-3" />
                            {post.commentCount}
                          </span>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </motion.div>

            {/* 모바일: 카드 */}
            <motion.div
              className="space-y-3 md:hidden"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {posts.map((post) => (
                <motion.div key={post.id} variants={variants}>
                  <Link
                    href={`/community/${post.id}`}
                    className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-peace-sky dark:border-gray-700 dark:hover:border-peace-sky"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {post.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>{post.authorName}</span>
                      <span>{formatDate(post.createdAt)}</span>
                      {post.commentCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-peace-sky">
                          <MessageSquare className="h-3 w-3" />
                          {post.commentCount}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === currentPage ? 'default' : 'outline'}
                    size="sm"
                    className={p === currentPage ? 'bg-peace-navy' : ''}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}
