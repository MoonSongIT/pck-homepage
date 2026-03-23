'use client'

import { useActionState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  GraduationCap,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { EDUCATION_CONFIG } from '@/lib/constants/education'
import { applyEducation } from '@/app/actions/education'
import type { EducationResult } from '@/app/actions/education'

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

const ApplyForm = () => {
  const searchParams = useSearchParams()
  const cohort = searchParams.get('cohort') || ''
  const formRef = useRef<HTMLFormElement>(null)

  const [state, formAction, isPending] = useActionState<
    EducationResult | null,
    FormData
  >(applyEducation, null)

  const shouldReduceMotion = useReducedMotion()
  const activeVariants = shouldReduceMotion ? reducedItemVariants : itemVariants

  const isSuccess = state?.success === true
  const fields = EDUCATION_CONFIG.fields

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
              {EDUCATION_CONFIG.applyTitle}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {EDUCATION_CONFIG.applySubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 폼 섹션 */}
      <section className="py-12 md:py-16" aria-label="교육 신청 양식">
        <div className="container mx-auto max-w-xl px-4">
          <motion.div
            variants={activeVariants}
            initial="hidden"
            animate="visible"
          >
            {isSuccess ? (
              <SuccessMessage />
            ) : (
              <Card>
                <CardContent className="p-6 md:p-8">
                  <form ref={formRef} action={formAction} className="space-y-5">
                    {/* cohort 히든 필드 */}
                    {cohort && (
                      <input type="hidden" name="cohort" value={cohort} />
                    )}

                    {/* 이름 */}
                    <FormField
                      name="name"
                      label={fields.name.label}
                      required
                      error={state?.fieldErrors?.name}
                    >
                      <Input
                        name="name"
                        placeholder={fields.name.placeholder}
                        required
                        aria-required="true"
                        aria-describedby={state?.fieldErrors?.name ? 'name-error' : undefined}
                      />
                    </FormField>

                    {/* 이메일 */}
                    <FormField
                      name="email"
                      label={fields.email.label}
                      required
                      error={state?.fieldErrors?.email}
                    >
                      <Input
                        name="email"
                        type="email"
                        placeholder={fields.email.placeholder}
                        required
                        aria-required="true"
                        aria-describedby={state?.fieldErrors?.email ? 'email-error' : undefined}
                      />
                    </FormField>

                    {/* 전화번호 */}
                    <FormField
                      name="phone"
                      label={fields.phone.label}
                      required
                      error={state?.fieldErrors?.phone}
                    >
                      <Input
                        name="phone"
                        type="tel"
                        placeholder={fields.phone.placeholder}
                        required
                        aria-required="true"
                        aria-describedby={state?.fieldErrors?.phone ? 'phone-error' : undefined}
                      />
                    </FormField>

                    {/* 소속 */}
                    <FormField
                      name="affiliation"
                      label={fields.affiliation.label}
                      help={fields.affiliation.help}
                      error={state?.fieldErrors?.affiliation}
                    >
                      <Input
                        name="affiliation"
                        placeholder={fields.affiliation.placeholder}
                        aria-describedby="affiliation-help"
                      />
                    </FormField>

                    {/* 지원 동기 */}
                    <FormField
                      name="motivation"
                      label={fields.motivation.label}
                      required
                      help={fields.motivation.help}
                      error={state?.fieldErrors?.motivation}
                    >
                      <MotivationTextarea />
                    </FormField>

                    {/* 개인정보처리방침 동의 */}
                    <FormField
                      name="privacyAgreed"
                      error={state?.fieldErrors?.privacyAgreed}
                    >
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="privacyAgreed"
                          name="privacyAgreed"
                          required
                          aria-required="true"
                        />
                        <Label
                          htmlFor="privacyAgreed"
                          className="cursor-pointer text-sm leading-relaxed"
                        >
                          {fields.privacyAgreed.label}
                          <span className="text-destructive"> *</span>
                        </Label>
                      </div>
                    </FormField>

                    {/* 서버 에러 메시지 */}
                    {state && !state.success && !state.fieldErrors && (
                      <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
                        <p>{state.message}</p>
                      </div>
                    )}

                    {/* 제출 버튼 */}
                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
                      <Button asChild variant="ghost" className="sm:order-1">
                        <Link href="/education">
                          <ArrowLeft className="mr-1 size-4" aria-hidden="true" />
                          교육 목록
                        </Link>
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-peace-orange hover:bg-peace-orange/90 sm:order-2"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden="true" />
                            신청 중...
                          </>
                        ) : (
                          '교육 신청하기'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

const FormField = ({
  name,
  label,
  required,
  help,
  error,
  children,
}: {
  name: string
  label?: string
  required?: boolean
  help?: string
  error?: string
  children: React.ReactNode
}) => (
  <div className="space-y-1.5">
    {label && (
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
    )}
    {children}
    {help && !error && (
      <p id={`${name}-help`} className="text-xs text-muted-foreground">
        {help}
      </p>
    )}
    {error && (
      <p id={`${name}-error`} className="text-xs text-destructive" role="alert">
        {error}
      </p>
    )}
  </div>
)

const MotivationTextarea = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const maxLength = EDUCATION_CONFIG.motivationMaxLength

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        name="motivation"
        placeholder={EDUCATION_CONFIG.fields.motivation.placeholder}
        required
        aria-required="true"
        aria-describedby="motivation-help"
        maxLength={maxLength}
        rows={5}
        className="resize-y"
        onChange={() => {
          // 글자수 카운터 업데이트 (DOM 직접 조작)
          const counter = document.getElementById('motivation-counter')
          if (counter && textareaRef.current) {
            counter.textContent = `${textareaRef.current.value.length}/${maxLength}`
          }
        }}
      />
      <span
        id="motivation-counter"
        className="absolute bottom-2 right-3 text-xs text-muted-foreground"
        aria-live="polite"
      >
        0/{maxLength}
      </span>
    </div>
  )
}

const SuccessMessage = () => (
  <Card>
    <CardContent className="flex flex-col items-center p-8 text-center">
      <CheckCircle className="mb-4 size-16 text-peace-olive" aria-hidden="true" />
      <h2 className="text-2xl font-bold text-peace-navy dark:text-peace-cream">
        {EDUCATION_CONFIG.successMessage}
      </h2>
      <p className="mt-3 text-muted-foreground">
        {EDUCATION_CONFIG.successDescription}
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="outline">
          <Link href="/education">교육 목록 보기</Link>
        </Button>
        <Button asChild className="bg-peace-orange hover:bg-peace-orange/90">
          <Link href="/">홈으로</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
)

export { ApplyForm }
