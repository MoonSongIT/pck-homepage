import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { scanReceipt } from '@/lib/ocr/claude-vision'
import { uploadReceipt } from '@/lib/supabase/storage'
import { RECEIPT_CONFIG } from '@/lib/constants/finance'

export async function POST(request: NextRequest) {
  // 1) 인증: API Key (CLI 스크립트) 또는 ADMIN 세션 (브라우저)
  const apiKey = request.headers.get('x-api-key')
  const isApiKeyAuth = apiKey !== null && apiKey === process.env.RECEIPT_API_KEY

  if (!isApiKeyAuth) {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 })
    }
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: '파일이 없습니다' },
        { status: 400 },
      )
    }

    // 2) MIME 타입 검증
    if (!RECEIPT_CONFIG.allowedTypes.includes(file.type as never)) {
      return NextResponse.json(
        { error: `허용되지 않는 파일 형식입니다 (${file.type})` },
        { status: 400 },
      )
    }

    // 3) 파일 크기 검증
    if (file.size > RECEIPT_CONFIG.maxFileSize) {
      return NextResponse.json(
        { error: '파일 크기는 10MB 이하여야 합니다' },
        { status: 400 },
      )
    }

    // 4) Buffer 변환
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 5) Supabase Storage 업로드
    const receiptUrl = await uploadReceipt(buffer, file.name)

    // 6) Claude Vision OCR
    const ocr = await scanReceipt(buffer, file.type)

    // 7) CLI(API Key) 경로: Expense DB 저장 (PENDING_REVIEW)
    if (isApiKeyAuth) {
      const expense = await prisma.expense.create({
        data: {
          date: ocr.date ? new Date(ocr.date) : new Date(),
          description: ocr.description || '미분류',
          amount: ocr.amount ?? 0,
          category: ocr.category,
          receipt: receiptUrl,
          ocrConfidence: ocr.confidence,
          ocrRawText: ocr.note || null,
          status: 'PENDING_REVIEW',
          note: null,
        },
      })
      return NextResponse.json({ receiptUrl, ocr, expenseId: expense.id })
    }

    return NextResponse.json({ receiptUrl, ocr })
  } catch (error: unknown) {
    console.error('[API] Receipt scan failed:', error)
    const message =
      error instanceof Error ? error.message : '영수증 분석에 실패했습니다'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
