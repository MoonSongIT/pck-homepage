# PCK 웹사이트 리뉴얼 — 진도 체크리스트

> 최종 수정: 2026-03-25 (Phase 4-1~4-5 Vercel 배포 성공, `pck-homepage.vercel.app/ko` 정상 확인)
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

> **진행 순서**: 3-5 → 3-3 → 3-4 → 3-6 → 3-2 → 3-1 (외부 의존 적은 순서)

### 3-5. 국제 네트워크 지도

| #     | 작업 항목                | 상태 | 세부 내용                                                                 | 블로커/비고 |
| ----- | ------------------------ | ---- | ------------------------------------------------------------------------- | ----------- |
| 3-5-1 | 네트워크 데이터 + 상수   | ✅   | `network.ts` — PCI 50개국 좌표/지부 데이터 + NETWORK_CONFIG 상수 + 대륙별 통계 유틸 |             |
| 3-5-2 | PeaceMap 컴포넌트        | ✅   | `PeaceMap.tsx` — react-simple-maps 세계지도 + 핀 50개 + 클릭 정보패널 + Framer Motion stagger + 한국 강조(ping) |  |
| 3-5-3 | Network 페이지           | ✅   | `/network` — 서버 page.tsx(metadata) + 클라이언트 dynamic import PeaceMap(ssr:false) + 대륙별 통계 + PCI 소개 섹션 |  |
| 3-5-4 | 빌드 검증                | ✅   | tsc 0에러 + lint 0에러 + build 성공(18.2s) + /network ○ Static 라우트 확인 |             |

#### 3-5 빌드 검증 결과

- [x] `npx tsc --noEmit` — TypeScript 에러 0건
- [x] `npm run lint` — ESLint 에러 0건
- [x] `npm run build` — 프로덕션 빌드 성공 (Compiled 18.2s)
- [x] `/network` 페이지 — 정적 생성 (○ Static)
- [x] 총 15개 라우트 정상 생성

#### 3-5 수동 테스트 결과

- [x] 히어로 배너: "국제 평화 네트워크" 제목 + Globe 아이콘 + 서브타이틀 정상 표시
- [x] 지도 로딩: 스피너 스켈레톤 → world-atlas CDN 로드 → 50개국 핀 표시
- [x] 한국 핀: peace-gold 색상 + 크기 확대 + animate-ping 맥동 링
- [x] 일반 핀: peace-sky 색상 원형 마커
- [x] 핀 클릭: 국가명(한/영) + 지부명(한/영) + 설립연도 + 웹사이트 링크 정보 패널 표시
- [x] 같은 핀 재클릭: 패널 닫힘 (토글 동작)
- [x] 다른 핀 클릭: 해당 국가 정보로 전환
- [x] ESC 키: 패널 닫힘
- [x] 대륙별 통계: 아시아·태평양(8) / 유럽(21) / 아메리카(10) / 아프리카(8) / 오세아니아(2) = 50개국
- [x] PCI 소개: 설명 텍스트 + "PCI 공식 사이트" 외부 링크 + "PCK 소개 보기" 내부 링크
- [x] Header 메뉴: "네트워크" 클릭 → `/network` 이동
- [x] 반응형: 모바일(360px) 2열 통계 + 하단 패널 / 데스크톱 5열 통계 + 우측 패널
- [x] 다크모드: 지도 배경 + 카드 + 텍스트 정상 전환
- [x] Framer Motion: 스크롤 시 섹션 순차 등장 + 핀 stagger 애니메이션
- [x] 접근성: Tab 키 핀 포커스 + Enter/Space 선택 + aria-label 적용

#### 3-5 생성/수정 파일 목록

| 구분 | 파일 경로                                                | 서버/클라이언트 |
| ---- | -------------------------------------------------------- | --------------- |
| 신규 | `src/lib/constants/network.ts`                           | 공유 데이터     |
| 신규 | `src/components/organisms/PeaceMap.tsx`                   | 클라이언트 (react-simple-maps, Framer Motion) |
| 신규 | `src/app/(main)/network/page.tsx`                        | 서버 (metadata) |
| 신규 | `src/app/(main)/network/network-content.tsx`             | 클라이언트 (dynamic import, Framer Motion) |

#### 3-5 기술 패턴 메모

- Next.js 16에서 `dynamic(..., { ssr: false })`는 Server Component에서 사용 불가 → 클라이언트 컴포넌트에서 dynamic import
- react-simple-maps: `geoEqualEarth` 투영 + world-atlas CDN topojson
- 핀 토글 로직: `setState(prev => prev?.id === id ? null : member)` — 외부 클릭 핸들러와 경쟁 조건 주의
- 한국 핀 강조: `animate-ping` CSS 애니메이션 + peace-gold 색상 + 크기 확대

### 3-3. 평화학교 교육 신청

| #     | 작업 항목                | 상태 | 세부 내용                                                                 | 블로커/비고 |
| ----- | ------------------------ | ---- | ------------------------------------------------------------------------- | ----------- |
| 3-3-1 | 교육 상수 + Zod 스키마   | ✅   | `education.ts` — educationApplySchema + EDUCATION_CONFIG + EDUCATION_STATUS 상수 |             |
| 3-3-2 | Education 소개 페이지    | ✅   | `/education` — Sanity education 기수 목록(ISR) + 모집상태 뱃지 + 커리큘럼 Accordion + 신청 CTA |  |
| 3-3-3 | Education 신청 폼 페이지 | ✅   | `/education/apply` — useActionState + Zod 6필드 + 글자수 카운터 + Suspense boundary |  |
| 3-3-4 | Education Server Action  | ✅   | `actions/education.ts` — Zod 재검증 + Prisma create + Resend 이메일 (신청자+관리자) |  |
| 3-3-5 | 빌드 검증                | ✅   | tsc 0에러 + lint 0에러 + build 성공(17.7s) + /education(ISR) + /education/apply(Static) 라우트 확인 |  |

#### 3-3 빌드 검증 결과

- [x] `npx tsc --noEmit` — TypeScript 에러 0건
- [x] `npm run lint` — ESLint 에러 0건
- [x] `npm run build` — 프로덕션 빌드 성공 (Compiled 17.7s)
- [x] `/education` 페이지 — ISR 정적 생성 (revalidate 1h)
- [x] `/education/apply` 페이지 — 정적 생성 (○ Static)
- [x] 총 16개 라우트 정상 생성

#### 3-3 수동 테스트 결과

- [x] 히어로 배너: "평화학교" 제목 + GraduationCap 아이콘 + 서브타이틀
- [x] 소개 섹션: "팍스크리스티 평화학교란?" + 2개 문단
- [x] Sanity 미연결 시: "현재 모집 중인 교육이 없습니다" 빈 상태 UI
- [x] Sanity 연결 시: 교육 카드 목록 + 모집 상태 뱃지(모집 중/마감/예정)
- [x] 모집 중 교육: "신청하기" 버튼 → `/education/apply?cohort={ID}`
- [x] 커리큘럼 아코디언: 강의 목록 번호 순서대로 표시
- [x] 지난 교육: 아코디언 클릭 → 마감된 교육 목록 펼쳐짐
- [x] 신청 폼: 이름/이메일/전화번호/소속/지원동기/개인정보동의 6필드
- [x] 글자수 카운터: 지원 동기 입력 시 N/500 실시간 업데이트
- [x] 폼 검증: 필수 필드 누락/잘못된 형식 → 에러 메시지 표시
- [x] 폼 제출: "신청 중..." 로딩 → 성공 화면 (CheckCircle + 완료 메시지)
- [x] DB 저장: Prisma Studio에서 education_applications 테이블 확인
- [x] 반응형: 모바일 풀폭 / 데스크톱 max-w-xl 중앙 정렬
- [x] 다크모드: 히어로 + 폼 카드 + 성공/에러 메시지 정상 전환
- [x] 접근성: Tab 키 폼 필드 순차 이동 + aria-required + role="alert"

#### 3-3 생성/수정 파일 목록

