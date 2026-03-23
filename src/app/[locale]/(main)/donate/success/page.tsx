import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { confirmPayment } from '@/lib/payments/toss'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: '후원 완료 | 팍스크리스티코리아',
}

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    paymentKey?: string
    orderId?: string
    amount?: string
  }>
}

export default async function DonateSuccessPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('Donate')
  const { paymentKey, orderId, amount } = await searchParams

  if (!paymentKey || !orderId || !amount) {
    redirect('/donate')
  }

  const numericAmount = Number(amount)

  let receiptUrl: string | undefined

  try {
    // 토스 결제 승인
    const result = await confirmPayment(paymentKey, orderId, numericAmount)
    receiptUrl = result.receipt?.url

    // DB 업데이트
    await prisma.donation.update({
      where: { orderId },
      data: {
        paymentKey,
        status: 'COMPLETED',
        receiptUrl: receiptUrl || null,
      },
    })

    // 감사 이메일 발송
    if (process.env.RESEND_API_KEY) {
      try {
        const donation = await prisma.donation.findUnique({
          where: { orderId },
          select: { donorName: true, donorEmail: true, amount: true },
        })

        if (donation) {
          const { Resend } = await import('resend')
          const resend = new Resend(process.env.RESEND_API_KEY)

          await resend.emails.send({
            from: 'Pax Christi Korea <noreply@paxchristikorea.or.kr>',
            to: donation.donorEmail,
            subject: '팍스크리스티코리아 후원 감사합니다',
            html: `
              <h2>${donation.donorName}님, 후원해 주셔서 감사합니다!</h2>
              <p>소중한 후원금 <strong>${donation.amount.toLocaleString()}원</strong>은 평화 활동에 사용됩니다.</p>
              <p>주문번호: ${orderId}</p>
              ${receiptUrl ? `<p><a href="${receiptUrl}">영수증 보기</a></p>` : ''}
              <br />
              <p>— 팍스크리스티코리아 드림</p>
            `,
          })
        }
      } catch {
        console.error('[Donate] Resend email failed')
      }
    }
  } catch (error: unknown) {
    console.error('[Donate] Payment confirmation failed:', error)
    await prisma.donation
      .update({
        where: { orderId },
        data: { status: 'FAILED' },
      })
      .catch(() => {})
    redirect(
      `/donate/fail?message=${encodeURIComponent('결제 승인에 실패했습니다')}`,
    )
  }

  return (
    <div>
      <section className="bg-peace-cream py-16 dark:bg-peace-navy/30 md:py-20">
        <div className="container mx-auto max-w-lg px-4">
          <Card>
            <CardContent className="flex flex-col items-center p-8 text-center">
              <CheckCircle
                className="mb-4 size-16 text-peace-olive"
                aria-hidden="true"
              />
              <h1 className="text-2xl font-bold text-peace-navy dark:text-peace-cream">
                {t('successTitle')}
              </h1>
              <p className="mt-3 text-muted-foreground">
                {t('successDescription')}
              </p>

              <div className="mt-6 w-full rounded-lg bg-peace-cream/50 p-4 dark:bg-peace-navy/20">
                <p className="text-sm text-muted-foreground">
                  {t('successAmount')}
                </p>
                <p className="text-3xl font-bold text-peace-orange">
                  {numericAmount.toLocaleString()}{t('currencyUnit')}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('successOrderId')}: {orderId}
                </p>
              </div>

              {receiptUrl && (
                <Button asChild variant="outline" className="mt-4" size="sm">
                  <a
                    href={receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('viewReceipt')}
                  </a>
                </Button>
              )}

              <div className="mt-8 flex gap-3">
                <Button asChild variant="outline">
                  <Link href="/donate">{t('donateMore')}</Link>
                </Button>
                <Button
                  asChild
                  className="bg-peace-orange hover:bg-peace-orange/90"
                >
                  <Link href="/">{t('goHome')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
