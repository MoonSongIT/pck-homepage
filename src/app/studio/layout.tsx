import type { Metadata, Viewport } from 'next'
import { metadata as studioMetadata } from 'next-sanity/studio'

export const metadata: Metadata = {
  ...studioMetadata,
  title: 'Pax Christi Korea CMS',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
}

const StudioLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}

export default StudioLayout
