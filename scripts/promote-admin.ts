/**
 * 사용자를 ADMIN 역할로 승격하는 스크립트
 * 실행: npx tsx scripts/promote-admin.ts <이메일>
 */

import 'dotenv/config'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const p = new PrismaClient({ adapter })

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('사용법: npx tsx scripts/promote-admin.ts <이메일>')
    process.exit(1)
  }

  const user = await p.user.findUnique({ where: { email } })
  if (!user) {
    console.error(`❌ 사용자를 찾을 수 없습니다: ${email}`)
    process.exit(1)
  }

  if (user.role === 'ADMIN') {
    console.log(`ℹ️  ${user.name} (${email})은 이미 ADMIN 입니다.`)
    await p.$disconnect()
    return
  }

  const updated = await p.user.update({
    where: { email },
    data: { role: 'ADMIN' },
    select: { id: true, name: true, email: true, role: true }
  })

  console.log(`✅ ADMIN 승격 완료:`)
  console.table([updated])

  await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
