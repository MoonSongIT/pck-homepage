import { NextStudio } from 'next-sanity/studio'
import { metadata as studioMetadata, viewport as studioViewport } from 'next-sanity/studio'
import type { Metadata } from 'next'

import config from '../../../../sanity.config'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  ...studioMetadata,
  title: 'Pax Christi Korea CMS',
}

export const viewport = {
  ...studioViewport,
  interactiveWidget: 'resizes-content',
}

export default function StudioPage() {
  return <NextStudio config={config} />
}
