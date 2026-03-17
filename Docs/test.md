# PCK 웹사이트 리뉴얼 — 테스트 전략 및 검증 절차

> 최종 수정: 2026-03-17

---

## 테스트 도구 및 환경

| 도구 | 용도 | 설치 시점 |
|------|------|----------|
| **Vitest** | 단위 테스트 (Zod 스키마, 유틸, Zustand 스토어) | Phase 1-6 |
| **@testing-library/react** | 컴포넌트 렌더링 + 인터랙션 테스트 | Phase 1-6 |
| **@testing-library/jest-dom** | DOM assertion 매처 | Phase 1-6 |
| **jsdom** | 브라우저 환경 시뮬레이션 (Vitest 환경) | Phase 1-6 |
| **MSW (Mock Service Worker)** | API 모킹 (통합 테스트용) | Phase 3 시작 시 |
| **Playwright** (선택) | E2E 테스트 | Phase 4 |

### Vitest 설정 (`vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/__tests__/**'],
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

### 커버리지 목표
- **전체**: 핵심 비즈니스 로직 70%+
- **Zod 스키마**: 100% (모든 유효/무효 케이스)
- **유틸 함수**: 90%+
- **Zustand 스토어**: 80%+
- **API 라우트**: 70%+ (핵심 경로)
- **컴포넌트**: 주요 컴포넌트 렌더링 + 인터랙션

---

## 테스트 파일 구조

```
src/
├── __tests__/
│   ├── setup.ts                          # 테스트 환경 설정 (@testing-library/jest-dom import)
│   ├── unit/
│   │   ├── schemas/
│   │   │   ├── donation.test.ts          # 후원 Zod 스키마
│   │   │   ├── education.test.ts         # 교육 신청 Zod 스키마
│   │   │   ├── expense.test.ts           # 제경비 Zod 스키마
│   │   │   ├── community.test.ts         # 게시글/댓글 Zod 스키마
│   │   │   └── auth.test.ts              # 인증 관련 스키마
│   │   ├── stores/
│   │   │   ├── language.test.ts          # 언어 설정 스토어
│   │   │   ├── theme.test.ts             # 다크모드 스토어
│   │   │   └── auth.test.ts              # 인증 상태 스토어
│   │   └── utils/
│   │       ├── format.test.ts            # 금액/날짜 포맷 유틸
│   │       ├── validation.test.ts        # 공통 검증 유틸
│   │       └── permissions.test.ts       # 권한 체크 유틸
│   ├── integration/
│   │   ├── donate-flow.test.tsx          # 후원 폼 → 결제 → 완료 플로우
│   │   ├── auth-flow.test.tsx            # 로그인 → 리다이렉트 플로우
│   │   ├── education-apply.test.tsx      # 교육 신청 폼 제출 플로우
│   │   ├── community-crud.test.tsx       # 게시글 작성/수정/삭제 플로우
│   │   └── finance-admin.test.tsx        # 재정 관리 CRUD 플로우
│   └── e2e/                              # (선택) Playwright
│       ├── home.spec.ts                  # 메인 홈 접속 + 네비게이션
│       ├── donate.spec.ts                # 후원 결제 완료 E2E
│       ├── auth.spec.ts                  # 회원 로그인 → 게시글 작성
│       └── admin.spec.ts                 # 관리자 재정 관리 E2E
```

---

## Phase 0 — 검증 절차

### T0: 개발 환경 검증