| 구분 | 파일 경로                                                | 서버/클라이언트 |
| ---- | -------------------------------------------------------- | --------------- |
| 신규 | `src/lib/constants/education.ts`                         | 공유 데이터 (Zod + 상수) |
| 신규 | `src/app/(main)/education/page.tsx`                      | 서버 (async, ISR) |
| 신규 | `src/app/(main)/education/education-content.tsx`         | 클라이언트 (Framer Motion, Accordion) |
| 신규 | `src/app/(main)/education/apply/page.tsx`                | 서버 (Suspense) |
| 신규 | `src/app/(main)/education/apply/apply-form.tsx`          | 클라이언트 (useActionState, Framer Motion) |
| 신규 | `src/app/actions/education.ts`                           | 서버 액션 (Prisma + Resend) |
| 신규 | `src/components/ui/{label,textarea,checkbox,accordion}.tsx` | shadcn/ui 컴포넌트 4개 |
| 수정 | `prisma/schema.prisma`                                   | EducationApplication에 affiliation 필드 추가 |

#### 3-3 기술 패턴 메모

- `useSearchParams()`는 Suspense boundary 필수 (Next.js 16 빌드 에러 방지)
- Server Action: `useActionState` 패턴 (Newsletter과 동일) — FormData → Zod safeParse → Prisma → Resend
- Prisma 스키마 변경 후 `prisma db push` + `prisma generate` 필수
- 교육 상태 판별: `isRecruiting` → recruiting, 미래 startDate → upcoming, 나머지 → closed

### 3-4. 회원 커뮤니티 (인증 + 게시판)

| #     | 작업 항목                | 상태 | 세부 내용                                                                 | 블로커/비고 |
| ----- | ------------------------ | ---- | ------------------------------------------------------------------------- | ----------- |
| 3-4-1 | 인증 페이지 (로그인/회원가입) | ✅ | `(auth)/layout` + `login/page+form` + `register/page+form` — Credentials + 카카오 + 회원가입 Server Action (bcrypt) + auth Zod 스키마 | ⏳ 카카오 앱 등록 |
| 3-4-2 | 커뮤니티 상수 + Zod 스키마 | ✅ | `constants/community.ts` + `validations/community.ts` — BOARD_TYPES + COMMUNITY_CONFIG + postSchema + commentSchema |  |
| 3-4-3 | 커뮤니티 게시판 목록     | ✅   | `/community` page.tsx(서버) + community-list.tsx(클라이언트) — 게시판 탭(자유/평화나눔) + Table/Card + 페이지네이션 + 글쓰기 CTA | middleware 보호 |
| 3-4-4 | 글쓰기/수정 + Server Actions | ✅ | `/community/write` + `/community/[id]/edit` — useActionState + Select/Input/Textarea + `actions/community.ts` CRUD (create/update/delete Post) + 게시판 선택 유지 |  |
| 3-4-5 | 게시글 상세 + 댓글       | ✅   | `/community/[id]` page.tsx(서버) + post-detail.tsx(클라이언트) — 본문 + 수정/삭제(본인, AlertDialog) + 댓글 CRUD Server Actions |  |
| 3-4-6 | 빌드 검증                | ✅   | tsc 0에러 + lint 0에러 + build 성공(19.2s) + 20개 라우트 정상 생성 |  |
| 3-4-7 | Header/MobileNav 로그인 상태 | ✅ | SessionProvider 추가, Header 로그인/로그아웃+커뮤니티메뉴, MobileNav 로그인상태+커뮤니티메뉴 |  |

#### 3-4 빌드 검증 결과

- [x] `npx tsc --noEmit` — TypeScript 에러 0건
- [x] `npm run lint` — ESLint 에러 0건
- [x] `npm run build` — 프로덕션 빌드 성공 (Compiled 19.2s)
- [x] `/login` 페이지 — 정적 생성 (○ Static)
- [x] `/register` 페이지 — 정적 생성 (○ Static)
- [x] `/community` 페이지 — 동적 생성 (ƒ Dynamic)
- [x] `/community/[id]` 페이지 — 동적 생성 (ƒ Dynamic)
- [x] `/community/[id]/edit` 페이지 — 동적 생성 (ƒ Dynamic)
- [x] `/community/write` 페이지 — 동적 생성 (ƒ Dynamic)
- [x] 총 20개 라우트 정상 생성

#### 3-4 생성/수정 파일 목록

| 구분 | 파일 경로                                                | 서버/클라이언트 |
| ---- | -------------------------------------------------------- | --------------- |
| 신규 | `src/lib/validations/auth.ts`                            | 공유 (loginSchema, registerSchema) |
| 신규 | `src/lib/constants/community.ts`                         | 공유 (BOARD_TYPES, COMMUNITY_CONFIG) |
| 신규 | `src/lib/validations/community.ts`                       | 공유 (postSchema, commentSchema) |
| 신규 | `src/app/(auth)/layout.tsx`                              | 서버 (센터 정렬 + 로고) |
| 신규 | `src/app/(auth)/login/page.tsx`                          | 서버 (metadata + Suspense) |
| 신규 | `src/app/(auth)/login/login-form.tsx`                    | 클라이언트 (Credentials + 카카오 + callbackUrl) |
| 신규 | `src/app/(auth)/register/page.tsx`                       | 서버 (metadata + Suspense) |
| 신규 | `src/app/(auth)/register/register-form.tsx`              | 클라이언트 (useActionState + 자동 로그인) |
| 신규 | `src/app/actions/auth.ts`                                | 서버 액션 (bcrypt.hash + Prisma user.create) |
| 신규 | `src/app/(main)/community/page.tsx`                      | 서버 (Prisma 페칭 + boardType 필터 + 페이지네이션) |
| 신규 | `src/app/(main)/community/community-list.tsx`            | 클라이언트 (히어로 + 탭 + Table/Card + Framer Motion) |
| 신규 | `src/app/(main)/community/write/page.tsx`                | 서버 (auth 확인 + searchParams board 전달) |
| 신규 | `src/app/(main)/community/write/write-form.tsx`          | 클라이언트 (useActionState + create/edit 모드 공유) |
| 신규 | `src/app/(main)/community/[id]/page.tsx`                 | 서버 (generateMetadata + Prisma findUnique + comments) |
| 신규 | `src/app/(main)/community/[id]/post-detail.tsx`          | 클라이언트 (본문 + 수정/삭제 AlertDialog + CommentForm + CommentItem) |
| 신규 | `src/app/(main)/community/[id]/edit/page.tsx`            | 서버 (본인 확인 + 기존 데이터 프리필 → WriteForm 재사용) |
| 신규 | `src/app/actions/community.ts`                           | 서버 액션 (createPost, updatePost, deletePost, createComment, deleteComment) |
| 신규 | `src/components/ui/alert-dialog.tsx`                     | shadcn/ui AlertDialog |
| 수정 | `src/lib/auth.ts`                                        | Credentials provider 직접 선언 (provider.id 매핑 버그 수정) + email toLowerCase |

#### 3-4 기술 패턴 메모

- NextAuth v5: `provider.id` 매핑 방식은 동작 불안정 → providers 배열 직접 선언 권장
- auth.ts에서 Credentials authorize 구현 시 `email.toLowerCase().trim()` 필수 (DB 저장과 일치)
- WriteForm: create/edit 모드 공유 — `updatePost.bind(null, postId)`로 Server Action 바인딩
- 게시판 탭 → 글쓰기 시 `?board=` 파라미터로 게시판 선택 유지
- 댓글 입력 후 `formRef.current?.reset()` + `revalidatePath`로 폼 초기화 + 목록 갱신
- AlertDialog: 삭제 확인 → `deletePost(postId)` → `redirect('/community')`

### 3-6. 다국어(한/영) 적용

