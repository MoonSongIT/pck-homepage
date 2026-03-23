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
