'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { IMPACT_STATS, IMPACT_CONFIG } from '@/lib/constants/impact'
import { cn } from '@/lib/utils'

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
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

const CounterValue = ({
  target,
  startFrom = 0,
  useLocale = true,
  isInView,
  duration,
  shouldReduceMotion,
}: {
  target: number
  startFrom?: number
  useLocale?: boolean
  isInView: boolean
  duration: number
  shouldReduceMotion: boolean | null
}) => {
  const [current, setCurrent] = useState(startFrom)

  useEffect(() => {
    if (!isInView) return
    if (shouldReduceMotion) {
      requestAnimationFrame(() => setCurrent(target))
      return
    }

    const startTime = performance.now()
    const diff = target - startFrom

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      // ease-out: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(startFrom + eased * diff))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [isInView, target, startFrom, duration, shouldReduceMotion])

  return <>{useLocale ? current.toLocaleString() : current}</>
}

const ImpactCounter = ({ className }: { className?: string }) => {
  const t = useTranslations()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const shouldReduceMotion = useReducedMotion()
  const activeVariants = shouldReduceMotion ? reducedItemVariants : itemVariants

  const statLabels: Record<number, string> = {
    1: t('Impact.statFounded'),
    2: t('Impact.statMembers'),
    3: t('Impact.statCountries'),
    4: t('Impact.statCampaigns'),
  }
  const statSuffixes: Record<number, string> = {
    1: t('Impact.yearSuffix'),
    2: '+',
    3: '',
    4: '+',
  }

  return (
    <section
      ref={ref}
      aria-label={t('Impact.sectionAriaLabel')}
      className={cn('bg-peace-cream py-12 dark:bg-muted md:py-20', className)}
    >
      <div className="container mx-auto px-4">
        {/* 섹션 헤더 */}
        <motion.div
          variants={activeVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-10 text-center md:mb-12"
        >
          <h2 className="text-2xl font-bold text-peace-navy dark:text-peace-cream md:text-3xl">
            {t('Impact.sectionTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t('Impact.sectionSubtitle')}
          </p>
        </motion.div>

        {/* 카운터 그리드 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4 md:gap-12"
        >
          {IMPACT_STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.id}
                variants={activeVariants}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-peace-sky/10 dark:bg-peace-sky/20">
                  <Icon className="size-7 text-peace-sky" aria-hidden="true" />
                </div>
                <p className="text-4xl font-bold text-peace-navy dark:text-peace-cream md:text-5xl">
                  <CounterValue
                    target={stat.value}
                    startFrom={'startFrom' in stat ? stat.startFrom : 0}
                    useLocale={'useLocale' in stat ? stat.useLocale : true}
                    isInView={isInView}
                    duration={IMPACT_CONFIG.animationDuration}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                  {statSuffixes[stat.id] && (
                    <span className="text-peace-sky">{statSuffixes[stat.id]}</span>
                  )}
                </p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  {statLabels[stat.id]}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export { ImpactCounter }
