import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NewsCard } from '../molecules/NewsCard'
import type { Post } from '@/types/sanity'

// next/image mock
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// next/link mock
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// Sanity image mock
vi.mock('@/lib/sanity/image', () => ({
  imagePresets: {
    thumbnail: () => ({
      url: () => 'https://cdn.sanity.io/test-thumb.jpg',
    }),
  },
}))

const mockPost: Post = {
  _id: 'post-1',
  title: '2026 평화 컨퍼런스 개최',
  slug: { current: 'peace-conference-2026' },
  publishedAt: '2026-03-20T09:00:00Z',
  category: 'news',
  body: [],
  excerpt: '팍스크리스티코리아가 국제 평화 컨퍼런스를 개최합니다.',
  mainImage: {
    alt: '컨퍼런스 메인 이미지',
    asset: { _id: 'image-abc', url: 'https://cdn.sanity.io/test.jpg' },
  },
}

describe('NewsCard', () => {
  it('제목이 렌더링된다', () => {
    render(<NewsCard post={mockPost} />)
    expect(screen.getByText('2026 평화 컨퍼런스 개최')).toBeInTheDocument()
  })

  it('발행일이 렌더링된다', () => {
    render(<NewsCard post={mockPost} />)
    const timeEl = screen.getByRole('time')
    expect(timeEl).toHaveAttribute('datetime', '2026-03-20T09:00:00Z')
  })

  it('발췌문이 렌더링된다', () => {
    render(<NewsCard post={mockPost} />)
    expect(screen.getByText(/국제 평화 컨퍼런스/)).toBeInTheDocument()
  })

  it('링크가 올바른 slug를 가리킨다', () => {
    render(<NewsCard post={mockPost} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/news/peace-conference-2026')
  })

  it('이미지가 렌더링된다', () => {
    render(<NewsCard post={mockPost} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', '컨퍼런스 메인 이미지')
  })

  it('mainImage가 없으면 플레이스홀더를 사용한다', () => {
    const postWithoutImage = { ...mockPost, mainImage: undefined }
    render(<NewsCard post={postWithoutImage} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/images/news/placeholder-1.svg')
  })

  it('커스텀 className을 적용할 수 있다', () => {
    const { container } = render(<NewsCard post={mockPost} className="my-class" />)
    expect(container.firstChild).toHaveClass('my-class')
  })
})
