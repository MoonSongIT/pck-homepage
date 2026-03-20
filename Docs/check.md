# PCK 웹사이트 리뉴얼 — 진도 체크리스트

> 최종 수정: 2026-03-20 (Phase 2-4 뉴스/활동 페이지 전체 완료 — 7/7 소항목 구현 + 빌드 검증)
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
| 2-2-1 | HeroSection 컴포넌트               | ✅   | 풀스크린 슬라이더 4장 + 반투명 네이비 오버레이 + 타이핑 애니메이션 (Framer Motion) + 도트 인디케이터 + 스크롤 유도 화살표 | |
| 2-2-2 | ImpactCounter 컴포넌트             | ✅   | 4개 항목(2019/200+/50/15+), useInView 뷰포트 진입 감지, rAF 카운트업 2초 ease-out, useReducedMotion 접근성 대응, 다크모드 지원 | |
| 2-2-3 | LatestNews 컴포넌트                | ✅   | Sanity GROQ 최신 3건 조회, NewsCard 그리드, Skeleton 로딩, Framer Motion stagger 애니메이션, ISR 1시간 | |
| 2-2-4 | NewsCard 분자 컴포넌트             | ✅   | 카테고리 뱃지(색상 매핑) + Next/Image 썸네일 + 제목 + 날짜 + 발췌문, 호버 스케일 | |
| 2-2-5 | Sanity Studio + 스키마             | ✅   | `/studio` 라우트 임베딩, 4개 스키마(post/education/teamMember/timeline) 정의, sanity+styled-components+@sanity/vision 설치 | |
| 2-2-6 | DonationCTA 컴포넌트               | ✅   | 후원 금액 카드 4종(선택식) + "추천" 뱃지 + CTA 버튼(금액 연동 `/donate?amount=`) + peace-cream 배경, Framer Motion stagger, 다크모드/접근성 대응 | |
| 2-2-7 | NewsletterSection 컴포넌트         | ✅   | 네이비 배경 이메일 구독 폼, Server Action(Zod+Prisma+Resend), useActionState 폼 상태 관리, 성공/에러/중복 처리, Framer Motion 스크롤 애니메이션 | |
| 2-2-8 | 메인 페이지 조립                   | ✅   | `src/app/(main)/page.tsx` — Hero → WaveDivider → ImpactCounter → WaveDivider → DonationCTA → WaveDivider → LatestNews → WaveDivider → NewsletterSection 전체 조립 완료 | |

#### 2-2-1 HeroSection 구현 상세

- **구현 파일**:
  - `src/components/organisms/HeroSection.tsx` — 클라이언트 컴포넌트
  - `src/lib/constants/hero.ts` — 슬라이드 4장 데이터 + 타이핑 텍스트 + 설정 상수
  - `public/images/hero/` — slide-{1~4}-{desktop,mobile}.webp (8개 파일, ~40MB)
  - `src/app/(main)/page.tsx` — HeroSection + placeholder 섹션 조립

- **기능 체크**:
  - [x] 풀스크린(100svh) 슬라이더 4장 자동 전환 (5초 간격)
  - [x] Framer Motion AnimatePresence 크로스페이드 + 줌 전환
  - [x] 타이핑 애니메이션 (한글 "그리스도의 평화" / 영문 "Peace of Christ" 순환)
  - [x] 반투명 네이비(50%) 오버레이
  - [x] PAX CHRISTI KOREA 서브타이틀 + 설명 텍스트 + CTA 버튼 2개 (후원/더 알아보기)
  - [x] 도트 인디케이터 (탭리스트 role, 현재 슬라이드 강조)
  - [x] 스크롤 유도 ChevronDown 바운스 애니메이션
  - [x] 마우스 호버/포커스 시 자동 전환 일시정지
  - [x] 키보드 좌우 화살표 슬라이드 전환
  - [x] useReducedMotion 대응 (모션 감소 설정 시 단순 페이드)
  - [x] 반응형 이미지 (모바일/데스크톱 별도)
  - [x] aria-roledescription, aria-label, aria-live 접근성 적용
  - [x] `tsc --noEmit` 에러 0 / `npm run lint` 에러 0 / `npm run build` 성공

#### 2-2-2 ImpactCounter 구현 상세

- **구현 파일**:
  - `src/components/organisms/ImpactCounter.tsx` — 클라이언트 컴포넌트
  - `src/lib/constants/impact.ts` — 4개 통계 데이터 + 설정 상수

- **기능 체크**:
  - [x] 4개 통계 카운터 (창립 2019 / 회원 200+ / 활동 국가 50 / 캠페인 15+)
  - [x] Framer Motion `useInView` 뷰포트 진입 감지 (`once: true`, `margin: -100px`)
  - [x] `requestAnimationFrame` 기반 카운트업 애니메이션 (2초, ease-out cubic)
  - [x] 창립 연도: 현재 연도 → 2019 역방향 카운트 (startFrom 패턴)
  - [x] Framer Motion `containerVariants` + `staggerChildren: 0.15` 순차 등장
  - [x] `useReducedMotion` 접근성 대응 (모션 감소 시 단순 페이드)
  - [x] 반응형 그리드: 2열(모바일) / 4열(데스크톱 md:)
  - [x] 다크모드 지원 (`dark:bg-muted`, `dark:text-peace-cream`, `dark:bg-peace-sky/20`)
  - [x] 아이콘 + 숫자 + suffix + 레이블 레이아웃 (lucide-react: Calendar, Users, Globe, Megaphone)
  - [x] `aria-label` 섹션 접근성 ("팍스크리스티코리아 주요 성과")
  - [x] 숫자 `toLocaleString()` 천단위 구분 표시

- **기술 패턴**:
  - `CounterValue` 서브컴포넌트: `requestAnimationFrame` + `performance.now()` 정밀 타이밍
  - `reducedItemVariants` / `itemVariants` 분기로 접근성 모드별 다른 애니메이션
  - 상수 파일에서 `as const` assertion + `ImpactStat` 유니온 타입 export

#### 2-2-3 LatestNews 구현 상세

- **구현 파일**:
  - `src/components/organisms/LatestNews.tsx` — 클라이언트 컴포넌트
  - `src/components/molecules/NewsCard.tsx` — 서버/클라이언트 분자 컴포넌트
  - `src/lib/constants/news.ts` — 카테고리 라벨/색상 매핑 상수

