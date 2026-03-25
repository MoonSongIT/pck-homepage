/**
 * Prisma aggregate 테스트
 * 실행: npx tsx scripts/test-aggregate.ts
 */

import 'dotenv/config'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('=== Expense aggregate 테스트 ===')

  try {
    const result = await prisma.expense.aggregate({
      where: { status: 'CONFIRMED' },
      _sum: { amount: true },
    })
    console.log('✅ Expense aggregate 성공:', result)
  } catch (e: unknown) {
    console.error('❌ Expense aggregate 실패:', e instanceof Error ? e.message : e)
  }

  try {
    const result = await prisma.donation.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    })
    console.log('✅ Donation aggregate 성공:', result)
  } catch (e: unknown) {
    console.error('❌ Donation aggregate 실패:', e instanceof Error ? e.message : e)
  }

  try {
    const count = await prisma.user.count()
    console.log('✅ User count 성공:', count)
  } catch (e: unknown) {
    console.error('❌ User count 실패:', e instanceof Error ? e.message : e)
  }

  try {
    const count = await prisma.educationApplication.count({
      where: { createdAt: { gte: new Date(2026, 2, 1) } },
    })
    console.log('✅ EducationApplication count 성공:', count)
  } catch (e: unknown) {
    console.error('❌ EducationApplication count 실패:', e instanceof Error ? e.message : e)
  }

  try {
    const count = await prisma.expense.count({
      where: { status: 'PENDING_REVIEW' },
    })
    console.log('✅ Expense PENDING_REVIEW count 성공:', count)
  } catch (e: unknown) {
    console.error('❌ Expense PENDING_REVIEW count 실패:', e instanceof Error ? e.message : e)
  }

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
