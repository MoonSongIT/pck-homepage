'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

import { TimelineItem } from '@/components/molecules/TimelineItem'
import type { TimelineEvent } from '@/types/sanity'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
}

const itemLeftVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

const itemRightVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

const HistoryTimeline = ({ events }: { events: TimelineEvent[] }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="relative"
    >
      {/* 수직 중앙선 — 데스크톱: 중앙 / 모바일: 왼쪽 */}
      <div className="absolute left-5 top-0 h-full w-0.5 bg-peace-navy/20 md:left-1/2 md:-translate-x-px dark:bg-peace-sky/30" />

      <div className="space-y-8 md:space-y-12">
        {events.map((event, index) => {
          const position = index % 2 === 0 ? 'left' : 'right'
          const variants = shouldReduceMotion
            ? reducedItemVariants
            : position === 'left'
              ? itemLeftVariants
              : itemRightVariants

          return (
            <motion.div
              key={event._id}
              variants={variants}
              className={
                // 데스크톱: 좌우 배치 (50%씩), 모바일: 왼쪽 여백
                position === 'left'
                  ? 'pl-14 md:mr-[50%] md:pl-0 md:pr-8'
                  : 'pl-14 md:ml-[50%] md:pl-8'
              }
            >
              <TimelineItem
                year={event.year}
                title={event.title}
                description={event.description}
                position={position}
              />
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export { HistoryTimeline }