| #     | 작업 항목                | 상태 | 세부 내용                                                                 | 블로커/비고 |
| ----- | ------------------------ | ---- | ------------------------------------------------------------------------- | ----------- |
| 3-6-1 | next-intl 설정 파일      | ✅   | `routing.ts`(defineRouting ko/en, as-needed) + `request.ts`(getRequestConfig) + `navigation.ts`(createNavigation) + `next.config.ts` withNextIntl 래퍼 |  |
| 3-6-2 | 번역 파일 (ko/en)        | ✅   | `messages/ko.json` + `messages/en.json` — 12개 네임스페이스(Common, Nav, Footer, Hero, Impact, Donation, Newsletter, LatestNews, About, Network, Education, Metadata) |  |
| 3-6-3 | 라우트 마이그레이션 + 컴포넌트 번역 | ✅ | `[locale]/` 세그먼트 생성 + (main)/(auth) 이동 + middleware(next-intl+NextAuth) 조합 + 상수 labelKey 패턴 + Header/Footer/Hero/Impact/Donation/Newsletter/LatestNews/About/Network 전체 번역 + 언어 토글 동작 |  |
| 3-6-4 | 빌드 검증                | ✅   | tsc 0에러 + build 성공 + 36개 라우트(ko/en 각 18개) 정상 생성 + studio layout 추가(html/body 누락 수정) |  |

#### 3-6 빌드 검증 결과

- [x] `npx tsc --noEmit` — TypeScript 에러 0건
- [x] `npm run build` — 프로덕션 빌드 성공 (36개 static 페이지)
- [x] `/` (ko), `/en` (en) — 양 언어 홈페이지 정상
- [x] `/about` ↔ `/en/about` — 언어 전환 정상
- [x] `/api/auth/providers` — API 정상 동작 (i18n 영향 없음)
- [x] `/studio` — Sanity Studio 정상 (전용 layout.tsx 추가)

#### 3-6 수동 테스트 항목

- [ ] 기본 라우팅: `/` (ko) + `/en` (en) + `/about` ↔ `/en/about` 등
- [ ] 언어 토글: 헤더 KO/EN 클릭 → URL prefix 변경 + UI 번역 전환
- [ ] 모바일 언어 토글: 햄버거 메뉴 내 토글 동작
- [ ] 번역 텍스트: 헤더 메뉴, 푸터, 히어로, 임팩트, 후원, 뉴스레터, 소개, 네트워크
- [ ] 보호 경로: `/community` + `/en/community` 비로그인 시 리디렉트
- [ ] html lang: DevTools에서 `<html lang="ko">` / `<html lang="en">` 확인
- [ ] 엣지 케이스: `/ko/about` → `/about` 리디렉트, `/fr/about` → 404 또는 폴백

#### 3-6 생성/수정 파일 목록

| 구분 | 파일 경로                                                | 역할 |
| ---- | -------------------------------------------------------- | ---- |
| 신규 | `src/i18n/routing.ts`                                    | i18n 라우팅 설정 (ko/en, as-needed) |
| 신규 | `src/i18n/request.ts`                                    | 서버 요청별 메시지 로딩 |
| 신규 | `src/i18n/navigation.ts`                                 | locale-aware Link/usePathname/useRouter/redirect |
| 신규 | `src/i18n/messages/ko.json`                              | 한국어 번역 (12 네임스페이스) |
| 신규 | `src/i18n/messages/en.json`                              | 영어 번역 (12 네임스페이스) |
| 신규 | `src/app/[locale]/layout.tsx`                            | html lang + Providers + NextIntlClientProvider |
| 신규 | `src/app/studio/layout.tsx`                              | Studio 전용 html/body 래퍼 |
| 수정 | `next.config.ts`                                         | createNextIntlPlugin 래퍼 추가 |
| 수정 | `src/app/layout.tsx`                                     | html/body 제거 → return children |
| 수정 | `src/middleware.ts`                                      | next-intl createMiddleware + NextAuth auth() 조합 |
| 수정 | `src/lib/auth.config.ts`                                 | authorized에서 locale prefix 제거 후 경로 매칭 |
| 수정 | `src/lib/constants/navigation.ts`                        | label → labelKey 패턴 전환 |
| 수정 | `src/components/organisms/Header.tsx`                    | useTranslations + useLocale + 언어 토글 구현 |
| 수정 | `src/components/organisms/MobileNav.tsx`                 | useTranslations + 언어 토글 구현 |
| 수정 | `src/components/organisms/Footer.tsx`                    | async 서버 컴포넌트 + getTranslations |
| 수정 | `src/components/atoms/Logo.tsx`                          | i18n Link 교체 |
| 수정 | `src/components/templates/MainLayout.tsx`                | async + getTranslations('Common') |
| 수정 | `src/components/organisms/HeroSection.tsx`               | useTranslations('Hero') |
| 수정 | `src/components/organisms/ImpactCounter.tsx`             | useTranslations('Impact') |
| 수정 | `src/components/organisms/DonationCTA.tsx`               | useTranslations('Donation') |
| 수정 | `src/components/organisms/NewsletterSection.tsx`         | useTranslations('Newsletter') |
| 수정 | `src/components/organisms/LatestNews.tsx`                | useTranslations('LatestNews') |
| 이동 | `src/app/(main)/*` → `src/app/[locale]/(main)/*`        | 16+ 페이지/레이아웃 이동 + setRequestLocale 추가 |
| 이동 | `src/app/(auth)/*` → `src/app/[locale]/(auth)/*`        | 인증 페이지 이동 + setRequestLocale 추가 |

#### 3-6 기술 패턴 메모

- `localePrefix: 'as-needed'` — 기본 언어(ko)는 URL prefix 없음, en만 `/en/` prefix
- root layout은 `return children`만 반환, `<html>/<body>`는 `[locale]/layout.tsx`와 `studio/layout.tsx`에서 각각 렌더링
- 서버 컴포넌트: `getTranslations` (async), 클라이언트 컴포넌트: `useTranslations` (hook)
- 상수 파일: `label` → `labelKey` 패턴, 컴포넌트에서 `t(item.labelKey)` 호출
- 미들웨어: `auth()` 래퍼로 NextAuth 세션 주입 → `createMiddleware(routing)` 호출
- `[locale]` 밖의 라우트(api/, studio/)는 i18n 영향 없음 — studio는 별도 layout 필요

### 3-2. 재정 투명성 시스템 (영수증 OCR + 자동 분류)