- **기능 체크**:
  - [x] Sanity GROQ `LATEST_POSTS_QUERY`로 최신 3건 조회 (ISR revalidate:3600)
  - [x] Sanity 연결 실패 시 빈 배열 → Skeleton 3개 표시 (graceful fallback)
  - [x] `page.tsx`에서 `async` 서버 컴포넌트로 fetch → props 전달
  - [x] NewsCard: 카테고리 뱃지 (news/activity/statement/press 색상 분류)
  - [x] NewsCard: Next/Image 썸네일 + placeholder SVG 폴백
  - [x] NewsCard: 제목 2줄 line-clamp + 발췌문 3줄 line-clamp
  - [x] NewsCard: 날짜 한국어 포맷 (`ko-KR` locale)
  - [x] NewsCard: 호버 시 scale + shadow 트랜지션
  - [x] Framer Motion `useInView` + stagger 순차 등장 애니메이션
  - [x] `useReducedMotion` 접근성 대응
  - [x] "더 많은 소식 보기" 링크 → `/news`
  - [x] 반응형 그리드: 1열(모바일) / 2열(sm) / 3열(lg)
  - [x] 다크모드 지원

#### 2-2-4 NewsCard 구현 상세

- **구현 파일**: `src/components/molecules/NewsCard.tsx`
- **Props**: `Post` 타입 (title, slug, category, excerpt, publishedAt, mainImage)
- **이미지**: Sanity `urlFor()` → Next/Image 또는 placeholder SVG 폴백

#### 2-2-5 Sanity Studio + 스키마 구현 상세

- **구현 파일**:
  - `sanity.config.ts` — Sanity 설정 (프로젝트 ID, 플러그인, 스키마)
  - `src/app/studio/[[...tool]]/page.tsx` — Next Studio 임베딩
  - `src/sanity/schemaTypes/index.ts` — 스키마 통합 export
  - `src/sanity/schemaTypes/post.ts` — 뉴스/활동 게시글 (7필드, 카테고리 4종)
  - `src/sanity/schemaTypes/education.ts` — 평화학교 교육 (9필드, 커리큘럼 배열)
  - `src/sanity/schemaTypes/teamMember.ts` — 임원진 (5필드, 순서 정렬)
  - `src/sanity/schemaTypes/timeline.ts` — 연혁 (3필드, 연도 범위 검증)
  - `src/lib/sanity/queries.ts` — GROQ 쿼리 11개 (목록/상세/필터/카운트/SSG)
  - `src/types/sanity.ts` — 4가지 문서 TypeScript 타입 정의

- **설치 패키지**: `sanity`, `styled-components`, `@sanity/vision`
- **next.config.ts**: `images.remotePatterns`에 `cdn.sanity.io` 추가

- **기능 체크**:
  - [x] `/studio` 라우트에서 Sanity Studio 접근 가능
  - [x] 4개 스키마 타입 정의 (post, education, teamMember, timeline)
  - [x] 11개 GROQ 쿼리 작성 (목록, 상세, 카테고리별, 카운트, SSG 슬러그, 최신 3건 등)
  - [x] 이미지 URL 빌더 (`urlFor()` 헬퍼)
  - [x] 클라이언트 분리: 공개(CDN)용 + 인증(프리뷰)용
  - [x] TypeScript 타입 4종 + 공통 타입 (SanityImage, SanitySlug)

#### 2-2-6 DonationCTA 구현 상세

- **구현 파일**:
  - `src/components/organisms/DonationCTA.tsx` — 클라이언트 컴포넌트
  - `src/lib/constants/donation.ts` — 4개 후원 플랜 데이터 + 설정 상수 (기존 파일)

- **기능 체크**:
  - [x] 4개 후원 금액 카드 (1만/3만/5만/10만원) 그리드 표시
  - [x] 카드 클릭 시 선택 상태 전환 (`useState` + `aria-pressed`)
  - [x] 기본 선택: `popular: true` 카드 (3만원 "평화의 동반자")
  - [x] 선택된 카드: 오렌지 ring + 오렌지 아이콘 / 비선택: 회색 ring + 블루 아이콘
  - [x] "추천" 뱃지 (peace-gold) — `popular: true` 카드에 표시
  - [x] 비선택 popular 카드: 골드 ring 구분
  - [x] CTA 버튼에 선택 금액 연동 ("30,000원 후원 참여하기")
  - [x] CTA 링크: `/donate?amount={선택금액}` 쿼리 파라미터 전달
  - [x] Framer Motion `useInView` + stagger 순차 등장 애니메이션
  - [x] `useReducedMotion` 접근성 대응
  - [x] 반응형 그리드: 1열(모바일) / 2열(sm) / 4열(lg)
  - [x] 다크모드 지원 (bg-background, ring-foreground 전환)
  - [x] `aria-label="후원 안내"` 섹션 접근성

- **기술 패턴**:
  - `motion.button` + `aria-pressed` 토글 패턴
  - `defaultPlan` 모듈 레벨 계산 (popular 카드 기본 선택)
  - CTA 버튼 `asChild` + `Link` 조합으로 `/donate?amount=` 전달

#### 2-2-7 NewsletterSection 구현 상세

- **구현 파일**:
  - `src/components/organisms/NewsletterSection.tsx` — 클라이언트 컴포넌트
  - `src/app/actions/newsletter.ts` — Server Action (`'use server'`)
  - `src/lib/constants/newsletter.ts` — 설정 상수 (제목, 메시지, 아이콘)

- **기능 체크**:
  - [x] 네이비 배경(`bg-peace-navy`) + 크림색 텍스트 레이아웃
  - [x] 좌측 제목+설명 / 우측 이메일 폼 (md+), 모바일은 세로 스택
  - [x] `useActionState` + Server Action으로 폼 제출 처리
  - [x] Zod `z.string().email()` 서버 사이드 이메일 검증
  - [x] `prisma.newsletterSubscriber.create()` DB 저장
  - [x] unique constraint 충돌 → "이미 구독 중인 이메일입니다" 에러 메시지
  - [x] Resend API Key 존재 시 환영 이메일 발송, 미설정 시 skip (graceful)
  - [x] 성공 시: CheckCircle 아이콘 + 성공 메시지, 폼 숨김
  - [x] 에러 시: 빨간색 에러 메시지 (`role="alert"`)
  - [x] 로딩 시: Loader2 스피너 + 입력 필드 비활성화
  - [x] Framer Motion `useInView` + `useReducedMotion` 스크롤 애니메이션
  - [x] 다크모드 지원 (`dark:bg-peace-navy/90`)
  - [x] `aria-label="뉴스레터 구독"` 섹션 접근성

- **기술 패턴**:
  - React 19 `useActionState<NewsletterResult | null, FormData>` — Server Action 연동
  - `zod/v4` import 패턴 (Zod v4 호환)
  - Resend dynamic import (`await import('resend')`) — API Key 없을 때 번들 절약
  - `from: 'Pax Christi Korea <noreply@paxchristikorea.or.kr>'` 발신 주소

#### 2-2-8 메인 페이지 조립 상세

