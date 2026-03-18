# PCK 웹사이트 리뉴얼 — 진도 체크리스트

> 최종 수정: 2026-03-18
> 상태 표시: ⬜ 미시작 | 🔄 진행 중 | ✅ 완료 | ❌ 블로커 | ⏭️ 건너뜀

---

## Phase 0 — 개발 환경 및 형상 관리 설정

| #   | 작업 항목                         | 상태 | 세부 내용                                                                        | 블로커/비고 |
| --- | --------------------------------- | ---- | -------------------------------------------------------------------------------- | ----------- |
| 0-1 | Next.js 15 프로젝트 초기화        | ✅   | Next.js 16.1.7 + React 19.2.3 + TS strict + Tailwind v4 + App Router + Turbopack |             |
| 0-2 | Git 초기화 + .gitignore + LICENSE | ✅   | git init(main), .gitignore 확장, MIT LICENSE, .env.example                       |             |
| 0-3 | 브랜치 전략 수립                  | ✅   | main + develop 브랜치 생성 완료                                                  |             |
| 0-4 | GitHub Actions CI 파이프라인      | ✅   | ci.yml (lint+typecheck+build) + deploy.yml (placeholder)                         |             |
| 0-5 | 관리 문서 생성                    | ✅   | plan.md, check.md, test.md 작성 + 점검 완료                                      |             |
| 0-6 | CLAUDE.md 프로젝트 지침           | ✅   | 기술스택, 코드스타일, 디렉토리구조, 명령어, 디자인토큰, 보안, 브랜치전략         |             |
| 0-7 | ESLint + Prettier 통합            | ✅   | prettier + eslint-config-prettier 설치, .prettierrc, format 스크립트 추가        |             |

### Phase 0 완료 체크포인트

- [x] `npm run lint` — 에러 0건
- [x] `npx tsc --noEmit` — 에러 0건
- [x] `npm run build` — 빌드 성공
- [x] `npm run dev` — localhost:3000 정상
- [x] `npx prettier --check .` — 포맷 일관성
- [x] `git branch` — main + develop 존재
- [x] `.github/workflows/ci.yml` — YAML 유효

---

## Phase 1 — 기반 설정

| #   | 작업 항목                       | 상태 | 세부 내용                                               | 블로커/비고                      |
| --- | ------------------------------- | ---- | ------------------------------------------------------- | -------------------------------- |
| 1-1 | Tailwind CSS v4 디자인 토큰     | ✅   | @theme 6개 컬러 + .dark 다크모드 + Noto Sans KR/Inter   |                                  |
| 1-2 | shadcn/ui 설치 + 초기 컴포넌트  | ✅   | radix-nova preset + 12개 컴포넌트 (toast→sonner 대체)   |                                  |
| 1-3 | Prisma + Supabase 연결 + 스키마 | ✅   | 12모델+4enum, PrismaPg 어댑터, Supabase 마이그레이션 완료 |                                  |
| 1-4 | NextAuth.js v5 설정             | ✅   | Credentials+Kakao, PrismaAdapter, JWT, middleware 보호경로 | ⏳ 카카오 앱은 추후 등록         |
| 1-5 | Sanity.io v3 연결 + 스키마      | ✅   | next-sanity+image-url, client/queries/image 유틸, 4개 타입 | ⏳ Sanity 프로젝트 생성 후 PROJECT_ID 설정 |
| 1-6 | 추가 라이브러리 설치            | ✅   | zustand, tanstack-query, framer-motion, next-intl, zod, resend, vitest 등 14개 | ⚠️ react-simple-maps: React 19 peer dep (legacy-peer-deps) |

### Phase 1 완료 체크포인트

- [x] 브라우저 DevTools에서 CSS 변수 6개 확인 — globals.css `@theme`에 6개 peace-* 토큰 정의 확인
- [x] shadcn/ui Button 렌더링 정상 — button.tsx 7개 variant + 8개 size, CVA 설정 정상
- [x] `npx prisma db push` — "The database is already in sync with the Prisma schema." ✅
- [x] `/api/auth/signin` — 302 → `/login` 리다이렉트 (커스텀 페이지 설정 정상), providers API: credentials+kakao 등록 확인
- [x] Sanity 테스트 쿼리 — 클라이언트 생성 성공 (projectId/dataset/apiVersion 설정 정상). ⏳ 실제 데이터 반환은 Sanity 프로젝트 생성 후 검증
- [x] `npm run build` — ✅ Compiled successfully in 3.2s, 에러 0건

