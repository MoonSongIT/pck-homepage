import Image from 'next/image'
import { cn } from '@/lib/utils'
import { imagePresets } from '@/lib/sanity/image'
import type { TeamMember } from '@/types/sanity'

type MemberCardProps = {
  member: TeamMember
  className?: string
}

const MemberCard = ({ member, className }: MemberCardProps) => {
  const initial = member.name.charAt(0)
  const hasPhoto = !!member.photo?.asset

  return (
    <article
      aria-label={`${member.name} - ${member.role}`}
      className={cn(
        'rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-background',
        className
      )}
    >
      {/* 프로필 사진 또는 이니셜 아바타 */}
      <div className="mb-4 flex justify-center">
        {hasPhoto ? (
          <Image
            src={imagePresets.avatar(member.photo!).url()}
            alt={member.photo?.alt ?? `${member.name} 프로필 사진`}
            width={120}
            height={120}
            sizes="(max-width: 640px) 100px, 120px"
            className="rounded-xl object-cover"
          />
        ) : (
          <div className="flex size-[120px] items-center justify-center rounded-xl bg-peace-navy text-3xl font-bold text-white dark:bg-peace-sky">
            {initial}
          </div>
        )}
      </div>

      {/* 이름 */}
      <h3 className="text-center text-lg font-semibold text-peace-navy dark:text-peace-cream">
        {member.name}
      </h3>

      {/* 직책 */}
      <p className="mt-1 text-center text-sm font-medium text-peace-sky">
        {member.role}
      </p>

      {/* 소개 */}
      {member.bio && (
        <p className="mt-3 line-clamp-3 text-center text-sm leading-relaxed text-muted-foreground">
          {member.bio}
        </p>
      )}
    </article>
  )
}

export { MemberCard }
export type { MemberCardProps }