| ID | 검증 항목 | 명령어/방법 | 기대 결과 | 상태 |
|----|----------|------------|----------|------|
| T0-1 | ESLint 통과 | `npm run lint` | 에러 0건, 경고만 허용 | ⬜ |
| T0-2 | TypeScript 타입 체크 | `npx tsc --noEmit` | 에러 0건 | ⬜ |
| T0-3 | 프로덕션 빌드 성공 | `npm run build` | exit code 0, .next/ 디렉토리 생성 | ⬜ |
| T0-4 | 개발 서버 실행 | `npm run dev` → 브라우저에서 localhost:3000 | Next.js 기본 페이지 정상 표시 | ⬜ |
| T0-5 | Git 브랜치 구조 | `git branch` | `* main`과 `develop` 두 브랜치 존재 | ⬜ |
| T0-6 | CI 파일 문법 | YAML lint 또는 GitHub Actions 탭 확인 | 유효한 YAML (파싱 에러 없음) | ⬜ |
| T0-7 | Prettier 포맷 | `npx prettier --check .` | 모든 파일 포맷 일치 (재포맷 필요 없음) | ⬜ |
| T0-8 | .gitignore 동작 | `git status` 후 .env 파일 추적 여부 확인 | .env 파일이 tracked 되지 않음 | ⬜ |

### T0 수동 확인 사항
- [ ] `package.json`에 프로젝트 이름, 버전 정상 설정
- [ ] `tsconfig.json`에 `strict: true` 확인
- [ ] `.prettierrc` 설정: semi=false, singleQuote=true, tabWidth=2
- [ ] `.env.example`에 모든 환경변수 키 나열
- [ ] `CLAUDE.md` 내용 정확성 확인

---

## Phase 1 — 검증 절차

### T1: 기반 설정 검증

| ID | 검증 항목 | 명령어/방법 | 기대 결과 | 상태 |
|----|----------|------------|----------|------|
| T1-1 | 디자인 토큰 CSS 변수 | 브라우저 DevTools → `:root` 스타일 확인 | `--color-peace-navy` 등 6개 변수 존재 | ⬜ |
| T1-2 | Tailwind 커스텀 컬러 | `class="bg-peace-navy"` 적용 확인 | 배경색 #1a3a5c 적용됨 | ⬜ |
| T1-3 | 다크모드 토큰 전환 | `.dark` 클래스 토글 | --background, --foreground 값 변경 확인 | ⬜ |
| T1-4 | shadcn/ui Button 렌더링 | `<Button>테스트</Button>` import 후 렌더링 | 스타일 적용된 버튼 정상 표시 | ⬜ |
| T1-5 | shadcn/ui Card 렌더링 | `<Card>` 컴포넌트 렌더링 | 카드 UI 정상 표시 | ⬜ |
| T1-6 | Prisma 스키마 동기화 | `npx prisma db push` | 모든 테이블 생성, exit code 0 | ⬜ |
| T1-7 | Prisma Client 생성 | `npx prisma generate` | @prisma/client 타입 생성 | ⬜ |
| T1-8 | DB 연결 테스트 | Prisma Studio 실행: `npx prisma studio` | 브라우저에서 테이블 목록 확인 | ⬜ |
| T1-9 | NextAuth 로그인 페이지 | `/api/auth/signin` 접속 | 이메일/비밀번호 입력 폼 + 카카오 버튼 표시 | ⬜ |
| T1-10 | NextAuth 세션 | 로그인 후 `getServerSession()` 호출 | 유저 정보 반환 | ⬜ |
| T1-11 | Sanity 클라이언트 | 테스트 GROQ 쿼리: `*[_type == "post"][0..2]` | 데이터 반환 (또는 빈 배열) | ⬜ |
| T1-12 | Zustand 스토어 테스트 | `npm test -- stores/` | 언어/테마 상태 변경 정상 | ⬜ |
| T1-13 | Zod 스키마 테스트 | `npm test -- schemas/` | 유효/무효 입력 검증 통과/실패 | ⬜ |
| T1-14 | 빌드 확인 | `npm run build` | 에러 0건 | ⬜ |

### T1 단위 테스트 상세

#### T1-12. Zustand 스토어 테스트

**파일**: `src/__tests__/unit/stores/language.test.ts`
```
테스트 케이스:
1. 초기 언어: 'ko'
2. setLanguage('en') → 언어 'en'으로 변경
3. setLanguage('ko') → 다시 'ko'로 복귀
```

