import { defineQuery } from 'next-sanity'

// ─── 뉴스/활동 게시글 (post) ─────────────────────────────────

// 게시글 목록 (페이지네이션)
export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    slug,
    category,
    excerpt,
    publishedAt,
    mainImage {
      asset->{_id, url},
      alt
    }
  }
`)

// 카테고리별 게시글 목록
export const POSTS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "post" && category == $category && defined(slug.current)] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    slug,
    category,
    excerpt,
    publishedAt,
    mainImage {
      asset->{_id, url},
      alt
    }
  }
`)

// 게시글 상세
export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    body,
    excerpt,
    publishedAt,
    mainImage {
      asset->{_id, url},
      alt
    },
    "relatedPosts": *[_type == "post" && category == ^.category && _id != ^._id] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      publishedAt,
      mainImage {
        asset->{_id, url},
        alt
      }
    }
  }
`)

// 게시글 슬러그 전체 목록 (SSG용)
export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)].slug.current
`)

// 총 게시글 수
export const POSTS_COUNT_QUERY = defineQuery(`
  count(*[_type == "post" && defined(slug.current)])
`)

// ─── 평화학교 교육 (education) ────────────────────────────────

// 교육 프로그램 목록
export const EDUCATIONS_QUERY = defineQuery(`
  *[_type == "education"] | order(startDate desc) [0...$limit] {
    _id,
    title,
    slug,
    description,
    startDate,
    endDate,
    isRecruiting,
    curriculum,
    mainImage {
      asset->{_id, url},
      alt
    }
  }
`)

// 현재 모집 중인 교육
export const RECRUITING_EDUCATIONS_QUERY = defineQuery(`
  *[_type == "education" && isRecruiting == true] | order(startDate asc) {
    _id,
    title,
    slug,
    description,
    startDate,
    endDate,
    isRecruiting,
    mainImage {
      asset->{_id, url},
      alt
    }
  }
`)

// 교육 상세
export const EDUCATION_QUERY = defineQuery(`
  *[_type == "education" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    body,
    startDate,
    endDate,
    isRecruiting,
    curriculum[] {
      title,
      description,
      date
    },
    mainImage {
      asset->{_id, url},
      alt
    }
  }
`)

// ─── 임원진 (teamMember) ─────────────────────────────────────

// 임원진 전체 목록 (정렬순서)
export const TEAM_MEMBERS_QUERY = defineQuery(`
  *[_type == "teamMember"] | order(order asc) {
    _id,
    name,
    role,
    bio,
    photo {
      asset->{_id, url},
      alt
    }
  }
`)

// ─── 연혁 타임라인 (timeline) ─────────────────────────────────

// 연혁 전체 목록 (연도순)
export const TIMELINE_QUERY = defineQuery(`
  *[_type == "timeline"] | order(year desc) {
    _id,
    year,
    title,
    description
  }
`)

// ─── 홈페이지용 조합 쿼리 ────────────────────────────────────

// 메인 페이지: 최신 뉴스 3건
export const LATEST_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    category,
    excerpt,
    publishedAt,
    mainImage {
      asset->{_id, url},
      alt
    }
  }
`)
