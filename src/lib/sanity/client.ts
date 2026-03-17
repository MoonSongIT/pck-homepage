import { createClient } from 'next-sanity'

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-03-01',
  // ISR/SSG 사용 시 false로 설정 (tag-based revalidation 지원)
  useCdn: process.env.NODE_ENV === 'production',
}

// 읽기 전용 클라이언트 (공개 데이터 조회용)
export const client = createClient(sanityConfig)

// 인증된 클라이언트 (비공개 데이터 또는 프리뷰용)
export const previewClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// 프리뷰 모드에 따라 적절한 클라이언트 반환
export const getClient = (preview = false) =>
  preview ? previewClient : client