**파일**: `src/__tests__/unit/stores/theme.test.ts`
```
테스트 케이스:
1. 초기 테마: 'system'
2. setTheme('dark') → 'dark'으로 변경
3. setTheme('light') → 'light'으로 변경
```

#### T1-13. Zod 스키마 테스트

**파일**: `src/__tests__/unit/schemas/donation.test.ts`
```
유효 케이스:
1. amount: 10000, type: 'ONE_TIME' → 통과
2. amount: 50000, type: 'REGULAR' → 통과

무효 케이스:
3. amount: 0 → 실패 (최소 1000원)
4. amount: -1000 → 실패
5. type: 'INVALID' → 실패
6. email: 'invalid' → 실패
```

**파일**: `src/__tests__/unit/schemas/education.test.ts`
```
유효 케이스:
1. 모든 필수 필드 입력 → 통과

무효 케이스:
2. name: '' → 실패 (필수)
3. email: 'invalid' → 실패 (이메일 형식)
4. phone: '123' → 실패 (전화번호 형식)
5. motivation: '짧음' → 실패 (최소 10자)
```

---

## Phase 2 — 검증 절차

### T2: 핵심 페이지 검증

| ID | 검증 항목 | 명령어/방법 | 기대 결과 | 상태 |
|----|----------|------------|----------|------|
| T2-1 | Header 데스크톱 | 1440px 뷰포트 | 로고 + 풀메뉴 + 후원CTA 표시 | ⬜ |
| T2-2 | Header 모바일 | 360px 뷰포트 | 로고 + 햄버거 + 후원버튼(축소 없이) 표시 | ⬜ |
| T2-3 | Header 스크롤 sticky | 스크롤 다운 | 헤더 상단 고정, 배경 불투명도 변경 | ⬜ |
| T2-4 | 모바일 메뉴 | 햄버거 클릭 | Sheet 메뉴 슬라이드 인, 메뉴 항목 표시 | ⬜ |
| T2-5 | Footer 반응형 | 360px~1440px | 모바일 1열, 데스크톱 4열 | ⬜ |
| T2-6 | WaveDivider navy | 밝은 배경 → 네이비 전환부 | SVG 웨이브 정상 렌더링 | ⬜ |
| T2-7 | WaveDivider cream | 네이비 → 크림 전환부 | SVG 웨이브 정상 렌더링 | ⬜ |
| T2-8 | WaveDivider 반응형 | 데스크톱/모바일 | 60-80px / 40-50px 높이 | ⬜ |
| T2-9 | Hero 슬라이더 | 메인 페이지 접속 | 3~4장 이미지 5초 자동 전환 | ⬜ |
| T2-10 | Hero 오버레이 | Hero 섹션 확인 | 반투명 네이비 오버레이 적용 | ⬜ |
| T2-11 | Hero 타이핑 | Hero 텍스트 확인 | "그리스도의 평화" 타이핑 애니메이션 | ⬜ |
| T2-12 | Impact Counter 트리거 | 스크롤 → 카운터 섹션 | 뷰포트 진입 시 카운트업 시작 | ⬜ |
| T2-13 | Impact Counter 값 | 카운터 애니메이션 완료 | 2019, 200+, 50, 15+ 표시 | ⬜ |
| T2-14 | 최신 뉴스 카드 | 메인 뉴스 그리드 | Sanity에서 3건 카드 표시 (Skeleton → 데이터) | ⬜ |
| T2-15 | 뉴스레터 구독 | 이메일 입력 → 제출 | 성공 메시지 (또는 Resend API 호출 확인) | ⬜ |
| T2-16 | About 카드 레이아웃 | /about 접속 | 비전·미션·핵심가치 3개 카드 | ⬜ |
| T2-17 | 타임라인 렌더링 | /about/history 접속 | 수직 중앙선 + 좌우 교대 항목 | ⬜ |
| T2-18 | 타임라인 애니메이션 | 스크롤 | fade-in 효과 (whileInView) | ⬜ |
| T2-19 | 임원 프로필 카드 | /about/team 접속 | 프로필 카드 그리드 (사진+역할+소개) | ⬜ |
| T2-20 | 뉴스 목록 ISR | /news 접속 | revalidate:3600 Cache-Control 헤더 | ⬜ |
| T2-21 | 뉴스 카테고리 필터 | 카테고리 버튼 클릭 | 필터링된 결과 표시 | ⬜ |
| T2-22 | 뉴스 페이지네이션 | 12건 초과 시 | 이전/다음 버튼 동작 | ⬜ |
| T2-23 | 뉴스 상세 페이지 | /news/[slug] 접속 | Portable Text 렌더링 정상 | ⬜ |
| T2-24 | OG 이미지 | /api/og?title=테스트 접속 | 동적 OG 이미지 생성 | ⬜ |
| T2-25 | 다크모드 전환 | 테마 토글 클릭 | 전체 컬러 토큰 정상 전환 | ⬜ |
| T2-26 | 접근성 점수 | Lighthouse 접근성 탭 | 90점 이상 | ⬜ |
| T2-27 | 최소 폰트 크기 | 전체 페이지 확인 | 본문 16px 이상 | ⬜ |
| T2-28 | 컴포넌트 테스트 | `npm test` | Header, Footer, NewsCard, WaveDivider 통과 | ⬜ |

