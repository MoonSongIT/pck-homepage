/**
 * Phase 3-2-1 Supabase Storage 테스트 스크립트
 * 실행: npx tsx scripts/test-supabase-storage.ts
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

console.log('=== Supabase Storage 테스트 ===\n')
console.log(`URL: ${supabaseUrl}`)
console.log(`Key: ${supabaseServiceKey.slice(0, 20)}...`)

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  // ── 1. receipts 버킷 확인/생성 ──
  console.log('\n1) receipts 버킷 확인...')
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()

  if (listError) {
    console.log(`   ❌ 버킷 목록 조회 실패: ${listError.message}`)
    return
  }

  const receiptsBucket = buckets?.find((b) => b.name === 'receipts')

  if (!receiptsBucket) {
    console.log('   → receipts 버킷 없음, 생성 중...')
    const { error: createError } = await supabase.storage.createBucket('receipts', {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    })
    if (createError) {
      console.log(`   ❌ 버킷 생성 실패: ${createError.message}`)
      return
    }
    console.log('   ✅ receipts 버킷 생성 완료')
  } else {
    console.log(`   ✅ receipts 버킷 존재 (id: ${receiptsBucket.id})`)
  }

  // ── 2. 테스트 이미지 업로드 ──
  console.log('\n2) 테스트 이미지 업로드...')

  // 1x1 PNG 픽셀 (최소 유효 PNG)
  const pngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64',
  )
  const testPath = `receipts/test-${Date.now()}.png`

  const { error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(testPath, pngBuffer, {
      contentType: 'image/png',
      upsert: false,
    })

  if (uploadError) {
    console.log(`   ❌ 업로드 실패: ${uploadError.message}`)
    return
  }
  console.log(`   ✅ 업로드 성공: ${testPath}`)

  // ── 3. Public URL 생성 ──
  console.log('\n3) Public URL 확인...')
  const { data: urlData } = supabase.storage
    .from('receipts')
    .getPublicUrl(testPath)

  console.log(`   ✅ URL: ${urlData.publicUrl}`)

  // ── 4. 파일 목록 확인 ──
  console.log('\n4) receipts 버킷 파일 목록...')
  const { data: files, error: listFilesError } = await supabase.storage
    .from('receipts')
    .list('receipts', { limit: 5, sortBy: { column: 'created_at', order: 'desc' } })

  if (listFilesError) {
    console.log(`   ❌ 목록 조회 실패: ${listFilesError.message}`)
  } else {
    console.log(`   ✅ 파일 ${files?.length || 0}개:`)
    files?.forEach((f) => console.log(`      - ${f.name} (${f.metadata?.size || '?'} bytes)`))
  }

  // ── 5. 테스트 파일 삭제 ──
  console.log('\n5) 테스트 파일 삭제...')
  const { error: deleteError } = await supabase.storage
    .from('receipts')
    .remove([testPath])

  if (deleteError) {
    console.log(`   ❌ 삭제 실패: ${deleteError.message}`)
  } else {
    console.log('   ✅ 삭제 성공')
  }

  console.log('\n=== Supabase Storage 테스트 완료 ===')
}

run().catch((err) => {
  console.error('테스트 실행 실패:', err.message)
  process.exit(1)
})
