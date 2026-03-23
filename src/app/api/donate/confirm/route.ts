import { NextRequest, NextResponse } from 'next/server'

import { confirmPayment } from '@/lib/payments/toss'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, donateRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting (IP 기반)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    const rateLimitResult = await checkRateLimit(donateRateLimit, ip)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
        { status: 429 },
      )
    }

    const { paymentKey, orderId, amount } = await request.json()

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다' },
        { status: 400 },
      )
    }

    // DB에서 주문 확인 (금액 위변조 방지)
    const donation = await prisma.donation.findUnique({
      where: { orderId },
    })

    if (!donation) {
      return NextResponse.json(
        { error: '주문을 찾을 수 없습니다' },
        { status: 404 },
      )
    }

    if (donation.amount !== Number(amount)) {
      return NextResponse.json(
        { error: '결제 금액이 일치하지 않습니다' },
        { status: 400 },
      )
    }

    // 토스 결제 승인
    const result = await confirmPayment(paymentKey, orderId, Number(amount))

    // DB 업데이트
    await prisma.donation.update({
      where: { orderId },
      data: {
        paymentKey,
        status: 'COMPLETED',
        receiptUrl: result.receipt?.url || null,
      },
    })

    return NextResponse.json({ success: true, receiptUrl: result.receipt?.url })
  } catch (error: unknown) {
    console.error('[API] Donate confirm failed:', error)
    const message =
      error instanceof Error ? error.message : '결제 승인에 실패했습니다'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