- **구현 파일**: `src/app/(main)/page.tsx` — 서버 컴포넌트 (async)
- **섹션 순서**:
  1. `<HeroSection />` — 풀스크린 슬라이더
  2. `<WaveDivider color="navy" />` — 네이비 물결
  3. `<ImpactCounter />` — 통계 카운터
  4. `<WaveDivider color="cream" flip />` — 크림 물결 (반전)
  5. `<DonationCTA />` — 후원 카드 선택
  6. `<WaveDivider color="cream" />` — 크림 물결
  7. `<LatestNews posts={posts} />` — 최신 뉴스 3건
  8. `<WaveDivider color="navy" />` — 네이비 물결
  9. `<NewsletterSection />` — 이메일 구독
- **데이터**: Sanity `LATEST_POSTS_QUERY` ISR fetch (`revalidate: 3600`)

#### 2-2 생성/수정 파일 목록

| 구분 | 파일 경로                                      | 서버/클라이언트 |
| ---- | ---------------------------------------------- | --------------- |
| 수정 | `next.config.ts`                               | 설정            |
| 수정 | `package.json` / `package-lock.json`           | 설정            |
| 수정 | `src/app/(main)/page.tsx`                      | 서버 (async)    |
| 수정 | `src/components/organisms/ImpactCounter.tsx`   | 클라이언트      |
| 신규 | `src/components/organisms/HeroSection.tsx`     | 클라이언트      |
| 신규 | `src/components/organisms/LatestNews.tsx`      | 클라이언트      |
| 신규 | `src/components/organisms/DonationCTA.tsx`     | 클라이언트      |
| 신규 | `src/components/molecules/NewsCard.tsx`        | 서버            |
| 신규 | `src/lib/constants/hero.ts`                    | 공유 데이터     |
| 신규 | `src/lib/constants/news.ts`                    | 공유 데이터     |
| 신규 | `sanity.config.ts`                             | 클라이언트      |
| 신규 | `src/app/studio/[[...tool]]/page.tsx`          | 서버            |
| 신규 | `src/sanity/schemaTypes/*.ts` (5파일)          | 공유 데이터     |
| 신규 | `src/components/organisms/NewsletterSection.tsx`| 클라이언트      |
| 신규 | `src/app/actions/newsletter.ts`                | 서버 액션       |
| 신규 | `src/lib/constants/newsletter.ts`              | 공유 데이터     |
| 신규 | `public/images/news/placeholder-{1~3}.svg`     | 정적 에셋       |

---

### 2-3. 단체 소개 + 타임라인 + 임원

| #     | 작업 항목                | 상태 | 세부 내용                                                                                 | 블로커/비고                |
| ----- | ------------------------ | ---- | ----------------------------------------------------------------------------------------- | -------------------------- |
| 2-3-1 | About 상수 파일          | ✅   | `src/lib/constants/about.ts` — 비전/목표 + 주요 활동 영역(8개) + 서브 네비 상수 + 페이지/타임라인/임원 설정 |                            |
| 2-3-2 | About 레이아웃           | ✅   | `src/app/(main)/about/layout.tsx` — 서브 네비게이션 (소개/연혁/임원진) + 공통 히어로 배너  |                            |
| 2-3-3 | About 메인 페이지        | ✅   | `src/app/(main)/about/page.tsx` + `about-content.tsx` — 소개텍스트 → 비전·목표 카드 → 주요 활동 영역 8개 그리드 + CTA 링크 |           |
| 2-3-4 | TimelineItem 컴포넌트    | ✅   | `src/components/molecules/TimelineItem.tsx` — 연도 뱃지 + 제목/설명 카드 + 좌우 교대 배치 + 모바일 왼쪽 정렬 |          |
| 2-3-5 | History 타임라인 페이지  | ✅   | `src/app/(main)/about/history/page.tsx` + `history-timeline.tsx` — Sanity TIMELINE_QUERY + 수직 중앙선 + 좌우 교대 + Framer Motion fade-in + 빈 상태 폴백 | |
| 2-3-6 | MemberCard 컴포넌트      | ✅   | `src/components/molecules/MemberCard.tsx` — 프로필 사진(Sanity imagePresets.avatar) + 이름 + 직책 + 소개 + 이니셜 폴백 |             |
| 2-3-7 | Team 임원진 페이지       | ✅   | `src/app/(main)/about/team/page.tsx` + `team-grid.tsx` — Sanity TEAM_MEMBERS_QUERY + MemberCard 그리드 + stagger 순차 등장 | |
| 2-3-8 | 빌드 검증                | ✅   | `tsc --noEmit` 에러 0 + `npm run lint` 에러 0 + `npm run build` 성공 (19.1s) + 3개 라우트 정적 생성 확인 |               |

#### 2-3-1 About 상수 파일 구현 상세

- **구현 파일**: `src/lib/constants/about.ts`
- **기능 체크**:
  - [x] `VISION_MISSION` 객체: 비전(Eye) + 목표(Target) — 실제 PCK 비전/목표 텍스트 반영
  - [x] `ACTIVITY_AREAS` 배열: 8개 주요 활동 영역 (갈등전환/Shield, 평화구축/Building2, 평화교육/GraduationCap, 비폭력모임/Users, 종교간대화/Handshake, 옹호활동/Megaphone, 협력단체교류/Link2, 평화의날/CalendarHeart) — id+제목+설명+아이콘
  - [x] `ABOUT_CONFIG` 객체: 히어로 타이틀/서브타이틀, 서브 페이지 링크, activitiesTitle/activitiesSubtitle, introTitle, PCK 소개 텍스트 4문단
  - [x] `ABOUT_NAV` 배열: 서브 네비게이션 (소개/연혁/임원진) href 3개
  - [x] `HISTORY_CONFIG` 객체: 타임라인 페이지 타이틀/설명/연도범위, 빈 상태 메시지
  - [x] `TEAM_CONFIG` 객체: 임원진 페이지 타이틀/설명, 빈 상태 메시지
  - [x] `as const` assertion + `ActivityArea`, `AboutNavItem` 타입 export

#### 2-3-2 About 레이아웃 구현 상세

- **구현 파일**: `src/app/(main)/about/layout.tsx` (클라이언트 — `usePathname`)
- **기능 체크**:
  - [x] 공통 히어로 배너: peace-cream 배경 + "단체 소개" 타이틀 + 서브타이틀
  - [x] 서브 네비게이션: ABOUT_NAV 3개 링크, border-b 탭 스타일
  - [x] 현재 경로 활성 표시 (활성 탭 peace-navy border-b-2 + 텍스트 강조, 다크모드 peace-sky)
  - [x] 모바일: 수평 스크롤(`overflow-x-auto` + `shrink-0`) / 데스크톱: 인라인 링크
  - [x] `children` 렌더링 (서브 페이지 콘텐츠)
  - [x] 다크모드 지원 (`dark:bg-peace-navy/30`, `dark:text-peace-cream`)
  - [x] 시맨틱: `<nav>` + `aria-label="단체 소개 메뉴"` + `aria-current="page"`