### Phase 1 특이사항

1. **Next.js 16 middleware 경고**: `"middleware" file convention is deprecated, use "proxy" instead` — 빌드 통과, 런타임 정상. Next.js 16 정식 릴리즈 시 proxy 패턴으로 마이그레이션 필요
2. **react-simple-maps React 19 미지원**: peer dep `react@^16.8.0 || 17.x || 18.x` — `--legacy-peer-deps`로 설치. 런타임 정상 동작하나, Phase 3-5 구현 시 실제 검증 필요
3. **Prisma v7 신규 패턴**: `prisma.config.ts` + `@prisma/adapter-pg` + `@/generated/prisma/client` import 경로. 기존 Prisma 가이드와 다르므로 주의
4. **NextAuth Edge Runtime 분리**: `auth.config.ts` (Edge-safe, middleware용) + `auth.ts` (Full, API routes용) 2파일 구조. Prisma를 middleware에서 직접 import하면 에러 발생
5. **Sanity/카카오 외부 의존**: PROJECT_ID와 KAKAO_CLIENT_ID 미설정 상태. 코드 준비 완료, 외부 계정 생성 후 .env 업데이트만 하면 됨

### Phase 1 외부 작업 체크리스트

- [x] Supabase 프로젝트 생성 → DATABASE_URL 확보
- [ ] Sanity.io 프로젝트 생성 → PROJECT_ID 확보
- [ ] 카카오 개발자 앱 등록 → CLIENT_ID / SECRET 확보

---

## Phase 2 — 핵심 페이지 구현

### 2-1. 공통 레이아웃

| #     | 작업 항목                          | 상태 | 세부 내용                                                                 |
| ----- | ---------------------------------- | ---- | ------------------------------------------------------------------------- |
| 2-1-1 | 루트 레이아웃 수정                 | ✅   | `src/app/layout.tsx` — next-themes ThemeProvider + Sonner Toaster 래핑    |
| 2-1-2 | 네비게이션 상수 파일               | ✅   | `src/lib/constants/navigation.ts` — 메뉴 6개, SNS 3개, 연락처, 법적 링크 |
| 2-1-3 | Logo 컴포넌트                      | ✅   | `src/components/atoms/Logo.tsx` — 서버 컴포넌트, 텍스트+아이콘 로고, 3 size (sm/md/lg), 홈 링크 |
| 2-1-4 | WaveDivider 컴포넌트               | ✅   | `src/components/atoms/WaveDivider.tsx` — 서버 컴포넌트, SVG 물결 구분선, 3색(navy/cream/sky), flip, 다크모드 대응 |
| 2-1-5 | MobileNav 컴포넌트                 | ✅   | `src/components/organisms/MobileNav.tsx` — 클라이언트, Sheet 기반, 메뉴 6개 + 연락처 + 후원 CTA |
| 2-1-6 | Header 컴포넌트                    | ✅   | `src/components/organisms/Header.tsx` — 클라이언트, TopBar(연락처/SNS/다크모드/언어) + MainNav(로고/메뉴6/후원CTA), 스크롤 sticky+blur |
| 2-1-7 | Footer 컴포넌트                    | ✅   | `src/components/organisms/Footer.tsx` — 서버 컴포넌트, 4열(단체정보/바로가기/연락처/정보) + 저작권, 반응형 1→2→4열 |
| 2-1-8 | MainLayout 템플릿                  | ✅   | `src/components/templates/MainLayout.tsx` — Header + main + Footer + Skip Navigation 링크 |
| 2-1-9 | (main) 라우트 그룹                 | ✅   | `src/app/(main)/layout.tsx` — MainLayout 적용, `src/app/(main)/page.tsx` — 플레이스홀더 홈 |
| 2-1-10| 빌드 검증                          | ✅   | `tsc --noEmit` 에러 0 / `npm run lint` 에러 0 / `npm run build` Compiled 3.4s 성공 |

#### 2-1 완료 체크포인트

