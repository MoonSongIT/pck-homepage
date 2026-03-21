import type { BoardType } from '@/generated/prisma/client'

export const BOARD_TYPES: Record<BoardType, { label: string; description: string }> = {
  FREE: { label: '자유게시판', description: '자유로운 이야기를 나눕니다' },
  PEACE_SHARING: { label: '평화 나눔', description: '평화 활동 경험을 공유합니다' },
} as const

export const COMMUNITY_CONFIG = {
  postsPerPage: 20,
  hero: {
    title: '커뮤니티',
    subtitle: '회원 여러분과 함께하는 공간',
  },
  emptyMessage: '아직 작성된 글이 없습니다.',
  writeButton: '글쓰기',
  deleteConfirm: {
    title: '글을 삭제하시겠습니까?',
    description: '삭제된 글은 복구할 수 없습니다.',
    confirm: '삭제',
    cancel: '취소',
  },
  commentDeleteConfirm: {
    title: '댓글을 삭제하시겠습니까?',
    confirm: '삭제',
    cancel: '취소',
  },
  form: {
    boardLabel: '게시판',
    boardPlaceholder: '게시판을 선택하세요',
    titleLabel: '제목',
    titlePlaceholder: '제목을 입력하세요',
    contentLabel: '내용',
    contentPlaceholder: '내용을 입력하세요',
    submitCreate: '작성하기',
    submitUpdate: '수정하기',
    submitting: '저장 중...',
  },
  comment: {
    label: '댓글',
    placeholder: '댓글을 입력하세요',
    submit: '등록',
    submitting: '등록 중...',
    empty: '아직 댓글이 없습니다.',
  },
} as const
