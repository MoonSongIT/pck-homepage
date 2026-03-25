'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// useEffect는 서버 props → 로컬 상태 동기화에 사용
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  FileDown,
  FileText,
  Link2,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  generateReport,
  generateReportPdf,
  toggleReportPublish,
  updateReportPdfUrl,
  deleteReport,
} from '@/app/actions/finance'

// ─── 타입 ──────────────────────────────────────────────

interface ReportRow {
  id: string
  year: number
  totalIncome: number
  totalExpense: number
  pdfUrl: string | null
  isPublished: boolean
  updatedAt: string
}

interface Props {
  reports: ReportRow[]
  pendingCount: number
}

// ─── 유틸 ──────────────────────────────────────────────

const formatKRW = (n: number) => n.toLocaleString('ko-KR') + '원'

// ─── 컴포넌트 ──────────────────────────────────────────

export const ReportForm = ({ reports, pendingCount }: Props) => {
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [isPending, startTransition] = useTransition()
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [pdfDialog, setPdfDialog] = useState<{ id: string; url: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState<string | null>(null)

  // 서버 props를 로컬 상태로 관리 (낙관적 업데이트용)
  const [localReports, setLocalReports] = useState<ReportRow[]>(reports)
  useEffect(() => { setLocalReports(reports) }, [reports])

  const existingYears = new Set(localReports.map((r) => r.year))

  // 보고서 생성
  const handleGenerate = () => {
    startTransition(async () => {
      const result = await generateReport(year)
      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  // 공개/비공개 토글 (낙관적 업데이트)
  const handleTogglePublish = (reportId: string) => {
    setLocalReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, isPublished: !r.isPublished } : r))
    )
    startTransition(async () => {
      const result = await toggleReportPublish(reportId)
      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
        router.refresh() // 실패 시 원상복구
      }
    })
  }

  // PDF URL 저장 (낙관적 업데이트)
  const handleSavePdfUrl = () => {
    if (!pdfDialog) return
    const { id: reportId, url: newUrl } = pdfDialog
    setLocalReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, pdfUrl: newUrl || null } : r))
    )
    setPdfDialog(null)
    startTransition(async () => {
      const result = await updateReportPdfUrl(reportId, newUrl)
      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
        router.refresh() // 실패 시 원상복구
      }
    })
  }

  // PDF 자동 생성
  const handleGeneratePdf = async (reportId: string) => {
    setIsGenerating(reportId)
    const result = await generateReportPdf(reportId)
    setIsGenerating(null)
    if (result.success && result.pdfUrl) {
      setLocalReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, pdfUrl: result.pdfUrl! } : r)),
      )
      toast.success('PDF가 생성되어 저장되었습니다.')
    } else {
      toast.error(result.message ?? 'PDF 생성 실패')
    }
  }

  // 삭제 (낙관적 업데이트)
  const handleDelete = () => {
    if (!deleteTarget) return
    const targetId = deleteTarget
    setLocalReports((prev) => prev.filter((r) => r.id !== targetId))
    setDeleteTarget(null)
    startTransition(async () => {
      const result = await deleteReport(targetId)
      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
        router.refresh() // 실패 시 원상복구
      }
    })
  }

  return (
    <>
      {/* PENDING_REVIEW 경고 */}
      {pendingCount > 0 && (
        <Card className="border-[var(--peace-gold)]/40 bg-[var(--peace-gold)]/5">
          <CardContent className="flex items-center gap-3 pt-5">
            <AlertTriangle className="h-5 w-5 shrink-0 text-[var(--peace-gold)]" />
            <div>
              <p className="text-sm font-medium text-[var(--peace-gold)]">
                검토 대기 {pendingCount}건
              </p>
              <p className="text-xs text-muted-foreground">
                미확인 영수증이 있습니다. 결산 보고서 생성 전 검토를 완료해 주세요.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 보고서 생성 영역 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">보고서 생성</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            {/* 연도 선택기 */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setYear((y) => y - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="w-16 text-center font-semibold text-lg">{year}년</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setYear((y) => y + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isPending}
              className="bg-[var(--peace-navy)] hover:bg-[var(--peace-navy)]/90 text-white"
            >
              {isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-1.5 h-4 w-4" />
              )}
              {existingYears.has(year) ? '보고서 갱신' : '보고서 생성'}
            </Button>

            {existingYears.has(year) && (
              <span className="text-xs text-muted-foreground">
                * 기존 보고서가 최신 데이터로 갱신됩니다
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 보고서 목록 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            생성된 보고서
            <span className="ml-2 text-xs text-muted-foreground font-normal">
              (총 {localReports.length}건)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {localReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm">생성된 보고서가 없습니다</p>
              <p className="text-xs mt-1">위에서 연도를 선택하고 보고서를 생성해 주세요</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-[var(--peace-navy)] hover:bg-[var(--peace-navy)]">
                  <TableHead className="text-white">연도</TableHead>
                  <TableHead className="text-right text-white">수입</TableHead>
                  <TableHead className="text-right text-white">지출</TableHead>
                  <TableHead className="text-right text-white">잔액</TableHead>
                  <TableHead className="text-center text-white">공개</TableHead>
                  <TableHead className="text-center text-white">PDF</TableHead>
                  <TableHead className="text-center text-white">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localReports.map((r) => {
                  const balance = r.totalIncome - r.totalExpense
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-semibold">{r.year}년</TableCell>
                      <TableCell className="text-right text-[var(--peace-sky)]">
                        {formatKRW(r.totalIncome)}
                      </TableCell>
                      <TableCell className="text-right text-[var(--peace-olive)]">
                        {formatKRW(r.totalExpense)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${balance < 0 ? 'text-destructive' : ''}`}
                      >
                        {balance < 0 && '▲ '}
                        {formatKRW(Math.abs(balance))}
                      </TableCell>

                      {/* 공개 토글 */}
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1"
                          disabled={isPending}
                          onClick={() => handleTogglePublish(r.id)}
                        >
                          {r.isPublished ? (
                            <>
                              <Eye className="h-3.5 w-3.5 text-[var(--peace-olive)]" />
                              <Badge className="bg-[var(--peace-olive)]/15 text-[var(--peace-olive)] hover:bg-[var(--peace-olive)]/15 text-xs">
                                공개
                              </Badge>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                              <Badge variant="outline" className="text-xs">
                                비공개
                              </Badge>
                            </>
                          )}
                        </Button>
                      </TableCell>

                      {/* PDF URL */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title="PDF 자동 생성"
                            disabled={isGenerating === r.id}
                            onClick={() => handleGeneratePdf(r.id)}
                          >
                            {isGenerating === r.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <FileDown className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title="PDF URL 직접 입력"
                            onClick={() =>
                              setPdfDialog({ id: r.id, url: r.pdfUrl ?? '' })
                            }
                          >
                            <Link2 className="h-3.5 w-3.5" />
                          </Button>
                          {r.pdfUrl && (
                            <a
                              href={r.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--peace-sky)] hover:text-[var(--peace-sky)]/80"
                              title="PDF 열기"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </TableCell>

                      {/* 삭제 */}
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          title="보고서 삭제"
                          onClick={() => setDeleteTarget(r.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* PDF URL 편집 다이얼로그 */}
      <Dialog
        open={!!pdfDialog}
        onOpenChange={(open) => {
          if (!open) setPdfDialog(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>PDF URL 설정</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="https://example.com/report-2024.pdf"
            value={pdfDialog?.url ?? ''}
            onChange={(e) =>
              setPdfDialog((prev) =>
                prev ? { ...prev, url: e.target.value } : null,
              )
            }
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setPdfDialog(null)}>
              취소
            </Button>
            <Button
              onClick={handleSavePdfUrl}
              disabled={isPending}
              className="bg-[var(--peace-navy)] hover:bg-[var(--peace-navy)]/90 text-white"
            >
              {isPending ? '저장 중...' : '저장'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>보고서 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 결산 보고서를 삭제합니다. 실제 수입/지출 데이터는 유지됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