- [x] Header 데스크톱 (≥768px): TopBar(전화/이메일/SNS/다크모드/KO·EN) + MainNav(로고/메뉴6/후원CTA) 2단 표시
- [x] Header 모바일 (<768px): TopBar 숨김, 로고 + 후원하기 + 햄버거 메뉴만 표시
- [x] Header 스크롤 sticky: 스크롤 50px 이상 시 배경 반투명(95%) + backdrop-blur + shadow
- [x] MobileNav: 햄버거 클릭 → Sheet 우측 슬라이드인, 메뉴 6개 + 연락처 + 후원 버튼 표시
- [x] MobileNav: 메뉴 항목 클릭 시 Sheet 자동 닫힘
- [x] Footer 데스크톱 (≥1024px): 4열 그리드 (단체정보 / 바로가기 / 연락처+SNS / 정보)
- [x] Footer 태블릿 (640~1023px): 2열 그리드
- [x] Footer 모바일 (<640px): 1열 스택
- [x] WaveDivider: navy/cream/sky 3색 정상 렌더링
- [x] WaveDivider: flip=true 시 상하 반전 동작
- [x] WaveDivider: 반응형 높이 (40px → 60px → 80px)
- [x] 다크모드: TopBar 해/달 아이콘 클릭으로 라이트/다크 전환
- [x] 다크모드: Header, Footer, WaveDivider, 페이지 배경 색상 정상 전환
- [x] Logo: 홈(/) 링크 동작, 3 size 정상 표시
- [x] Skip Navigation: Tab 키로 "본문으로 건너뛰기" 링크 접근 가능
- [x] 접근성: `<header>`, `<nav>`, `<main>`, `<footer>` 시맨틱 구조 적용
- [x] 접근성: 외부 링크에 `target="_blank" rel="noopener noreferrer"` + aria-label 적용
- [x] 접근성: WaveDivider에 `aria-hidden="true"` 적용 (장식 요소)

#### 2-1 생성/수정 파일 목록

| 구분 | 파일 경로                                      | 서버/클라이언트 |
| ---- | ---------------------------------------------- | --------------- |
| 수정 | `src/app/layout.tsx`                           | 서버            |
| 신규 | `src/lib/constants/navigation.ts`              | 공유 데이터     |
| 신규 | `src/components/atoms/Logo.tsx`                | 서버            |
| 신규 | `src/components/atoms/WaveDivider.tsx`         | 서버            |
| 신규 | `src/components/organisms/MobileNav.tsx`       | 클라이언트      |
| 신규 | `src/components/organisms/Header.tsx`          | 클라이언트      |
| 신규 | `src/components/organisms/Footer.tsx`          | 서버            |
| 신규 | `src/components/templates/MainLayout.tsx`      | 서버            |
| 신규 | `src/app/(main)/layout.tsx`                    | 서버            |
| 신규 | `src/app/(main)/page.tsx`                      | 서버            |
| 삭제 | `src/app/page.tsx`                             | (기존 기본 페이지 제거) |

#### 2-1 기술 패턴 메모

- `useSyncExternalStore` 패턴으로 mounted 상태 관리 (React 19 ESLint 규칙 호환, `useEffect`+`useState` 대신 사용)
- 서버/클라이언트 분리: Header, MobileNav만 `"use client"`, 나머지 전부 서버 컴포넌트
- 반응형 분기점: `md (768px)` — TopBar 표시/숨김, 데스크톱 메뉴/햄버거 전환
- SNS_ICON_MAP 패턴: 상수 파일의 문자열 icon 이름을 실제 lucide-react 컴포넌트로 매핑

---

### 2-2. 메인 홈페이지

| #     | 작업 항목                          | 상태 | 세부 내용                                                                 | 블로커/비고 |
| ----- | ---------------------------------- | ---- | ------------------------------------------------------------------------- | ----------- |
| 2-2-1 | HeroSection 컴포넌트               | ⬜   | 풀스크린 슬라이더 3~4장 + 반투명 네이비 오버레이 + 타이핑 애니메이션 (Framer Motion) | |
| 2-2-2 | ImpactCounter 컴포넌트             | ⬜   | 4개 항목(2019/200+/50/15+), IntersectionObserver 뷰포트 진입 감지, 카운트업 2초 ease-out | |
| 2-2-3 | LatestNews 컴포넌트                | ⬜   | Sanity GROQ 쿼리로 최신 3건 조회, NewsCard 그리드, Skeleton 로딩 | 1-5 (Sanity) |
| 2-2-4 | NewsCard 컴포넌트                  | ⬜   | 카테고리 뱃지 + 썸네일 + 제목 + 날짜 + 발췌문 | |
| 2-2-5 | DonationCTA 컴포넌트               | ⬜   | 달성률 프로그레스 바 + 후원 버튼 + 배경 peace-cream | |
| 2-2-6 | NewsletterSection 컴포넌트         | ⬜   | 이메일 입력 폼 → Resend API 구독 처리 | |
| 2-2-7 | 메인 페이지 조립                   | ⬜   | `src/app/(main)/page.tsx` — Hero → WaveDivider → Impact → WaveDivider → News → DonationCTA → Newsletter | |

