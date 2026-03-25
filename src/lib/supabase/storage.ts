import { createClient } from '@supabase/supabase-js'

// ─── Supabase 클라이언트 (서버사이드 전용, service_role) ──

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

const getSupabase = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Supabase 환경변수가 설정되지 않았습니다 (SUPABASE_URL, SUPABASE_SERVICE_KEY)',
    )
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

// ─── 영수증 업로드 ─────────────────────────────────────

export async function uploadReceipt(
  file: Buffer,
  filename: string,
): Promise<string> {
  const supabase = getSupabase()
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `receipts/${Date.now()}-${safeName}`

  const { error } = await supabase.storage
    .from('receipts')
    .upload(path, file, {
      contentType: 'image/*',
      upsert: false,
    })

  if (error) {
    throw new Error(`영수증 업로드 실패: ${error.message}`)
  }

  const { data } = supabase.storage.from('receipts').getPublicUrl(path)
  return data.publicUrl
}

// ─── 결산 보고서 PDF 업로드 ──────────────────────────────

/**
 * 결산 보고서 PDF를 Supabase Storage에 업로드하고 공개 URL을 반환한다.
 * @param year  보고서 연도 (파일명에 사용)
 * @param pdfBuffer  @react-pdf/renderer renderToBuffer 결과
 */
export async function uploadReportPdf(year: number, pdfBuffer: Buffer): Promise<string> {
  const supabase = getSupabase()
  const BUCKET = 'reports'
  const path = `finance/${year}-annual-report.pdf`

  // 버킷 없으면 자동 생성 (public)
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.find((b) => b.name === BUCKET)) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET, { public: true })
    if (createError) throw new Error(`reports 버킷 생성 실패: ${createError.message}`)
  }

  const { error } = await supabase.storage.from(BUCKET).upload(path, pdfBuffer, {
    contentType: 'application/pdf',
    upsert: true,   // 동일 연도 재생성 시 덮어쓰기
  })
  if (error) throw new Error(`보고서 PDF 업로드 실패: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// ─── 영수증 삭제 ───────────────────────────────────────

export async function deleteReceipt(url: string): Promise<void> {
  const supabase = getSupabase()
  const match = url.match(/\/receipts\/(.+)$/)
  if (!match) return

  const path = `receipts/${match[1]}`
  const { error } = await supabase.storage
    .from('receipts')
    .remove([path])

  if (error) {
    throw new Error(`영수증 삭제 실패: ${error.message}`)
  }
}
