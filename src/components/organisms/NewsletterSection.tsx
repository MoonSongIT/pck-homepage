'use client'

import { useRef, useActionState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { NEWSLETTER_CONFIG } from '@/lib/constants/newsletter'
import {
  subscribeNewsletter,
  type NewsletterResult,
} from '@/app/actions/newsletter'

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

const Icon = NEWSLETTER_CONFIG.icon

const NewsletterSection = ({ className }: { className?: string }) => {
  const t = useTranslations('Newsletter')
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldReduceMotion = useReducedMotion()
  const activeVariants = shouldReduceMotion ? reducedItemVariants : itemVariants

  const [state, formAction, isPending] = useActionState<
    NewsletterResult | null,
    FormData
  >(subscribeNewsletter, null)

  const isSuccess = state?.success === true

  return (
    <section
      ref={ref}
      aria-label={t('sectionAriaLabel')}
      className={cn(
        'bg-peace-navy py-12 dark:bg-peace-navy/90 md:py-20',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <motion.div
          variants={activeVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mx-auto flex max-w-4xl flex-col items-center gap-8 md:flex-row md:items-start md:justify-between md:gap-12"
        >
          {/* 좌측: 제목 + 설명 */}
          <div className="text-center md:flex-1 md:text-left">
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-white/10">
              <Icon className="size-6 text-peace-cream" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-peace-cream md:text-3xl">
              {t('sectionTitle')}
            </h2>
            <p className="mt-3 text-peace-cream/70">
              {t('sectionSubtitle')}
            </p>
          </div>

          {/* 우측: 이메일 폼 */}
          <div className="w-full md:flex-1">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 rounded-xl bg-peace-olive/20 p-4"
              >
                <CheckCircle
                  className="size-6 shrink-0 text-peace-olive"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-peace-cream">
                  {state.message}
                </p>
              </motion.div>
            ) : (
              <form action={formAction} className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    name="email"
                    placeholder={t('placeholder')}
                    required
                    disabled={isPending}
                    aria-label={t('emailLabel')}
                    className="h-11 flex-1 rounded-lg border-white/20 bg-white/10 text-peace-cream placeholder:text-peace-cream/40 focus:border-peace-sky focus:ring-peace-sky"
                  />
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-11 shrink-0 bg-peace-orange px-6 text-white hover:bg-peace-orange/90 disabled:opacity-60"
                  >
                    {isPending ? (
                      <>
                        <Loader2
                          className="size-4 animate-spin"
                          aria-hidden="true"
                        />
                        <span className="sr-only">
                          {t('loadingText')}
                        </span>
                      </>
                    ) : (
                      t('buttonText')
                    )}
                  </Button>
                </div>

                {state && !state.success && (
                  <p className="text-sm text-red-400" role="alert">
                    {state.message}
                  </p>
                )}

                <p className="text-xs text-peace-cream/40">
                  {t('cancelNote')}
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export { NewsletterSection }
