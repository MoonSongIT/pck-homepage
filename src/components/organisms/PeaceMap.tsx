'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { X, ExternalLink, MapPin } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  MEMBER_COUNTRIES,
  NETWORK_CONFIG,
} from '@/lib/constants/network'
import type { PaxChristiMember } from '@/lib/constants/network'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.02 },
  },
}

const pinVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
}

const reducedPinVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
}

const PeaceMap = ({ className }: { className?: string }) => {
  const [selected, setSelected] = useState<PaxChristiMember | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const shouldReduceMotion = useReducedMotion()
  const activePinVariants = shouldReduceMotion ? reducedPinVariants : pinVariants

  const handleSelect = useCallback((member: PaxChristiMember) => {
    setSelected((prev) => (prev?.id === member.id ? null : member))
  }, [])

  const handleClose = useCallback(() => {
    setSelected(null)
  }, [])

  // ESC 키로 패널 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    if (selected) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selected])

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      aria-label="국제 평화 네트워크 세계 지도"
      role="img"
    >
      {/* 지도 */}
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{
          scale: NETWORK_CONFIG.mapScale,
          center: NETWORK_CONFIG.mapCenter,
        }}
        width={800}
        height={420}
        className="w-full h-auto"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className="fill-peace-navy/10 stroke-peace-navy/20 dark:fill-peace-cream/10 dark:stroke-peace-cream/15 outline-none"
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {/* 핀 마커 */}
        <motion.g
          variants={shouldReduceMotion ? undefined : containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {MEMBER_COUNTRIES.map((member) => (
            <Marker key={member.id} coordinates={member.coordinates}>
              <motion.g
                variants={activePinVariants}
                onClick={() => handleSelect(member)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelect(member)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${member.country} - ${member.name}`}
                className="cursor-pointer focus:outline-none"
              >
                {/* 한국 강조: 맥동 링 */}
                {member.isHighlighted && (
                  <circle
                    r={NETWORK_CONFIG.pinSize.highlighted + 4}
                    className="fill-peace-gold/30 animate-ping"
                  />
                )}
                <circle
                  r={member.isHighlighted
                    ? NETWORK_CONFIG.pinSize.highlighted
                    : NETWORK_CONFIG.pinSize.default
                  }
                  className={cn(
                    'transition-colors duration-200',
                    member.isHighlighted
                      ? 'fill-peace-gold stroke-peace-gold/50'
                      : 'fill-peace-sky stroke-peace-sky/50',
                    selected?.id === member.id && 'fill-peace-orange stroke-peace-orange/50',
                  )}
                  strokeWidth={1.5}
                />
              </motion.g>
            </Marker>
          ))}
        </motion.g>
      </ComposableMap>

      {/* 정보 패널 */}
      {selected && (
        <InfoPanel member={selected} onClose={handleClose} />
      )}
    </div>
  )
}

const InfoPanel = ({
  member,
  onClose,
}: {
  member: PaxChristiMember
  onClose: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-4 left-1/2 z-10 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 md:bottom-auto md:right-4 md:top-4 md:left-auto md:translate-x-0"
    >
      <Card className="border-peace-sky/20 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPin
                className={cn(
                  'size-5 shrink-0',
                  member.isHighlighted ? 'text-peace-gold' : 'text-peace-sky',
                )}
                aria-hidden="true"
              />
              <div>
                <h3 className="font-bold text-peace-navy dark:text-peace-cream">
                  {member.country}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {member.countryEn}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="정보 패널 닫기"
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-3 space-y-1.5 text-sm">
            <p className="font-medium text-foreground">{member.name}</p>
            <p className="text-muted-foreground">{member.nameEn}</p>
            {member.established && (
              <p className="text-muted-foreground">
                설립: {member.established}년
              </p>
            )}
          </div>

          {member.website && (
            <a
              href={member.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-peace-sky transition-colors hover:text-peace-sky/80"
            >
              웹사이트 방문
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export { PeaceMap }
