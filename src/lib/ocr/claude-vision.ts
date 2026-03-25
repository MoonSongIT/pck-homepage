import Anthropic from '@anthropic-ai/sdk'

// ─── 타입 정의 ─────────────────────────────────────────

export interface OcrResult {
  date: string | null
  description: string
  amount: number | null
  category: 'PERSONNEL' | 'OFFICE' | 'EVENT' | 'TRANSPORT' | 'OTHER'
  note: string
  confidence: number
}

// ─── 영수증 분석 프롬프트 ───────────────────────────────

const RECEIPT_SCAN_PROMPT = `이 영수증 이미지를 분석하여 아래 JSON 형식으로 정확히 응답해 주세요.
다른 텍스트 없이 JSON만 출력하세요.

{
  "date": "YYYY-MM-DD 또는 null",
  "description": "지출 항목 요약 (한국어, 30자 이내)",
  "amount": 숫자(원 단위, 정수) 또는 null,
  "category": "PERSONNEL | OFFICE | EVENT | TRANSPORT | OTHER 중 하나",
  "note": "상세 내용 - 상호명, 품목 등 (없으면 빈 문자열)",
  "confidence": 0.0~1.0 사이의 신뢰도
}

카테고리 분류 기준:
- PERSONNEL: 인건비, 급여, 강사료, 자문료, 용역비
- OFFICE: 사무용품, 인쇄, 통신, 임대료, 소프트웨어
- EVENT: 행사, 세미나, 워크숍, 식비(행사용), 현수막
- TRANSPORT: 교통비, 주유, 택시, 주차, 톨게이트
- OTHER: 위에 해당하지 않는 항목

금액은 원(KRW) 단위 정수로 변환하세요.
날짜를 읽을 수 없으면 null로 설정하세요.
confidence는 이미지 품질과 정보 추출 정확도를 기반으로 판단하세요.`

// ─── Claude Vision OCR 실행 ────────────────────────────

type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'

const getAnthropic = () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      'ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다',
    )
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export async function scanReceipt(
  imageBuffer: Buffer,
  mimeType: string,
): Promise<OcrResult> {
  const anthropic = getAnthropic()
  const base64 = imageBuffer.toString('base64')

  // HEIC → JPEG로 매핑 (Claude SDK는 heic 미지원)
  const mediaType: ImageMediaType =
    mimeType === 'image/heic' ? 'image/jpeg' : (mimeType as ImageMediaType)

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64,
            },
          },
          { type: 'text', text: RECEIPT_SCAN_PROMPT },
        ],
      },
    ],
  })

  const text =
    response.content[0].type === 'text' ? response.content[0].text : ''

  try {
    // JSON 블록 추출 (```json ... ``` 래핑 대응)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('JSON을 찾을 수 없습니다')
    }
    return JSON.parse(jsonMatch[0]) as OcrResult
  } catch {
    throw new Error(
      `OCR 응답 파싱 실패: 유효한 JSON이 아닙니다 — ${text.slice(0, 200)}`,
    )
  }
}
