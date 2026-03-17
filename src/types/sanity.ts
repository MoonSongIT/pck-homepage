import type { PortableTextBlock } from 'next-sanity'

// ─── 공통 Sanity 타입 ────────────────────────────────────────

export type SanityImage = {
  asset: {
    _id: string
    url: string
  }
  alt?: string
}

export type SanitySlug = {
  current: string
}

// ─── post — 뉴스/활동 게시글 ─────────────────────────────────

export type PostCategory = 'news' | 'activity' | 'statement' | 'press'

export type Post = {
  _id: string
  title: string
  slug: SanitySlug
  category: PostCategory
  excerpt?: string
  body: PortableTextBlock[]
  publishedAt: string
  mainImage?: SanityImage
  relatedPosts?: Pick<Post, '_id' | 'title' | 'slug' | 'publishedAt' | 'mainImage'>[]
}

// ─── education — 평화학교 교육 ────────────────────────────────

export type CurriculumItem = {
  title: string
  description?: string
  date?: string
}

export type Education = {
  _id: string
  title: string
  slug: SanitySlug
  description?: string
  body?: PortableTextBlock[]
  startDate: string
  endDate?: string
  isRecruiting: boolean
  curriculum?: CurriculumItem[]
  mainImage?: SanityImage
}

// ─── teamMember — 임원진 ─────────────────────────────────────

export type TeamMember = {
  _id: string
  name: string
  role: string
  bio?: string
  photo?: SanityImage
  order?: number
}

// ─── timeline — 연혁 이벤트 ───────────────────────────────────

export type TimelineEvent = {
  _id: string
  year: number
  title: string
  description?: string
}
