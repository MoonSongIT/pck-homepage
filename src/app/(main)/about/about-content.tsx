'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { WaveDivider } from '@/components/atoms/WaveDivider'
import {
  VISION_MISSION,
  CORE_VALUES,
  ABOUT_CONFIG,
} from '@/lib/constants/about'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

const AboutContent = () => {
  const visionRef = useRef<HTMLElement>(null)
  const valuesRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLElement>(null)
  const visionInView = useInView(visionRef, { once: true, margin: '-80px' })
  const valuesInView = useInView(valuesRef, { once: true, margin: '-80px' })
  const introInView = useInView(introRef, { once: true, margin: '-80px' })
  const shouldReduceMotion = useReducedMotion()
  const activeVariants = shouldReduceMotion ? reducedItemVariants : itemVariants

  const visionItems = [VISION_MISSION.vision, VISION_MISSION.mission]

  return (
    <div>
      {/* 비전·미션 섹션 */}
      <section ref={visionRef} className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={visionInView ? 'visible' : 'hidden'}
            className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2"
          >
            {visionItems.map((item) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  variants={activeVariants}
                  className="rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:bg-background"
                >
                  <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-peace-navy/10 dark:bg-peace-sky/20">
                    <Icon
                      className="size-7 text-peace-navy dark:text-peace-sky"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-peace-navy dark:text-peace-cream">
                    {item.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      <WaveDivider color="cream" flip />

      {/* 핵심가치 섹션 */}
      <section
        ref={valuesRef}
        className="bg-peace-cream py-12 dark:bg-muted md:py-20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={activeVariants}
            initial="hidden"
            animate={valuesInView ? 'visible' : 'hidden'}
            className="mb-10 text-center md:mb-12"
          >
            <h2 className="text-2xl font-bold text-peace-navy dark:text-peace-cream md:text-3xl">
              핵심가치
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              팍스크리스티코리아가 추구하는 네 가지 핵심가치입니다
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? 'visible' : 'hidden'}
            className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {CORE_VALUES.map((value) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.id}
                  variants={activeVariants}
                  className="rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-background"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-peace-sky/10 dark:bg-peace-sky/20">
                    <Icon
                      className="size-6 text-peace-sky"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-peace-navy dark:text-peace-cream">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      <WaveDivider color="cream" />

      {/* 단체 소개 텍스트 */}
      <section ref={introRef} className="py-12 md:py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={introInView ? 'visible' : 'hidden'}
          >
            <motion.h2
              variants={activeVariants}
              className="text-2xl font-bold text-peace-navy dark:text-peace-cream md:text-3xl"
            >
              {ABOUT_CONFIG.introTitle}
            </motion.h2>
            <div className="mt-6 space-y-4">
              {ABOUT_CONFIG.introTexts.map((text, i) => (
                <motion.p
                  key={i}
                  variants={activeVariants}
                  className="leading-relaxed text-muted-foreground"
                >
                  {text}
                </motion.p>
              ))}
            </div>

            {/* 서브 페이지 CTA */}
            <motion.div
              variants={activeVariants}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Button asChild variant="outline" size="lg">
                <Link href={ABOUT_CONFIG.historyLink.href}>
                  {ABOUT_CONFIG.historyLink.label}
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={ABOUT_CONFIG.teamLink.href}>
                  {ABOUT_CONFIG.teamLink.label}
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export { AboutContent }
