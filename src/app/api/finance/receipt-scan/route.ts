import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { scanReceipt } from '@/lib/ocr/claude-vision'
import { uploadReceipt } from '@/lib/supabase/storage'
import { RECEIPT_CONFIG } from '@/lib/constants/finance'

export async function POST(request: NextRequest) {
  // 1) ADMIN 인증
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 })
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

    return NextResponse.json({ receiptUrl, ocr })
  } catch (error: unknown) {
    console.error('[API] Receipt scan failed:', error)
    const message =
      error instanceof Error ? error.message : '영수증 분석에 실패했습니다'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
