'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import ReceiptUploader, { type ScanResult } from '@/components/organisms/ReceiptUploader'
import ScanResultForm from '@/components/organisms/ScanResultForm'

const ExpenseNewTabs = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)

  return (
    <Tabs defaultValue="scan">
      <TabsList className="w-full">
        <TabsTrigger value="scan" className="flex-1">
          영수증 스캔
        </TabsTrigger>
        <TabsTrigger value="manual" className="flex-1">
          수동 입력
        </TabsTrigger>
      </TabsList>

      {/* 영수증 스캔 탭 */}
      <TabsContent value="scan">
        <Card>
          <CardContent className="pt-6">
            {scanResult === null ? (
              <ReceiptUploader
                onScanComplete={setScanResult}
                onError={() => setScanResult(null)}
              />
            ) : (
              <ScanResultForm
                scanResult={scanResult}
                onReset={() => setScanResult(null)}
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* 수동 입력 탭 (Phase 3-2-4에서 구현 예정) */}
      <TabsContent value="manual">
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <FileText className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700">수동 입력</p>
            <p className="text-xs text-gray-500">Phase 3-2-4에서 구현 예정입니다</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default ExpenseNewTabs