---

## Phase 3 — 검증 절차

### T3-A: 후원 시스템 검증

| ID | 검증 항목 | 명령어/방법 | 기대 결과 | 상태 |
|----|----------|------------|----------|------|
| T3-A1 | 후원 페이지 렌더링 | /donate 접속 | 정기/일시 탭 + 금액 선택 버튼 표시 | ⬜ |
| T3-A2 | 금액 선택 | 1만원/3만원/5만원 버튼 클릭 | 선택된 금액 표시 + 스타일 변경 | ⬜ |
| T3-A3 | 직접 입력 | "직접 입력" 선택 → 금액 입력 | 커스텀 금액 반영 | ⬜ |
| T3-A4 | 폼 유효성 (빈 값) | 금액 미선택 + 제출 | Zod 에러 메시지 표시 | ⬜ |
| T3-A5 | 폼 유효성 (이메일) | 잘못된 이메일 입력 + 제출 | 이메일 형식 에러 표시 | ⬜ |
| T3-A6 | 개인정보 동의 | 미체크 시 제출 | 동의 필수 에러 표시 | ⬜ |
| T3-A7 | 토스 결제창 호출 | 유효한 폼 → "후원하기" 클릭 | 토스페이먼츠 결제창 팝업 | ⬜ |
| T3-A8 | 결제 승인 (테스트) | 토스 테스트 카드로 결제 완료 | /api/donate/confirm 호출 → 승인 성공 | ⬜ |
| T3-A9 | DB 저장 확인 | 결제 완료 후 Prisma Studio | Donation 레코드 생성 확인 | ⬜ |
| T3-A10 | 감사 이메일 | 결제 완료 후 | Resend API 호출 확인 (또는 실제 이메일 수신) | ⬜ |
| T3-A11 | Rate Limiting | 후원 API 11회 연속 호출 | 10회 초과 시 429 응답 | ⬜ |

### T3-B: 재정 투명성 검증

