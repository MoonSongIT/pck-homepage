'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { WaveDivider } from '@/components/atoms/WaveDivider'
import {
  VISION_MISSION,
  ACTIVITY_AREAS,
} from '@/lib/constants/about'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
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

const activityKeys = [
  'actConflict',
  'actPeaceBuilding',
  'actEducation',
  'actNonviolent',
  'actInterfaith',
  'actAdvocacy',
  'actPartner',
  'actPeaceDay',
] as const

const AboutContent = () => {
  const visionRef = useRef<HTMLElement>(null)
  const activitiesRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLElement>(null)
  const visionInView = useInView(visionRef, { once: true, margin: '-80px' })
  const activitiesInView = useInView(activitiesRef, { once: true, margin: '-80px' })
  const introInView = useInView(introRef, { once: true, margin: '-80px' })
  const shouldReduceMotion = useReducedMotion()
  const activeVariants = shouldReduceMotion ? reducedItemVariants : itemVariants
  const t = useTranslations('About')

  const visionItems = [
    { ...VISION_MISSION.vision, title: t('visionTitle'), description: t('visionDescription') },
    { ...VISION_MISSION.mission, title: t('missionTitle'), description: t('missionDescription') },
  ]

  return (
    <div>
      {/* 단체 소개 텍스트 (맨 앞) */}
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
              {t('introTitle')}
            </motion.h2>
            <div className="mt-6 space-y-4">
              {(['introText1', 'introText2', 'introText3', 'introText4'] as const).map((key) => (
                <motion.p
                  key={key}
                  variants={activeVariants}
                  className="leading-relaxed text-muted-foreground"
                >
                  {t(key)}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <WaveDivider color="cream" flip />

      {/* 비전·목표 섹션 */}
      <section ref={visionRef} className="bg-peace-cream py-12 dark:bg-muted md:py-20">
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

      <WaveDivider color="cream" />

      {/* 주요 활동 영역 섹션 */}
      <section
        ref={activitiesRef}
        className="py-12 md:py-20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={activeVariants}
            initial="hidden"
            animate={activitiesInView ? 'visible' : 'hidden'}
            className="mb-10 text-center md:mb-12"
          >
            <h2 className="text-2xl font-bold text-peace-navy dark:text-peace-cream md:text-3xl">
              {t('activitiesTitle')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              {t('activitiesSubtitle')}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activitiesInView ? 'visible' : 'hidden'}
            className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {ACTIVITY_AREAS.map((area, index) => {
              const Icon = area.icon
              return (
                <motion.div
                  key={area.id}
                  variants={activeVariants}
                  className="rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-background"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-peace-sky/10 dark:bg-peace-sky/20">
                    <Icon
                      className="size-6 text-peace-sky"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-base font-semibold text-peace-navy dark:text-peace-cream">
                    {t(activityKeys[index])}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`${activityKeys[index]}Desc`)}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* 서브 페이지 CTA */}
          <motion.div
            variants={activeVariants}
            initial="hidden"
            animate={activitiesInView ? 'visible' : 'hidden'}
            className="mt-12 flex justify-center gap-4"
          >
            <Button asChild variant="outline" size="lg">
              <Link href="/about/history">
                {t('historyLink')}
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about/team">
                {t('teamLink')}
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export { AboutContent }