### 2-3. 단체 소개 + 타임라인 + 임원

| #     | 작업 항목                          | 상태 | 세부 내용                                                                 | 블로커/비고 |
| ----- | ---------------------------------- | ---- | ------------------------------------------------------------------------- | ----------- |
| 2-3-1 | About 메인 페이지                  | ⬜   | `/about` — 비전·미션·핵심가치 3개 카드 레이아웃 | |
| 2-3-2 | TimelineItem 컴포넌트              | ⬜   | 연도 뱃지 + 제목 + 설명 + (선택) 이미지, 좌우 교대 배치 | |
| 2-3-3 | History 타임라인 페이지            | ⬜   | `/about/history` — 수직 중앙선 + 좌우 교대, Framer Motion whileInView fade-in | 1-5 (Sanity) |
| 2-3-4 | MemberCard 컴포넌트                | ⬜   | 프로필 사진 + 이름 + 역할 + 소개 텍스트 | |
| 2-3-5 | Team 임원진 페이지                 | ⬜   | `/about/team` — 프로필 카드 그리드 (Sanity teamMember 스키마) | 1-5 (Sanity) |

### 2-4. 뉴스/활동 목록 + 상세 (ISR)

| #     | 작업 항목                          | 상태 | 세부 내용                                                                 | 블로커/비고 |
| ----- | ---------------------------------- | ---- | ------------------------------------------------------------------------- | ----------- |
| 2-4-1 | 뉴스 목록 페이지                   | ⬜   | `/news` — ISR revalidate:3600, 카테고리 필터(한반도평화/국제활동/교육/공지), 12건씩 페이지네이션 | 1-5 (Sanity) |
| 2-4-2 | 뉴스 상세 페이지                   | ⬜   | `/news/[slug]` — Sanity Portable Text 렌더링, 관련 뉴스 3건 | 1-5 (Sanity) |
| 2-4-3 | 활동 목록 페이지                   | ⬜   | `/activities` — 활동 카테고리별 필터 + 그리드 | 1-5 (Sanity) |
| 2-4-4 | 활동 상세 페이지                   | ⬜   | `/activities/[slug]` — Portable Text 렌더링 | 1-5 (Sanity) |
| 2-4-5 | OG 이미지 API                      | ⬜   | `/api/og` — @vercel/og ImageResponse, 게시글 제목+카테고리+PCK 로고 | |

### Phase 2 전체 체크포인트

- [x] Header: 360px~1440px 반응형 정상 (2-1 완료)
- [ ] Hero: 이미지 전환 + 타이핑 애니메이션 (2-2)
- [ ] Impact Counter: 뷰포트 진입 시 카운트업 (2-2)
- [ ] 뉴스 카드: Sanity 데이터 3건 표시 (2-2)
- [ ] 타임라인: 스크롤 시 fade-in (2-3)
- [ ] ISR: Cache-Control 헤더 확인 (2-4)
- [x] WaveDivider: 섹션 전환부 정상 렌더링 (2-1 완료)
- [x] 다크모드: 전체 컬러 전환 정상 (2-1 완료)
- [ ] Lighthouse 접근성: 90+ (2-4 완료 후 측정)
- [ ] 컴포넌트 단위 테스트: Header, Footer, NewsCard 통과 (2-4 완료 후)

---

## Phase 3 — 기능 구현