#### 2-3-3 About 메인 페이지 구현 상세

- **구현 파일**: `src/app/(main)/about/page.tsx` (서버, metadata) + `about-content.tsx` (클라이언트, Framer Motion)
- **기능 체크**:
  - [x] **섹션 순서**: ① 단체 소개 텍스트 → ② WaveDivider(cream flip) → ③ 비전·목표(cream 배경) → ④ WaveDivider(cream) → ⑤ 주요 활동 영역 + CTA
  - [x] **단체 소개 텍스트** (맨 앞): "팍스크리스티코리아란?" 타이틀 + PCK/PCI 소개 4문단 (ABOUT_CONFIG.introTexts)
  - [x] **비전·목표 섹션**: 2열(md+) / 1열(모바일) 카드, peace-cream 배경
  - [x] 비전/목표 카드: lucide 아이콘(Eye/Target) + 제목 + 설명, peace-navy/peace-sky 배경 원형 아이콘
  - [x] 카드 스타일: border + rounded-2xl + shadow-sm, 호버 shadow-md 전환
  - [x] **주요 활동 영역 섹션**: 4열(lg) / 2열(sm) / 1열(모바일) 카드 그리드, max-w-6xl, 8개 ACTIVITY_AREAS
  - [x] 활동 영역 카드: lucide 아이콘(8종) + 제목 + 설명, 호버 시 shadow-md 전환
  - [x] **서브 페이지 안내**: "연혁 보기" + "임원진 보기" outline 버튼 + ArrowRight 아이콘 (justify-center)
  - [x] WaveDivider 섹션 구분: cream flip / cream 2개 사용
  - [x] Framer Motion `useInView` + `containerVariants` + `staggerChildren: 0.12` 순차 등장
  - [x] `useReducedMotion` 접근성 대응 (reducedItemVariants: 단순 fadeIn)
  - [x] 다크모드 지원 (`dark:bg-background`, `dark:bg-muted`, `dark:text-peace-cream`)
  - [x] `export const metadata` — 제목: "단체 소개 | 팍스크리스티코리아", description 설정

#### 2-3-4 TimelineItem 컴포넌트 구현 상세

- **구현 파일**: `src/components/molecules/TimelineItem.tsx` (서버 컴포넌트)
- **기능 체크**:
  - [x] Props: `year`, `title`, `description?`, `position: 'left' | 'right'`, `className?`
  - [x] 연도 뱃지: rounded-full, peace-navy 배경 + 흰색 텍스트 (다크: peace-sky), z-10
  - [x] 카드 본체: border + rounded-xl + shadow-sm, 제목(font-semibold) + 설명(선택적)
  - [x] 좌우 배치: `position='left'` → `md:flex-row-reverse` + `md:text-right`, `position='right'` → `md:flex-row`
  - [x] **반응형**: 데스크톱(md+) 좌우 교대 / 모바일 항상 `flex-row` (오른쪽 정렬)
  - [x] 다크모드 지원 (`dark:bg-background`, `dark:text-peace-cream`)
  - [x] `aria-label="${year}년"` 접근성
  - [x] `TimelineItemProps` 타입 export

#### 2-3-5 History 타임라인 페이지 구현 상세

- **구현 파일**: `src/app/(main)/about/history/page.tsx` (서버 async) + `history-timeline.tsx` (클라이언트)
- **기능 체크**:
  - [x] Sanity `TIMELINE_QUERY` ISR fetch (`revalidate: 3600`)
  - [x] 에러 시 빈 배열 → HISTORY_CONFIG.emptyMessage + emptyDescription 폴백 표시
  - [x] **수직 타임라인 레이아웃**: 중앙(`md:left-1/2`)/왼쪽(`left-5`) 수직선, w-0.5
  - [x] TimelineItem 좌우 교대: `index % 2 === 0 ? 'left' : 'right'`
  - [x] 수직선: absolute, peace-navy/20 (다크: peace-sky/30), 전체 높이
  - [x] **Framer Motion**: 컨테이너 `staggerChildren: 0.2`, 아이템 fadeIn + slideX (좌: x:40→0, 우: x:-40→0)
  - [x] `useReducedMotion` 접근성 대응 (단순 fadeIn)
  - [x] 페이지 헤더: HISTORY_CONFIG.title + subtitle + yearRange
  - [x] 다크모드 지원 (수직선 `dark:bg-peace-sky/30`)
  - [x] 빈 상태 UI: "아직 등록된 연혁이 없습니다" + CMS 안내
  - [x] `export const metadata` — 제목: "연혁 | 팍스크리스티코리아"

#### 2-3-6 MemberCard 컴포넌트 구현 상세

- **구현 파일**: `src/components/molecules/MemberCard.tsx` (서버 컴포넌트)
- **기능 체크**:
  - [x] Props: `member: TeamMember` (from `src/types/sanity.ts`), `className?`
  - [x] **프로필 사진**: Sanity `imagePresets.avatar()` → `next/image` 120x120, rounded-xl
  - [x] 사진 없을 때: 이니셜 아바타 (이름 첫 글자, peace-navy 배경 + 흰색 텍스트, 다크: peace-sky)
  - [x] Next/Image `sizes="(max-width: 640px) 100px, 120px"` 반응형
  - [x] **이름**: text-lg font-semibold, text-center
  - [x] **직책**: peace-sky 색상 텍스트, text-sm font-medium
  - [x] **소개**: bio 텍스트 3줄 line-clamp (`line-clamp-3`), text-muted-foreground
  - [x] 카드 스타일: border + rounded-lg + shadow-sm, 호버 시 shadow-md 전환
  - [x] 다크모드 지원 (`dark:bg-background`, `dark:text-peace-cream`)
  - [x] `aria-label="{이름} - {직책}"` 접근성 (`<article>` 시맨틱)

#### 2-3-7 Team 임원진 페이지 구현 상세

- **구현 파일**: `src/app/(main)/about/team/page.tsx` (서버 async) + `team-grid.tsx` (클라이언트)
- **기능 체크**:
  - [x] Sanity `TEAM_MEMBERS_QUERY` ISR fetch (`revalidate: 3600`)
  - [x] `order(order asc)` 정렬 (GROQ 쿼리에서 처리)
  - [x] 에러 시 빈 배열 → TEAM_CONFIG.emptyMessage + emptyDescription 폴백 표시
  - [x] **MemberCard 그리드**: 1열(모바일) / 2열(sm) / 3열(md) / 4열(lg) (`grid gap-6`)
  - [x] Framer Motion `staggerChildren: 0.1` 순차 등장 + `useInView` 트리거 (`margin: -80px`)
  - [x] `useReducedMotion` 접근성 대응 (reducedItemVariants)
  - [x] 페이지 헤더: TEAM_CONFIG.title + subtitle
  - [x] 다크모드 지원
  - [x] 빈 상태 UI: "아직 등록된 임원진이 없습니다" + CMS 안내
  - [x] `export const metadata` — 제목: "임원진 | 팍스크리스티코리아"

