'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import {
  GraduationCap,
  Calendar,
  ArrowRight,
  BookOpen,
  FileText,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { WaveDivider } from '@/components/atoms/WaveDivider'
import {
  EDUCATION_CONFIG,
  EDUCATION_STATUS,
} from '@/lib/constants/education'
import type { EducationStatus } from '@/lib/constants/education'
import type { Education } from '@/types/sanity'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
}

const getStatus = (edu: Education): EducationStatus => {
  if (edu.isRecruiting) return 'recruiting'
  const now = new Date()
  const start = new Date(edu.startDate)
  if (start > now) return 'upcoming'
  return 'closed'
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const EducationContent = ({
  educations,
}: {
  educations: Education[]
}) => {
  const introRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLElement>(null)

  const introInView = useInView(introRef, { once: true, margin: '-80px' })
  const listInView = useInView(listRef, { once: true, margin: '-60px' })

  const shouldReduceMotion = useReducedMotion()
  const activeVariants = shouldReduceMotion ? reducedItemVariants : itemVariants

  const currentEducations = educations.filter(
    (e) => getStatus(e) !== 'closed',
  )
  const pastEducations = educations.filter(
    (e) => getStatus(e) === 'closed',
  )

  return (
    <div>
      {/* 히어로 배너 */}
      <section className="bg-peace-cream py-16 text-center dark:bg-peace-navy/30 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={activeVariants}
            initial="hidden"
            animate="visible"
          >
            <GraduationCap
              className="mx-auto mb-4 size-10 text-peace-sky"
              aria-hidden="true"
            />
            <h1 className="text-3xl font-bold text-peace-navy dark:text-peace-cream md:text-4xl">
              {EDUCATION_CONFIG.hero.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {EDUCATION_CONFIG.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <WaveDivider color="cream" />

      {/* 소개 섹션 */}
      <section ref={introRef} className="py-12 md:py-16" aria-label="평화학교 소개">
        <div className="container mx-auto max-w-3xl px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={introInView ? 'visible' : 'hidden'}
          >
            <motion.div variants={activeVariants} className="mb-6 flex items-center gap-3">
              <BookOpen
                className="size-6 text-peace-sky"
                aria-hidden="true"
              />
              <h2 className="text-2xl font-bold text-peace-navy dark:text-peace-cream">
                {EDUCATION_CONFIG.intro.title}
              </h2>
            </motion.div>
            {EDUCATION_CONFIG.intro.paragraphs.map((text, i) => (
              <motion.p
                key={i}
                variants={activeVariants}
                className="mb-4 leading-relaxed text-muted-foreground last:mb-0"
              >
                {text}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </section>

      <WaveDivider color="cream" flip />

      {/* 교육 프로그램 목록 */}
      <section
        ref={listRef}
        className="bg-peace-cream py-12 dark:bg-muted md:py-16"
        aria-label="교육 프로그램 목록"
      >
        <div className="container mx-auto max-w-4xl px-4">
          {educations.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* 현재/예정 교육 */}
              {currentEducations.length > 0 && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={listInView ? 'visible' : 'hidden'}
                >
                  <motion.h2
                    variants={activeVariants}
                    className="mb-8 text-2xl font-bold text-peace-navy dark:text-peace-cream"
                  >
                    현재 · 예정 교육
                  </motion.h2>
                  <div className="space-y-6">
                    {currentEducations.map((edu) => (
                      <motion.div key={edu._id} variants={activeVariants}>
                        <EducationCard education={edu} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 지난 교육 */}
              {pastEducations.length > 0 && (
                <div className="mt-12">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="past" className="border-none">
                      <AccordionTrigger className="text-lg font-bold text-peace-navy hover:no-underline dark:text-peace-cream">
                        <span className="flex items-center gap-2">
                          <FileText className="size-5" aria-hidden="true" />
                          지난 교육 ({pastEducations.length}건)
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-4">
                          {pastEducations.map((edu) => (
                            <EducationCard
                              key={edu._id}
                              education={edu}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <WaveDivider color="cream" />
    </div>
  )
}

const EducationCard = ({ education }: { education: Education }) => {
  const status = getStatus(education)
  const statusInfo = EDUCATION_STATUS[status]

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-peace-navy dark:text-peace-cream">
                {education.title}
              </h3>
              <Badge
                variant="outline"
                className={statusInfo.color}
              >
                {statusInfo.label}
              </Badge>
            </div>

            {education.description && (
              <p className="text-sm text-muted-foreground">
                {education.description}
              </p>
            )}

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="size-4" aria-hidden="true" />
              <span>
                {formatDate(education.startDate)}
                {education.endDate && ` ~ ${formatDate(education.endDate)}`}
              </span>
            </div>
          </div>

          {status === 'recruiting' && (
            <Button
              asChild
              className="shrink-0 bg-peace-orange hover:bg-peace-orange/90"
            >
              <Link href={`/education/apply?cohort=${education._id}`}>
                신청하기
                <ArrowRight className="ml-1 size-4" aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>

        {/* 커리큘럼 */}
        {education.curriculum && education.curriculum.length > 0 && (
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="curriculum" className="border-t">
              <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
                커리큘럼 ({education.curriculum.length}강)
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {education.curriculum.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-peace-sky/10 text-xs font-bold text-peace-sky">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                        {item.date && (
                          <p className="text-xs text-muted-foreground">
                            {formatDate(item.date)}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}

const EmptyState = () => (
  <div className="py-16 text-center">
    <GraduationCap
      className="mx-auto mb-4 size-12 text-muted-foreground/50"
      aria-hidden="true"
    />
    <p className="text-lg font-medium text-foreground">
      {EDUCATION_CONFIG.emptyMessage}
    </p>
    <p className="mt-2 text-muted-foreground">
      {EDUCATION_CONFIG.emptyDescription}
    </p>
    <Button asChild variant="outline" className="mt-6">
      <Link href="/">홈으로 돌아가기</Link>
    </Button>
  </div>
)

export { EducationContent }