| ID | 검증 항목 | 명령어/방법 | 기대 결과 | 상태 |
|----|----------|------------|----------|------|
| T3-B1 | ADMIN 접근 | ADMIN 계정으로 /admin/finance 접속 | 재정 관리 대시보드 표시 | ⬜ |
| T3-B2 | 비ADMIN 접근 거부 | MEMBER 계정으로 /admin/finance 접속 | 403 또는 리다이렉트 | ⬜ |
| T3-B3 | 제경비 생성 | 입력 폼 → 모든 필드 입력 → 제출 | DB 저장 + 목록에 표시 | ⬜ |
| T3-B4 | 제경비 Zod 검증 | 금액 0 또는 음수 입력 → 제출 | 에러 메시지 표시 | ⬜ |
| T3-B5 | 제경비 수정 | 기존 항목 수정 → 저장 | DB 업데이트 확인 | ⬜ |
| T3-B6 | 제경비 삭제 | 삭제 버튼 → 확인 | DB 삭제 + 목록에서 제거 | ⬜ |
| T3-B7 | 제경비 검색/필터 | 카테고리 필터 + 날짜 범위 | 필터링된 결과 | ⬜ |
| T3-B8 | 예산 편성 | 연도 + 카테고리 + 금액 → 등록 | BudgetItem 생성 | ⬜ |
| T3-B9 | 예산 집행률 | 제경비 입력 후 예산 페이지 | 집행액/잔액 자동 계산 + 프로그레스 바 | ⬜ |
| T3-B10 | 결산 보고서 생성 | 연도 선택 → 생성 | 수입/지출 자동 집계 | ⬜ |
| T3-B11 | 보고서 공개 토글 | isPublished 토글 | 공개/비공개 전환 | ⬜ |
| T3-B12 | 투명성 페이지 (공개) | /transparency 접속 (비로그인) | 공개된 연도 재정 요약 표시 | ⬜ |
| T3-B13 | 도넛 차트 | /transparency 접속 | 카테고리별 지출 비율 차트 | ⬜ |
| T3-B14 | 연도별 상세 | /transparency/2025 접속 | 해당 연도 수입/지출 상세 | ⬜ |
| T3-B15 | 보고서 PDF 다운로드 | PDF 다운로드 링크 클릭 | PDF 파일 다운로드 | ⬜ |

### T3-C: 교육 신청 검증

| ID | 검증 항목 | 명령어/방법 | 기대 결과 | 상태 |
|----|----------|------------|----------|------|
| T3-C1 | 교육 소개 페이지 | /education 접속 | 평화학교 소개 + 현재 기수 일정 | ⬜ |
| T3-C2 | 신청 폼 렌더링 | /education/apply 접속 | 전체 필드 표시 | ⬜ |
| T3-C3 | 유효한 신청 | 모든 필드 정상 입력 → 제출 | 성공 메시지 + DB 저장 | ⬜ |
| T3-C4 | 이름 미입력 | 이름 빈칸 → 제출 | "이름을 입력해주세요" 에러 | ⬜ |
| T3-C5 | 이메일 형식 | 잘못된 이메일 → 제출 | 이메일 형식 에러 | ⬜ |
| T3-C6 | 전화번호 형식 | "123" → 제출 | 전화번호 형식 에러 | ⬜ |
| T3-C7 | 지원동기 길이 | 5자 입력 → 제출 | "10자 이상 입력" 에러 | ⬜ |
| T3-C8 | 개인정보 동의 | 미체크 → 제출 | 동의 필수 에러 | ⬜ |
| T3-C9 | 확인 이메일 | 신청 완료 후 | 신청자 + 관리자에게 이메일 발송 | ⬜ |
| T3-C10 | 관리자 신청 목록 | /admin/education 접속 (ADMIN) | 신청 목록 테이블 표시 | ⬜ |

### T3-D: 커뮤니티 검증

