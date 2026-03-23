import Image from 'next/image'
import { Phone, Mail, MapPin, Instagram, Youtube, Facebook } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { Separator } from '@/components/ui/separator'
import { NAV_ITEMS, SNS_LINKS, CONTACT_INFO, ORG_INFO, FOOTER_LINKS } from '@/lib/constants/navigation'

const SNS_ICON_MAP = {
  Instagram,
  Youtube,
  Facebook,
} as const

const Footer = async () => {
  const t = await getTranslations()

  return (
    <footer className="bg-peace-navy dark:bg-[#0a1220]">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* 1열: 단체 정보 */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label={t('Common.homeAriaLabel')}>
              <Image
                src="/images/logo-white.svg"
                alt={t('Common.logoAlt')}
                width={160}
                height={100}
                className="h-[48px] w-auto"
              />
            </Link>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-peace-cream/70">
              {t('Footer.orgDescription')}
            </p>
          </div>

          {/* 2열: 바로가기 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-peace-gold">{t('Footer.quickLinks')}</h3>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-peace-cream/70 transition-colors hover:text-peace-cream"
                  >
                    {t(`Nav.${item.labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3열: 연락처 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-peace-gold">{t('Footer.contact')}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="flex items-center gap-2 text-sm text-peace-cream/70 transition-colors hover:text-peace-cream"
                >
                  <Phone className="size-4 shrink-0" />
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-2 text-sm text-peace-cream/70 transition-colors hover:text-peace-cream"
                >
                  <Mail className="size-4 shrink-0" />
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-peace-cream/70">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{CONTACT_INFO.address}</span>
              </li>
            </ul>
            {/* SNS 아이콘 */}
            <div className="mt-4 flex items-center gap-2">
              {SNS_LINKS.map((link) => {
                const Icon = SNS_ICON_MAP[link.icon]
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md p-2 text-peace-cream/60 transition-colors hover:bg-peace-cream/10 hover:text-peace-cream"
                    aria-label={t('Common.newWindow', { label: link.label })}
                  >
                    <Icon className="size-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* 4열: 법적 정보 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-peace-gold">{t('Footer.info')}</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-peace-cream/70 transition-colors hover:text-peace-cream"
                  >
                    {t(`Footer.${link.labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-peace-cream/20" />

        {/* 하단 사업자 정보 + 저작권 */}
        <div className="space-y-2 text-xs text-peace-cream/50">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{t('Footer.companyName')}: {ORG_INFO.name}</span>
            <span className="hidden sm:inline">|</span>
            <span>{t('Footer.representative')}: {ORG_INFO.representatives}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{t('Footer.businessNumber')}: {ORG_INFO.businessNumber}</span>
            <span className="hidden sm:inline">|</span>
            <span>{CONTACT_INFO.address}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{t('Footer.email')}: {CONTACT_INFO.email}</span>
            <span className="hidden sm:inline">|</span>
            <span>{t('Footer.phone')}: {CONTACT_INFO.phone}</span>
          </div>
          <div className="flex flex-col items-start justify-between gap-2 pt-2 md:flex-row md:items-center">
            <p>{t('Footer.copyright', { year: new Date().getFullYear(), name: ORG_INFO.name })}</p>
            <p>{t('Footer.pciMembership')}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
