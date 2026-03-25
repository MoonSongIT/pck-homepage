import type { Metadata } from 'next'
import Link from 'next/link'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: '결제 실패 | 팍스크리스티코리아',
}

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    code?: string
    message?: string
  }>
}

export default async function DonateFailPage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('Donate')
  const { code, message } = await searchParams

  return (
    <div>
      <section className="bg-peace-cream py-16 dark:bg-peace-navy/30 md:py-20">
        <div className="container mx-auto max-w-lg px-4">
          <Card>
            <CardContent className="flex flex-col items-center p-8 text-center">
              <XCircle
                className="mb-4 size-16 text-destructive"
                aria-hidden="true"
              />
              <h1 className="text-2xl font-bold text-peace-navy dark:text-peace-cream">
                {t('failTitle')}
              </h1>
              <p className="mt-3 text-muted-foreground">
                {message || t('failDescription')}
              </p>

              {code && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {t('failErrorCode')}: {code}
                </p>
              )}

              <div className="mt-8 flex gap-3">
                <Button
                  asChild
                  className="bg-peace-orange hover:bg-peace-orange/90"
                >
                  <Link href="/donate">{t('retryText')}</Link>
                </Button>
                <Button asChild variant="outline">
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