| ID | 검증 항목 | 명령어/방법 | 기대 결과 | 상태 |
|----|----------|------------|----------|------|
| T3-D1 | 비로그인 접근 | 로그아웃 → /community 접속 | /login으로 리다이렉트 | ⬜ |
| T3-D2 | 게시판 목록 | 로그인 → /community 접속 | 자유게시판 + 평화나눔 탭 표시 | ⬜ |
| T3-D3 | 글쓰기 | 제목 + 내용 입력 → 제출 | DB 저장 + 목록에 표시 | ⬜ |
| T3-D4 | 글수정 (본인) | 본인 글 → 수정 버튼 → 수정 → 저장 | DB 업데이트 | ⬜ |
| T3-D5 | 글수정 (타인) | 타인 글 → 수정 버튼 | 수정 버튼 미표시 또는 접근 거부 | ⬜ |
| T3-D6 | 글삭제 (본인) | 본인 글 → 삭제 → 확인 | DB 삭제 + 목록에서 제거 | ⬜ |
| T3-D7 | 글삭제 (타인) | 타인 글 → 삭제 시도 | 삭제 불가 | ⬜ |
| T3-D8 | 댓글 작성 | 게시글 상세 → 댓글 입력 → 제출 | 댓글 추가 표시 | ⬜ |
| T3-D9 | 댓글 삭제 (본인) | 본인 댓글 → 삭제 | 삭제 성공 | ⬜ |
| T3-D10 | 페이지네이션 | 20건 초과 게시글 | 페이지 전환 동작 | ⬜ |

### T3-E: 네트워크 지도 검증

| ID | 검증 항목 | 명령어/방법 | 기대 결과 | 상태 |
|----|----------|------------|----------|------|
| T3-E1 | 지도 렌더링 | /network 접속 | 세계 지도 SVG 정상 표시 | ⬜ |
| T3-E2 | 50개국 핀 | 지도 로드 완료 | 50개 핀 순차 등장 애니메이션 | ⬜ |
| T3-E3 | 한국 강조 | 한국 핀 확인 | 다른 색상(gold) + 맥동 애니메이션 | ⬜ |
| T3-E4 | 핀 클릭 | 임의의 국가 핀 클릭 | 지부 정보 툴팁/패널 표시 | ⬜ |
| T3-E5 | 반응형 지도 | 모바일 뷰포트 | 줌/스와이프 가능 | ⬜ |

### T3-F: 다국어 검증

| ID | 검증 항목 | 명령어/방법 | 기대 결과 | 상태 |
|----|----------|------------|----------|------|
| T3-F1 | 기본 언어 | / 접속 | 한국어로 표시 (URL prefix 없음) | ⬜ |
| T3-F2 | 영어 전환 | 헤더 EN 클릭 | /en/ 경로로 이동 + 영어 표시 | ⬜ |
| T3-F3 | 한국어 복귀 | /en/ 에서 KO 클릭 | / 경로로 이동 + 한국어 표시 | ⬜ |
| T3-F4 | About 영어 | /en/about 접속 | About 페이지 영문 표시 | ⬜ |
| T3-F5 | Network 영어 | /en/network 접속 | 네트워크 페이지 영문 표시 | ⬜ |
| T3-F6 | 번역 누락 확인 | 전체 영어 페이지 탐색 | 한국어 텍스트 누출 없음 | ⬜ |

### T3-G: 보안 검증

| ID | 검증 항목 | 명령어/방법 | 기대 결과 | 상태 |
|----|----------|------------|----------|------|
| T3-G1 | Rate Limit (로그인) | 로그인 API 6회 연속 호출 | 5회 초과 → 429 Too Many Requests | ⬜ |
| T3-G2 | Rate Limit (후원) | 후원 API 11회 연속 호출 | 10회 초과 → 429 | ⬜ |
| T3-G3 | XSS 방어 | 게시글 제목에 `<script>alert(1)</script>` 입력 | 스크립트 실행 안됨 (이스케이프 처리) | ⬜ |
| T3-G4 | 서버 사이드 검증 | API 직접 호출 (클라이언트 검증 우회) | 서버 Zod 재검증으로 거부 | ⬜ |
| T3-G5 | 환경변수 노출 | 브라우저 DevTools → 소스 확인 | TOSS_SECRET_KEY 등 서버 변수 미노출 | ⬜ |

