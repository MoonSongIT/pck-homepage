/**
 * Phase 3-2-5 영수증 폴더 감시 스크립트
 *
 * 실행: npm run receipt-watcher
 *   또는: npx tsx scripts/receipt-watcher.ts
 *
 * 환경변수 (.env.local):
 *   RECEIPT_WATCH_DIR  — 감시할 폴더 절대 경로 (필수)
 *   RECEIPT_API_KEY    — API 인증 키 (필수, 최소 32자 랜덤 문자열 권장)
 *   APP_URL            — Next.js 서버 URL (기본: http://localhost:3000)
 */

import 'dotenv/config'
import path from 'path'
import fs from 'fs'
import { watch } from 'chokidar'

// ─── 환경변수 검증 ────────────────────────────────────

const WATCH_DIR = process.env.RECEIPT_WATCH_DIR
const API_KEY = process.env.RECEIPT_API_KEY
const APP_URL = process.env.APP_URL ?? 'http://localhost:3000'
const API_ENDPOINT = `${APP_URL}/api/finance/receipt-scan`

if (!WATCH_DIR || !API_KEY) {
  console.error('[ERROR] 필수 환경변수 누락:')
  if (!WATCH_DIR) console.error('  RECEIPT_WATCH_DIR 미설정')
  if (!API_KEY)   console.error('  RECEIPT_API_KEY 미설정')
  process.exit(1)
}

const DONE_DIR  = path.join(WATCH_DIR, 'done')
const ERROR_DIR = path.join(WATCH_DIR, 'error')

// ─── 지원 MIME 타입 ───────────────────────────────────

const MIME_MAP: Record<string, string> = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.webp': 'image/webp',
}

// ─── 헬퍼 ─────────────────────────────────────────────

function ensureSubDirs() {
  ;[DONE_DIR, ERROR_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  })
}

function moveFile(src: string, destDir: string): string {
  const filename = path.basename(src)
  let dest = path.join(destDir, filename)
  if (fs.existsSync(dest)) {
    dest = path.join(destDir, `${Date.now()}-${filename}`)
  }
  fs.renameSync(src, dest)
  return dest
}

// ─── 처리 큐 (순차 실행 — Claude API rate limit 대응) ────

const queue: string[] = []
let isProcessing = false

function enqueue(filePath: string) {
  queue.push(filePath)
  if (!isProcessing) drainQueue()
}

async function drainQueue() {
  isProcessing = true
  while (queue.length > 0) {
    const next = queue.shift()!
    await processFile(next)
  }
  isProcessing = false
}

// ─── 파일 처리 ────────────────────────────────────────

async function processFile(filePath: string): Promise<void> {
  const filename = path.basename(filePath)
  const ext = path.extname(filename).toLowerCase()
  const mimeType = MIME_MAP[ext]

  if (!mimeType) {
    console.log(`[SKIP] 지원하지 않는 형식: ${filename}`)
    return
  }

  // done/ · error/ 서브폴더 내 파일은 무시
  const absPath = path.resolve(filePath)
  if (
    absPath.startsWith(path.resolve(DONE_DIR)) ||
    absPath.startsWith(path.resolve(ERROR_DIR))
  ) {
    return
  }

  console.log(`\n[START] ${filename}`)
  const startAt = Date.now()

  try {
    const fileBuffer = fs.readFileSync(filePath)
    const blob = new Blob([fileBuffer], { type: mimeType })
    const form = new FormData()
    form.append('file', blob, filename)

    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'x-api-key': API_KEY! },
      body: form,
    })

    const elapsed = ((Date.now() - startAt) / 1000).toFixed(1)

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`HTTP ${res.status}: ${body}`)
    }

    const data = (await res.json()) as {
      receiptUrl: string
      ocr: {
        description: string
        amount: number | null
        category: string
        confidence: number
      }
      expenseId: string
    }

    moveFile(filePath, DONE_DIR)

    console.log(`[DONE]  ${elapsed}s`)
    console.log(`  설명: ${data.ocr.description}`)
    console.log(`  금액: ${data.ocr.amount != null ? data.ocr.amount.toLocaleString() + '원' : '미확인'}`)
    console.log(`  분류: ${data.ocr.category} (신뢰도 ${(data.ocr.confidence * 100).toFixed(0)}%)`)
    console.log(`  ID  : ${data.expenseId}`)
    console.log(`  →   done/`)
  } catch (err: unknown) {
    const elapsed = ((Date.now() - startAt) / 1000).toFixed(1)
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[ERROR] ${filename} (${elapsed}s): ${message}`)
    try {
      moveFile(filePath, ERROR_DIR)
      console.error(`  → error/`)
    } catch {
      console.error(`  [WARN] error/ 폴더 이동 실패`)
    }
  }
}

// ─── 메인 ─────────────────────────────────────────────

function main() {
  ensureSubDirs()

  console.log('=== PCK 영수증 폴더 감시 시작 ===')
  console.log(`감시 폴더 : ${WATCH_DIR}`)
  console.log(`API URL   : ${API_ENDPOINT}`)
  console.log(`완료 폴더 : ${DONE_DIR}`)
  console.log(`오류 폴더 : ${ERROR_DIR}`)
  console.log('')

  // chokidar v5: Windows 경로 구분자(\) → 슬래시(/) 정규화 필요
  const globPattern = WATCH_DIR!.replace(/\\/g, '/') + '/*.{jpg,jpeg,png,webp}'

  const watcher = watch(globPattern, {
    persistent: true,
    ignoreInitial: false,     // 시작 시 이미 있는 파일도 처리
    awaitWriteFinish: {       // 파일 쓰기 완료 후 이벤트 발생
      stabilityThreshold: 1500,
      pollInterval: 200,
    },
  })

  watcher
    .on('add', (filePath) => enqueue(filePath))
    .on('error', (error) => console.error('[WATCHER ERROR]', error))
    .on('ready', () => console.log('[READY] 새 파일 감시 중... (Ctrl+C 종료)\n'))

  process.on('SIGINT', async () => {
    console.log('\n[STOP] 종료 중...')
    await watcher.close()
    process.exit(0)
  })
}

main()
