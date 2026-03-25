// ⚠️ 서버 컴포넌트 전용 — 'use client' 금지
import path from 'path'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// 한글 폰트 등록 (Pretendard OTF — 로컬 파일 경로 직접 전달)
// @react-pdf/font 내부: isUrl/isDataUrl 미해당 → fontkit.open(src) 호출
// fontkit.openSync()로 검증: 14,716 글리프 / 한글 완전 포함
const fontDir = path.join(process.cwd(), 'public', 'fonts')

Font.register({
  family: 'Pretendard',
  fonts: [
    { src: path.join(fontDir, 'Pretendard-Regular.otf') },
    { src: path.join(fontDir, 'Pretendard-Bold.otf'), fontWeight: 'bold' },
  ],
})

const styles = StyleSheet.create({
  page:    { fontFamily: 'Pretendard', padding: 48, fontSize: 10, color: '#222' },
  header:  { marginBottom: 28 },
  title:   { fontSize: 20, fontWeight: 'bold', color: '#1a3a5c', marginBottom: 6 },
  org:     { fontSize: 11, color: '#4a90d9' },
  section: { marginBottom: 20 },
  label:   { fontSize: 9, color: '#888', marginBottom: 4 },
  row:     { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  key:     { color: '#444' },
  val:     { fontWeight: 'bold', color: '#1a3a5c' },
  dot:     { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  catRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  footer:  { position: 'absolute', bottom: 32, left: 48, right: 48, textAlign: 'center', fontSize: 8, color: '#aaa' },
})

const CATEGORY_LABELS: Record<string, string> = {
  PERSONNEL: '인건비', OFFICE: '사무비', EVENT: '행사비', TRANSPORT: '교통비', OTHER: '기타',
}
const CATEGORY_COLORS: Record<string, string> = {
  PERSONNEL: '#4a90d9', OFFICE: '#6b8f47', EVENT: '#c9a84c', TRANSPORT: '#1a3a5c', OTHER: '#e8911a',
}

interface Props {
  year: number
  totalIncome: number
  totalExpense: number
  breakdown: Array<{ category: string; amount: number }>
}

export const FinanceReportPdf = ({ year, totalIncome, totalExpense, breakdown }: Props) => {
  const balance = totalIncome - totalExpense
  const fmt = (n: number) => n.toLocaleString('ko-KR') + '원'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>{year}년 결산 보고서</Text>
          <Text style={styles.org}>팍스크리스티코리아 (Pax Christi Korea)</Text>
        </View>

        {/* 요약 */}
        <View style={styles.section}>
          <Text style={styles.label}>■ 수입·지출 요약</Text>
          <View style={styles.row}>
            <Text style={styles.key}>총 수입</Text>
            <Text style={[styles.val, { color: '#4a90d9' }]}>{fmt(totalIncome)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.key}>총 지출</Text>
            <Text style={[styles.val, { color: '#6b8f47' }]}>{fmt(totalExpense)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.key}>{balance >= 0 ? '잉여금' : '부족액'}</Text>
            <Text style={[styles.val, { color: balance >= 0 ? '#1a3a5c' : '#e53e3e' }]}>{fmt(Math.abs(balance))}</Text>
          </View>
        </View>

        {/* 지출 카테고리 */}
        {breakdown.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>■ 지출 항목별 내역</Text>
            {breakdown.map((b) => (
              <View key={b.category} style={styles.catRow}>
                <View style={[styles.dot, { backgroundColor: CATEGORY_COLORS[b.category] ?? '#888' }]} />
                <Text style={{ flex: 1 }}>{CATEGORY_LABELS[b.category] ?? b.category}</Text>
                <Text style={{ fontWeight: 'bold' }}>{fmt(b.amount)}</Text>
                <Text style={{ color: '#888', marginLeft: 12, width: 48, textAlign: 'right' }}>
                  {totalExpense > 0 ? `${((b.amount / totalExpense) * 100).toFixed(1)}%` : '-'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 푸터 */}
        <Text style={styles.footer}>
          본 보고서는 팍스크리스티코리아가 공식 발행한 {year}년도 결산 보고서입니다. 생성일: {new Date().toLocaleDateString('ko-KR')}
        </Text>
      </Page>
    </Document>
  )
}