#### 2-3-8 빌드 검증 상세

- [x] `npx tsc --noEmit` — TypeScript 에러 0건
- [x] `npm run lint` — ESLint 에러 0건 (`.claude/**` ignore 추가)
- [x] `npm run build` — 프로덕션 빌드 성공 (Compiled 19.1s)
- [x] `/about` 페이지 — 정적 생성 (○ Static)
- [x] `/about/history` 페이지 — ISR 정적 생성 (Revalidate 1h)
- [x] `/about/team` 페이지 — ISR 정적 생성 (Revalidate 1h)

#### 2-3 완료 체크포인트

- [x] About 메인: 소개텍스트 → 비전·목표 2열 카드 → 주요 활동 영역 4×2 그리드 정상 표시
- [x] About 메인: Framer Motion 스크롤 애니메이션 (stagger 0.12) + useReducedMotion 대응
- [x] 서브 네비: 소개/연혁/임원진 탭 전환 + 현재 경로 활성 표시
- [x] History: 수직 타임라인 중앙선 + 좌우 교대 배치 (데스크톱)
- [x] History: 모바일 왼쪽 정렬 타임라인 정상 표시
- [x] History: Framer Motion staggerChildren + slideX 애니메이션
- [x] Team: 임원진 카드 그리드 1/2/3/4열 반응형 전환
- [x] Team: 프로필 사진 Sanity Image + 이니셜 폴백 정상 동작
- [x] Team: Framer Motion stagger 순차 등장 애니메이션
- [x] 다크모드: 3개 페이지 모두 정상 전환
- [x] 접근성: 시맨틱 HTML + aria-label + aria-current 적용
- [x] Sanity 미연결 상태에서 graceful fallback (빈 상태 UI)
- [x] 빌드: tsc + lint + build 에러 0건

#### 2-3 생성/수정 파일 목록

| 구분 | 파일 경로                                           | 서버/클라이언트 |
| ---- | --------------------------------------------------- | --------------- |
| 신규 | `src/lib/constants/about.ts`                        | 공유 데이터     |
| 신규 | `src/app/(main)/about/layout.tsx`                   | 클라이언트 (usePathname) |
| 신규 | `src/app/(main)/about/page.tsx`                     | 서버 (metadata) |
| 신규 | `src/app/(main)/about/about-content.tsx`            | 클라이언트 (Framer Motion) |
| 신규 | `src/components/molecules/TimelineItem.tsx`         | 서버            |
| 신규 | `src/app/(main)/about/history/page.tsx`             | 서버 (async, ISR) |
| 신규 | `src/app/(main)/about/history/history-timeline.tsx` | 클라이언트 (Framer Motion) |
| 신규 | `src/components/molecules/MemberCard.tsx`           | 서버            |
| 신규 | `src/app/(main)/about/team/page.tsx`                | 서버 (async, ISR) |
| 신규 | `src/app/(main)/about/team/team-grid.tsx`           | 클라이언트 (Framer Motion) |
| 수정 | `eslint.config.mjs`                                 | `.claude/**` ignore 추가 |

#### 2-3 기술 패턴 메모

- 서버/클라이언트 분리: metadata export는 서버 page.tsx에서, Framer Motion 애니메이션은 별도 클라이언트 컴포넌트로 분리 (Next.js "use client" + metadata 충돌 방지)
- History/Team 페이지: 서버 async page → Sanity fetch → 클라이언트 래퍼에 props 전달
- TimelineItem/MemberCard: 서버 컴포넌트 (상태 불필요), 부모 클라이언트 래퍼에서 motion.div로 감싸서 애니메이션 적용
- About 레이아웃: `usePathname()` 사용으로 "use client" 필수, 히어로 배너 + 탭 네비 공통화
- lucide-react 아이콘: 실제 PCK 활동 내용에 맞게 8종 아이콘 선정 (Shield, Building2, GraduationCap, Users, Handshake, Megaphone, Link2, CalendarHeart)

### 2-4. 뉴스/활동 목록 + 상세 (ISR)

**설계 결정**: `/activities` → `/news?category=activity` 리디렉트, 검색 기능 생략, URL searchParams 서버사이드 페이지네이션

| #     | 작업 항목                          | 상태 | 세부 내용                                                                 | 블로커/비고 |
| ----- | ---------------------------------- | ---- | ------------------------------------------------------------------------- | ----------- |
| 2-4-1 | 패키지 설치 + 상수 확장 + 쿼리 추가 | ✅   | `@portabletext/react` (next-sanity 종속성으로 이미 설치), `news.ts` NEWS_PAGE/DETAIL_CONFIG 추가, `queries.ts` 페이지네이션 쿼리 3개 추가, tsc 통과 | |
| 2-4-2 | 뉴스 목록 페이지                   | ✅   | `/news` page.tsx(서버 ISR) + news-list-content.tsx(클라이언트) + loading.tsx(Skeleton) — 카테고리 필터 탭 5개 + 12건 페이지네이션 + NewsCard 3열 그리드 + Framer Motion + 빈 상태 UI, 빌드 ƒ Dynamic 확인 | |
| 2-4-3 | Portable Text 렌더러               | ✅   | `src/lib/sanity/portable-text-components.tsx` — h2/h3/h4/normal/blockquote 블록 + link/strong/em/underline 마크 + 이미지(Next/Image+urlFor) + bullet/number 리스트, tsc 통과 | |
| 2-4-4 | 뉴스 상세 페이지                   | ✅   | `/news/[slug]` page.tsx(서버, SSG generateStaticParams + generateMetadata + notFound) + news-detail-content.tsx(클라이언트, 히어로이미지 + PortableText본문 + 관련글2건 NewsCard), 빌드 ● SSG 3개 slug 정적생성 확인 | |
| 2-4-5 | OG 이미지 API                      | ✅   | `/api/og/route.tsx` — `next/og` ImageResponse, title+category 쿼리 파라미터, peace-navy 135° 그라데이션 배경 + 카테고리 뱃지(4색) + 제목(최대80자) + PCK 로고 + ☮ 심볼, 빌드 ƒ Dynamic 확인 | |
| 2-4-6 | Activities 리디렉트                | ✅   | `/activities/page.tsx` → `redirect('/news?category=activity')`, `/activities/[slug]/page.tsx` → `redirect('/news/${slug}')`, params Promise 비동기 접근, 빌드 ○ Static + ƒ Dynamic 확인 | |
| 2-4-7 | 빌드 검증                          | ✅   | `tsc --noEmit` 에러 0건 + `npm run lint` 에러 0건 (`Docs/**` ignore 추가) + `npm run build` 17.4s 성공 — 13개 라우트 정적/동적 생성 확인 | |

