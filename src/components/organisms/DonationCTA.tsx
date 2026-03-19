'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DONATION_PLANS, DONATION_CONFIG } from '@/lib/constants/donation'
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
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldReduceMotion = useReducedMotion()
  const activeVariants = shouldReduceMotion ? reducedItemVariants : itemVariants
  const [selected, setSelected] = useState<DonationPlan['id']>(defaultPlan.id)

  return (
    <section
      ref={ref}
      aria-label="후원 안내"
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
            {DONATION_CONFIG.sectionTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {DONATION_CONFIG.sectionSubtitle}
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
                    {DONATION_CONFIG.popularBadge}
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
                  {plan.label}
                </h3>

                <p className="mt-3 text-2xl font-bold text-peace-navy dark:text-peace-cream">
                  {formatCurrency(plan.amount)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {DONATION_CONFIG.currencyUnit}/{DONATION_CONFIG.monthlyLabel}
                  </span>
                </p>

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {plan.description}
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
                    ? `${formatCurrency(selectedPlan.amount)}${DONATION_CONFIG.currencyUnit} ${DONATION_CONFIG.ctaText}`
                    : DONATION_CONFIG.ctaText}
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
