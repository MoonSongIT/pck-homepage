'use client'

import { Suspense, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Globe, Users, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { WaveDivider } from '@/components/atoms/WaveDivider'
import {
  MEMBER_COUNTRIES,
  NETWORK_CONFIG,
  CONTINENT_LABELS,
  getContinentStats,
} from '@/lib/constants/network'
import type { Continent } from '@/lib/constants/network'

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
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
}

const PeaceMap = dynamic(
  () => import('@/components/organisms/PeaceMap').then((mod) => mod.PeaceMap),
  { ssr: false },
)

const MapLoadingFallback = ({ t }: { t: (key: string) => string }) => (
  <div
    className="flex h-[300px] w-full items-center justify-center rounded-xl bg-muted/50 md:h-[420px]"
    aria-label={t('mapLoadingAriaLabel')}
  >
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
      <div className="size-8 animate-spin rounded-full border-2 border-peace-sky border-t-transparent" />
      <p className="text-sm">{t('mapLoading')}</p>
    </div>
  </div>
)

const continentStats = getContinentStats()

const NetworkContent = () => {
  const t = useTranslations('Network')
  const mapRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLElement>(null)
  const infoRef = useRef<HTMLElement>(null)

  const mapInView = useInView(mapRef, { once: true, margin: '-60px' })
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' })
  const infoInView = useInView(infoRef, { once: true, margin: '-80px' })

  const shouldReduceMotion = useReducedMotion()
  const activeVariants = shouldReduceMotion ? reducedItemVariants : itemVariants

  return (
    <div>
      {/* 히어로 배너 */}
      <section className="bg-peace-cream py-16 text-center dark:bg-peace-navy/30 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={activeVariants}
            initial="hidden"
            animate="visible"
          >
            <Globe
              className="mx-auto mb-4 size-10 text-peace-sky"
              aria-hidden="true"
            />
            <h1 className="text-3xl font-bold text-peace-navy dark:text-peace-cream md:text-4xl">
              {t('heroTitle')}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {t('heroSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <WaveDivider color="cream" />

      {/* 세계 지도 섹션 */}
      <section ref={mapRef} className="py-12 md:py-16" aria-label={t('mapAriaLabel')}>
        <div className="container mx-auto px-4">
          <motion.div
            variants={activeVariants}
            initial="hidden"
            animate={mapInView ? 'visible' : 'hidden'}
          >
            <p className="mb-6 text-center text-sm text-muted-foreground">
              {t('mapInstruction')}
            </p>
            <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border bg-card shadow-sm">
              <Suspense fallback={<MapLoadingFallback t={t} />}>
                <PeaceMap className="p-2 md:p-4" />
              </Suspense>
            </div>
          </motion.div>
        </div>
      </section>

      <WaveDivider color="cream" flip />

      {/* 대륙별 통계 */}
      <section
        ref={statsRef}
        className="bg-peace-cream py-12 dark:bg-muted md:py-16"
        aria-label={t('continentAriaLabel')}
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={activeVariants}
            initial="hidden"
            animate={statsInView ? 'visible' : 'hidden'}
            className="mb-10 text-center"
          >
            <h2 className="text-2xl font-bold text-peace-navy dark:text-peace-cream md:text-3xl">
              {t('sectionTitle')}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t('memberCountries', { count: MEMBER_COUNTRIES.length })}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? 'visible' : 'hidden'}
            className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5"
          >
            {(Object.keys(CONTINENT_LABELS) as Continent[]).map(
              (key) => {
                const count = continentStats.get(key) || 0
                return (
                  <motion.div
                    key={key}
                    variants={activeVariants}
                    className="flex flex-col items-center rounded-xl bg-background p-4 text-center shadow-sm ring-1 ring-foreground/5 dark:bg-card"
                  >
                    <Users
                      className="mb-2 size-6 text-peace-sky"
                      aria-hidden="true"
                    />
                    <p className="text-3xl font-bold text-peace-navy dark:text-peace-cream">
                      {count}
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {t(key)}
                    </p>
                  </motion.div>
                )
              },
            )}
          </motion.div>
        </div>
      </section>

      <WaveDivider color="cream" />

      {/* PCI 소개 섹션 */}
      <section ref={infoRef} className="py-12 md:py-16" aria-label={t('pciAriaLabel')}>
        <div className="container mx-auto max-w-3xl px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={infoInView ? 'visible' : 'hidden'}
            className="text-center"
          >
            <motion.h2
              variants={activeVariants}
              className="text-2xl font-bold text-peace-navy dark:text-peace-cream md:text-3xl"
            >
              {t('pciTitle')}
            </motion.h2>
            <motion.p
              variants={activeVariants}
              className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground"
            >
              {t('pciDescription')}
            </motion.p>
            <motion.div
              variants={activeVariants}
              className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
            >
              <span>{t('foundedLabel')}: {NETWORK_CONFIG.pciInfo.founded}</span>
              <span className="hidden sm:inline" aria-hidden="true">|</span>
              <span>{t('headquartersLabel')}: {t('headquarters')}</span>
            </motion.div>
            <motion.div
              variants={activeVariants}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              <Button asChild variant="outline">
                <a
                  href={NETWORK_CONFIG.pciInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('pciWebsite')}
                  <ExternalLink className="ml-1.5 size-4" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild className="bg-peace-orange hover:bg-peace-orange/90">
                <Link href="/about">{t('pckAbout')}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export { NetworkContent }
