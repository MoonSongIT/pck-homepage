'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

import { MemberCard } from '@/components/molecules/MemberCard'
import type { TeamMember } from '@/types/sanity'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

const TeamGrid = ({ members }: { members: TeamMember[] }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldReduceMotion = useReducedMotion()
  const activeVariants = shouldReduceMotion ? reducedItemVariants : itemVariants

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {members.map((member) => (
        <motion.div key={member._id} variants={activeVariants}>
          <MemberCard member={member} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export { TeamGrid }
