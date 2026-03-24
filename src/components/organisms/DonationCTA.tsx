'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DONATION_PLANS } from '@/lib/constants/donation'
import type { DonationPlan } from '@/lib/constants/donation'

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

const formatCurrency = (amount: number) =>
  amount.toLocaleString('ko-KR')

const defaultPlan = DONATION_PLANS.find((p) => p.popular) ?? DONATION_PLANS[0]

const DonationCTA = ({ className }: { className?: string }) => {
  const t = useTranslations()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldReduceMotion = useReducedMotion()
  const activeVariants = shouldReduceMotion ? reducedItemVariants : itemVariants
  const [selected, setSelected] = useState<DonationPlan['id']>(defaultPlan.id)

  const planLabels: Record<string, string> = {
    'monthly-10k': t('Donation.planSeed'),
    'monthly-30k': t('Donation.planCompanion'),
    'monthly-50k': t('Donation.planWorker'),
    'monthly-100k': t('Donation.planSponsor'),
  }
  const planDescs: Record<string, string> = {
    'monthly-10k': t('Donation.planSeedDesc'),
    'monthly-30k': t('Donation.planCompanionDesc'),
    'monthly-50k': t('Donation.planWorkerDesc'),
    'monthly-100k': t('Donation.planSponsorDesc'),
  }

  return (
    <section
      ref={ref}
      aria-label={t('Donation.sectionAriaLabel')}
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
            {t('Donation.sectionTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t('Donation.sectionSubtitle')}
          </p>
        </motion.div>

        {/* 후원 카드 그리드 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
          {DONATION_PLANS.map((plan) => {
            const Icon = plan.icon
            const isSelected = selected === plan.id
            return (
              <motion.button
                key={plan.id}
                type="button"
                variants={activeVariants}
                onClick={() => setSelected(plan.id)}
                aria-pressed={isSelected}
                className={cn(
                  'relative flex cursor-pointer flex-col items-center rounded-2xl bg-white p-6 text-center ring-1 ring-foreground/10 transition-all hover:shadow-lg dark:bg-background dark:ring-foreground/15',
                  isSelected &&
                    'ring-2 ring-peace-orange shadow-md dark:ring-peace-orange',
                  plan.popular && !isSelected &&
                    'ring-2 ring-peace-gold/50 dark:ring-peace-gold/50'
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2.5 border-0 bg-peace-gold text-xs font-semibold text-white shadow-sm">
                    {t('Donation.popularBadge')}
                  </Badge>
                )}

                <div className={cn(
                  'mb-3 flex size-12 items-center justify-center rounded-full transition-colors',
                  isSelected
                    ? 'bg-peace-orange/10 dark:bg-peace-orange/20'
                    : 'bg-peace-sky/10 dark:bg-peace-sky/20'
                )}>
                  <Icon className={cn(
                    'size-6 transition-colors',
                    isSelected ? 'text-peace-orange' : 'text-peace-sky'
                  )} aria-hidden="true" />
                </div>

                <h3 className="text-sm font-semibold text-peace-navy dark:text-peace-cream">
                  {planLabels[plan.id]}
                </h3>

                <p className="mt-3 text-2xl font-bold text-peace-navy dark:text-peace-cream">
                  {formatCurrency(plan.amount)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {t('Donation.currencyUnit')}/{t('Donation.monthlyLabel')}
                  </span>
                </p>

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {planDescs[plan.id]}
                </p>
              </motion.button>
            )
          })}
        </motion.div>

        {/* CTA 버튼 */}
        <motion.div
          variants={activeVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-10 text-center md:mt-12"
        >
          {(() => {
            const selectedPlan = DONATION_PLANS.find((p) => p.id === selected)
            return (
              <Button
                asChild
                size="lg"
                className="bg-peace-orange text-white shadow-md hover:bg-peace-orange/90"
              >
                <Link href={`/donate?amount=${selectedPlan?.amount ?? ''}`}>
                  {selectedPlan
                    ? `${formatCurrency(selectedPlan.amount)}${t('Donation.currencyUnit')} ${t('Donation.ctaText')}`
                    : t('Donation.ctaText')}
                </Link>
              </Button>
            )
          })()}
        </motion.div>
      </div>
    </section>
  )
}

export { DonationCTA }
