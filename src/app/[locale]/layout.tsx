import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { Inter, Noto_Sans_KR } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'

import { Toaster } from '@/components/ui/sonner'
import { routing } from '@/i18n/routing'

import '../globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://paxchristikorea.org'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const notoSansKR = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: '팍스크리스티코리아 | Pax Christi Korea',
    template: '%s | 팍스크리스티코리아',
  },
  description: '그리스도의 평화 — 가톨릭 국제 평화 운동 한국 지부. 복음적 비폭력과 정의·평화·창조질서 보전을 실천합니다.',
  keywords: ['팍스크리스티', 'Pax Christi', '평화운동', '가톨릭', '비폭력', 'NGO', '한국'],
  authors: [{ name: '팍스크리스티코리아' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: 'en_US',
    siteName: '팍스크리스티코리아',
    title: '팍스크리스티코리아 | Pax Christi Korea',
    description: '그리스도의 평화 — 가톨릭 국제 평화 운동 한국 지부',
    images: [
      {
        url: '/api/og?title=팍스크리스티코리아',
        width: 1200,
        height: 630,
        alt: '팍스크리스티코리아',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '팍스크리스티코리아 | Pax Christi Korea',
    description: '그리스도의 평화 — 가톨릭 국제 평화 운동 한국 지부',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: '팍스크리스티코리아',
        alternateName: 'Pax Christi Korea',
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/images/logo.png`,
        },
        description: '가톨릭 국제 평화 운동 한국 지부. 복음적 비폭력과 정의·평화·창조질서 보전을 실천합니다.',
        parentOrganization: {
          '@type': 'Organization',
          name: 'Pax Christi International',
          url: 'https://paxchristi.net',
        },
        sameAs: [
          'https://www.facebook.com/paxchristikorea',
          'https://www.instagram.com/paxchristikorea',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: '팍스크리스티코리아',
        publisher: { '@id': `${BASE_URL}/#organization` },
        inLanguage: ['ko', 'en'],
      },
    ],
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${notoSansKR.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              {children}
              <Toaster />
            </NextIntlClientProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