#### 2-4-1 패키지 설치 + 상수 확장 + 쿼리 추가 구현 상세

- **패키지**: `@portabletext/react` — `next-sanity` 종속성으로 이미 `node_modules`에 존재 (별도 설치 불필요)
- **수정 파일**:
  - `src/lib/constants/news.ts` — NEWS_PAGE_CONFIG, NEWS_DETAIL_CONFIG 추가
  - `src/lib/sanity/queries.ts` — 페이지네이션 쿼리 3개 추가

- **기능 체크**:
  - [x] `NEWS_PAGE_CONFIG`: hero.title/subtitle, postsPerPage(12), allCategoryLabel("전체"), emptyMessage/emptyDescription, pagination.prevLabel/nextLabel
  - [x] `NEWS_DETAIL_CONFIG`: backLabel("목록으로"), backHref("/news"), relatedTitle("관련 글"), emptyMessage/emptyDescription
  - [x] `POSTS_PAGINATED_QUERY`: `[$start...$end]` offset 기반 페이지네이션, publishedAt desc 정렬
  - [x] `POSTS_BY_CATEGORY_PAGINATED_QUERY`: category + offset 페이지네이션
  - [x] `POSTS_COUNT_BY_CATEGORY_QUERY`: 카테고리별 총 게시글 수
  - [x] 기존 쿼리(LATEST_POSTS_QUERY, POSTS_QUERY 등) 변경 없음 (홈페이지 호환성 유지)
  - [x] `as const` assertion 적용
  - [x] `tsc --noEmit` 에러 0건

#### 2-4-2 뉴스 목록 페이지 구현 상세

- **구현 파일**:
  - `src/app/(main)/news/page.tsx` — 서버 컴포넌트 (async, ISR revalidate:3600)
  - `src/app/(main)/news/news-list-content.tsx` — 클라이언트 컴포넌트 (카테고리 탭 + 그리드 + 페이지네이션)
  - `src/app/(main)/news/loading.tsx` — Skeleton 로딩 UI

- **기능 체크**:
  - [x] ISR `revalidate: 3600` (1시간 재검증)
  - [x] `searchParams` Promise 비동기 접근 (Next.js 16 패턴)
  - [x] 카테고리 유효성 검사: `NEWS_CATEGORIES` 키에 없는 값은 무시 → 전체 목록 표시
  - [x] Sanity `Promise.all([posts, totalCount])` 병렬 fetch
  - [x] 에러 시 빈 배열 + totalCount 0 → 빈 상태 UI 표시 (graceful fallback)
  - [x] 히어로 배너: `bg-peace-cream py-16 text-center dark:bg-peace-navy/30` (About layout 패턴 동일)
  - [x] 카테고리 필터 탭 5개: 전체/뉴스/활동/성명서/보도자료 — `Link` 기반 URL searchParams 변경
  - [x] 활성 탭: `border-b-2 border-peace-navy` + 텍스트 강조, `aria-current="page"`
  - [x] 모바일 탭: `overflow-x-auto` + `shrink-0` 수평 스크롤
  - [x] NewsCard 3열 반응형 그리드: 1열(모바일) / 2열(sm) / 3열(lg) — 기존 컴포넌트 재사용
  - [x] Framer Motion `containerVariants` + `staggerChildren: 0.1` 순차 등장
  - [x] `useReducedMotion` 접근성 대응 (reducedItemVariants: 단순 fadeIn)
  - [x] 빈 상태 UI: Newspaper 아이콘 + emptyMessage + emptyDescription
  - [x] 페이지네이션: 이전/다음 Button + 페이지 번호 (7페이지 이상 시 `...` 생략)
  - [x] 페이지네이션 카테고리 유지: `buildHref()` 함수로 category + page searchParams 조합
  - [x] 첫 페이지/마지막 페이지: 이전/다음 버튼 `pointer-events-none opacity-50` 비활성화
  - [x] loading.tsx: 히어로 배너 + 탭 + 카드 12개 Skeleton 골격
  - [x] 메타데이터: "뉴스 & 활동 | 팍스크리스티코리아"
  - [x] `<nav aria-label="뉴스 카테고리 필터">`, `<section aria-label="뉴스 목록">` 시맨틱
  - [x] 다크모드 지원
  - [x] `tsc --noEmit` 에러 0건
  - [x] 빌드: `/news` ƒ Dynamic 라우트 등록 확인

- **기술 패턴**:
  - `buildHref()` 유틸: category/page 조합 → URLSearchParams → `/news?...` 생성
  - `generatePageNumbers()`: 현재 페이지 기준 앞뒤 1개 + 양쪽 끝 + `...` 생략 패턴
  - `Pagination` 별도 컴포넌트로 분리 (재사용 가능)

#### 2-4-3 Portable Text 렌더러 구현 상세

- **구현 파일**: `src/lib/sanity/portable-text-components.tsx`
- **기능 체크**:
  - [x] `block.h2`: `mt-10 mb-4 text-2xl font-bold text-peace-navy dark:text-peace-cream`
  - [x] `block.h3`: `mt-8 mb-3 text-xl font-semibold`
  - [x] `block.h4`: `mt-6 mb-2 text-lg font-semibold`
  - [x] `block.normal`: `mb-4 leading-relaxed text-foreground/90`
  - [x] `block.blockquote`: `border-l-4 border-peace-sky pl-4 italic text-muted-foreground`
  - [x] `marks.strong`: `font-semibold`
  - [x] `marks.em`: `italic`
  - [x] `marks.underline`: `underline`
  - [x] `marks.link`: peace-sky 색상 + underline, 외부 링크 `target="_blank" rel="noopener noreferrer"`
  - [x] `types.image`: Next/Image + `urlFor().width(800).auto('format').quality(85)` + caption
  - [x] `list.bullet`: `ml-6 list-disc space-y-1`
  - [x] `list.number`: `ml-6 list-decimal space-y-1`
  - [x] `listItem`: `leading-relaxed text-foreground/90`
  - [x] `PortableTextComponents` 타입 import (`@portabletext/react`)
  - [x] `tsc --noEmit` 에러 0건

#### 2-4-4 뉴스 상세 페이지 구현 상세

