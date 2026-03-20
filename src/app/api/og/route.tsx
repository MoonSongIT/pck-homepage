import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

const CATEGORY_LABELS: Record<string, string> = {
  news: '뉴스',
  activity: '활동',
  statement: '성명서',
  press: '보도자료',
}

const CATEGORY_COLORS: Record<string, string> = {
  news: '#4a90d9',
  activity: '#6b8f47',
  statement: '#c9a84c',
  press: '#f8f4ed',
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const title = searchParams.get('title') || '팍스크리스티코리아'
    const category = searchParams.get('category') || ''

    const categoryLabel = CATEGORY_LABELS[category] || ''
    const categoryColor = CATEGORY_COLORS[category] || '#4a90d9'

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px',
            background: 'linear-gradient(135deg, #1a3a5c 0%, #2a5a8c 50%, #1a3a5c 100%)',
            color: '#f8f4ed',
            fontFamily: 'sans-serif',
          }}
        >
          {/* 상단: 카테고리 뱃지 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {categoryLabel && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 20px',
                  borderRadius: '24px',
                  backgroundColor: categoryColor,
                  color: category === 'press' ? '#1a3a5c' : '#ffffff',
                  fontSize: '24px',
                  fontWeight: 600,
                }}
              >
                {categoryLabel}
              </div>
            )}
          </div>

          {/* 중앙: 제목 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: title.length > 40 ? '42px' : '52px',
                fontWeight: 700,
                lineHeight: 1.3,
                color: '#f8f4ed',
                maxWidth: '900px',
                wordBreak: 'break-word',
              }}
            >
              {title.length > 80 ? `${title.slice(0, 80)}...` : title}
            </div>
          </div>

          {/* 하단: PCK 로고 + 구분선 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#f8f4ed',
                  letterSpacing: '2px',
                }}
              >
                PAX CHRISTI KOREA
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: '#f8f4ed',
                  opacity: 0.7,
                }}
              >
                팍스크리스티코리아 · 평화를 만드는 사람들
              </div>
            </div>

            {/* 평화 심볼 (비둘기 모양 대체: ☮ 심볼) */}
            <div
              style={{
                fontSize: '48px',
                color: '#4a90d9',
                opacity: 0.5,
              }}
            >
              ☮
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error('[OG] Image generation failed:', error)
    return new Response('Failed to generate OG image', { status: 500 })
  }
}
