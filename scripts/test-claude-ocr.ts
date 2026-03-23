/**
 * Phase 3-2-1 Claude Vision OCR 테스트 스크립트
 *
 * 사용법:
 *   npx tsx scripts/test-claude-ocr.ts                  → 내장 테스트 이미지
 *   npx tsx scripts/test-claude-ocr.ts 영수증.jpg       → 실제 영수증 파일
 */

import dotenv from 'dotenv'
dotenv.config({ override: true })
import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

const apiKey = process.env.ANTHROPIC_API_KEY

console.log('=== Claude Vision OCR 테스트 ===\n')
console.log(`API Key: ${apiKey ? apiKey.slice(0, 20) + '...' : '❌ 미설정'}`)

if (!apiKey) {
  console.log('\n❌ ANTHROPIC_API_KEY가 .env에 설정되지 않았습니다.')
  process.exit(1)
}

const anthropic = new Anthropic({ apiKey })

// 영수증 분석 프롬프트 (claude-vision.ts와 동일)
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

async function testWithFile(filePath: string) {
  console.log(`\n📄 파일: ${filePath}`)

  if (!fs.existsSync(filePath)) {
    console.log(`   ❌ 파일이 존재하지 않습니다: ${filePath}`)
    return
  }

  const ext = path.extname(filePath).toLowerCase()
  const mimeMap: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  }
  const mimeType = mimeMap[ext]
  if (!mimeType) {
    console.log(`   ❌ 지원하지 않는 형식: ${ext}`)
    return
  }

  const imageBuffer = fs.readFileSync(filePath)
  const base64 = imageBuffer.toString('base64')
  const fileSizeMB = (imageBuffer.length / 1024 / 1024).toFixed(2)
  console.log(`   크기: ${fileSizeMB}MB, 타입: ${mimeType}`)

  console.log('   🔍 Claude Vision API 호출 중...')
  const startTime = Date.now()

  try {
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
                media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
                data: base64,
              },
            },
            { type: 'text', text: RECEIPT_SCAN_PROMPT },
          ],
        },
      ],
    })

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    console.log(`   ⏱️ 응답 시간: ${elapsed}초`)
    console.log(`   📊 토큰: 입력 ${response.usage.input_tokens} / 출력 ${response.usage.output_tokens}`)
    console.log(`   📝 원본 응답:\n   ${text}\n`)

    // JSON 파싱
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0])
      console.log('   ✅ OCR 파싱 결과:')
      console.log(`      날짜: ${result.date || '(읽을 수 없음)'}`)
      console.log(`      항목: ${result.description}`)
      console.log(`      금액: ${result.amount ? result.amount.toLocaleString() + '원' : '(읽을 수 없음)'}`)
      console.log(`      분류: ${result.category}`)
      console.log(`      비고: ${result.note || '(없음)'}`)
      console.log(`      신뢰도: ${(result.confidence * 100).toFixed(0)}%`)
    } else {
      console.log('   ❌ JSON 파싱 실패')
    }
  } catch (error: unknown) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`   ⏱️ 응답 시간: ${elapsed}초`)
    if (error instanceof Error) {
      console.log(`   ❌ API 에러: ${error.message}`)
    }
  }
}

async function testWithTextPrompt() {
  console.log('\n📋 텍스트 기반 API 연결 테스트 (이미지 없이)...')
  const startTime = Date.now()

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: '다음 JSON만 반환하세요: {"status": "ok", "message": "Claude Vision API 연결 성공"}',
        },
      ],
    })

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    console.log(`   ⏱️ 응답 시간: ${elapsed}초`)
    console.log(`   📝 응답: ${text}`)
    console.log('   ✅ Anthropic API 연결 성공!')
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`   ❌ API 연결 실패: ${error.message}`)
    }
    return false
  }
}

async function run() {
  // Step 1: API 연결 테스트
  const connected = await testWithTextPrompt()
  if (!connected) {
    console.log('\n⛔ API 연결 실패. ANTHROPIC_API_KEY를 확인하세요.')
    process.exit(1)
  }

  // Step 2: 파일 인자가 있으면 실제 영수증 분석
  const filePath = process.argv[2]
  if (filePath) {
    const absPath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath)
    await testWithFile(absPath)
  } else {
    console.log('\n💡 실제 영수증 테스트:')
    console.log('   npx tsx scripts/test-claude-ocr.ts 영수증파일.jpg')
    console.log('   (카페 영수증, 편의점 영수증 등 아무 이미지나 가능)')
  }

  console.log('\n=== Claude Vision OCR 테스트 완료 ===')
}

run().catch((err) => {
  console.error('테스트 실행 실패:', err.message)
  process.exit(1)
})
