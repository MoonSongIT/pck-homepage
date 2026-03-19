export const HERO_SLIDES = [
  {
    id: 1,
    desktop: '/images/hero/slide-1-desktop.webp',
    mobile: '/images/hero/slide-1-mobile.webp',
    alt: '평화의 빛',
  },
  {
    id: 2,
    desktop: '/images/hero/slide-2-desktop.webp',
    mobile: '/images/hero/slide-2-mobile.webp',
    alt: '연대와 화해',
  },
  {
    id: 3,
    desktop: '/images/hero/slide-3-desktop.webp',
    mobile: '/images/hero/slide-3-mobile.webp',
    alt: '비폭력 평화운동',
  },
  {
    id: 4,
    desktop: '/images/hero/slide-4-desktop.webp',
    mobile: '/images/hero/slide-4-mobile.webp',
    alt: '국제 평화 네트워크',
  },
] as const

export const TYPING_TEXTS = ['그리스도의 평화', 'Peace of Christ'] as const

export const HERO_CONFIG = {
  autoPlayInterval: 5000,
  typingDuration: 1.5,
  typingPause: 2.0,
  slideFadeDuration: 0.8,
} as const

export type HeroSlide = (typeof HERO_SLIDES)[number]