- **구현 파일**:
  - `src/app/(main)/news/[slug]/page.tsx` — 서버 컴포넌트 (async, ISR revalidate:3600)
  - `src/app/(main)/news/[slug]/news-detail-content.tsx` — 클라이언트 컴포넌트 (Framer Motion)

- **기능 체크**:
  - [x] ISR `revalidate: 3600` (1시간 재검증)
  - [x] `generateStaticParams()`: `POST_SLUGS_QUERY`로 전체 slug 목록 → 빌드 시 정적 생성
  - [x] `generateStaticParams()` 에러 시 빈 배열 반환 (빌드 실패 방지)
  - [x] `generateMetadata()`: 동적 제목 `${post.title} | 팍스크리스티코리아`
  - [x] `generateMetadata()`: OG 이미지 — mainImage 있으면 `imagePresets.ogImage()`, 없으면 `/api/og?title=&category=` 폴백
  - [x] `generateMetadata()` 에러 시 기본 제목 반환
  - [x] 게시글 없으면 `notFound()` 호출 → 404 페이지
  - [x] `params` Promise 비동기 접근 (Next.js 16 패턴)
  - [x] 히어로 이미지: `imagePresets.hero()` → `aspect-[21/9]` 풀폭, `priority` 로딩
  - [x] 히어로 이미지 그라데이션 오버레이: `bg-gradient-to-t from-black/40 to-transparent`
  - [x] "목록으로" 버튼: Ghost variant + ArrowLeft 아이콘 → `/news` 링크
  - [x] 카테고리 뱃지: `NEWS_CATEGORIES` 색상 매핑 적용
  - [x] 제목: `text-2xl md:text-3xl lg:text-4xl font-bold` 반응형
  - [x] 날짜: Calendar 아이콘 + `ko-KR` 로케일 (`2026년 3월 19일`)
  - [x] Portable Text 본문: `<PortableText value={post.body} components={portableTextComponents} />`
  - [x] 관련 글 섹션: `post.relatedPosts` 존재 시 표시 (동일 카테고리 최대 3건)
  - [x] 관련 글: `NewsCard` 재사용 + 3열 반응형 그리드
  - [x] 관련 글 배경: `bg-peace-cream/50 dark:bg-peace-navy/10` + `border-t` 구분
  - [x] Framer Motion `containerVariants` + `staggerChildren: 0.15` 순차 등장
  - [x] `useReducedMotion` 접근성 대응
  - [x] 다크모드 지원
  - [x] `<article>` 시맨틱 래핑
  - [x] `tsc --noEmit` 에러 0건
  - [x] 빌드: `/news/[slug]` ● SSG 3개 slug 정적 생성 확인

- **기술 패턴**:
  - 서버 page.tsx → Sanity fetch → 클라이언트 content.tsx에 props 전달 (About History/Team 패턴 동일)
  - `generateStaticParams` + `revalidate` 조합 = ISR SSG (빌드 시 정적 + 런타임 재검증)
  - `generateMetadata`에서 Sanity fetch → OG 이미지 URL 동적 결정
  - `NewsCard`에 `Post` 타입 호환을 위해 `related as Post` 캐스팅 (relatedPosts는 Pick<Post> 부분 타입)

#### 2-4-5 OG 이미지 API 구현 상세

- **구현 파일**: `src/app/api/og/route.tsx` — API Route Handler (ƒ Dynamic)
- **기능 체크**:
  - [x] `next/og` `ImageResponse` import — Next.js 내장 OG 이미지 생성
  - [x] `GET` 핸들러: `request.nextUrl.searchParams`에서 `title`, `category` 추출
  - [x] 배경: `linear-gradient(135deg, #1a3a5c 0%, #2a5a8c 50%, #1a3a5c 100%)` peace-navy 그라데이션
  - [x] 카테고리 뱃지: `CATEGORY_LABELS` (뉴스/활동/성명서/보도자료) + `CATEGORY_COLORS` (sky/olive/gold/cream) 4색 매핑
  - [x] 보도자료(`press`) 카테고리: 밝은 배경(cream)이므로 텍스트 색상 navy로 전환
  - [x] 제목: 40자 초과 시 42px, 이하 시 52px 크기 자동 조정
  - [x] 제목 80자 초과 시 `...` 자동 말줄임
  - [x] 하단 로고: "PAX CHRISTI KOREA" + "팍스크리스티코리아 · 평화를 만드는 사람들" 서브텍스트
  - [x] ☮ 평화 심볼: peace-sky 색상, opacity 0.5
  - [x] 이미지 크기: 1200×630px (OG 표준)
  - [x] 에러 시 500 응답 + 콘솔 로깅
  - [x] `NextRequest` 타입 안전한 URL 파싱
  - [x] 빌드: `/api/og` ƒ Dynamic 라우트 등록 확인

- **기술 패턴**:
  - `ImageResponse`는 Satori 기반 → CSS-in-JS 인라인 스타일 (camelCase) 사용
  - 폰트: 시스템 `sans-serif` (추후 한국어 웹폰트 로딩 가능)
  - 카테고리 없이 호출 가능 (`/api/og?title=제목`만으로 동작)
  - `news-detail-content.tsx`의 `generateMetadata`에서 mainImage 없을 때 폴백으로 사용

#### 2-4-6 Activities 리디렉트 구현 상세

- **구현 파일**:
  - `src/app/(main)/activities/page.tsx` — 목록 리디렉트 (○ Static)
  - `src/app/(main)/activities/[slug]/page.tsx` — 상세 리디렉트 (ƒ Dynamic)

- **기능 체크**:
  - [x] `/activities` → `redirect('/news?category=activity')` — 활동 카테고리 필터 적용된 뉴스 목록으로
  - [x] `/activities/[slug]` → `redirect('/news/${slug}')` — 동일 slug의 뉴스 상세 페이지로
  - [x] `params` Promise 비동기 접근 (Next.js 16 패턴) — `const { slug } = await params`
  - [x] `next/navigation`의 `redirect()` 사용 (서버 컴포넌트 리디렉트, 308 Permanent)
  - [x] 코드 중복 제거: 별도 activities 페이지 대신 `/news` 통합
  - [x] 빌드: `/activities` ○ Static, `/activities/[slug]` ƒ Dynamic 확인

- **기술 패턴**:
  - `redirect()` — Next.js 서버 컴포넌트에서 사용하는 308 영구 리디렉트
  - 목록 페이지는 동적 파라미터 없으므로 Static, 상세 페이지는 slug 파라미터 있으므로 Dynamic
  - 네비게이션 상수(`navigation.ts`)의 `/activities` 링크가 자동으로 `/news?category=activity`로 전환

#### 2-4-7 빌드 검증 상세

