import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { sanityConfig } from './client'

const builder = imageUrlBuilder({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
})

/**
 * Sanity 이미지 소스에서 최적화된 URL을 생성하는 헬퍼
 *
 * @example
 * ```tsx
 * <img src={urlFor(post.mainImage).width(800).height(400).url()} alt="..." />
 * <img src={urlFor(post.mainImage).width(400).auto('format').url()} alt="..." />
 * ```
 */
export const urlFor = (source: SanityImageSource) => builder.image(source)

/**
 * 자주 사용하는 이미지 프리셋
 */
export const imagePresets = {
  // 뉴스 카드 썸네일 (16:9)
  thumbnail: (source: SanityImageSource) =>
    urlFor(source).width(400).height(225).auto('format').quality(80),

  // 뉴스 상세 메인 이미지
  hero: (source: SanityImageSource) =>
    urlFor(source).width(1200).height(630).auto('format').quality(85),

  // 임원진 프로필 사진 (1:1)
  avatar: (source: SanityImageSource) =>
    urlFor(source).width(300).height(300).auto('format').quality(80),

  // OG 이미지 (1200x630 — SNS 공유용)
  ogImage: (source: SanityImageSource) =>
    urlFor(source).width(1200).height(630).auto('format').quality(90),
}