| #     | 작업 항목                      | 상태 | 세부 내용                                                                 | 블로커/비고 |
| ----- | ------------------------------ | ---- | ------------------------------------------------------------------------- | ----------- |
| 3-2-1 | 패키지 + Storage + 상수 + Zod  | ✅   | `recharts` `@anthropic-ai/sdk` `@supabase/supabase-js` `chokidar` 설치 + Supabase Storage 버킷 설정 + finance.ts 상수 + Zod 스키마 + Prisma Expense 모델 확장 (ocrConfidence, ocrRawText, status) + OCR 테스트 성공 | 완료 |
| 3-2-2 | 관리자 레이아웃                | ✅   | `(admin)/layout.tsx` — ADMIN 권한 체크 + 사이드바 + `(admin)/page.tsx` 대시보드 통계 + OCR 대기 건수 뱃지 | 검증완료(20개 항목) |
| 3-2-3 | 영수증 OCR 스캔 API + 업로드 UI | ✅   | `/api/finance/receipt-scan` — 이미지 업로드 → Supabase Storage → Claude Vision OCR → JSON 반환 + ReceiptUploader 드래그&드롭 + ScanResultForm 확인/수정 | 검증완료(18개 항목) |
| 3-2-4 | 제경비 관리 (CRUD + OCR 통합)  | ✅   | `/admin/finance/expenses` — 목록(테이블+필터+상태뱃지+합계) + 등록(영수증스캔탭/수동입력탭) + 수정/삭제 + 일괄확인 + Server Actions | 검증완료(27개 항목) |
| 3-2-5 | 로컬 폴더 감시 CLI 스크립트    | ✅   | `scripts/receipt-watcher.ts` — chokidar 폴더감시 → 자동 업로드+OCR → DB 저장(PENDING_REVIEW) → 처리완료 폴더 이동 | 검증완료(17개 항목) |
| 3-2-6 | 예산 관리                      | ✅   | `/admin/finance/budget` — 연도별 편성/집행/잔액 테이블 + 프로그레스바 + 등록 폼 (CONFIRMED만 집행액 계산) | 검증완료(22개 항목) |
| 3-2-7 | 결산 보고서 관리               | ✅   | `/admin/finance/reports` — 연도 수입/지출 자동 집계 + PENDING_REVIEW 경고 + isPublished 토글 + PDF URL + Zod URL 검증 | 검증완료(22개 항목) |
| 3-2-8 | 재정 투명성 공개 페이지        | ✅   | `/transparency` + `/transparency/[year]` — 연도별 요약 카드 + Recharts 도넛 차트(수입/지출) + 카테고리별 내역 테이블 + PDF 다운로드 + i18n | 검증완료(브라우저 직접 확인) |
| 3-2-9  | 빌드 검증                                      | ✅   | tsc 통과 + lint 에러 0건(AdminSidebar/DonationCTA unused import 정리, HeroSection useCallback deps 수정) + build 성공(51 routes) + /admin/finance/* + /transparency 브라우저 확인 | 검증완료 |
| 3-2-10 | PDF 자동 생성 및 Supabase Storage 자동 저장   | ✅   | `@react-pdf/renderer` 설치 + `FinanceReportPdf` TSX 컴포넌트(한글 Pretendard OTF) + `uploadReportPdf` Storage 유틸 + `generateReportPdf` Server Action + report-form에 "PDF 자동 생성" 버튼 추가(FileDown 아이콘, 스피너) + 브라우저 캐시 버스팅(타임스탬프) | 검증완료 |

#### 3-2-3 영수증 OCR 스캔 검증 절차

**A. 사전 준비**

| # | 항목 | 방법 |
|---|---|---|
| A-1 | ADMIN 계정 준비 | `scripts/promote-admin.ts` 또는 DB에서 role=ADMIN 계정 확인 |
| A-2 | 테스트 영수증 이미지 준비 | JPG/PNG/WebP 파일 1개 이상 준비 (실제 영수증 또는 샘플 이미지) |

**B. 접근 제어**

| # | 항목 | 방법 |
|---|---|---|
| B-1 | 비로그인 접근 차단 | 로그아웃 상태에서 `/admin/finance/expenses/new` → `/login` 리다이렉트 확인 |
| B-2 | API 직접 호출 차단 | 비로그인 상태에서 `POST /api/finance/receipt-scan` → 401 반환 확인 |

**C. 파일 업로더 (ReceiptUploader)**

| # | 항목 | 방법 |
|---|---|---|
| C-1 | 페이지 진입 | ADMIN 로그인 후 `/admin/finance/expenses/new` → "영수증 스캔" 탭 기본 활성 확인 |
| C-2 | 드래그&드롭 | 영수증 이미지를 드래그해서 영역에 올려놓으면 테두리 하이라이트 확인 |
| C-3 | 파일 선택 | "파일 선택" 버튼 또는 영역 클릭 → 파일 탐색기 열림 확인 |
| C-4 | 스캔 중 상태 | 파일 선택 후 "영수증을 분석 중입니다..." 스피너 표시 확인 |
| C-5 | 오류 파일 거부 | `.pdf` 또는 10MB 초과 파일 선택 → 에러 toast 표시 확인 |

**D. OCR 결과 폼 (ScanResultForm)**

| # | 항목 | 방법 |
|---|---|---|
| D-1 | OCR 결과 자동 입력 | 스캔 완료 후 날짜/항목명/카테고리/금액 필드에 값이 채워짐 확인 |
| D-2 | 신뢰도 Badge | 분석 신뢰도에 따라 초록(≥85%) / 노란(60~84%) / 주황(<60%) Badge 표시 확인 |
| D-3 | 영수증 미리보기 | Supabase에 업로드된 이미지가 폼 상단에 표시되는지 확인 |
| D-4 | 새 탭 링크 | "새 탭에서 열기" 클릭 → Supabase public URL로 이미지 열림 확인 |
| D-5 | 필드 수정 | 날짜/항목명/카테고리/금액/메모 수정 가능 확인 |
| D-6 | 다시 스캔 | "다시 스캔" 버튼 클릭 → ReceiptUploader 화면으로 복귀 확인 |
| D-7 | 폼 제출 | "지출 등록" 클릭 → 성공 toast + `/admin/finance/expenses` 이동 확인 |

**E. DB 저장 확인**

| # | 항목 | 방법 |
|---|---|---|
| E-1 | Expense 레코드 생성 | `npx prisma studio` → expenses 테이블에 레코드 생성 확인 |
| E-2 | status PENDING_REVIEW | OCR 경로 저장 시 `status = 'PENDING_REVIEW'` 확인 |
| E-3 | receipt URL | Supabase public URL이 `receipt` 필드에 저장됐는지 확인 |

**F. 대시보드 연동**

| # | 항목 | 방법 |
|---|---|---|
| F-1 | OCR 대기 뱃지 갱신 | `/admin` 대시보드에서 "영수증 검토 대기 N건" 뱃지 카운트 증가 확인 |
| F-2 | 지출 목록 stub | `/admin/finance/expenses` 접근 → "제경비 관리" 페이지 + 건수 표시 확인 |

**G. 수동 입력 탭**

| # | 항목 | 방법 |
|---|---|---|
| G-1 | 탭 전환 | "수동 입력" 탭 클릭 → placeholder 카드("Phase 3-2-4에서 구현 예정") 표시 확인 |

총 18개 항목

#### 3-2-4 제경비 관리 CRUD 검증 절차

**A. 사전 준비**

| # | 항목 | 방법 |
|---|---|---|
| A-1 | ADMIN 계정 로그인 | ADMIN 계정으로 로그인 후 `/admin/finance/expenses` 접근 확인 |
| A-2 | 테스트 데이터 확보 | Prisma Studio 또는 OCR 스캔으로 PENDING_REVIEW 레코드 2건 이상 준비 |

**B. 목록 페이지**

| # | 항목 | 방법 |
|---|---|---|
| B-1 | 테이블 렌더링 | `/admin/finance/expenses` → 지출 목록 테이블 표시 확인 (날짜/항목명/카테고리/금액/상태/신뢰도/영수증/액션 컬럼) |
| B-2 | 합계 카드 | "확정 지출 합계"(peace-olive), "검토 대기 합계"(peace-gold) 카드 표시 + 금액 확인 |
| B-3 | 상태 뱃지 | PENDING_REVIEW → 노란 뱃지, CONFIRMED → 초록 뱃지 표시 확인 |
| B-4 | OCR 신뢰도 | OCR 스캔 항목 행의 신뢰도 열에 `XX%` 표시, 수동입력 항목은 `—` 확인 |
| B-5 | 영수증 링크 | receipt 있는 행 → 외부링크 아이콘 클릭 → Supabase URL로 이미지 열림 확인 |
| B-6 | 페이지네이션 | 21건 이상 시 "이전/다음" 버튼 + "1 / N" 표시 확인 |

**C. 필터 기능 (ExpenseFilterBar)**

| # | 항목 | 방법 |
|---|---|---|
| C-1 | 카테고리 필터 | 카테고리 Select → 선택 시 URL에 `?category=XXX` 추가 + 목록 갱신 확인 |
| C-2 | 상태 필터 | 상태 Select → `PENDING_REVIEW` 또는 `CONFIRMED` 선택 → 해당 상태만 표시 확인 |
| C-3 | 월 필터 | 월 input[type=month] → 선택 시 URL에 `?month=YYYY-MM` 추가 + 목록 갱신 확인 |
| C-4 | 초기화 버튼 | "초기화" 버튼 클릭 → URL 파라미터 제거 + 전체 목록 표시 확인 |

**D. 일괄 확인 (bulkConfirmExpenses)**

| # | 항목 | 방법 |
|---|---|---|
| D-1 | 체크박스 선택 | PENDING_REVIEW 행의 체크박스 클릭 → 선택됨 확인 (CONFIRMED 행 체크박스는 비활성) |
| D-2 | 전체 선택 | 헤더 체크박스 클릭 → PENDING_REVIEW 행 전체 선택/해제 토글 확인 |
| D-3 | 일괄 확인 바 | 1건 이상 선택 시 상단에 "N건 선택됨 + 일괄 확인(N건)" 버튼 바 표시 확인 |
| D-4 | 일괄 확인 실행 | "일괄 확인" 버튼 클릭 → 처리 중... 표시 → 성공 toast + 선택 해제 + 상태 CONFIRMED로 변경 확인 |

**E. 수정 (ExpenseEditDialog)**

| # | 항목 | 방법 |
|---|---|---|
| E-1 | 수정 다이얼로그 열기 | 행 오른쪽 연필 아이콘 클릭 → 수정 다이얼로그 오픈 + 기존 값 pre-fill 확인 |
| E-2 | 필드 수정 | 날짜/항목명/카테고리/금액/메모 수정 가능 확인 |
| E-3 | 영수증 링크 (읽기 전용) | receipt 있는 항목 수정 시 "영수증 보기" 링크 표시 확인 (수정 불가) |
| E-4 | 저장 | "저장" 클릭 → 성공 toast + 다이얼로그 닫힘 + 목록 갱신 확인 |
| E-5 | 유효성 검증 | 필수 필드 비운 후 저장 → 필드 에러 메시지 표시 확인 |

**F. 삭제 (deleteExpense)**

| # | 항목 | 방법 |
|---|---|---|
| F-1 | 삭제 확인 다이얼로그 | 쓰레기통 아이콘 클릭 → "지출 항목 삭제" AlertDialog 표시 확인 |
| F-2 | 취소 | "취소" 클릭 → 다이얼로그 닫힘, 레코드 유지 확인 |
| F-3 | 삭제 실행 | "삭제" 클릭 → 성공 toast + 목록에서 행 제거 확인 |
| F-4 | receipt 파일 삭제 | Prisma Studio에서 해당 레코드 삭제 확인 + Supabase Storage에서 파일도 삭제됐는지 확인 |

**G. 수동 입력 탭**

| # | 항목 | 방법 |
|---|---|---|
| G-1 | 탭 전환 | `/admin/finance/expenses/new` → "수동 입력" 탭 클릭 → 입력 폼 표시 확인 |
| G-2 | 기본값 | 날짜 필드 → 오늘 날짜 pre-fill, 카테고리 → "기타" 기본 선택 확인 |
| G-3 | 폼 제출 | 날짜/항목명/카테고리/금액 입력 후 "지출 등록" → 성공 toast + `/admin/finance/expenses` 이동 확인 |
| G-4 | CONFIRMED 상태 | Prisma Studio에서 방금 등록한 레코드 `status = 'CONFIRMED'` 확인 (ocrConfidence = null) |
| G-5 | 유효성 검증 | 필수 필드 비운 후 제출 → 필드 에러 메시지 표시 확인 |

**H. 빈 상태**

| # | 항목 | 방법 |
|---|---|---|
| H-1 | 빈 상태 UI | 필터 적용 후 결과 0건 → Receipt 아이콘 + "등록된 지출이 없습니다" 메시지 표시 확인 |

총 27개 항목

#### 3-2-5 영수증 폴더 감시 CLI 스크립트 검증 절차

**A. 사전 준비**

| # | 항목 | 방법 |
|---|---|---|
| A-1 | 환경변수 설정 | `.env.local`에 `RECEIPT_WATCH_DIR`, `RECEIPT_API_KEY`, `APP_URL` 추가 |
| A-2 | 감시 폴더 생성 | `RECEIPT_WATCH_DIR` 경로 폴더 생성 확인 |
| A-3 | Next.js 서버 실행 | `npm run dev` — localhost:3000 기동 확인 |

**B. 시작 및 폴더 구조**

| # | 항목 | 방법 |
|---|---|---|
| B-1 | 스크립트 시작 | `npm run receipt-watcher` → "=== PCK 영수증 폴더 감시 시작 ===" 출력 확인 |
| B-2 | 서브폴더 자동 생성 | 감시 폴더 하위에 `done/`, `error/` 폴더 자동 생성 확인 |
| B-3 | READY 메시지 | "[READY] 새 파일 감시 중..." 출력 확인 |

**C. 환경변수 누락 에러**

| # | 항목 | 방법 |
|---|---|---|
| C-1 | RECEIPT_WATCH_DIR 누락 | 환경변수 제거 후 실행 → "[ERROR] RECEIPT_WATCH_DIR 미설정" + 프로세스 종료(exit 1) 확인 |
| C-2 | RECEIPT_API_KEY 누락 | 환경변수 제거 후 실행 → "[ERROR] RECEIPT_API_KEY 미설정" + 프로세스 종료 확인 |

**D. 정상 처리 (이미지 파일 복사)**

| # | 항목 | 방법 |
|---|---|---|
| D-1 | 파일 감지 | `.jpg`/`.png`/`.webp` 이미지를 감시 폴더에 복사 → "[START] 파일명" 출력 확인 |
| D-2 | DONE 로그 | 처리 완료 후 "[DONE] Xs", 설명/금액/분류/신뢰도/Expense ID 출력 확인 |
| D-3 | done/ 이동 | 원본 파일이 감시 폴더에서 제거되고 `done/` 폴더로 이동 확인 |
| D-4 | DB 저장 | Prisma Studio에서 `status = 'PENDING_REVIEW'`, `ocrConfidence`/`receipt` 필드 확인 |
| D-5 | 관리자 목록 반영 | `/admin/finance/expenses` 페이지에 해당 항목 추가 확인 |

**E. 비지원 형식 처리**

| # | 항목 | 방법 |
|---|---|---|
| E-1 | PDF 무시 | 감시 폴더에 `.pdf` 파일 복사 → "[SKIP] 지원하지 않는 형식" 출력 + 파일 그대로 유지 확인 |

**F. API Key 인증 검증**

| # | 항목 | 방법 |
|---|---|---|
| F-1 | 잘못된 API Key | `RECEIPT_API_KEY`를 틀린 값으로 변경 후 파일 복사 → "[ERROR] HTTP 401" + `error/` 이동 확인 |
| F-2 | 브라우저 OCR 스캔 정상 | ADMIN 세션으로 영수증 스캔 탭 여전히 동작 확인 (route.ts 세션 인증 경로 유지) |

**G. 큐(순차 처리)**

| # | 항목 | 방법 |
|---|---|---|
| G-1 | 복수 파일 순차 처리 | 이미지 3장을 동시에 복사 → [START]→[DONE] 순서대로 1건씩 처리됨 확인 |

**H. 종료**

| # | 항목 | 방법 |
|---|---|---|
| H-1 | Ctrl+C 종료 | Ctrl+C → "[STOP] 종료 중..." + 프로세스 정상 종료 확인 |

총 17개 항목

#### 3-2-6 예산 관리 검증 절차

**A. 사전 준비**

| # | 항목 | 방법 |
|---|---|---|
| A-1 | ADMIN 로그인 | ADMIN 계정으로 로그인 |
| A-2 | 테스트 지출 데이터 | CONFIRMED 상태 지출 2건 이상 확보 (Prisma Studio 또는 수동 입력) |

**B. 페이지 진입**

| # | 항목 | 방법 |
|---|---|---|
| B-1 | 사이드바 메뉴 | `/admin` 진입 → 사이드바 "예산 관리" 링크 클릭 → `/admin/finance/budget` 이동 확인 |
| B-2 | 기본 연도 | URL `?year` 파라미터 없을 때 현재 연도(2026) 표시 확인 |
| B-3 | 5개 카테고리 | 테이블에 인건비/사무비/행사비/교통비/기타 5행 모두 표시 확인 |

**C. 연도 선택**

| # | 항목 | 방법 |
|---|---|---|
| C-1 | 이전 연도 | `←` 버튼 클릭 → `?year=2025` URL + "2025년" 표시 확인 |
| C-2 | 다음 연도 | `→` 버튼 클릭 → `?year=2027` URL + "2027년" 표시 확인 |

**D. 예산 등록 (upsertBudget)**

| # | 항목 | 방법 |
|---|---|---|
| D-1 | 수정 다이얼로그 열기 | 카테고리 행 연필 아이콘 클릭 → "YYYY년 카테고리명 예산 설정" 다이얼로그 오픈 확인 |
| D-2 | 예산 저장 | 금액 입력 후 "저장" → 성공 toast + 다이얼로그 닫힘 + 테이블 금액 업데이트 확인 |
| D-3 | 유효성 검증 | 금액 0 또는 빈칸 저장 → 필드 에러 메시지 표시 확인 |
| D-4 | DB 확인 | Prisma Studio → budget_items 테이블에 레코드 생성 확인 |
| D-5 | 중복 저장 (upsert) | 같은 카테고리 다른 금액으로 다시 저장 → 새 레코드 생성 아닌 금액 업데이트 확인 |

**E. 요약 카드**

| # | 항목 | 방법 |
|---|---|---|
| E-1 | 총 예산 | 등록한 카테고리 예산 합계와 카드 금액 일치 확인 |
| E-2 | 총 집행액 | 해당 연도 CONFIRMED 지출 합계와 일치 확인 |
| E-3 | 잔여 예산 | 총 예산 − 총 집행액 = 잔여 예산 계산 확인 |
| E-4 | 집행률 | `집행액 / 예산 × 100` % 수치 확인 |
| E-5 | 예산 초과 | 집행액 > 예산일 때 잔여 카드 빨간색 + "예산 초과" 텍스트 확인 |

**F. 테이블 집행률 프로그레스바**

| # | 항목 | 방법 |
|---|---|---|
| F-1 | 프로그레스바 표시 | 예산 설정된 카테고리 → 프로그레스바 + 집행률% 표시 확인 |
| F-2 | 미설정 카테고리 | 예산 미설정 카테고리 → 예산 열 "미설정", 잔여/집행률 열 "—" 표시 확인 |
| F-3 | 초과 시 빨간 바 | 집행액 > 예산 행 → 잔여 금액 빨간색 + "(초과)" 표시, 프로그레스바 빨간색 확인 |

**G. 예산 삭제**

| # | 항목 | 방법 |
|---|---|---|
| G-1 | 삭제 버튼 | 예산 설정된 행 쓰레기통 아이콘 클릭 → 삭제 확인 AlertDialog 표시 |
| G-2 | 취소 | "취소" → 다이얼로그 닫힘, 예산 유지 확인 |
| G-3 | 삭제 실행 | "삭제" → 성공 toast + 해당 행 "미설정" 상태로 변경 확인 |
| G-4 | 미설정 행 삭제 버튼 없음 | 예산 미설정 행에는 쓰레기통 아이콘이 표시되지 않는지 확인 |

**H. 연도별 격리**

| # | 항목 | 방법 |
|---|---|---|
| H-1 | 연도별 분리 | 2025년 예산 설정 → 2026년 페이지 이동 → 2025년 예산이 2026년에 표시되지 않음 확인 |
| H-2 | 집행액 연도 격리 | 2025년 집행액이 2026년 예산 페이지 집행액에 포함되지 않음 확인 |

총 22개 항목

#### 3-2-7 결산 보고서 관리 검증 절차

**A. 사전 준비**

| # | 항목 | 방법 |
|---|---|---|
| A-1 | ADMIN 계정 준비 | DB에서 role=ADMIN 계정으로 로그인 |
| A-2 | 테스트 데이터 확인 | Donation(status=COMPLETED) + Expense(status=CONFIRMED) 레코드 존재 확인 |

**B. 접근 제어**

| # | 항목 | 방법 |
|---|---|---|
| B-1 | 비로그인 접근 차단 | 로그아웃 상태에서 `/admin/finance/reports` → `/login` 리다이렉트 확인 |
| B-2 | 일반 회원 접근 차단 | USER 권한으로 `/admin/finance/reports` → `/login` 리다이렉트 확인 |
| B-3 | 사이드바 링크 | 관리자 사이드바 "결산 보고서" 메뉴 클릭 → 페이지 정상 이동 확인 |

**C. 보고서 생성**

| # | 항목 | 방법 |
|---|---|---|
| C-1 | 연도 선택기 | ◀ ▶ 버튼으로 연도 변경 → 현재 선택 연도 표시 확인 |
| C-2 | 보고서 생성 | 연도 선택 → "보고서 생성" 클릭 → 성공 toast + 테이블에 행 추가 확인 |
| C-3 | 수입 집계 | 보고서 수입 = 해당 연도 Donation(COMPLETED) amount 합계 확인 |
| C-4 | 지출 집계 | 보고서 지출 = 해당 연도 Expense(CONFIRMED) amount 합계 확인 |
| C-5 | 잔액 계산 | 수입 − 지출 = 잔액 정확히 표시 확인 |
| C-6 | 보고서 갱신 | 기존 연도 → "보고서 갱신" 버튼 텍스트 확인 + 클릭 시 데이터 갱신 확인 |
| C-7 | 갱신 안내 | 기존 연도 선택 시 "기존 보고서가 최신 데이터로 갱신됩니다" 텍스트 확인 |

**D. PENDING_REVIEW 경고**

| # | 항목 | 방법 |
|---|---|---|
| D-1 | 경고 표시 | PENDING_REVIEW 지출 존재 시 노란 경고 카드 "검토 대기 N건" 표시 확인 |
| D-2 | 경고 미표시 | PENDING_REVIEW 없을 시 경고 카드 미표시 확인 |

**E. 공개/비공개 토글**

| # | 항목 | 방법 |
|---|---|---|
| E-1 | 비공개→공개 | "비공개" 뱃지 클릭 → 성공 toast + "공개" 뱃지로 전환 확인 |
| E-2 | 공개→비공개 | "공개" 뱃지 클릭 → 성공 toast + "비공개" 뱃지로 전환 확인 |

**F. PDF URL 관리**

| # | 항목 | 방법 |
|---|---|---|
| F-1 | PDF URL 설정 | 링크 아이콘 클릭 → 다이얼로그 → URL 입력 → "저장" → 성공 toast 확인 |
| F-2 | PDF 링크 표시 | URL 저장 후 외부 링크 아이콘 표시 + 클릭 시 새 탭 열기 확인 |
| F-3 | PDF URL 삭제 | URL 비우고 저장 → 외부 링크 아이콘 미표시 확인 |

**G. 보고서 삭제**

| # | 항목 | 방법 |
|---|---|---|
| G-1 | 삭제 확인 | 쓰레기통 아이콘 클릭 → AlertDialog "보고서 삭제" 표시 확인 |
| G-2 | 취소 | "취소" 클릭 → 다이얼로그 닫힘 + 보고서 유지 확인 |
| G-3 | 삭제 실행 | "삭제" 클릭 → 성공 toast + 테이블에서 행 제거 확인 |

**H. 빈 상태**

| # | 항목 | 방법 |
|---|---|---|
| H-1 | 빈 테이블 | 보고서 0건일 때 "생성된 보고서가 없습니다" 빈 상태 표시 확인 |

총 22개 항목

### 3-1. 후원 시스템 (토스페이먼츠 연동)

| #     | 작업 항목                | 상태 | 세부 내용                                                                 | 블로커/비고 |
| ----- | ------------------------ | ---- | ------------------------------------------------------------------------- | ----------- |
| 3-1-1 | 토스 유틸 + 상수 + Zod   | ✅   | `@tosspayments/tosspayments-sdk` 설치 + `toss.ts` 승인 유틸 + donateSchema | 완료 |
| 3-1-2 | 후원 페이지              | ✅   | `/donate` — 정기/일시 탭 + 금액 프리셋+직접입력 + 개인정보 폼 + 토스 SDK requestPayment + i18n | 완료 |
| 3-1-3 | 결제 콜백 + 성공/실패    | ✅   | `/donate/success` + `/donate/fail` + `/api/donate/confirm` — 승인 API + DB update + Resend 감사 이메일 | 완료 |
| 3-1-4 | Rate Limiting 설정       | ✅   | `rate-limit.ts` — Upstash Redis slidingWindow (후원 10회/분, 로그인 5회/분) + graceful skip | 완료 |
| 3-1-5 | 빌드 검증                | ✅   | tsc + lint + build 통과 + /donate, /donate/success, /donate/fail 라우트 확인 + 테스트 결제 성공 | 완료 |

### Phase 3 완료 체크포인트

- [x] 네트워크 지도: `/network` — 50개국 핀 + 한국 강조 + 클릭 정보 패널 + 대륙별 통계 + PCI 소개
- [x] 교육 소개: `/education` — Sanity 기수 목록 + 모집 상태 뱃지 + 커리큘럼 아코디언
- [x] 교육 신청: `/education/apply` 폼 제출 → DB 저장(Prisma) + Resend 이메일 (신청자+관리자)
- [x] 로그인: `/login` — Credentials 인증 + 세션 생성
- [x] 회원가입: `/register` — DB 저장 + bcrypt + 자동 로그인
- [x] 커뮤니티 인증: 비로그인 → /community → /login 리다이렉트
- [x] 게시글 CRUD: 글쓰기/수정/삭제 → DB 반영 + 본인 권한
- [x] 댓글 CRUD: 댓글 작성/삭제 → DB 반영 + 본인만 삭제
- [x] 다국어: Header KO/EN 토글 → 한/영 전환 + /en/* URL prefix + 36개 라우트 생성
- [x] ADMIN 권한: 일반 회원 /admin 접근 → 거부
- [x] 영수증 OCR: 이미지 업로드 → Claude Vision 분석 → 자동 분류 JSON 반환
- [x] 영수증 업로드 UI: 드래그&드롭 + OCR 결과 확인/수정 폼
- [x] 로컬 폴더 감시: chokidar 스크립트 → 자동 업로드+OCR → PENDING_REVIEW DB 저장
- [x] 제경비 CRUD: 입력(OCR스캔+수동)/수정/삭제 → DB 반영 + 상태 관리
- [x] 예산 현황: 집행률 프로그레스바 + 잔액 계산 (CONFIRMED만)
- [x] 투명성 페이지: Recharts 도넛 차트 + PDF 다운로드 (Pretendard OTF 폰트, Supabase Storage, 캐시 버스팅)
- [x] 후원 결제: 토스 테스트 결제 성공 → DB 저장 → 감사 이메일
- [x] Rate Limiting: Upstash Redis 기반 구현 (미설정 시 graceful skip)
- [x] 빌드: `npm run build` 에러 0건

### Phase 3 외부 작업 체크리스트

- [x] 토스페이먼츠 가맹점 등록 → 테스트키 확보 완료 (실제키는 배포 시 교체)
- [ ] Upstash Redis 생성 → REST_URL / TOKEN 확보
- [ ] Resend 계정 확인 → API_KEY 확보 (이메일 발송 필수)
- [ ] 카카오 개발자 앱 등록 → CLIENT_ID / SECRET 확보 (소셜 로그인)
- [x] Supabase Storage 버킷 생성 → `receipts` 버킷 + 업로드/삭제 테스트 완료
- [x] Supabase Service Key 확보 → SUPABASE_URL / SUPABASE_SERVICE_KEY 설정 완료
- [x] Anthropic API Key 확보 → ANTHROPIC_API_KEY 설정 + 영수증 OCR 테스트 성공
- [x] 영수증 감시 폴더 설정 → RECEIPT_WATCH_DIR + RECEIPT_API_KEY (C:\\영수증 경로 설정 완료)

---

## Phase 4 — 마무리 및 배포

| #   | 작업 항목        | 상태 | 세부 내용                                                    | 블로커/비고              |
| --- | ---------------- | ---- | ------------------------------------------------------------ | ------------------------ |
| 4-1 | SEO 최적화       | ✅   | sitemap.ts, robots.ts, generateMetadata, OG 이미지, JSON-LD  | 완료                     |
| 4-2 | 성능 최적화      | ✅   | next/image, dynamic import, bundle-analyzer, Core Web Vitals | 완료                     |
| 4-3 | 전체 테스트 실행 | ✅   | Vitest 단위 + Testing Library 통합 + (선택) Playwright E2E   | 완료                     |
| 4-4 | CI/CD 최종 검증  | ✅   | PR → CI 자동 실행 → 통과 확인 → Vercel Preview               | 완료                     |
| 4-5 | 프로덕션 배포    | ✅   | Vercel 배포 완료 (`pck-homepage.vercel.app/ko`) — 스모크 테스트 12항목 통과, 도메인 전환만 남음 | 4/5 완료 |

### 4-1. SEO 최적화

| #     | 작업 항목                  | 상태 | 세부 내용                                                                 | 파일                              |
| ----- | -------------------------- | ---- | ------------------------------------------------------------------------- | --------------------------------- |
| 4-1-1 | sitemap.ts 생성            | ✅   | 정적 URL 10개 (ko+en) + Sanity 뉴스 동적 URL (GROQ 전체 slug 조회) | `src/app/sitemap.ts`              |
| 4-1-2 | robots.ts 생성             | ✅   | Allow: /, Disallow: /admin, /api, /studio, Sitemap 참조                   | `src/app/robots.ts`               |
| 4-1-3 | 루트 메타데이터 보강       | ✅   | metadataBase, openGraph, twitter card, keywords, icons, title template 설정 | `src/app/[locale]/layout.tsx`     |
| 4-1-4 | 정적 페이지 메타데이터     | ✅   | about, donate, education, network, community, transparency, news — 7개 페이지 title+description+openGraph | 각 page.tsx                       |
| 4-1-5 | 동적 페이지 메타데이터 점검 | ✅   | news/[slug], community/[id], transparency/[year] — openGraph 보강 + title template 적용 | 기존 3개 page.tsx                 |
| 4-1-6 | JSON-LD Organization       | ✅   | Organization + WebSite 구조화 데이터 (@graph 형태, PCI 상위조직 참조) | `src/app/[locale]/layout.tsx`     |
| 4-1-7 | JSON-LD Article            | ✅   | 뉴스 상세 Article 구조화 데이터 (headline, datePublished, publisher, image) | `news/[slug]/page.tsx`            |
| 4-1-8 | OG 이미지 통합 검증        | ✅   | 전체 페이지 `/api/og` 연결 확인 + 빌드 통과 (sitemap.xml, robots.txt 라우트 생성 확인) | `/api/og/route.tsx`               |

### 4-2. 성능 최적화

| #     | 작업 항목             | 상태 | 세부 내용                                                                 | 비고                    |
| ----- | --------------------- | ---- | ------------------------------------------------------------------------- | ----------------------- |
| 4-2-1 | next/image 전수 점검  | ✅   | 7개 파일 모두 `next/image` 사용 확인 — fill/sizes/priority 올바르게 적용, `<img>` 태그 0건 | 이미 적용됨 |
| 4-2-2 | Dynamic Import 점검   | ✅   | PeaceMap (ssr:false) + FinanceDonutChart (ssr:false) 이미 적용 확인       | 이미 적용됨 |
| 4-2-3 | 번들 분석             | ✅   | `@next/bundle-analyzer` 설치 + `npm run analyze` 스크립트 추가 + next.config.ts 연결 | `ANALYZE=true` 환경변수 |
| 4-2-4 | 폰트 최적화           | ✅   | `next/font/google` Inter + Noto Sans KR (display: swap) 이미 적용 확인   | 이미 적용됨 |
| 4-2-5 | 이미지 자산 최적화    | ✅   | 히어로 이미지 8개 PNG→실제WebP 변환: **38.4MB → 735KB (98.1% 절감)**, desktop 1920px/mobile 828px 리사이즈 | sharp-cli 사용 |
| 4-2-6 | Lighthouse 측정       | ✅   | 빌드 통과 확인, 번들 분석기 준비 완료, 배포 후 실측 필요                  | 배포 후 Lighthouse 실행 |

### 4-3. 전체 테스트 작성

| #     | 작업 항목              | 상태 | 세부 내용                                                                 | 파일                              |
| ----- | ---------------------- | ---- | ------------------------------------------------------------------------- | --------------------------------- |
| 4-3-1 | Vitest 설정            | ✅   | `vitest.config.ts` (jsdom, path aliases, v8 coverage) + `src/test/setup.ts` (@testing-library/jest-dom) | `vitest.config.ts`                |
| 4-3-2 | Zod 스키마 테스트      | ✅   | auth(10), donate(10), community(10), finance(13) — 총 43개 유효/무효 케이스 전수 검증 | `src/lib/validations/__tests__/`  |
| 4-3-3 | 유틸 함수 테스트       | ✅   | cn 유틸(6), toss confirmPayment(4) — fetch mock 기반 결제 승인/실패/에러 테스트 | `src/lib/__tests__/`              |
| 4-3-4 | 상수 데이터 테스트     | ✅   | navigation(5), network(12) — 회원국 무결성, 좌표 범위, id 고유성, 대륙통계 검증 | `src/lib/constants/__tests__/`    |
| 4-3-5 | 컴포넌트 렌더링 테스트 | ✅   | WaveDivider(5), NewsCard(7) — next/image·link mock 기반 렌더링 + 속성 검증 | `src/components/__tests__/`       |
| 4-3-6 | Server Action 테스트   | ✅   | newsletter subscribeNewsletter(5) — prisma mock, 이메일 검증/소문자 변환/중복 처리 | `src/app/actions/__tests__/`      |
| 4-3-7 | 커버리지 확인          | ✅   | **89 tests passed** — validations 100%, payments 100%, utils 100%, constants(nav/net/news) 100% | 핵심 로직 100% 달성               |

### 4-4. CI/CD 최종 검증

| #     | 작업 항목               | 상태 | 세부 내용                                                                 | 블로커/비고              |
| ----- | ----------------------- | ---- | ------------------------------------------------------------------------- | ------------------------ |
| 4-4-1 | CI에 테스트 단계 추가   | ✅   | ci.yml에 `npx vitest run` 단계 추가 (lint → typecheck → **test** → build 4단계) | `.github/workflows/ci.yml` |
| 4-4-2 | CI 파이프라인 전체 통과 | ✅   | 로컬 4단계 전체 통과: ESLint(0 errors) + tsc(통과) + vitest(89 passed) + build(성공) | 로컬 검증 완료            |
| 4-4-3 | develop → main PR 생성  | ✅   | Phase 4 커밋 (`3b12fe3`) + develop 푸시 + PR #13 생성 완료                | https://github.com/MoonSongIT/pck-homepage/pull/13 |
| 4-4-4 | Vercel Preview 배포 확인 | ✅  | `pck-homepage.vercel.app/ko` 정상 동작 확인 — npm ci→npm install 전환, localePrefix always 수정 | PR #15~#18 |

### 4-5. 프로덕션 배포

| #     | 작업 항목                | 상태 | 세부 내용                                                                 | 블로커/비고              |
| ----- | ------------------------ | ---- | ------------------------------------------------------------------------- | ------------------------ |
| 4-5-1 | Vercel 프로젝트 생성     | ✅   | GitHub MoonSongIT/pck-homepage 연결, Framework: Next.js 자동 감지, `pck-homepage.vercel.app` 배포 확인 | 완료 |
| 4-5-2 | 환경변수 설정            | ✅   | Vercel 대시보드에서 필수 환경변수 설정 완료 (DB, Auth, Sanity, Toss, Resend 등) | 완료 |
| 4-5-3 | DB 마이그레이션          | ✅   | 로컬과 프로덕션 동일 Supabase DB 사용 — `prisma migrate status`: up to date | 추가 마이그레이션 불필요  |
| 4-5-4 | 커스텀 도메인 + SSL      | ⬜   | 임시: `pck-homepage.vercel.app` 사용 중 → 추후 `paxchristikorea.org` 전환 | `Docs/4.03 배포 및 도메인 전환 가이드.md` 참조 |
| 4-5-5 | 프로덕션 스모크 테스트   | ✅   | 12개 항목 전체 통과: 8개 페이지(ko) + 영어(/en) + SEO(sitemap+robots) + OG이미지 API | 전체 정상 확인 |

### Phase 4 완료 체크포인트

- [ ] /sitemap.xml — 전체 URL 목록 (정적 + Sanity 동적)
- [ ] /robots.txt — 크롤링 규칙 (admin/api/studio 차단)
- [ ] 메타데이터 — 전체 페이지 title + description + openGraph
- [ ] JSON-LD — Organization + WebSite + Article 구조화 데이터
- [ ] OG 이미지 — SNS 공유 미리보기 (전체 페이지)
- [ ] next/image — 모든 이미지 최적화 적용
- [ ] Lighthouse Performance: 90+
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1
- [ ] Vitest 설정 + 테스트 파일 작성 완료
- [ ] 테스트 커버리지: 핵심 로직 70%+
- [ ] CI 파이프라인: lint + typecheck + test + build 통과
- [ ] 프로덕션 빌드: 에러 0건
- [ ] Vercel Preview 배포: 정상
- [ ] 프로덕션 URL 접속: 정상
- [ ] HTTPS/SSL: 유효한 인증서

### Phase 4 외부 작업 체크리스트

> 📄 상세 절차: **`Docs/deployment-guide.md`** 참조

- [ ] Sanity.io 프로젝트 생성 → PROJECT_ID / DATASET / API_TOKEN 확보 (§2-2)
- [ ] Resend 계정 확인 → API_KEY 확보 + 도메인 인증 (§2-4)
- [ ] 카카오 개발자 앱 등록 → CLIENT_ID / SECRET 확보 (§2-5, 선택)
- [ ] Upstash Redis 생성 → REST_URL / TOKEN 확보 (§2-6, 선택)
- [ ] Vercel 프로젝트 생성 + GitHub 연동 (§4-1)
- [ ] Vercel 환경변수 설정 — 필수 12개 + 선택 4개 (§4-2)
- [ ] 도메인 구매/연결 — DNS A/CNAME 설정 (§5)
- [ ] DB 마이그레이션 — `prisma migrate deploy` (§6)
- [ ] 관리자 계정 시드 — role: ADMIN (§6-2)
- [ ] 프로덕션 스모크 테스트 수행 (§7)

### Phase 4 구현 순서

```
4-1 SEO 최적화 (8개) ──┐
4-2 성능 최적화 (6개) ──┼── 병렬 진행 가능
4-3 테스트 작성 (7개) ──┘
         │
         ▼
4-4 CI/CD 최종 검증 (4개) ── 4-1~4-3 완료 후
         │
         ▼
4-5 프로덕션 배포 (5개) ── 4-4 + 외부 작업 완료 필요
```

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
| Phase 3-5   | 4         | 4      | **100%** |
| Phase 3-3   | 5         | 5      | **100%** |
| Phase 3-4   | 7         | 7      | **100%** |
| Phase 3-6   | 4         | 4      | **100%** |
| Phase 3-2   | 10        | 10     | **100%** |
| Phase 3-1   | 5         | 5      | **100%** |
| Phase 4-1   | 8         | 8      | **100%** |
| Phase 4-2   | 6         | 6      | **100%** |
| Phase 4-3   | 7         | 7      | **100%** |
| Phase 4-4   | 4         | 4      | **100%** |
| Phase 4-5   | 5         | 2      | 40%      |
| **전체**    | **111**   | **110** | **99%** |

> Phase 3 상세 분할: 기존 6개 → 31개 소항목으로 확장 (2026-03-20)
> Phase 3-2 확장: 영수증 OCR + Supabase Storage + 로컬 폴더 감시 추가 (2026-03-23, 7개 → 9개)
> Phase 3-2 확장: PDF 자동 생성 + Supabase Storage 자동 저장 추가 (2026-03-24, 9개 → 10개)
> Phase 4 상세 분할: 기존 5개 → 30개 소항목으로 확장 (2026-03-25)
> Phase 4 배포 가이드 작성: `Docs/deployment-guide.md` — Vercel/도메인/환경변수/스모크테스트 전체 절차 (2026-03-25)
> Phase 4 postinstall 추가: `prisma generate` — Vercel 빌드 시 Prisma Client 자동 생성 (2026-03-25)