- [x] `npx tsc --noEmit` — TypeScript 에러 0건
- [x] `npm run lint` — ESLint 에러 0건 (`Docs/**` globalIgnores 추가)
- [x] `npm run build` — 프로덕션 빌드 성공 (Compiled 17.4s)
- [x] 13개 라우트 정상 생성:
  - `/` — ○ Static (ISR 1h)
  - `/about` — ○ Static
  - `/about/history` — ○ Static (ISR 1h)
  - `/about/team` — ○ Static (ISR 1h)
  - `/activities` — ○ Static (redirect)
  - `/activities/[slug]` — ƒ Dynamic (redirect)
  - `/api/auth/[...nextauth]` — ƒ Dynamic
  - `/api/og` — ƒ Dynamic (ImageResponse)
  - `/news` — ƒ Dynamic (searchParams)
  - `/news/[slug]` — ● SSG (3개 slug 정적 생성, ISR 1h)
  - `/studio/[[...tool]]` — ○ Static
- [x] `eslint.config.mjs` 수정: `Docs/**` ignore 추가 (기존 `.claude/**` 에 병합)

#### 2-4 완료 체크포인트

- [x] 뉴스 목록: 히어로 배너 + 카테고리 필터 탭 5개 + 12건 카드 그리드 + 페이지네이션
- [x] 뉴스 상세: 히어로 이미지 + PortableText 본문 + 관련 글 3건 + 목록 돌아가기
- [x] OG 이미지: `/api/og?title=&category=` 동적 이미지 생성
- [x] Activities 리디렉트: `/activities` → `/news?category=activity`, `/activities/[slug]` → `/news/[slug]`
- [x] 카테고리 필터: 전체/뉴스/활동/성명서/보도자료 URL searchParams 기반 서버사이드 필터링
- [x] SSG + ISR: `generateStaticParams` 빌드 시 정적 + `revalidate: 3600` 런타임 재검증
- [x] Framer Motion: containerVariants + stagger + useReducedMotion 접근성 대응
- [x] 다크모드: 전체 페이지 정상 전환
- [x] Sanity 미연결 상태에서 graceful fallback (빈 상태 UI)
- [x] 빌드: tsc + lint + build 에러 0건 (17.4s)

#### 2-4 생성/수정 파일 목록 (전체)

| 구분 | 파일 경로                                                | 서버/클라이언트 |
| ---- | -------------------------------------------------------- | --------------- |
| 수정 | `src/lib/constants/news.ts`                              | 공유 데이터     |
| 수정 | `src/lib/sanity/queries.ts`                              | 공유 데이터     |
| 수정 | `eslint.config.mjs`                                      | 설정 (`Docs/**` ignore 추가) |
| 신규 | `src/lib/sanity/portable-text-components.tsx`             | 공유 데이터     |
| 신규 | `src/app/(main)/news/page.tsx`                           | 서버 (async, ISR) |
| 신규 | `src/app/(main)/news/news-list-content.tsx`              | 클라이언트 (Framer Motion) |
| 신규 | `src/app/(main)/news/loading.tsx`                        | 서버            |
| 신규 | `src/app/(main)/news/[slug]/page.tsx`                    | 서버 (async, ISR, SSG) |
| 신규 | `src/app/(main)/news/[slug]/news-detail-content.tsx`     | 클라이언트 (Framer Motion, PortableText) |
| 신규 | `src/app/api/og/route.tsx`                               | API Route (ƒ Dynamic, ImageResponse) |
| 신규 | `src/app/(main)/activities/page.tsx`                     | 서버 (redirect) |
| 신규 | `src/app/(main)/activities/[slug]/page.tsx`              | 서버 (redirect, async) |

#### 2-4 기술 패턴 메모

- 서버/클라이언트 분리: 서버 page.tsx(metadata + fetch) → 클라이언트 content.tsx(Framer Motion + UI)
- Next.js 16 비동기 params: `searchParams`와 `params` 모두 `Promise` — `await` 필수
- GROQ 페이지네이션: `[$start...$end]` offset 슬라이싱 + `count()` 총 건수 병렬 fetch
- `generateStaticParams` + `revalidate` = ISR SSG (빌드 시 정적 + 런타임 재검증)
- OG 이미지: `next/og` ImageResponse (Satori 기반) → CSS-in-JS 인라인 스타일
- Activities 리디렉트: `redirect()` 308 영구 리디렉트로 코드 중복 제거
- Portable Text: `@portabletext/react` 커스텀 컴포넌트로 Tailwind 스타일링
- `buildHref()` 유틸: category/page URLSearchParams 조합으로 SEO 친화적 URL 생성

### Phase 2 전체 체크포인트

- [x] Header: 360px~1440px 반응형 정상 (2-1 완료)
- [x] Hero: 이미지 전환 + 타이핑 애니메이션 (2-2) — 4장 슬라이더 + 도트 인디케이터 + 키보드 접근성
- [x] Impact Counter: 뷰포트 진입 시 카운트업 (2-2) — useInView + rAF 카운트업 + stagger 순차 등장
- [x] 뉴스 카드: Sanity 데이터 3건 표시 (2-2) — LatestNews + NewsCard + Sanity Studio/스키마 완료
- [x] About: 소개텍스트 + 비전·목표 2열 카드 + 주요 활동 영역 4×2 그리드 + CTA 링크 (2-3)
- [x] 타임라인: 수직 중앙선 + 좌우 교대 + Framer Motion slideX fade-in (2-3)
- [x] 임원진: MemberCard 프로필 그리드 + Sanity ISR + 이니셜 폴백 (2-3)
- [x] 뉴스 목록: 카테고리 탭 5개 + 12건 페이지네이션 + NewsCard 그리드 (2-4)
- [x] 뉴스 상세: SSG + 히어로 이미지 + PortableText + 관련 글 + OG 이미지 (2-4)
- [x] OG 이미지: 동적 생성 API + peace-navy 그라데이션 (2-4)
- [x] Activities 리디렉트: `/activities` → `/news?category=activity` (2-4)
- [x] ISR: `revalidate: 3600` 적용 — `/`, `/about/history`, `/about/team`, `/news/[slug]` (2-4)
- [x] WaveDivider: 섹션 전환부 정상 렌더링 (2-1 완료)
- [x] 다크모드: 전체 컬러 전환 정상 (2-1 완료)
- [ ] Lighthouse 접근성: 90+ (Phase 4에서 측정)
- [ ] 컴포넌트 단위 테스트: Header, Footer, NewsCard 통과 (Phase 4에서 실행)

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
| Phase 2-2   | 8         | 8      | **100%** |
| Phase 2-3   | 8         | 8      | **100%** |
| Phase 2-4   | 7         | 7      | **100%** |
| Phase 3     | 6         | 0      | 0%       |
| Phase 4     | 5         | 0      | 0%       |
| **전체**    | **57**    | **46** | **81%**  |
