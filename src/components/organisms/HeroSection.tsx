'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { HERO_SLIDES, HERO_CONFIG } from '@/lib/constants/hero'
import { cn } from '@/lib/utils'

const slideVariants = {
  enter: { opacity: 0, scale: 1.1 },
  center: {
    opacity: 1,
    scale: 1,
    transition: { duration: HERO_CONFIG.slideFadeDuration, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    transition: { duration: HERO_CONFIG.slideFadeDuration, ease: 'easeIn' as const },
  },
}

const reducedSlideVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

const typingContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
}

const charVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
}

const contentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.15, duration: 0.6, ease: 'easeOut' as const },
  }),
}

const HeroSection = ({ className }: { className?: string }) => {
  const t = useTranslations()
  const typingTexts = [t('Hero.typingText1'), t('Hero.typingText2')]
  const slideAlts = [t('Hero.slide1Alt'), t('Hero.slide2Alt'), t('Hero.slide3Alt'), t('Hero.slide4Alt')]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [textIndex, setTextIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  // 슬라이드 자동 전환
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, HERO_CONFIG.autoPlayInterval)
    return () => clearInterval(timer)
  }, [isPaused])

  // 타이핑 텍스트 순환
  useEffect(() => {
    const interval = setInterval(
      () => {
        setTextIndex((prev) => (prev + 1) % typingTexts.length)
      },
      (HERO_CONFIG.typingDuration + HERO_CONFIG.typingPause) * 1000,
    )
    return () => clearInterval(interval)
  }, [typingTexts.length])

  // 키보드 내비게이션 (setCurrentSlide는 안정적인 state setter)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setCurrentSlide((prev) =>
        prev === 0 ? HERO_SLIDES.length - 1 : prev - 1,
      )
    }
    if (e.key === 'ArrowRight') {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }
  }, [setCurrentSlide])

  const currentText = typingTexts[textIndex]
  const activeVariants = shouldReduceMotion
    ? reducedSlideVariants
    : slideVariants

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t('Hero.carouselLabel')}
      className={cn('relative h-[80svh] w-full overflow-hidden', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
    >
      {/* 슬라이드 배경 이미지 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          variants={activeVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* 모바일 이미지 (md 미만) */}
          <Image
            src={HERO_SLIDES[currentSlide].mobile}
            alt={slideAlts[currentSlide]}
            fill
            priority={currentSlide === 0}
            sizes="100vw"
            className="object-cover md:hidden"
          />
          {/* 데스크톱 이미지 (md 이상) */}
          <Image
            src={HERO_SLIDES[currentSlide].desktop}
            alt={slideAlts[currentSlide]}
            fill
            priority={currentSlide === 0}
            sizes="100vw"
            className="hidden object-cover md:block"
          />
        </motion.div>
      </AnimatePresence>

      {/* 반투명 오버레이 */}
      <div className="absolute inset-0 z-10 bg-peace-navy/50" />

      {/* 콘텐츠 레이어 */}
      <div className="relative z-20 flex h-full items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          {/* 서브 타이틀 */}
          <motion.p
            custom={0}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="mb-4 text-sm font-medium tracking-widest text-peace-gold"
          >
            PAX CHRISTI KOREA
          </motion.p>

          {/* 타이핑 애니메이션 */}
          <div
            className="flex h-[56px] items-center justify-center md:h-[68px] lg:h-[80px]"
            aria-live="polite"
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={textIndex}
                variants={
                  shouldReduceMotion ? undefined : typingContainerVariants
                }
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-4xl font-bold leading-tight text-peace-cream md:text-5xl lg:text-6xl"
              >
                {shouldReduceMotion
                  ? currentText
                  : currentText.split('').map((char, i) => (
                      <motion.span key={i} variants={charVariants} className="inline-block">
                        {char === ' ' ? '\u00A0' : char}
                      </motion.span>
                    ))}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* 설명 텍스트 */}
          <motion.p
            custom={1}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto mt-6 max-w-2xl text-lg text-peace-cream/80"
          >
            {t('Hero.description')}
          </motion.p>

          {/* CTA 버튼 */}
          <motion.div
            custom={2}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="mt-8 flex justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-peace-orange text-white hover:bg-peace-orange/90"
            >
              <Link href="/donate">{t('Common.donate')}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
            >
              <Link href="/about">{t('Common.learnMore')}</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* 도트 인디케이터 */}
      <div
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3"
        role="tablist"
        aria-label={t('Hero.slideSelector')}
      >
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`${t('Hero.slideLabel', { number: index + 1 })}: ${slideAlts[index]}`}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              'h-3 rounded-full transition-all duration-300',
              index === currentSlide
                ? 'w-8 bg-peace-gold'
                : 'w-3 bg-peace-cream/50 hover:bg-peace-cream/80',
            )}
          />
        ))}
      </div>

      {/* 스크롤 유도 화살표 */}
      <motion.div
        className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 text-peace-cream/60"
        animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <ChevronDown className="size-6" />
      </motion.div>
    </section>
  )
}

export { HeroSection }