---

## Phase 4 — 검증 절차

### T4: 마무리 및 배포 검증

| ID | 검증 항목 | 명령어/방법 | 기대 결과 | 상태 |
|----|----------|------------|----------|------|
| T4-1 | sitemap.xml | /sitemap.xml 접속 | 모든 페이지 URL 목록 (정적 + 동적) | ⬜ |
| T4-2 | robots.txt | /robots.txt 접속 | 크롤링 허용/차단 규칙 + sitemap 링크 | ⬜ |
| T4-3 | 메타데이터 | 각 페이지 `<head>` 확인 | title, description, og:image 존재 | ⬜ |
| T4-4 | OG 이미지 | 카카오톡/트위터에 URL 공유 | 미리보기 이미지 + 제목 + 설명 표시 | ⬜ |
| T4-5 | JSON-LD | 메인 페이지 소스 확인 | Organization, WebSite 구조화 데이터 | ⬜ |
| T4-6 | Lighthouse Performance | Chrome DevTools Lighthouse | Performance 90+ | ⬜ |
| T4-7 | Lighthouse Accessibility | Chrome DevTools Lighthouse | Accessibility 90+ | ⬜ |
| T4-8 | Lighthouse SEO | Chrome DevTools Lighthouse | SEO 90+ | ⬜ |
| T4-9 | LCP | Core Web Vitals 측정 | < 2.5초 | ⬜ |
| T4-10 | CLS | Core Web Vitals 측정 | < 0.1 | ⬜ |
| T4-11 | 번들 크기 | `@next/bundle-analyzer` | 불필요한 대용량 번들 없음 | ⬜ |
| T4-12 | 이미지 최적화 | Network 탭 확인 | WebP 포맷 + lazy loading 적용 | ⬜ |
| T4-13 | 단위 테스트 전체 | `npm test` | 모든 테스트 통과 | ⬜ |
| T4-14 | 테스트 커버리지 | `npm test -- --coverage` | 핵심 로직 70%+ | ⬜ |
| T4-15 | CI 파이프라인 | PR 생성 → GitHub Actions | lint + typecheck + build 통과 | ⬜ |
| T4-16 | Vercel Preview | PR → Preview 배포 | Preview URL 접속 정상 | ⬜ |
| T4-17 | 프로덕션 빌드 | `npm run build` | 에러 0건 + 번들 크기 적정 | ⬜ |
| T4-18 | 프로덕션 배포 | main 머지 → Vercel 자동 배포 | 프로덕션 URL 접속 정상 | ⬜ |
| T4-19 | SSL 인증서 | HTTPS 접속 | 유효한 인증서, 보안 연결 | ⬜ |
| T4-20 | 커스텀 도메인 | 도메인 URL 접속 | 사이트 정상 표시 | ⬜ |

---

## 전체 테스트 요약

| Phase | 테스트 항목 수 | 통과 | 실패 | 미실행 |
|-------|--------------|------|------|--------|
| Phase 0 | 8 | 0 | 0 | 8 |
| Phase 1 | 14 | 0 | 0 | 14 |
| Phase 2 | 28 | 0 | 0 | 28 |
| Phase 3 | 57 | 0 | 0 | 57 |
| Phase 4 | 20 | 0 | 0 | 20 |
| **전체** | **127** | **0** | **0** | **127** |

---

## 테스트 실행 명령어 모음

```bash
# 전체 테스트
npm test

# 특정 파일 테스트
npm test -- schemas/donation.test.ts

# 커버리지 리포트
npm test -- --coverage

# Watch 모드 (개발 중)
npm test -- --watch

# E2E 테스트 (선택)
npx playwright test

# E2E 특정 파일
npx playwright test e2e/donate.spec.ts

# E2E UI 모드
npx playwright test --ui
```
