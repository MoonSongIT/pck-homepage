import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { MapPin, Phone, Mail, Train, Bus } from 'lucide-react'

import { CONTACT_INFO } from '@/lib/constants/navigation'
import KakaoMap from './kakao-map'

export const metadata: Metadata = {
  title: '오시는 길 | 팍스크리스티코리아',
  description: '팍스크리스티코리아 사무실 위치 및 오시는 길 안내입니다.',
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('About')

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto max-w-4xl px-4">
        {/* 페이지 헤더 */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-peace-navy dark:text-peace-cream md:text-3xl">
            {t('locationTitle')}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t('locationSubtitle')}
          </p>
        </div>

        {/* 카카오 지도 */}
        <KakaoMap />

        {/* 주소 및 연락처 */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* 연락처 카드 */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-peace-navy dark:text-peace-cream">
              {t('locationContact')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="mt-0.5 size-4 shrink-0 text-peace-sky" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="size-4 shrink-0 text-peace-sky" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="size-4 shrink-0 text-peace-sky" />
                <span>{CONTACT_INFO.email}</span>
              </li>
            </ul>
          </div>

          {/* 대중교통 안내 */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-peace-navy dark:text-peace-cream">
              {t('locationTransport')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <Train className="mt-0.5 size-4 shrink-0 text-peace-sky" />
                <div>
                  <p className="font-medium">{t('locationSubway')}</p>
                  <p className="mt-0.5 text-muted-foreground">
                    {t('locationSubwayDesc')}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Bus className="mt-0.5 size-4 shrink-0 text-peace-sky" />
                <div>
                  <p className="font-medium">{t('locationBus')}</p>
                  <p className="mt-0.5 text-muted-foreground">
                    {t('locationBusDesc')}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
