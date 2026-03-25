'use client'

import { useRef, useState } from 'react'
import { Upload, Loader2, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { RECEIPT_CONFIG } from '@/lib/constants/finance'
import type { OcrResult } from '@/lib/ocr/claude-vision'

// ─── 타입 ───────────────────────────────────────────────

export type ScanResult = {
  receiptUrl: string
  ocr: OcrResult
}

type Props = {
  onScanComplete: (result: ScanResult) => void
  onError: (message: string) => void
}

// ─── 컴포넌트 ───────────────────────────────────────────

const ReceiptUploader = ({ onScanComplete, onError }: Props) => {
  const [dragActive, setDragActive] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!RECEIPT_CONFIG.allowedTypes.includes(file.type as never)) {
      return `지원하지 않는 파일 형식입니다. (JPG, PNG, WebP, HEIC만 가능)`
    }
    if (file.size > RECEIPT_CONFIG.maxFileSize) {
      return '파일 크기는 10MB 이하여야 합니다.'
    }
    return null
  }

  const processFile = async (file: File) => {
    const error = validateFile(file)
    if (error) {
      toast.error(error)
      onError(error)
      return
    }

    // 미리보기 생성
    setPreview(URL.createObjectURL(file))
    setIsScanning(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/finance/receipt-scan', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '영수증 분석에 실패했습니다')
      }

      onScanComplete(data as ScanResult)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : '영수증 분석에 실패했습니다'
      toast.error(message)
      onError(message)
      setPreview(null)
    } finally {
      setIsScanning(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className="space-y-4">
      {/* 드래그&드롭 영역 */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => !isScanning && inputRef.current?.click()}
        className={[
          'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-colors',
          dragActive
            ? 'border-peace-sky bg-peace-sky/5'
            : 'border-gray-300 bg-gray-50 hover:border-peace-sky/60 hover:bg-peace-sky/5',
          isScanning ? 'cursor-wait' : 'cursor-pointer',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept={RECEIPT_CONFIG.allowedTypes.join(',')}
          onChange={handleChange}
          className="hidden"
          disabled={isScanning}
        />

        {isScanning ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-peace-sky" />
            <p className="text-sm font-medium text-peace-navy">
              영수증을 분석 중입니다...
            </p>
            <p className="text-xs text-gray-500">Claude Vision으로 처리 중</p>
          </>
        ) : preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="영수증 미리보기"
              className="max-h-40 rounded-lg object-contain shadow"
            />
            <p className="text-xs text-gray-500">다른 파일로 교체하려면 클릭하세요</p>
          </>
        ) : (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-peace-sky/10">
              {dragActive ? (
                <ImageIcon className="h-7 w-7 text-peace-sky" />
              ) : (
                <Upload className="h-7 w-7 text-peace-sky" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-peace-navy">
                {dragActive ? '여기에 놓으세요' : '영수증 이미지를 드래그하거나 클릭하세요'}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, WebP, HEIC · 최대 10MB
              </p>
            </div>
          </>
        )}
      </div>

      {/* 파일 선택 버튼 (보조) */}
      {!isScanning && !preview && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            파일 선택
          </Button>
        </div>
      )}
    </div>
  )
}

export default ReceiptUploader