| #   | 작업 항목          | 상태 | 세부 내용                                               | 블로커/비고              |
| --- | ------------------ | ---- | ------------------------------------------------------- | ------------------------ |
| 3-1 | 후원 시스템        | ⬜   | 정기/일시 탭, 금액 선택, 토스페이먼츠 결제, 감사 이메일 | ❗ 토스 가맹점 등록 필요 |
| 3-2 | 재정 투명성 시스템 | ⬜   | 관리자: 제경비/예산/결산 CRUD, 공개: 차트+보고서        | 1-3, 1-4 의존            |
| 3-3 | 평화학교 교육 신청 | ⬜   | 신청 폼(Zod), DB 저장, 확인 이메일                      | 1-3, 1-5 의존            |
| 3-4 | 회원 커뮤니티      | ⬜   | 자유게시판+평화나눔, 댓글, 본인만 수정/삭제, 인증 보호  | 1-3, 1-4 의존            |
| 3-5 | 국제 네트워크 지도 | ⬜   | react-simple-maps, 50개국 핀, 순차 등장, 한국 강조      | 2-1 의존                 |
| 3-6 | 다국어(한/영) 적용 | ⬜   | next-intl, ko.json/en.json, [locale] 라우트, 헤더 토글  | 2-1 의존                 |

### Phase 3 완료 체크포인트

- [ ] 후원: 토스 테스트 결제 성공 → DB 저장 → 이메일 발송
- [ ] ADMIN 권한: 일반 회원 /admin 접근 거부
- [ ] 재정 CRUD: 제경비 입력/수정/삭제 → DB 반영
- [ ] 투명성 페이지: 도넛 차트 + 보고서 표시
- [ ] 교육 신청: 폼 제출 → DB + 이메일
- [ ] 커뮤니티 인증: 비로그인 → /login 리다이렉트
- [ ] 게시글 권한: 타인 글 수정 시도 → 거부
- [ ] 네트워크 지도: 50개국 핀 + 한국 강조
- [ ] 다국어: 헤더 토글로 한/영 전환
- [ ] Rate Limiting: 로그인 6회 시도 → 429 응답
- [ ] 통합 테스트: 후원 + 로그인 플로우 통과

### Phase 3 외부 작업 체크리스트

- [ ] 토스페이먼츠 가맹점 등록 → 테스트키/실제키 확보
- [ ] Upstash Redis 생성 → REST_URL / TOKEN 확보
- [ ] Resend 계정 생성 → API_KEY 확보

---

## Phase 4 — 마무리 및 배포

| #   | 작업 항목        | 상태 | 세부 내용                                                    | 블로커/비고              |
| --- | ---------------- | ---- | ------------------------------------------------------------ | ------------------------ |
| 4-1 | SEO 최적화       | ⬜   | sitemap.ts, robots.ts, generateMetadata, OG 이미지, JSON-LD  | Phase 2~3 완료 필요      |
| 4-2 | 성능 최적화      | ⬜   | next/image, dynamic import, bundle-analyzer, Core Web Vitals | 전체 기능 완료 필요      |
| 4-3 | 전체 테스트 실행 | ⬜   | Vitest 단위 + Testing Library 통합 + (선택) Playwright E2E   | 모든 기능 완료 필요      |
| 4-4 | CI/CD 최종 검증  | ⬜   | PR → CI 자동 실행 → 통과 확인 → Vercel Preview               | 4-3 의존                 |
| 4-5 | 프로덕션 배포    | ⬜   | Vercel 배포 + 커스텀 도메인 + SSL                            | 4-4 의존, ❗ 도메인 필요 |

### Phase 4 완료 체크포인트

- [ ] /sitemap.xml — 전체 URL 목록
- [ ] /robots.txt — 크롤링 규칙
- [ ] OG 이미지 — SNS 공유 미리보기
- [ ] Lighthouse Performance: 90+
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1
- [ ] 테스트 커버리지: 70%+
- [ ] CI 파이프라인: lint + typecheck + build 통과
- [ ] 프로덕션 빌드: 에러 0건
- [ ] 프로덕션 URL 접속: 정상
- [ ] HTTPS/SSL: 유효한 인증서

### Phase 4 외부 작업 체크리스트

- [ ] Vercel 프로젝트 GitHub 연동
- [ ] 도메인 구매/연결
- [ ] Vercel 환경변수 설정 (프로덕션 값)

---

## 전체 진행률 요약

| Phase       | 전체 항목 | 완료   | 진행률   |
| ----------- | --------- | ------ | -------- |
| Phase 0     | 7         | 7      | 100%     |
| Phase 1     | 6         | 6      | 100%     |
| Phase 2-1   | 10        | 10     | **100%** |
| Phase 2-2~4 | 17        | 0      | 0%       |
| Phase 3     | 6         | 0      | 0%       |
| Phase 4     | 5         | 0      | 0%       |
| **전체**    | **51**    | **23** | **45%**  |
