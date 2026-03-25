/**
 * DB 사용자 목록 + ADMIN 확인 스크립트
 * 실행: npx tsx scripts/check-users.ts
 */

import 'dotenv/config'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const p = new PrismaClient({ adapter })

async function main() {
  const users = await p.user.findMany({
    select: { id: true, name: true, email: true, role: true }
  })
  console.log('=== 전체 사용자 목록 ===')
  console.table(users)

  const admins = users.filter(u => u.role === 'ADMIN')
  console.log(`\nADMIN 사용자: ${admins.length}명`)
  if (admins.length > 0) {
    console.table(admins)
  } else {
    console.log('⚠️  ADMIN 사용자가 없습니다! 아래 스크립트로 승격하세요:')
    console.log('   npx tsx scripts/promote-admin.ts <이메일>')
  }

  await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
