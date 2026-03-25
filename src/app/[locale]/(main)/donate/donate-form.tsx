'use client'

import { useState, useEffect, useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Heart,
  Loader2,
  AlertCircle,
  CreditCard,
  RefreshCw,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DONATION_PLANS } from '@/lib/constants/donation'
import { createDonation } from '@/app/actions/donate'
import type { DonateResult } from '@/app/actions/donate'

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || ''
const MIN_AMOUNT = 1000

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

const DonateForm = () => {
  const t = useTranslations('Donate')
  const searchParams = useSearchParams()
  const initialAmount = Number(searchParams.get('amount')) || 0

  const [donationType, setDonationType] = useState<'REGULAR' | 'ONE_TIME'>(
    'ONE_TIME',
  )
  const [selectedAmount, setSelectedAmount] = useState(
    initialAmount || DONATION_PLANS[1].amount,
  )
  const [customAmount, setCustomAmount] = useState(
    initialAmount && !DONATION_PLANS.some((p) => p.amount === initialAmount)
      ? String(initialAmount)
      : '',
  )
  const [isCustom, setIsCustom] = useState(
    initialAmount > 0 &&
      !DONATION_PLANS.some((p) => p.amount === initialAmount),
  )
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)

  const [state, formAction, isPending] = useActionState<
    DonateResult | null,
    FormData
  >(createDonation, null)

  const shouldReduceMotion = useReducedMotion()
  const activeVariants = shouldReduceMotion ? reducedItemVariants : itemVariants

  // 결제 요청 처리
  useEffect(() => {
    if (!state?.success || !state.orderId) return

    const requestPayment = async () => {
      if (!TOSS_CLIENT_KEY) {
        alert('결제 설정이 완료되지 않았습니다. 관리자에게 문의해 주세요.')
        return
      }

      setIsPaymentLoading(true)
      try {
        const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY)
        const payment = tossPayments.payment({ customerKey: 'ANONYMOUS' })

        await payment.requestPayment({
          method: 'CARD',
          amount: {
            currency: 'KRW',
            value: selectedAmount,
          },
          orderId: state.orderId!,
          orderName: `팍스크리스티코리아 ${donationType === 'REGULAR' ? '정기' : '일시'} 후원`,
          successUrl: `${window.location.origin}/donate/success`,
          failUrl: `${window.location.origin}/donate/fail`,
        })
      } catch (error: unknown) {
        if (error instanceof Error && error.message !== 'USER_CANCEL') {
          console.error('[Donate] Payment request failed:', error)
        }
        setIsPaymentLoading(false)
      }
    }

    requestPayment()
  }, [state, selectedAmount, donationType])

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setIsCustom(false)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    const num = value.replace(/[^0-9]/g, '')
    setCustomAmount(num)
    setIsCustom(true)
    if (Number(num) >= MIN_AMOUNT) {
      setSelectedAmount(Number(num))
    }
  }

  const currentAmount = isCustom ? Number(customAmount) || 0 : selectedAmount
  const isAmountValid = currentAmount >= MIN_AMOUNT

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
            <Heart
              className="mx-auto mb-4 size-10 text-peace-orange"
              aria-hidden="true"
            />
            <h1 className="text-3xl font-bold text-peace-navy dark:text-peace-cream md:text-4xl">
              {t('title')}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 폼 섹션 */}
      <section className="py-12 md:py-16" aria-label={t('title')}>
        <div className="container mx-auto max-w-3xl px-4">
          <motion.div
            variants={activeVariants}
            initial="hidden"
            animate="visible"
          >
            <Tabs
              value={donationType}
              onValueChange={(v) =>
                setDonationType(v as 'REGULAR' | 'ONE_TIME')
              }
              className="w-full"
            >
              <TabsList className="mb-8 grid w-full grid-cols-2">
                <TabsTrigger value="ONE_TIME">
                  <CreditCard className="mr-1.5 size-4" aria-hidden="true" />
                  {t('tabOneTime')}
                </TabsTrigger>
                <TabsTrigger value="REGULAR">
                  <RefreshCw className="mr-1.5 size-4" aria-hidden="true" />
                  {t('tabRegular')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ONE_TIME">
                <p className="mb-6 text-sm text-muted-foreground">
                  {t('oneTimeDescription')}
                </p>
              </TabsContent>
              <TabsContent value="REGULAR">
                <p className="mb-6 text-sm text-muted-foreground">
                  {t('regularDescription')}
                </p>
              </TabsContent>
            </Tabs>

            <div className="grid gap-8 md:grid-cols-2">
              {/* 좌측: 금액 선택 */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold text-peace-navy dark:text-peace-cream">
                    {t('amountTitle')}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {DONATION_PLANS.map((plan) => {
                      const Icon = plan.icon
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => handleAmountSelect(plan.amount)}
                          className={`relative rounded-lg border-2 p-4 text-left transition-all hover:border-peace-orange/60 ${
                            !isCustom && selectedAmount === plan.amount
                              ? 'border-peace-orange bg-peace-orange/5 dark:bg-peace-orange/10'
                              : 'border-border'
                          }`}
                        >
                          {plan.popular && (
                            <span className="absolute -top-2.5 right-2 rounded-full bg-peace-gold px-2 py-0.5 text-xs font-medium text-white">
                              {t('recommended')}
                            </span>
                          )}
                          <Icon
                            className="mb-1.5 size-5 text-peace-orange"
                            aria-hidden="true"
                          />
                          <p className="text-lg font-bold text-peace-navy dark:text-peace-cream">
                            {plan.amount.toLocaleString()}{t('currencyUnit')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {plan.label}
                          </p>
                        </button>
                      )
                    })}
                  </div>

                  {/* 직접 입력 */}
                  <div className="mt-4">
                    <Label
                      htmlFor="customAmount"
                      className="mb-1.5 text-sm font-medium"
                    >
                      {t('customAmountLabel')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="customAmount"
                        type="text"
                        inputMode="numeric"
                        placeholder={t('customAmountPlaceholder')}
                        value={
                          customAmount
                            ? Number(customAmount).toLocaleString()
                            : ''
                        }
                        onChange={(e) =>
                          handleCustomAmountChange(e.target.value)
                        }
                        onFocus={() => setIsCustom(true)}
                        className={
                          isCustom ? 'border-peace-orange ring-1 ring-peace-orange/30' : ''
                        }
                      />
                      <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                        {t('currencyUnit')}
                      </span>
                    </div>
                    {isCustom && customAmount && Number(customAmount) < MIN_AMOUNT && (
                      <p className="mt-1 text-xs text-destructive">
                        {t('minAmountError', { min: MIN_AMOUNT.toLocaleString() })}
                      </p>
                    )}
                  </div>

                  {/* 선택된 금액 표시 */}
                  <div className="mt-4 rounded-lg bg-peace-cream/50 p-3 text-center dark:bg-peace-navy/20">
                    <p className="text-sm text-muted-foreground">
                      {donationType === 'REGULAR'
                        ? t('monthlyAmount')
                        : t('oneTimeAmount')}
                    </p>
                    <p className="text-2xl font-bold text-peace-orange">
                      {isAmountValid
                        ? `${currentAmount.toLocaleString()}${t('currencyUnit')}`
                        : '-'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 우측: 개인정보 입력 */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold text-peace-navy dark:text-peace-cream">
                    {t('infoTitle')}
                  </h2>
                  <form action={formAction} className="space-y-4">
                    <input type="hidden" name="amount" value={currentAmount} />
                    <input type="hidden" name="type" value={donationType} />

                    {/* 이름 */}
                    <div className="space-y-1.5">
                      <Label htmlFor="donorName" className="text-sm font-medium">
                        {t('nameLabel')}
                        <span className="text-destructive"> *</span>
                      </Label>
                      <Input
                        id="donorName"
                        name="donorName"
                        placeholder={t('namePlaceholder')}
                        required
                        aria-required="true"
                      />
                      {state?.fieldErrors?.donorName && (
                        <p className="text-xs text-destructive" role="alert">
                          {state.fieldErrors.donorName}
                        </p>
                      )}
                    </div>

                    {/* 이메일 */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="donorEmail"
                        className="text-sm font-medium"
                      >
                        {t('emailLabel')}
                        <span className="text-destructive"> *</span>
                      </Label>
                      <Input
                        id="donorEmail"
                        name="donorEmail"
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        required
                        aria-required="true"
                      />
                      {state?.fieldErrors?.donorEmail && (
                        <p className="text-xs text-destructive" role="alert">
                          {state.fieldErrors.donorEmail}
                        </p>
                      )}
                    </div>

                    {/* 전화번호 */}
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        {t('phoneLabel')}
                        <span className="text-destructive"> *</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder={t('phonePlaceholder')}
                        required
                        aria-required="true"
                      />
                      {state?.fieldErrors?.phone && (
                        <p className="text-xs text-destructive" role="alert">
                          {state.fieldErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* 익명 후원 */}
                    <div className="flex items-center gap-2">
                      <Checkbox id="isAnonymous" name="isAnonymous" />
                      <Label
                        htmlFor="isAnonymous"
                        className="cursor-pointer text-sm"
                      >
                        {t('anonymousLabel')}
                      </Label>
                    </div>

                    {/* 개인정보 동의 */}
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="privacyAgreed"
                        name="privacyAgreed"
                        required
                        aria-required="true"
                      />
                      <Label
                        htmlFor="privacyAgreed"
                        className="cursor-pointer text-sm leading-relaxed"
                      >
                        {t('privacyLabel')}
                        <span className="text-destructive"> *</span>
                      </Label>
                    </div>
                    {state?.fieldErrors?.privacyAgreed && (
                      <p className="text-xs text-destructive" role="alert">
                        {state.fieldErrors.privacyAgreed}
                      </p>
                    )}

                    {/* 서버 에러 메시지 */}
                    {state && !state.success && !state.fieldErrors && (
                      <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        <AlertCircle
                          className="size-4 shrink-0"
                          aria-hidden="true"
                        />
                        <p>{state.message}</p>
                      </div>
                    )}

                    {/* 제출 버튼 */}
                    <Button
                      type="submit"
                      disabled={
                        isPending || isPaymentLoading || !isAmountValid
                      }
                      className="w-full bg-peace-orange hover:bg-peace-orange/90"
                      size="lg"
                    >
                      {isPending || isPaymentLoading ? (
                        <>
                          <Loader2
                            className="mr-1.5 size-4 animate-spin"
                            aria-hidden="true"
                          />
                          {t('submittingText')}
                        </>
                      ) : (
                        <>
                          <Heart
                            className="mr-1.5 size-4"
                            aria-hidden="true"
                          />
                          {isAmountValid
                            ? `${currentAmount.toLocaleString()}${t('currencyUnit')} ${t('submitText')}`
                            : t('submitText')}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export { DonateForm }
