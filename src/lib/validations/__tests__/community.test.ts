import { describe, it, expect } from 'vitest'
import { postSchema, commentSchema } from '../community'

describe('postSchema', () => {
  it('유효한 게시글 입력을 통과시킨다', () => {
    const result = postSchema.safeParse({
      title: '평화 나눔',
      content: '평화에 대한 이야기를 나눠봅시다. 함께 해요.',
      boardType: 'FREE',
    })
    expect(result.success).toBe(true)
  })

  it('PEACE_SHARING 게시판도 통과시킨다', () => {
    const result = postSchema.safeParse({
      title: '평화 나눔',
      content: '평화에 대한 이야기를 나눠봅시다. 함께 해요.',
      boardType: 'PEACE_SHARING',
    })
    expect(result.success).toBe(true)
  })

  it('제목이 2자 미만이면 거부한다', () => {
    const result = postSchema.safeParse({
      title: '글',
      content: '내용은 충분히 길게 작성합니다.',
      boardType: 'FREE',
    })
    expect(result.success).toBe(false)
  })

  it('제목이 200자 초과이면 거부한다', () => {
    const result = postSchema.safeParse({
      title: '가'.repeat(201),
      content: '내용은 충분히 길게 작성합니다.',
      boardType: 'FREE',
    })
    expect(result.success).toBe(false)
  })

  it('내용이 10자 미만이면 거부한다', () => {
    const result = postSchema.safeParse({
      title: '테스트 제목',
      content: '짧은내용',
      boardType: 'FREE',
    })
    expect(result.success).toBe(false)
  })

  it('내용이 10000자 초과이면 거부한다', () => {
    const result = postSchema.safeParse({
      title: '테스트 제목',
      content: '가'.repeat(10001),
      boardType: 'FREE',
    })
    expect(result.success).toBe(false)
  })

  it('잘못된 boardType을 거부한다', () => {
    const result = postSchema.safeParse({
      title: '테스트 제목',
      content: '내용은 충분히 길게 작성합니다.',
      boardType: 'INVALID',
    })
    expect(result.success).toBe(false)
  })
})

describe('commentSchema', () => {
  it('유효한 댓글을 통과시킨다', () => {
    const result = commentSchema.safeParse({ content: '좋은 글이네요!' })
    expect(result.success).toBe(true)
  })

  it('빈 댓글을 거부한다', () => {
    const result = commentSchema.safeParse({ content: '' })
    expect(result.success).toBe(false)
  })

  it('1000자 초과 댓글을 거부한다', () => {
    const result = commentSchema.safeParse({ content: '가'.repeat(1001) })
    expect(result.success).toBe(false)
  })
})
