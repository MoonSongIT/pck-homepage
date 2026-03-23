# PCK 웹사이트 리뉴얼 — 전체 구현 계획서

> 최종 수정: 2026-03-23
> 프로젝트: 팍스크리스티코리아(Pax Christi Korea) 공식 웹사이트 리뉴얼
> 기술 스택: Next.js 16 + TypeScript + Tailwind CSS v4 + Supabase + Sanity.io

---

## 개요

현재 쇼핑몰 솔루션 기반의 구식 UI를 현대적 비영리 NGO 사이트로 완전 리뉴얼한다.
평화·연대·영성의 정체성을 시각적으로 표현하고, 후원·회원관리·교육신청·다국어·재정 투명성 기능을 구현한다.

---

## Phase 0 — 개발 환경 및 형상 관리 설정

### 0-1. Next.js 15 프로젝트 초기화

**목표**: 프로젝트 골격 생성 (TypeScript + App Router + Tailwind CSS + src/ 디렉토리)

**방법**:

```bash
cd C:\Users\dohay\ClaudeWork\PCKHomePage
npx create-next-app@latest . --ts --eslint --tailwind --src-dir --app --turbopack --import-alias "@/*"
```

**설정 확인**:

- `tsconfig.json`: `"strict": true` 확인
- `next.config.ts`: 기본 설정 확인
- `src/app/layout.tsx`, `src/app/page.tsx` 생성 확인

**검증**:

```bash
npm run dev
# → localhost:3000 접속 → Next.js 기본 페이지 표시
```

**의존성**: 없음 (첫 작업)

---

### 0-2. Git 초기화 + .gitignore + LICENSE + .env.example

**목표**: 형상 관리 기반 구축

**방법**:

1. `git init`
2. `.gitignore` 확장 — create-next-app 기본 항목에 추가:

   ```
   # 환경변수
   .env
   .env*.local

   # Prisma
   prisma/*.db
   prisma/*.db-journal

   # Vercel
   .vercel

   # IDE
   .vscode/settings.json
   .idea/

   # OS
   Thumbs.db
   .DS_Store
   ```

3. `LICENSE` 파일 생성 — MIT 라이선스
4. `.env.example` 작성:

   ```env
   # === 인증 ===
   NEXTAUTH_SECRET=
   NEXTAUTH_URL=http://localhost:3000

   # === 데이터베이스 (Supabase) ===
   DATABASE_URL=

   # === Sanity CMS ===
   NEXT_PUBLIC_SANITY_PROJECT_ID=
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=

   # === 결제 (토스페이먼츠) ===
   NEXT_PUBLIC_TOSS_CLIENT_KEY=
   TOSS_SECRET_KEY=

   # === 이메일 (Resend) ===
   RESEND_API_KEY=

   # === 소셜 로그인 (카카오) ===
   KAKAO_CLIENT_ID=
   KAKAO_CLIENT_SECRET=

   # === Rate Limiting (Upstash Redis) ===
   UPSTASH_REDIS_REST_URL=
   UPSTASH_REDIS_REST_TOKEN=
   ```

5. 초기 커밋:
   ```bash
   git add .
   git commit -m "Initial commit: Next.js 15 프로젝트 초기화"
   ```

**의존성**: 0-1 완료 후

---

### 0-3. 브랜치 전략 수립

**목표**: 안정적인 배포 흐름을 위한 브랜치 규칙 확립

**방법**:

```bash
# develop 브랜치 생성
git checkout -b develop
git push -u origin develop  # GitHub 리포 연결 후
```

**브랜치 규칙**:

| 브랜치      | 용도          | 머지 대상                | 보호 규칙             |
| ----------- | ------------- | ------------------------ | --------------------- |
| `main`      | 프로덕션 배포 | develop에서만 머지       | PR 필수, CI 통과 필수 |
| `develop`   | 개발 통합     | feature에서 머지         | PR 필수               |
| `feature/*` | 기능 개발     | develop으로 머지         | 자유                  |
| `hotfix/*`  | 긴급 수정     | main + develop 동시 머지 | PR 필수               |

**명명 규칙 예시**:

- `feature/hero-section`
- `feature/donate-system`
- `hotfix/login-redirect-fix`

**의존성**: 0-2 완료 후

---

### 0-4. GitHub Actions CI 파이프라인 구성

**목표**: PR 시 자동 검증 (lint + typecheck + build)

**파일**: `.github/workflows/ci.yml`

```yaml
name: CI
on:
  pull_request:
    branches: [develop, main]
  push:
    branches: [develop]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: ESLint
        run: npm run lint
      - name: TypeScript 타입 체크
        run: npx tsc --noEmit
      - name: Build
        run: npm run build
```

**파일**: `.github/workflows/deploy.yml`

```yaml
name: Deploy
on:
  push:
    branches: [main]

# Vercel GitHub 연동 시 자동 배포되므로 placeholder
# 필요 시 vercel CLI 기반 수동 배포 추가 가능
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Vercel Deploy
        run: echo "Vercel auto-deploys on push to main via GitHub integration"
```

**의존성**: 0-1 완료 후 (package.json의 scripts 필요)

---

### 0-5. 프로젝트 관리 문서 생성

**목표**: 진도 관리 및 테스트 추적 체계 수립

**파일**:

- `Docs/plan.md` — 본 문서 (전체 구현 계획)
- `Docs/check.md` — 진도 체크리스트
- `Docs/test.md` — 테스트 전략 및 검증 절차

**의존성**: 없음

---

### 0-6. CLAUDE.md 프로젝트 지침

**목표**: AI 페어 프로그래밍 시 일관된 코드 스타일과 프로젝트 맥락 제공

**파일**: 프로젝트 루트 `CLAUDE.md`

**내용 요약**:

- 프로젝트 개요 (PCK 웹사이트 리뉴얼, 비영리 NGO)
- 기술 스택 요약
- 코드 스타일 가이드:
  - 컴포넌트: PascalCase, 화살표 함수 (`const Hero = () => {}`)
  - 훅: camelCase, `use` 접두사
  - 상수: SCREAMING_SNAKE_CASE
  - Import 순서: React → Next.js → 외부 → 내부 → 타입
  - 세미콜론 없음, 작은 따옴표, 탭 너비 2
- 디렉토리 구조 설명
- 자주 사용하는 명령어:
  ```
  npm run dev          # 개발 서버
  npm run build        # 프로덕션 빌드
  npm run lint         # ESLint
  npx tsc --noEmit     # 타입 체크
  npx prisma studio    # DB 브라우저
  npx prisma migrate dev  # DB 마이그레이션
  ```
- "use client" 최소화 원칙
- 서버 컴포넌트 우선 설계

**의존성**: 0-1 완료 후

---

### 0-7. ESLint + Prettier 통합

**목표**: 코드 포맷 일관성 + 린트 규칙 자동 적용

**방법**:

```bash
npm install -D prettier eslint-config-prettier
```

**파일**: `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

**ESLint 설정 수정** (`eslint.config.mjs`):

- `eslint-config-prettier` 추가하여 ESLint-Prettier 충돌 방지
- `@typescript-eslint/recommended` 규칙 확인

**검증**:

```bash
npm run lint          # 에러 0건
npx prettier --check .  # 포맷 일관성 확인
```

**의존성**: 0-1 완료 후

---

### Phase 0 완료 체크포인트

| 검증 항목            | 명령어                   | 기대 결과           |
| -------------------- | ------------------------ | ------------------- |
| ESLint 통과          | `npm run lint`           | 에러 0건            |
| TypeScript 타입 체크 | `npx tsc --noEmit`       | 에러 0건            |
| 빌드 성공            | `npm run build`          | exit code 0         |
| 개발 서버            | `npm run dev`            | localhost:3000 정상 |
| Prettier 포맷        | `npx prettier --check .` | 포맷 일치           |
| Git 브랜치           | `git branch`             | main, develop 존재  |
| CI 파일              | YAML syntax 확인         | 유효                |

---

## Phase 1 — 기반 설정

### 1-1. Tailwind CSS v4 디자인 토큰 설정

**목표**: PCK 브랜드 컬러 시스템을 CSS Variables + Tailwind로 구축

**파일**: `src/app/globals.css`

```css
@import 'tailwindcss';

@theme {
  --color-peace-navy: #1a3a5c;
  --color-peace-sky: #4a90d9;
  --color-peace-olive: #6b8f47;
  --color-peace-cream: #f8f4ed;
  --color-peace-gold: #c9a84c;
  --color-peace-orange: #e8911a;
}
```

**다크모드 토큰** (CSS Variables):

```css
:root {
  --background: #ffffff;
  --foreground: #1a3a5c;
}

.dark {
  --background: #0f1a2e;
  --foreground: #f8f4ed;
}
```

**추가 설정**:

- 기본 폰트: Noto Sans KR (한글) + Inter (영문)
- Google Fonts import 또는 next/font/google 사용
- 최소 폰트 크기: 16px (접근성)

**의존성**: Phase 0 완료

---

### 1-2. shadcn/ui 설치 + 초기 컴포넌트

**목표**: 재사용 가능한 UI 컴포넌트 기반 구축

**방법**:

```bash
npx shadcn@latest init
```

**설정**:

- Style: Default
- Base color: Neutral (PCK 토큰으로 커스텀)
- CSS variables: Yes

**초기 설치 컴포넌트**:

```bash
npx shadcn@latest add button card badge input dialog tabs sheet \
  dropdown-menu separator avatar skeleton toast
```

**의존성**: 1-1 완료 후

---

### 1-3. Prisma + Supabase 연결 + 스키마

**목표**: 데이터베이스 모델링 및 ORM 연결

**방법**:

```bash
npm install prisma @prisma/client
npx prisma init
```

**파일**: `prisma/schema.prisma`

**모델 목록**:
| 모델 | 용도 |
|------|------|
| User | 회원 (이메일, 이름, 역할, 카카오ID) |
| Account | NextAuth 계정 연동 |
| Session | NextAuth 세션 |
| VerificationToken | NextAuth 이메일 인증 |
| Donation | 후원 내역 (금액, 유형, 상태) |
| Expense | 제경비 사용내역 (날짜, 항목, 카테고리, 금액) |
| BudgetItem | 예산 항목 (연도, 카테고리, 편성액) |
| FinanceReport | 결산 보고서 (연도, 수입, 지출, PDF) |
| CommunityPost | 커뮤니티 게시글 |
| Comment | 댓글 |
| EducationApplication | 교육 신청 |
| NewsletterSubscriber | 뉴스레터 구독자 |

**enum**:

- `Role`: ADMIN, EDITOR, MEMBER
- `DonationType`: REGULAR, ONE_TIME
- `ExpenseCategory`: PERSONNEL, OFFICE, EVENT, TRANSPORT, OTHER
- `BoardType`: FREE, PEACE_SHARING

**마이그레이션**:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

**Prisma 클라이언트** (`src/lib/prisma/client.ts`):

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**의존성**: Supabase 프로젝트 생성 필요 (외부 작업 — DATABASE_URL 확보)

---

### 1-4. NextAuth.js v5 설정

**목표**: 이메일/비밀번호 + 카카오 소셜 로그인 구현

**방법**:

```bash
npm install next-auth@beta @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

**파일 구조**:

- `src/lib/auth.ts` — NextAuth 설정 (PrismaAdapter, Providers)
- `src/app/api/auth/[...nextauth]/route.ts` — API 라우트
- `src/middleware.ts` — 보호 경로 설정

**Providers**:

1. **Credentials** — 이메일/비밀번호 (bcryptjs 해싱)
2. **Kakao** — 카카오 OAuth (KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET)

**보호 경로** (middleware.ts):

```
/community/*  → 로그인 필수 (MEMBER 이상)
/admin/*      → ADMIN 역할만
/api/donate   → 로그인 필수
/api/finance/* → ADMIN 역할만
```

**의존성**: 1-3 완료 후 (User, Account, Session 모델 필요)

---

### 1-5. Sanity.io v3 연결 + 스키마

**목표**: 뉴스/활동 콘텐츠를 비개발자가 편집할 수 있는 CMS 구축

**방법**:

```bash
npm install next-sanity @sanity/image-url
```

**파일 구조**:

- `src/lib/sanity/client.ts` — Sanity 클라이언트
- `src/lib/sanity/queries.ts` — GROQ 쿼리 모음
- `src/lib/sanity/image.ts` — 이미지 URL 빌더

**Sanity 스키마** (Sanity Studio에서 별도 관리):
| 스키마 | 용도 |
|--------|------|
| post | 뉴스/활동 게시글 (제목, 슬러그, 카테고리, 본문, 이미지) |
| education | 평화학교 기수 정보 (기수명, 일정, 커리큘럼, 모집 상태) |
| teamMember | 임원진 (이름, 역할, 사진, 소개) |
| timeline | 연혁 이벤트 (연도, 제목, 설명) |

**ISR 설정**: `revalidate: 3600` (1시간)

**의존성**: Sanity 프로젝트 생성 필요 (외부 작업 — PROJECT_ID 확보)

---

### 1-6. 추가 라이브러리 설치

**목표**: Phase 2~3에서 사용할 라이브러리 사전 설치

**명령어**:

```bash
# 상태 관리
npm install zustand @tanstack/react-query

# 폼 + 검증
npm install react-hook-form @hookform/resolvers zod

# 애니메이션
npm install framer-motion

# 다국어
npm install next-intl

# 다크모드
npm install next-themes

# 이메일
npm install resend

# Rate Limiting
npm install @upstash/ratelimit @upstash/redis

# 지도
npm install react-simple-maps
npm install -D @types/react-simple-maps

# 테스트
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**의존성**: Phase 0 완료 후

---

### Phase 1 완료 체크포인트

| 검증 항목   | 방법                            | 기대 결과          |
| ----------- | ------------------------------- | ------------------ |
| 디자인 토큰 | 브라우저 DevTools CSS 변수 확인 | 6개 컬러 토큰 적용 |
| shadcn/ui   | Button 컴포넌트 렌더링          | 정상 표시          |
| DB 연결     | `npx prisma db push`            | 스키마 동기화      |
| 인증        | /api/auth/signin 접속           | 로그인 폼 표시     |
| Sanity      | 테스트 GROQ 쿼리                | 데이터 반환        |
| 빌드        | `npm run build`                 | 에러 0건           |

---

## Phase 2 — 핵심 페이지 구현

### 2-1. 공통 레이아웃 (Header + Footer + WaveDivider)

**목표**: 전체 사이트에 적용되는 공통 UI 프레임 구축

**파일**:

| 파일                                      | 설명                             |
| ----------------------------------------- | -------------------------------- |
| `src/components/organisms/Header.tsx`     | 2단 구조 헤더 (TopBar + MainNav) |
| `src/components/organisms/MobileNav.tsx`  | 모바일 햄버거 메뉴 (Sheet 활용)  |
| `src/components/organisms/Footer.tsx`     | 4열 푸터                         |
| `src/components/atoms/WaveDivider.tsx`    | SVG 웨이브 구분선                |
| `src/components/atoms/Logo.tsx`           | PCK 로고 컴포넌트                |
| `src/components/templates/MainLayout.tsx` | Header + children + Footer       |
| `src/app/(main)/layout.tsx`               | 메인 그룹 레이아웃               |

**Header 상세**:

- **TopBar**: 연락처 (전화, 이메일), SNS (인스타, 유튜브, 페이스북), 한/영 토글
- **MainNav**: 로고 + 메뉴(단체소개, 활동, 교육, 뉴스, 네트워크, 재정공개) + 후원 CTA
- 후원 버튼: `bg-peace-orange` 또는 `bg-peace-gold`, 항상 우측 고정
- 모바일(< 768px): 햄버거 메뉴, 후원 버튼 축소 없이 노출
- 스크롤 시: sticky, 배경 불투명도 변경

**WaveDivider 상세**:

- Props: `color` (navy | cream | sky), `flip` (boolean)
- SVG path로 물결 곡선 생성
- 반응형: 데스크톱 60-80px, 모바일 40-50px
- 다크모드 대응

**의존성**: Phase 1 완료

---

### 2-2. 메인 홈페이지

**목표**: 방문자가 단체의 정체성과 주요 활동을 한눈에 파악할 수 있는 랜딩 페이지

**파일**: `src/app/(main)/page.tsx`

**섹션 구성 (위→아래)**:

| #   | 섹션      | 컴포넌트                | 설명                                         |
| --- | --------- | ----------------------- | -------------------------------------------- |
| 1   | Hero      | `HeroSection.tsx`       | 풀스크린 슬라이더 + 타이핑 애니메이션        |
| 2   | 구분선    | WaveDivider(navy)       |                                              |
| 3   | Impact    | `ImpactCounter.tsx`     | 4개 카운터 애니메이션 (useInView + rAF)      |
| 4   | 구분선    | WaveDivider(cream,flip) |                                              |
| 5   | 후원 CTA  | `DonationCTA.tsx`       | 후원 금액 카드 + CTA 버튼 + peace-cream 배경 |
| 6   | 구분선    | WaveDivider(cream)      |                                              |
| 7   | 최신 뉴스 | `LatestNews.tsx`        | Sanity 연동 3건 카드 그리드                  |
| 8   | 구분선    | WaveDivider(navy)       |                                              |
| 9   | 뉴스레터  | `NewsletterSection.tsx` | 이메일 구독 폼 → Resend API                  |

**작업 항목 (check.md 동기화)**:

| #     | 작업 항목                          | 상태 | 설명                                                                 |
| ----- | ---------------------------------- | ---- | -------------------------------------------------------------------- |
| 2-2-1 | HeroSection 컴포넌트               | ✅   | 풀스크린 슬라이더 4장 + 타이핑 애니메이션 + 도트 인디케이터          |
| 2-2-2 | ImpactCounter 컴포넌트             | ✅   | 4개 카운터 useInView + rAF 카운트업 + stagger 순차 등장              |
| 2-2-3 | LatestNews 컴포넌트                | ⬜   | Sanity GROQ 최신 3건 조회, NewsCard 그리드, Skeleton 로딩            |
| 2-2-4 | NewsCard 컴포넌트                  | ⬜   | 카테고리 뱃지 + 썸네일 + 제목 + 날짜 + 발췌문                       |
| 2-2-5 | DonationCTA 컴포넌트               | ⬜   | 후원 금액 카드 4종 + CTA 버튼 + peace-cream 배경                    |
| 2-2-6 | NewsletterSection 컴포넌트         | ⬜   | 이메일 입력 폼 → Resend API 구독 처리                                |
| 2-2-7 | 메인 페이지 조립                   | 🔄   | page.tsx — 전체 섹션 조립 (placeholder → 실제 컴포넌트 교체)         |

**HeroSection 상세**:

- 풀스크린(100svh) 슬라이더 4장 자동 전환 (5초 간격)
- Framer Motion AnimatePresence 크로스페이드 + 줌 전환
- 타이핑 텍스트: "그리스도의 평화" → "Peace of Christ" 순환
- 반투명 네이비(50%) 오버레이
- 도트 인디케이터 (탭리스트 role) + 스크롤 유도 ChevronDown
- 키보드 좌우 화살표 + useReducedMotion 접근성 대응
- 반응형 이미지 (모바일/데스크톱 별도 webp)

**ImpactCounter 상세**:

- 4개 항목: 창립 2019 / 회원 200+ / 활동 국가 50 / 캠페인 15+
- Framer Motion `useInView` 뷰포트 진입 감지 (`once: true`)
- `requestAnimationFrame` 기반 카운트업 (2초, ease-out cubic)
- 창립 연도: 현재 연도 → 2019 역방향 카운트 (`startFrom` 패턴)
- `staggerChildren: 0.15` 순차 등장 + `useReducedMotion` 접근성 대응
- 반응형 그리드 2열(모바일) / 4열(데스크톱), 다크모드 지원
- 배경: peace-cream

**DonationCTA 상세**:

- 4개 후원 금액 카드 (1만원/3만원/5만원/10만원) + 아이콘 + 설명
- "추천" 뱃지 (3만원 카드)
- CTA 버튼: `bg-peace-orange`, `/donate` 링크
- Framer Motion whileInView 스크롤 트리거 애니메이션
- `useReducedMotion` 접근성 대응, 다크모드 지원

**의존성**: 2-1 완료 후

---

### 2-3. 단체 소개 페이지

**목표**: 팍스크리스티코리아의 비전·목표·주요 활동 영역, 연혁, 임원진 정보를 제공하는 3개 서브 페이지 구현

**파일 구조**:

| 파일                                                 | 설명                                    | 서버/클라이언트 |
| ---------------------------------------------------- | --------------------------------------- | --------------- |
| `src/lib/constants/about.ts`                         | About 섹션 상수 (비전/목표/활동영역/메타) | 공유 데이터     |
| `src/app/(main)/about/layout.tsx`                    | About 서브 네비게이션 레이아웃          | 서버            |
| `src/app/(main)/about/page.tsx`                      | 비전·목표·주요 활동 영역 카드 레이아웃  | 서버            |
| `src/components/molecules/TimelineItem.tsx`          | 타임라인 개별 항목 (연도+제목+설명)     | 서버            |
| `src/app/(main)/about/history/page.tsx`              | 수직 타임라인 (Sanity 연동)             | 서버 (async)    |
| `src/components/molecules/MemberCard.tsx`            | 임원 프로필 카드 (사진+이름+직책+소개)  | 서버            |
| `src/app/(main)/about/team/page.tsx`                 | 임원진 프로필 카드 그리드 (Sanity 연동) | 서버 (async)    |

**기존 인프라 (이미 완성)**:

- Sanity 스키마: `teamMember` (5필드), `timeline` (3필드) — `src/sanity/schemaTypes/`
- GROQ 쿼리: `TEAM_MEMBERS_QUERY`, `TIMELINE_QUERY` — `src/lib/sanity/queries.ts`
- 타입: `TeamMember`, `TimelineEvent` — `src/types/sanity.ts`
- Sanity 이미지: `urlFor()`, `imagePresets` — `src/lib/sanity/image.ts`

---

#### 2-3-1. About 상수 파일

**파일**: `src/lib/constants/about.ts`

**내용**:

```typescript
import {
  Eye, Target, Shield, Building2, GraduationCap,
  Users, Handshake, Megaphone, Link2, CalendarHeart,
} from 'lucide-react'

// 비전·목표 데이터
export const VISION_MISSION = {
  vision: {
    title: '비전',
    description: 'Pax Christi International과 보조를 맞춰 한국 현실에 부합하는 평화 운동을 활발하게 전개하고, 모든 폭력에서 자유로운 세계, \'평화로운 세계 건설\'이라는 비전을 추구합니다.',
    icon: Eye,
  },
  mission: {
    title: '목표',
    description: '가톨릭교회의 모든 신원이 동등하게 수평적으로 평화와 화해를 추구하는 활동에 참여하는 비공인 가톨릭 평화운동 단체로서, 복음과 가톨릭 신앙에 바탕을 두고 기도·공부(연구)·실천을 방법적 원리로 삼아 활동합니다.',
    icon: Target,
  },
} as const

// 주요 활동 영역 (8개)
export const ACTIVITY_AREAS = [
  { id: 'conflict-transformation', title: '갈등 전환', icon: Shield },
  { id: 'peace-building', title: '평화 구축', icon: Building2 },
  { id: 'peace-education', title: '평화 교육과 청년활동 지원', icon: GraduationCap },
  { id: 'nonviolent-organizing', title: '비폭력 모임 조직', icon: Users },
  { id: 'interfaith-dialogue', title: '종교간 대화와 협력', icon: Handshake },
  { id: 'advocacy', title: '각국 옹호(Advocacy) 활동 참여', icon: Megaphone },
  { id: 'partner-exchange', title: '협력단체 교류', icon: Link2 },
  { id: 'peace-day', title: '평화의 날 담화 실천', icon: CalendarHeart },
] as const

// About 페이지 메타데이터 + 섹션 설정
export const ABOUT_CONFIG = {
  hero: { title: '단체 소개', subtitle: '팍스크리스티코리아를 소개합니다' },
  historyLink: { label: '연혁 보기', href: '/about/history' },
  teamLink: { label: '임원진 보기', href: '/about/team' },
  activitiesTitle: '주요 활동 영역',
  activitiesSubtitle: 'PCI와 보조를 맞춰 한국 현실에 부합하는 평화운동 영역을 개척하고 있습니다',
  introTitle: '팍스크리스티코리아란?',
  introTexts: [/* PCK/PCI 소개 4문단 */],
} as const

// About 서브 네비게이션
export const ABOUT_NAV = [
  { label: '소개', href: '/about' },
  { label: '연혁', href: '/about/history' },
  { label: '임원진', href: '/about/team' },
]

export type ActivityArea = (typeof ACTIVITY_AREAS)[number]
export type AboutNavItem = (typeof ABOUT_NAV)[number]
```

**의존성**: 없음

---

#### 2-3-2. About 레이아웃 (서브 네비게이션)

**파일**: `src/app/(main)/about/layout.tsx`

**상세**:

- 서브 네비게이션 탭/링크: 소개 | 연혁 | 임원진
- 현재 경로 활성 표시 (`usePathname` 또는 서버 사이드 segment)
- `children` 렌더링
- 모바일: 수평 스크롤 탭 / 데스크톱: 인라인 링크
- peace-cream 배경 히어로 배너 (공통 타이틀 영역)

**의존성**: 2-3-1

---

#### 2-3-3. About 메인 페이지

**파일**: `src/app/(main)/about/page.tsx`

**상세**:

- **서버/클라이언트 분리**: `page.tsx` (서버, metadata) + `about-content.tsx` (클라이언트, Framer Motion)
- **섹션 순서 (Intro → Vision → Activities)**:
  1. **단체 소개 텍스트** (팍스크리스티코리아란?): PCK/PCI 소개 4문단 (ABOUT_CONFIG.introTexts)
  2. WaveDivider(cream, flip)
  3. **비전·목표 섹션**: 2열 카드 레이아웃 (비전 Eye / 목표 Target), peace-cream 배경
  4. WaveDivider(cream)
  5. **주요 활동 영역**: 4열×2행 카드 그리드 (8개 ACTIVITY_AREAS), 아이콘+제목+설명
  6. **서브 페이지 CTA**: "연혁 보기" / "임원진 보기" 버튼 (justify-center)
- 호버 시 shadow-md 전환
- Framer Motion staggerChildren: 0.12 순차 등장 + useReducedMotion 접근성 대응
- 다크모드 지원
- `export const metadata` SEO 메타데이터

**의존성**: 2-3-1, 2-3-2

---

#### 2-3-4. TimelineItem 분자 컴포넌트

**파일**: `src/components/molecules/TimelineItem.tsx`

**Props**:

```typescript
type TimelineItemProps = {
  year: number
  title: string
  description?: string
  position: 'left' | 'right'  // 좌우 배치
  className?: string
}
```

**상세**:

- **연도 뱃지**: peace-navy 배경 원형/라운드, 흰색 텍스트
- **카드 본체**: 제목 + 설명, 화살표(꼬리표)로 중앙선과 연결
- **좌우 배치**: `position` prop으로 좌/우 교대
  - 데스크톱(md+): 좌우 교대 배치, 각각 50% 너비
  - 모바일(<md): 모두 오른쪽 정렬 (왼쪽에 중앙선)
- **연결선**: 뱃지에서 카드로 가는 수평 점선 또는 실선
- 다크모드 지원
- `aria-label` 접근성

**의존성**: 없음

---

#### 2-3-5. History 타임라인 페이지

**파일**: `src/app/(main)/about/history/page.tsx`

**상세**:

- **데이터 페칭**: Sanity `TIMELINE_QUERY` (ISR `revalidate: 3600`)
  - 에러 시 빈 배열 → "연혁 데이터를 불러올 수 없습니다" 폴백
- **수직 타임라인 레이아웃**:
  - 중앙 수직선: absolute position, border-left 2px peace-navy
  - TimelineItem 좌우 교대: `index % 2 === 0 ? 'left' : 'right'`
  - 모바일: 왼쪽 수직선 + 모든 항목 오른쪽 배치
- **Framer Motion 애니메이션**:
  - 컨테이너 `staggerChildren: 0.2`
  - 각 아이템 `whileInView` fadeIn + slideX (좌→우 or 우→좌)
  - `useReducedMotion` 접근성 대응
- **페이지 헤더**: "팍스크리스티코리아 연혁" 타이틀
- 연도 범위 표시: 2019 ~ 현재
- 다크모드 지원
- `generateMetadata` SEO 메타데이터
- 데이터 없을 때: "아직 등록된 연혁이 없습니다" 빈 상태 UI

**의존성**: 2-3-2, 2-3-4, 1-5 (Sanity)

---

#### 2-3-6. MemberCard 분자 컴포넌트

**파일**: `src/components/molecules/MemberCard.tsx`

**Props**:

```typescript
type MemberCardProps = {
  member: TeamMember  // from src/types/sanity.ts
  className?: string
}
```

**상세**:

- **프로필 사진**: Sanity `urlFor()` → Next/Image, 원형 또는 라운드 스퀘어
  - 사진 없을 때: 이니셜 아바타 (이름 첫 글자, peace-navy 배경)
  - `sizes` 반응형 속성
- **이름**: 볼드 텍스트
- **직책(role)**: peace-sky 색상 또는 뱃지 스타일
- **소개(bio)**: 2~3줄 line-clamp, 옵션
- **카드 스타일**: border + shadow + 호버 시 elevation 변화
- 다크모드 지원
- `aria-label` 접근성

**의존성**: 없음

---

#### 2-3-7. Team 임원진 페이지

**파일**: `src/app/(main)/about/team/page.tsx`

**상세**:

- **데이터 페칭**: Sanity `TEAM_MEMBERS_QUERY` (ISR `revalidate: 3600`)
  - `order(order asc)` 정렬 (Sanity에서 설정한 순서)
  - 에러 시 빈 배열 → 폴백 UI
- **MemberCard 그리드**:
  - 반응형: 1열(모바일) / 2열(sm) / 3열(md) / 4열(lg)
  - Framer Motion `staggerChildren` 순차 등장
  - `useReducedMotion` 접근성 대응
- **페이지 헤더**: "임원진 소개" 타이틀 + 설명 텍스트
- 다크모드 지원
- `generateMetadata` SEO 메타데이터
- 데이터 없을 때: "아직 등록된 임원진이 없습니다" 빈 상태 UI

**의존성**: 2-3-2, 2-3-6, 1-5 (Sanity)

---

#### 2-3-8. 빌드 검증

- `tsc --noEmit` — TypeScript 에러 0건
- `npm run lint` — ESLint 에러 0건
- `npm run build` — 프로덕션 빌드 성공
- 개발 서버에서 `/about`, `/about/history`, `/about/team` 접속 확인

**의존성**: 2-3-1 ~ 2-3-7 완료

---

#### 2-3 작업 항목 요약

| #     | 작업 항목                | 상태 | 설명                                                                       |
| ----- | ------------------------ | ---- | -------------------------------------------------------------------------- |
| 2-3-1 | About 상수 파일          | ✅   | 비전/목표 + 주요 활동 영역(8개) + 서브 네비 상수 + 페이지/타임라인/임원 설정 |
| 2-3-2 | About 레이아웃           | ✅   | 서브 네비게이션 (소개/연혁/임원진) + 공통 히어로 배너                      |
| 2-3-3 | About 메인 페이지        | ✅   | 소개텍스트 → 비전·목표 카드 → 주요 활동 영역 8개 그리드 + CTA 링크        |
| 2-3-4 | TimelineItem 컴포넌트    | ✅   | 연도 뱃지 + 제목/설명 카드 + 좌우 교대 배치 + 반응형                      |
| 2-3-5 | History 타임라인 페이지  | ✅   | Sanity TIMELINE_QUERY 페칭 + 수직 타임라인 + Framer Motion fade-in        |
| 2-3-6 | MemberCard 컴포넌트      | ✅   | 프로필 사진 + 이름/직책/소개 + 이니셜 폴백 + 호버 애니메이션              |
| 2-3-7 | Team 임원진 페이지       | ✅   | Sanity TEAM_MEMBERS_QUERY 페칭 + MemberCard 그리드 + stagger 애니메이션   |
| 2-3-8 | 빌드 검증                | ✅   | tsc + lint + build + 3개 라우트 접속 확인                                  |

**의존성**: 2-1 완료 후 (✅), 1-5 Sanity 연동 (✅ 코드 준비, Sanity 프로젝트 미생성)

---

### 2-4. 뉴스/활동 페이지 (ISR)

**설계 결정**:
- `/activities` → `/news?category=activity` 리디렉트 (코드 중복 방지)
- 검색 기능 생략 (추후 Sanity 서버사이드 검색으로 별도 추가)
- 페이지네이션: URL searchParams 기반 서버사이드 (?page=2, SEO 친화적)

**파일**:

| 파일                                               | 설명                                     |
| -------------------------------------------------- | ---------------------------------------- |
| `src/lib/constants/news.ts`                        | NEWS_PAGE_CONFIG, NEWS_DETAIL_CONFIG 추가 |
| `src/lib/sanity/queries.ts`                        | 페이지네이션 쿼리 3개 추가               |
| `src/lib/sanity/portable-text-components.tsx`      | PortableText 커스텀 렌더링 컴포넌트      |
| `src/app/(main)/news/page.tsx`                     | 뉴스 목록 서버 컴포넌트 (ISR)            |
| `src/app/(main)/news/news-list-content.tsx`        | 뉴스 목록 클라이언트 (카테고리 탭+그리드+페이지네이션) |
| `src/app/(main)/news/loading.tsx`                  | Skeleton 로딩 UI                         |
| `src/app/(main)/news/[slug]/page.tsx`              | 뉴스 상세 서버 컴포넌트 (SSG+동적 메타)  |
| `src/app/(main)/news/[slug]/news-detail-content.tsx` | 뉴스 상세 클라이언트 (Portable Text+관련글) |
| `src/app/api/og/route.tsx`                         | 동적 OG 이미지 생성 (Edge Runtime)       |
| `src/app/(main)/activities/page.tsx`               | → /news?category=activity 리디렉트      |
| `src/app/(main)/activities/[slug]/page.tsx`        | → /news/[slug] 리디렉트                 |

**뉴스 목록 상세**:

- ISR: `revalidate: 3600` (1시간)
- 카테고리 필터: 전체/뉴스/활동/성명서/보도자료 (URL searchParams, Link 기반 서버사이드)
- 페이지네이션: 12건씩, URL ?page=N, 이전/다음 + 페이지 번호
- Skeleton UI: loading.tsx (카드 12개 골격)
- 기존 NewsCard 컴포넌트 재사용

**뉴스 상세 상세**:

- `generateStaticParams()` — 빌드 시 전체 slug 정적 생성
- `generateMetadata()` — 동적 제목 + OG 이미지
- `@portabletext/react` PortableText 본문 렌더링
- 관련 글 3건 (동일 카테고리, GROQ relatedPosts)
- 없는 slug → `notFound()`

**OG 이미지 생성**:

- `next/og` ImageResponse (Next.js 16 내장, @vercel/og 불필요)
- Edge Runtime, 쿼리 파라미터: title + category
- peace-navy 그라데이션 배경 + 제목 + 카테고리 라벨 + PCK 로고 텍스트

**의존성**: 1-5 (Sanity 연동) 완료 후

---

### Phase 2 완료 체크포인트

| 검증 항목      | 방법                  | 기대 결과                      |
| -------------- | --------------------- | ------------------------------ |
| Header 반응형  | 360px~1440px 리사이즈 | 모바일 햄버거, 데스크톱 풀메뉴 |
| Hero 슬라이더  | 메인 페이지 접속      | 이미지 전환 + 타이핑           |
| Impact Counter | 스크롤 → 카운터 섹션  | 카운트업 애니메이션            |
| 뉴스 카드      | Sanity 데이터 연동    | 3건 카드 표시                  |
| ISR 동작       | 뉴스 상세 페이지      | Cache-Control 확인             |
| 다크모드       | 테마 전환             | 전체 컬러 정상 전환            |
| 접근성         | Lighthouse            | 90+                            |
| 단위 테스트    | `npm test`            | 주요 컴포넌트 통과             |

---

## Phase 3 — 기능 구현

> **진행 순서**: 외부 의존성이 적은 것부터 → 3-5(네트워크 지도) → 3-3(교육 신청) → 3-4(커뮤니티) → 3-6(다국어) → 3-2(재정 투명성) → 3-1(후원 시스템)
> **추가 설치 패키지**: `recharts` (3-2 차트), `@tosspayments/tosspayments-sdk` (3-1 결제)

---

### 3-5. 국제 네트워크 지도

> **우선순위 1** — 외부 의존 없음, react-simple-maps 설치 완료

#### 3-5-1. 네트워크 데이터 + 상수 파일

**파일**: `src/lib/constants/network.ts`

**내용**:

```typescript
export type PaxChristiMember = {
  id: string
  country: string
  countryEn: string
  iso3: string          // ISO 3166-1 alpha-3 (지도 매칭)
  coordinates: [number, number] // [longitude, latitude]
  name: string          // 지부명
  nameEn: string
  established?: number  // 설립 연도
  website?: string
  isHighlighted?: boolean // 한국(PCK) 강조
}

// PCI 회원국 50개 데이터 (좌표 + 지부 정보)
export const MEMBER_COUNTRIES: PaxChristiMember[] = [
  { id: 'kor', country: '한국', countryEn: 'South Korea', iso3: 'KOR',
    coordinates: [127.0, 37.5], name: '팍스크리스티코리아', nameEn: 'Pax Christi Korea',
    established: 2019, website: 'https://paxchristikorea.or.kr', isHighlighted: true },
  // ... 49개 추가
]

export const NETWORK_CONFIG = {
  hero: { title: '국제 평화 네트워크', subtitle: 'Pax Christi International 회원국' },
  mapCenter: [15, 25] as [number, number],  // 유럽 중심 (PCI 본부)
  mapScale: 150,
  pinSize: { default: 6, highlighted: 10 },
  emptyMessage: '네트워크 데이터를 불러올 수 없습니다',
} as const
```

**의존성**: 없음

---

#### 3-5-2. PeaceMap 컴포넌트

**파일**: `src/components/organisms/PeaceMap.tsx` (클라이언트)

**상세**:

- `react-simple-maps`: `ComposableMap` + `Geographies` + `Geography` + `Marker`
- TopoJSON: `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json` (정적 import 또는 fetch)
- 지도 투영: `geoMercator`, center/scale NETWORK_CONFIG에서 설정
- **핀 렌더링**:
  - 일반 핀: `peace-sky` 색상 원형 (`r=6`)
  - 한국 핀: `peace-gold` 색상 + 크기 확대 (`r=10`) + 맥동 CSS `animate-ping` 링
- **인터랙션**:
  - 핀 호버/클릭 → 정보 패널 (국가명, 지부명, 설립 연도, 웹사이트)
  - 정보 패널: absolute positioned 카드 (Card + CardContent shadcn/ui)
  - ESC 키 또는 외부 클릭 시 패널 닫기
- **Framer Motion**:
  - 핀 순차 등장: `staggerChildren: 0.02` (50개국이므로 빠른 간격)
  - 핀 등장: `scale: 0 → 1` + `opacity: 0 → 1`
  - `useReducedMotion` 접근성 대응
- **반응형**:
  - 데스크톱(lg+): 풀폭 지도 + 우측 패널
  - 모바일: 지도 zoom 축소 + 핀 크기 감소 + 하단 패널
- **다크모드**: 지도 배경 (`dark:fill-peace-navy/20`), 국가 경계선 색상 전환
- `aria-label="국제 평화 네트워크 세계 지도"` 접근성

**의존성**: 3-5-1

---

#### 3-5-3. Network 페이지

**파일**: `src/app/(main)/network/page.tsx` (서버) + `src/app/(main)/network/network-content.tsx` (클라이언트)

**상세**:

- **서버 page.tsx**: `export const metadata` SEO + PeaceMap dynamic import (SSR 비활성화)
  ```typescript
  const PeaceMap = dynamic(() => import('@/components/organisms/PeaceMap'), { ssr: false })
  ```
- **레이아웃**: 히어로 배너(peace-cream) + 지도 섹션 + 통계 요약 (회원국 수, 대륙별 분포)
- **통계 섹션**: MEMBER_COUNTRIES 기반 카운터 (아시아/유럽/아메리카/아프리카/오세아니아)
- **빌드 검증**: tsc + lint + build

**의존성**: 3-5-1, 3-5-2

---

#### 3-5-4. 빌드 검증

- `tsc --noEmit` 에러 0건
- `npm run lint` 에러 0건
- `npm run build` 성공
- `/network` 라우트 등록 확인

---

### 3-3. 평화학교 교육 신청

> **우선순위 2** — Server Action 패턴(Newsletter)과 동일, Sanity education 스키마 활용

#### 3-3-1. 교육 상수 + Zod 스키마

**파일**: `src/lib/constants/education.ts`

**Zod 스키마**:

```typescript
import { z } from 'zod/v4'

export const educationApplySchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다').max(50),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  phone: z.string().regex(/^01[016789]-?\d{3,4}-?\d{4}$/, '올바른 전화번호 형식이 아닙니다'),
  affiliation: z.string().max(100).optional(),
  motivation: z.string().min(10, '지원 동기는 10자 이상이어야 합니다').max(500),
  cohort: z.string().optional(),
  privacyAgreed: z.literal(true, { message: '개인정보처리방침에 동의해야 합니다' }),
})

export type EducationApplyInput = z.infer<typeof educationApplySchema>

export const EDUCATION_CONFIG = {
  hero: { title: '평화학교', subtitle: '비폭력 평화를 배우고 실천합니다' },
  applyTitle: '교육 신청',
  applySubtitle: '아래 양식을 작성하여 교육에 신청해 주세요',
  successMessage: '교육 신청이 완료되었습니다',
  successDescription: '입력하신 이메일로 확인 메일이 발송됩니다',
  fields: { /* 필드별 라벨, placeholder, 도움말 */ },
  emptyMessage: '현재 모집 중인 교육이 없습니다',
} as const
```

**의존성**: 없음

---

#### 3-3-2. Education 소개 페이지

**파일**: `src/app/(main)/education/page.tsx` (서버 async) + `src/app/(main)/education/education-content.tsx` (클라이언트)

**상세**:

- **데이터 페칭**: Sanity `EDUCATION_LIST_QUERY` (ISR `revalidate: 3600`)
  - education 스키마: 기수명, 일정(시작일~종료일), 커리큘럼, 모집 상태(recruiting/closed/upcoming)
- **레이아웃**:
  1. 히어로 배너: "평화학교" 타이틀 + 서브타이틀
  2. 교육 소개 텍스트: PCK 평화학교 취지 설명 (상수)
  3. 현재/예정 기수 카드 목록:
     - 기수명, 기간, 모집 상태 뱃지 (recruiting: peace-olive / closed: muted / upcoming: peace-sky)
     - 커리큘럼 아코디언(Accordion shadcn/ui) 또는 리스트
     - 모집 중일 때 "신청하기" 버튼 → `/education/apply?cohort={기수ID}`
  4. 지난 기수 히스토리 (접힌 상태, 클릭 확장)
- `export const metadata` SEO
- Framer Motion stagger 순차 등장
- 빈 상태 UI (Sanity 데이터 없을 때)

**의존성**: 3-3-1, 1-5 (Sanity education 스키마)

---

#### 3-3-3. Education 신청 폼 페이지

**파일**: `src/app/(main)/education/apply/page.tsx` (서버) + `src/app/(main)/education/apply/apply-form.tsx` (클라이언트)

**상세**:

- **클라이언트 폼**: `react-hook-form` + `@hookform/resolvers/zod` + `educationApplySchema`
- **필드 목록**:
  | 필드 | 타입 | 필수 | 검증 |
  |------|------|------|------|
  | 이름 | Input | ✅ | 2~50자 |
  | 이메일 | Input (email) | ✅ | 이메일 형식 |
  | 전화번호 | Input (tel) | ✅ | 한국 전화번호 |
  | 소속 | Input | ❌ | 최대 100자 |
  | 지원 동기 | Textarea | ✅ | 10~500자 (글자수 카운터) |
  | 개인정보처리방침 동의 | Checkbox | ✅ | true 필수 |
- **URL 쿼리**: `?cohort={기수ID}` → 기수 자동 선택 (Sanity에서 현재 모집중인 기수)
- **제출**: `useActionState` + Server Action (`src/app/actions/education.ts`)
- **상태 표시**: 로딩 스피너, 성공 메시지 (CheckCircle), 에러 메시지 (AlertCircle)
- **접근성**: `aria-describedby` 에러 메시지 연결, `aria-required` 필수 필드

**의존성**: 3-3-1

---

#### 3-3-4. Education Server Action

**파일**: `src/app/actions/education.ts`

**플로우**:

```
1. FormData → educationApplySchema.safeParse (서버 재검증)
2. 실패 → { success: false, error: fieldErrors }
3. 성공 → prisma.educationApplication.create({ name, email, phone, affiliation, motivation, cohort })
4. Resend 이메일 발송:
   a. 신청자에게: "교육 신청 접수 확인" (이름, 기수명, 안내사항)
   b. 관리자에게: "새로운 교육 신청" (신청자 정보 요약)
5. { success: true, message: '교육 신청이 완료되었습니다' }
```

**패턴**: Newsletter Server Action과 동일 (Zod 재검증 + Prisma + Resend)

**의존성**: 3-3-1, 1-3 (Prisma)

---

#### 3-3-5. 빌드 검증

- `tsc --noEmit` + `npm run lint` + `npm run build`
- `/education` + `/education/apply` 라우트 확인

---

### 3-4. 회원 커뮤니티 (인증 + 게시판)

> **우선순위 3** — NextAuth 인증 + Prisma CommunityPost/Comment 모델 활용

#### 3-4-1. 인증 페이지 (로그인/회원가입)

**파일**:

| 파일 | 설명 |
|------|------|
| `src/app/(auth)/layout.tsx` | 인증 레이아웃 (센터 정렬, 로고) |
| `src/app/(auth)/login/page.tsx` | 로그인 페이지 |
| `src/app/(auth)/login/login-form.tsx` | 로그인 폼 (클라이언트) |
| `src/app/(auth)/register/page.tsx` | 회원가입 페이지 |
| `src/app/(auth)/register/register-form.tsx` | 회원가입 폼 (클라이언트) |
| `src/app/actions/auth.ts` | 회원가입 Server Action |
| `src/lib/validations/auth.ts` | 로그인/회원가입 Zod 스키마 |

**로그인 폼**:

- 이메일 + 비밀번호 Credentials 로그인
- 카카오 소셜 로그인 버튼 (아이콘 + "카카오로 로그인")
- "비밀번호를 잊으셨나요?" 링크 (Phase 4)
- `signIn('credentials', { email, password, redirectTo: callbackUrl || '/' })`
- 에러 처리: "이메일 또는 비밀번호가 올바르지 않습니다"

**회원가입 폼**:

- 필드: 이름(2~50자), 이메일(unique), 비밀번호(8자이상), 비밀번호 확인
- Zod `.refine()` 비밀번호 일치 검증
- Server Action → `bcrypt.hash(password, 12)` → `prisma.user.create()`
- 이메일 중복 시 "이미 등록된 이메일입니다" 에러
- 성공 시 자동 로그인 후 리다이렉트

**Zod 스키마** (`src/lib/validations/auth.ts`):

```typescript
export const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해 주세요'),
})

export const registerSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다').max(50),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
})
```

**의존성**: 1-4 (NextAuth)

---

#### 3-4-2. 커뮤니티 상수 + Zod 스키마

**파일**: `src/lib/constants/community.ts`, `src/lib/validations/community.ts`

**상수**:

```typescript
export const BOARD_TYPES = {
  FREE: { label: '자유게시판', description: '자유로운 이야기를 나눕니다' },
  PEACE_SHARING: { label: '평화 나눔', description: '평화 활동 경험을 공유합니다' },
} as const

export const COMMUNITY_CONFIG = {
  postsPerPage: 20,
  hero: { title: '커뮤니티', subtitle: '회원 여러분과 함께하는 공간' },
  emptyMessage: '아직 작성된 글이 없습니다',
  writeButton: '글쓰기',
} as const
```

**Zod 스키마**:

```typescript
export const postSchema = z.object({
  title: z.string().min(2, '제목은 2자 이상이어야 합니다').max(200),
  content: z.string().min(10, '내용은 10자 이상이어야 합니다').max(10000),
  boardType: z.enum(['FREE', 'PEACE_SHARING']),
})

export const commentSchema = z.object({
  content: z.string().min(1, '댓글을 입력해 주세요').max(1000),
})
```

**의존성**: 없음

---

#### 3-4-3. 커뮤니티 게시판 목록 페이지

**파일**: `src/app/(main)/community/page.tsx` (서버) + `src/app/(main)/community/community-list.tsx` (클라이언트)

**상세**:

- **데이터 페칭**: Prisma `communityPost.findMany()` + 페이지네이션 (20건씩)
  - `include: { author: { select: { name: true } }, _count: { select: { comments: true } } }`
  - `orderBy: { createdAt: 'desc' }`
- **게시판 탭**: 자유게시판 / 평화 나눔 (URL searchParams `?board=FREE`)
- **목록 테이블/카드**: 제목 + 작성자 + 날짜 + 댓글 수
  - 데스크톱: 테이블 레이아웃 (Table shadcn/ui)
  - 모바일: 카드 레이아웃
- **글쓰기 버튼**: 우측 상단 고정, peace-orange, `/community/write` 링크
- **페이지네이션**: 2-4 뉴스 목록과 동일 패턴 (URL searchParams `?page=N`)
- `export const metadata` SEO
- 빈 상태 UI

**의존성**: 3-4-2, 1-3 (Prisma), 1-4 (인증 — middleware 보호)

---

#### 3-4-4. 커뮤니티 글쓰기/수정 페이지

**파일**:

| 파일 | 설명 |
|------|------|
| `src/app/(main)/community/write/page.tsx` | 글쓰기 서버 래퍼 |
| `src/app/(main)/community/write/write-form.tsx` | 글쓰기 폼 (클라이언트) |
| `src/app/(main)/community/[id]/edit/page.tsx` | 글수정 서버 래퍼 (본인 확인) |
| `src/app/actions/community.ts` | 게시글 CRUD Server Actions |

**글쓰기 폼**:

- 게시판 선택: Select (자유게시판/평화 나눔)
- 제목: Input (2~200자)
- 내용: Textarea (10~10000자)
- `react-hook-form` + `postSchema` Zod 검증
- Server Action: `createPost` → `prisma.communityPost.create()`

**글수정**:

- `page.tsx`에서 `auth()` 세션 확인 + `post.authorId === session.user.id` 본인 확인
- 본인 아닌 경우 `notFound()` 또는 403 처리
- 기존 데이터 프리필 → `updatePost` Server Action

**삭제**:

- `deletePost` Server Action — `post.authorId === session.user.id` 확인 후 삭제
- 확인 Dialog (AlertDialog shadcn/ui) "정말 삭제하시겠습니까?"

**의존성**: 3-4-2, 1-3, 1-4

---

#### 3-4-5. 커뮤니티 게시글 상세 + 댓글

**파일**: `src/app/(main)/community/[id]/page.tsx` (서버) + `src/app/(main)/community/[id]/post-detail.tsx` (클라이언트)

**상세**:

- **게시글**: 제목 + 작성자 + 날짜 + 본문 (줄바꿈 유지 `whitespace-pre-wrap`)
- **수정/삭제 버튼**: 본인 글일 때만 표시 (`session.user.id === post.authorId`)
- **댓글 목록**: `post.comments` + `author.name` + 날짜
- **댓글 입력 폼**: Textarea + 등록 버튼 (`commentSchema` Zod 검증)
- **댓글 삭제**: 본인 댓글만 삭제 가능 (X 버튼)
- **Server Actions**: `createComment`, `deleteComment`
- `generateMetadata` 동적 제목
- 존재하지 않는 ID → `notFound()`

**의존성**: 3-4-2, 3-4-4, 1-3, 1-4

---

#### 3-4-6. 빌드 검증

- `tsc --noEmit` + `npm run lint` + `npm run build`
- `/login`, `/register`, `/community`, `/community/write`, `/community/[id]` 라우트 확인
- middleware 보호: 비로그인 상태에서 `/community` 접근 → `/login` 리다이렉트 확인

---

#### 3-4-7. Header/MobileNav 로그인 상태 표시

**수정 파일**: `src/components/organisms/Header.tsx`, `src/components/organisms/MobileNav.tsx`

**상세**:

- **비로그인 상태**: "로그인" 버튼 표시 → `/login` 이동
- **로그인 상태**: 사용자 이름 + "로그아웃" 버튼 표시 → `signOut()` 호출
- **커뮤니티 메뉴**: Header 메뉴에 이미 포함 (middleware가 보호), 로그인 시 정상 접근
- `useSession()` (next-auth/react) 사용하여 클라이언트에서 세션 확인
- `SessionProvider` 래핑 필요 (루트 레이아웃 또는 MainLayout)

**의존성**: 3-4-1 (NextAuth 설정 완료)

---

### 3-6. 다국어(한/영) 적용

> **우선순위 4** — next-intl 설치 완료, 기존 페이지 텍스트 i18n 키로 교체 필요

#### 3-6-1. next-intl 설정 파일

**파일**:

| 파일 | 설명 |
|------|------|
| `src/i18n/routing.ts` | 로케일 정의 + 라우팅 설정 |
| `src/i18n/request.ts` | 서버 요청별 메시지 로딩 |
| `src/i18n/navigation.ts` | `createNavigation()` 유틸 (Link, redirect, usePathname) |

**routing.ts**:

```typescript
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ko', 'en'],
  defaultLocale: 'ko',
  localePrefix: 'as-needed', // ko: prefix 없음, en: /en/...
})
```

**request.ts**:

```typescript
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'ko' | 'en')) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
```

**의존성**: 없음

---

#### 3-6-2. 번역 파일 (ko/en)

**파일**: `src/i18n/messages/ko.json`, `src/i18n/messages/en.json`

**구조** (네임스페이스 기반):

```json
{
  "common": {
    "donate": "후원하기",
    "learnMore": "더 알아보기",
    "readMore": "자세히 보기"
  },
  "header": {
    "about": "단체 소개",
    "activities": "활동",
    "education": "교육",
    "news": "뉴스",
    "network": "네트워크",
    "transparency": "재정 공개"
  },
  "footer": { ... },
  "home": {
    "hero": { "typing": "그리스도의 평화", "subtitle": "..." },
    "impact": { ... },
    "donation": { ... },
    "newsletter": { ... }
  },
  "about": { ... },
  "network": { ... }
}
```

**적용 범위**: Header, Footer, 홈페이지, About, Network 공통 텍스트
**제외**: 뉴스(Sanity CMS 관리), 커뮤니티(사용자 생성 콘텐츠), 관리자

**의존성**: 없음

---

#### 3-6-3. 라우트 구조 마이그레이션

**변경 사항**:

- `src/app/(main)/layout.tsx` → `src/app/[locale]/(main)/layout.tsx`
- `src/app/layout.tsx` → next-intl `NextIntlClientProvider` 래핑
- `middleware.ts` 수정: next-intl `createMiddleware` + 기존 auth 미들웨어 조합
- 기존 페이지 파일: `useTranslations()` 훅으로 하드코딩 텍스트 교체

**Header 언어 전환**:

- 기존 TopBar 내 "KO | EN" 링크 → 실제 `Link` (`usePathname` + locale 전환)
- 현재 언어 강조 (bold + 밑줄)

**의존성**: 3-6-1, 3-6-2, 모든 기존 페이지

---

#### 3-6-4. 빌드 검증

- `tsc --noEmit` + `npm run lint` + `npm run build`
- `/about` (한국어 기본) + `/en/about` (영어) 라우트 확인
- Header 언어 토글 동작 확인

---

### 3-2. 재정 투명성 시스템 (영수증 OCR + 자동 분류)

> **우선순위 5** — Recharts + Supabase Storage + Claude Vision API 연동
> 핵심 신규 기능: 영수증 사진 업로드 → AI OCR 자동 판독 → 카테고리 분류 → 제경비 자동 등록

#### 시스템 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────────┐
│                    영수증 OCR 제경비 시스템                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [입력 경로 1: 웹 UI]                                            │
│  관리자 브라우저 → 드래그&드롭/파일선택 → /api/finance/receipt-scan │
│                                                                 │
│  [입력 경로 2: 로컬 폴더 감시]                                    │
│  PC 폴더 (예: C:\영수증\) → chokidar 감시 → /api/finance/receipt-scan │
│  (별도 CLI 스크립트: scripts/receipt-watcher.ts)                  │
│                                                                 │
│  ┌─────────────────────────────────────┐                        │
│  │  /api/finance/receipt-scan          │                        │
│  │  1. ADMIN 권한 확인 (또는 API Key)  │                        │
│  │  2. 파일 유효성 (타입/크기)         │                        │
│  │  3. Supabase Storage 업로드         │                        │
│  │  4. Claude Vision API OCR           │                        │
│  │  5. JSON 구조화 데이터 반환         │                        │
│  └──────────────┬──────────────────────┘                        │
│                 │                                                │
│                 ▼                                                │
│  ┌─────────────────────────────────────┐                        │
│  │  OCR 결과 JSON                      │                        │
│  │  {                                  │                        │
│  │    imageUrl: "https://supabase/...",│                        │
│  │    extracted: {                     │                        │
│  │      date: "2026-03-15",            │                        │
│  │      description: "사무용품 구매",   │                        │
│  │      amount: 35000,                 │                        │
│  │      category: "OFFICE",            │                        │
│  │      note: "A4용지 10박스"          │                        │
│  │    }                                │                        │
│  │  }                                  │                        │
│  └──────────────┬──────────────────────┘                        │
│                 │                                                │
│      ┌──────────┴──────────┐                                    │
│      ▼                     ▼                                    │
│  [웹 UI 경로]         [폴더 감시 경로]                           │
│  관리자 확인/수정      자동 DB 저장                               │
│  화면 → 저장           (status: PENDING_REVIEW)                  │
│                        → 관리자 추후 검토                         │
│                                                                 │
│                 ▼                                                │
│  ┌─────────────────────────────────────┐                        │
│  │  Prisma DB (Expense 테이블)         │                        │
│  │  + receipt: Supabase Storage URL    │                        │
│  │  + ocrConfidence: AI 신뢰도         │                        │
│  │  + ocrRawText: 원본 OCR 텍스트      │                        │
│  └─────────────────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

#### Claude Vision API 프롬프트 설계

```typescript
const RECEIPT_SCAN_PROMPT = `
이 영수증/간이영수증 이미지를 분석해주세요.
다음 JSON 형식으로 정보를 추출하세요 (JSON만 반환, 다른 텍스트 불필요):

{
  "date": "YYYY-MM-DD 또는 null",
  "description": "지출 항목 요약 (20자 이내)",
  "amount": 숫자(원 단위, 정수) 또는 null,
  "category": "PERSONNEL" | "OFFICE" | "EVENT" | "TRANSPORT" | "OTHER",
  "note": "상세 내용 (상호명, 품목 등)",
  "confidence": 0.0~1.0 (인식 신뢰도)
}

카테고리 분류 기준:
- PERSONNEL: 인건비, 급여, 강사료, 용역비
- OFFICE: 사무용품, 인쇄, 통신, 임대료, 소프트웨어
- EVENT: 행사, 세미나, 워크숍, 식비(행사용), 현수막
- TRANSPORT: 교통비, 주유, 택시, 주차, 톨게이트
- OTHER: 위에 해당하지 않는 항목

읽을 수 없는 부분은 null로 표시하세요.
`
```

---

#### 3-2-1. 패키지 설치 + Supabase Storage + 재정 상수 + Zod 스키마

**추가 설치**:

```bash
npm install recharts @anthropic-ai/sdk @supabase/supabase-js chokidar
```

| 패키지 | 용도 |
|--------|------|
| `recharts` | 재정 투명성 페이지 도넛 차트 |
| `@anthropic-ai/sdk` | Claude Vision API (영수증 OCR) |
| `@supabase/supabase-js` | Supabase Storage (영수증 이미지 저장) |
| `chokidar` | 로컬 폴더 감시 (영수증 자동 업로드) |

**환경변수 추가** (`.env` + `.env.example`):

```env
# Supabase Storage
SUPABASE_URL="https://bsccnnpebrxuinymziyn.supabase.co"
SUPABASE_SERVICE_KEY="eyJ..."

# Anthropic Claude Vision API
ANTHROPIC_API_KEY="sk-ant-..."

# 영수증 로컬 감시 폴더 (선택, CLI 전용)
RECEIPT_WATCH_DIR="C:\\영수증"
```

**파일**: `src/lib/supabase/storage.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
)

export async function uploadReceipt(
  file: Buffer,
  filename: string,
): Promise<string> {
  const path = `receipts/${Date.now()}-${filename}`
  const { error } = await supabase.storage
    .from('receipts')
    .upload(path, file, { contentType: 'image/*', upsert: false })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)

  const { data } = supabase.storage.from('receipts').getPublicUrl(path)
  return data.publicUrl
}

export async function deleteReceipt(url: string): Promise<void> {
  const path = url.split('/receipts/')[1]
  if (path) {
    await supabase.storage.from('receipts').remove([`receipts/${path}`])
  }
}
```

**파일**: `src/lib/ocr/claude-vision.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export interface OcrResult {
  date: string | null
  description: string
  amount: number | null
  category: 'PERSONNEL' | 'OFFICE' | 'EVENT' | 'TRANSPORT' | 'OTHER'
  note: string
  confidence: number
}

export async function scanReceipt(
  imageBuffer: Buffer,
  mimeType: string,
): Promise<OcrResult> {
  const base64 = imageBuffer.toString('base64')

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mimeType, data: base64 },
          },
          { type: 'text', text: RECEIPT_SCAN_PROMPT },
        ],
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return JSON.parse(text) as OcrResult
}
```

**파일**: `src/lib/constants/finance.ts`, `src/lib/validations/finance.ts`

**Zod 스키마**:

```typescript
export const expenseSchema = z.object({
  date: z.coerce.date(),
  description: z.string().min(2, '항목명은 2자 이상이어야 합니다').max(200),
  category: z.enum(['PERSONNEL', 'OFFICE', 'EVENT', 'TRANSPORT', 'OTHER']),
  amount: z.number().int().positive('금액은 0보다 커야 합니다'),
  receipt: z.string().url().optional(),       // Supabase Storage URL
  ocrConfidence: z.number().min(0).max(1).optional(),
  ocrRawText: z.string().max(2000).optional(),
  note: z.string().max(500).optional(),
})

export const budgetSchema = z.object({
  year: z.number().int().min(2019).max(2030),
  category: z.enum(['PERSONNEL', 'OFFICE', 'EVENT', 'TRANSPORT', 'OTHER']),
  amount: z.number().int().positive('금액은 0보다 커야 합니다'),
})

export const reportSchema = z.object({
  year: z.number().int().min(2019).max(2030),
  isPublished: z.boolean().default(false),
})
```

**상수**:

```typescript
export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  PERSONNEL: '인건비', OFFICE: '사무비', EVENT: '행사비', TRANSPORT: '교통비', OTHER: '기타',
}

export const EXPENSE_CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  PERSONNEL: '#4a90d9', OFFICE: '#6b8f47', EVENT: '#c9a84c', TRANSPORT: '#e8911a', OTHER: '#94a3b8',
}

export const RECEIPT_CONFIG = {
  maxFileSize: 10 * 1024 * 1024,  // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
  storageBucket: 'receipts',
} as const

export const FINANCE_CONFIG = {
  admin: { title: '재정 관리', subtitle: '제경비·예산·결산 관리' },
  transparency: { title: '재정 공개', subtitle: '투명한 재정 운용 현황' },
  emptyMessage: '등록된 재정 데이터가 없습니다',
} as const
```

**Prisma 스키마 수정** (`Expense` 모델 필드 추가):

```prisma
model Expense {
  id            String          @id @default(cuid())
  date          DateTime
  description   String
  category      ExpenseCategory
  amount        Int
  receipt       String?         // Supabase Storage URL (기존)
  ocrConfidence Float?          // AI OCR 신뢰도 0.0~1.0 (신규)
  ocrRawText    String?         // OCR 원본 텍스트 (신규)
  status        String          @default("CONFIRMED") // CONFIRMED | PENDING_REVIEW (신규)
  note          String?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  @@index([date])
  @@index([category])
  @@index([status])
  @@map("expenses")
}
```

**의존성**: 없음

**Supabase Storage 설정** (Supabase 대시보드에서):

1. Storage → New Bucket → `receipts` (Public 또는 Authenticated)
2. Policies: `service_role`만 업로드/삭제 허용
3. 최대 파일 크기: 10MB

---

#### 3-2-2. 관리자 레이아웃

**파일**:

| 파일 | 설명 |
|------|------|
| `src/app/(admin)/layout.tsx` | 관리자 레이아웃 (ADMIN 권한 체크 + 사이드바) |
| `src/app/(admin)/page.tsx` | 관리자 대시보드 (간단 통계) |

**layout.tsx 상세**:

- `auth()` 세션 확인 → `user.role !== 'ADMIN'` → `redirect('/login')`
- **사이드바 메뉴**: 재정 관리(제경비/예산/후원금/결산), 영수증 스캔, 교육 관리, 회원 관리
- **반응형**: 데스크톱 좌측 사이드바 240px / 모바일 상단 드롭다운
- 관리자 전용 스타일 (peace-navy 사이드바)

**대시보드**:

- 요약 카드 4개: 총 후원금, 총 지출, 회원 수, 이번 달 교육 신청
- **OCR 대기 건수 뱃지**: `Expense.count({ where: { status: 'PENDING_REVIEW' } })`
- Prisma `aggregate` / `count` 쿼리

**의존성**: 1-4 (인증 ADMIN), 1-3 (Prisma)

---

#### 3-2-3. 영수증 OCR 스캔 API + 업로드 UI

**파일**:

| 파일 | 설명 |
|------|------|
| `src/app/api/finance/receipt-scan/route.ts` | 영수증 업로드 + OCR API Route |
| `src/app/(admin)/finance/expenses/receipt-uploader.tsx` | 영수증 드래그&드롭 업로드 컴포넌트 (클라이언트) |
| `src/app/(admin)/finance/expenses/scan-result-form.tsx` | OCR 결과 확인/수정 폼 (클라이언트) |

**API Route `/api/finance/receipt-scan`** (POST):

```typescript
// 1. ADMIN 세션 확인 (또는 X-API-Key 헤더로 CLI 스크립트 인증)
// 2. FormData에서 파일 추출
// 3. 파일 유효성 검사 (타입: JPEG/PNG/WebP/HEIC, 크기: ≤10MB)
// 4. Supabase Storage 업로드 → imageUrl 획득
// 5. Claude Vision API 호출 → OcrResult 획득
// 6. Rate Limiting: IP 기반 20회/분 (OCR API 비용 보호)
// 7. JSON 응답: { imageUrl, extracted: OcrResult }
```

**ReceiptUploader 컴포넌트**:

```
┌─────────────────────────────────────────┐
│                                         │
│    📷 영수증 이미지를 드래그하거나       │
│       클릭하여 업로드하세요             │
│                                         │
│    지원 형식: JPG, PNG, WebP, HEIC      │
│    최대 크기: 10MB                      │
│                                         │
│    [파일 선택]                           │
│                                         │
└─────────────────────────────────────────┘
```

- 드래그 앤 드롭 영역 (`onDragOver`, `onDrop`)
- 파일 선택 input (`accept="image/*"`)
- 업로드 진행 프로그레스바
- 이미지 미리보기 (업로드 전 로컬 미리보기)
- 스캔 중 로딩 스피너 + "AI가 영수증을 분석하고 있습니다..."

**ScanResultForm 컴포넌트** (OCR 결과 확인):

```
┌───────────────────────────────────────────────────┐
│                                                   │
│  ┌──────────────┐   ┌────────────────────────┐   │
│  │              │   │ 📅 날짜: [2026-03-15]   │   │
│  │   영수증     │   │ 📝 항목: [사무용품 구매] │   │
│  │   미리보기   │   │ 💰 금액: [35,000]       │   │
│  │   (이미지)   │   │ 🏷️ 분류: [사무비 ▼]     │   │
│  │              │   │ 📋 비고: [A4용지 10박스] │   │
│  │              │   │ 🎯 신뢰도: 92%          │   │
│  └──────────────┘   │                        │   │
│                     │ [✅ 저장] [🔄 다시 스캔] │   │
│                     └────────────────────────┘   │
│                                                   │
└───────────────────────────────────────────────────┘
```

- 좌측: 영수증 이미지 미리보기 (확대 가능)
- 우측: OCR 추출 데이터 (모든 필드 수정 가능)
- 신뢰도 표시: ≥0.8 녹색, 0.5~0.8 노란색, <0.5 빨간색 (수동 확인 강조)
- "저장" → Server Action `createExpense` 호출
- "다시 스캔" → 동일 이미지로 OCR 재요청

**의존성**: 3-2-1

---

#### 3-2-4. 제경비 관리 (CRUD)

**파일**:

| 파일 | 설명 |
|------|------|
| `src/app/(admin)/finance/expenses/page.tsx` | 제경비 목록 (테이블, 필터, 검색) |
| `src/app/(admin)/finance/expenses/expense-list.tsx` | 목록 클라이언트 컴포넌트 |
| `src/app/(admin)/finance/expenses/new/page.tsx` | 제경비 등록 (수동 + 영수증 스캔 탭) |
| `src/app/(admin)/finance/expenses/[id]/edit/page.tsx` | 제경비 수정 폼 |
| `src/app/actions/finance.ts` | 재정 Server Actions |

**목록 페이지**:

- **테이블 컬럼**: 날짜, 항목명, 카테고리(뱃지), 금액(toLocaleString), 영수증(🖼️ 아이콘), 상태(뱃지), 비고, 액션(수정/삭제)
- **상태 뱃지**: `CONFIRMED`(확인됨/녹색) / `PENDING_REVIEW`(검토 대기/노란색)
- **필터**: 카테고리 Select + 기간 DateRange + 상태 Select
- **정렬**: 날짜 내림차순 기본, 금액/카테고리 정렬 토글
- **페이지네이션**: 20건씩
- **합계 표시**: 필터 적용 후 총 금액 합계
- **일괄 확인**: PENDING_REVIEW 항목 체크박스 → "선택 항목 확인" 버튼

**등록 페이지 (2탭 구조)**:

- **탭 1 — 영수증 스캔**: `ReceiptUploader` → `ScanResultForm` → 저장
- **탭 2 — 수동 입력**: 기존 폼 (날짜, 카테고리, 금액, 비고)

**Server Actions**:

- `createExpense(formData)` → Zod → `prisma.expense.create()` (receipt URL + OCR 데이터 포함)
- `updateExpense(id, formData)` → Zod → `prisma.expense.update()`
- `deleteExpense(id)` → `prisma.expense.delete()` + Supabase Storage 영수증 삭제 + `revalidatePath`
- `confirmExpenses(ids)` → `prisma.expense.updateMany({ where: { id: { in: ids } }, data: { status: 'CONFIRMED' } })`

**의존성**: 3-2-1, 3-2-2, 3-2-3

---

#### 3-2-5. 로컬 폴더 감시 CLI 스크립트

**파일**:

| 파일 | 설명 |
|------|------|
| `scripts/receipt-watcher.ts` | 로컬 폴더 감시 + 자동 업로드 CLI |
| `scripts/receipt-watcher.config.ts` | 감시 설정 (폴더 경로, API URL, 인증키) |

**receipt-watcher.ts 동작 흐름**:

```
1. chokidar로 RECEIPT_WATCH_DIR 감시 시작
2. 새 이미지 파일 감지 (*.jpg, *.jpeg, *.png, *.webp, *.heic)
3. 파일 읽기 → FormData 생성
4. fetch('/api/finance/receipt-scan') 호출
   - Header: X-API-Key (관리자 인증)
5. OCR 결과 수신
6. 자동으로 Expense DB 저장 (status: 'PENDING_REVIEW')
7. 원본 파일 → 처리완료 폴더로 이동 (RECEIPT_WATCH_DIR/processed/)
8. 콘솔 로그 출력: [✅ 처리완료] 2026-03-15 사무용품 구매 35,000원 (OFFICE)
```

**실행 방법**:

```bash
# 개발 환경
npx tsx scripts/receipt-watcher.ts

# 또는 package.json scripts 등록
npm run receipt:watch
```

**설정 (receipt-watcher.config.ts)**:

```typescript
export const WATCHER_CONFIG = {
  watchDir: process.env.RECEIPT_WATCH_DIR || 'C:\\영수증',
  processedDir: 'processed',     // watchDir 하위 처리완료 폴더
  apiUrl: process.env.AUTH_URL || 'http://localhost:3000',
  apiKey: process.env.RECEIPT_API_KEY || '', // 관리자 인증키
  extensions: ['.jpg', '.jpeg', '.png', '.webp', '.heic'],
  pollInterval: 1000,            // ms
  debounceDelay: 500,            // 파일 쓰기 완료 대기
} as const
```

**API 인증 확장** (`/api/finance/receipt-scan`):

```typescript
// 기존: ADMIN 세션 확인
// 추가: X-API-Key 헤더 확인 (CLI 스크립트용)
const apiKey = request.headers.get('x-api-key')
if (apiKey === process.env.RECEIPT_API_KEY) {
  // CLI 스크립트 인증 통과
} else {
  // 기존 세션 기반 ADMIN 인증
}
```

**환경변수 추가**:

```env
# 영수증 CLI 인증키 (서버 전용)
RECEIPT_API_KEY="pck-receipt-{랜덤32자}"
```

**의존성**: 3-2-1, 3-2-3

---

#### 3-2-6. 예산 관리

**파일**:

| 파일 | 설명 |
|------|------|
| `src/app/(admin)/finance/budget/page.tsx` | 예산 편성/집행 현황 |
| `src/app/(admin)/finance/budget/budget-table.tsx` | 예산 테이블 (클라이언트) |
| `src/app/(admin)/finance/budget/new/page.tsx` | 예산 항목 등록 |

**예산 현황 페이지**:

- **연도 선택**: Select (2019~현재)
- **테이블**: 카테고리, 편성액, 집행액(Expense 합계 자동계산), 잔액, 집행률 프로그레스바
- 집행 금액 = `prisma.expense.aggregate({ where: { category, date: { gte: yearStart, lte: yearEnd }, status: 'CONFIRMED' }, _sum: { amount: true } })`
- 잔액 = 편성액 - 집행액 (음수 시 빨간색 경고)
- **프로그레스바**: shadcn/ui Progress, 100% 초과 시 `destructive` 색상

**예산 등록**:

- 연도 + 카테고리 + 편성 금액
- `@@unique([year, category])` → 이미 존재 시 "이미 등록된 항목입니다" (upsert 제안)

**의존성**: 3-2-1, 3-2-2

---

#### 3-2-7. 결산 보고서 관리

**파일**:

| 파일 | 설명 |
|------|------|
| `src/app/(admin)/finance/reports/page.tsx` | 결산 보고서 목록/생성 |
| `src/app/(admin)/finance/reports/report-form.tsx` | 결산 보고서 생성 폼 (클라이언트) |

**결산 보고서 생성**:

- 연도 선택 → "보고서 생성" 버튼
- Server Action: `generateReport(year)`:
  1. `totalIncome = prisma.donation.aggregate({ where: { status: 'COMPLETED', createdAt: yearRange }, _sum: { amount: true } })`
  2. `totalExpense = prisma.expense.aggregate({ where: { date: yearRange, status: 'CONFIRMED' }, _sum: { amount: true } })`
  3. `prisma.financeReport.upsert({ where: { year }, create: { year, totalIncome, totalExpense }, update: { totalIncome, totalExpense } })`
- **PENDING_REVIEW 경고**: 미확인 영수증이 있으면 "검토 대기 N건이 있습니다" 알림
- isPublished 토글 → 공개/비공개 전환
- PDF URL: 현재는 수동 업로드 (URL 입력), 향후 서버 PDF 생성

**의존성**: 3-2-1, 3-2-2

---

#### 3-2-8. 재정 투명성 공개 페이지

**파일**:

| 파일 | 설명 |
|------|------|
| `src/app/[locale]/(main)/transparency/page.tsx` | 연도별 재정 현황 요약 (서버) |
| `src/app/[locale]/(main)/transparency/transparency-content.tsx` | 차트 + 카드 (클라이언트) |
| `src/app/[locale]/(main)/transparency/[year]/page.tsx` | 연도별 상세 보고서 (서버) |
| `src/components/molecules/DonutChart.tsx` | Recharts 도넛 차트 래퍼 |

**투명성 메인 페이지**:

- **데이터**: `prisma.financeReport.findMany({ where: { isPublished: true }, orderBy: { year: 'desc' } })`
- **연도별 요약 카드**: 수입(peace-olive) + 지출(peace-orange) + 잔액 표시
- 카드 클릭 → `/transparency/[year]` 상세 이동

**연도별 상세 보고서**:

- **수입·지출 총액 카드**: 큰 숫자 (`toLocaleString`) + 전년 대비 증감
- **카테고리별 지출 도넛 차트**: Recharts `PieChart` + `Cell` (5가지 EXPENSE_CATEGORY_COLORS)
- **카테고리별 지출 테이블**: 카테고리명 + 금액 + 비율(%)
- **결산 보고서 PDF 다운로드**: `pdfUrl` 존재 시 다운로드 링크
- ISR `revalidate: 3600`
- `generateMetadata` SEO

**DonutChart 컴포넌트**:

- Recharts `PieChart` + `Pie` + `Cell` + `Tooltip` + `Legend`
- Props: `data: { name: string, value: number, color: string }[]`
- 반응형 크기: 데스크톱 300×300, 모바일 250×250
- 다크모드 대응 (배경/텍스트 색상)
- `dynamic(() => import('./DonutChart'), { ssr: false })` SSR 비활성화 (Recharts)

**의존성**: 3-2-1, 3-2-7

---

#### 3-2-9. 빌드 검증

- `tsc --noEmit` + `npm run lint` + `npm run build`
- `/admin/finance/*`, `/transparency`, `/transparency/[year]` 라우트 확인
- 영수증 OCR API 테스트 (이미지 업로드 → JSON 응답)
- 로컬 폴더 감시 스크립트 테스트 (`npm run receipt:watch`)

---

#### 의존성 체인 (Phase 3-2)

```
3-2-1 (패키지 + Storage + 상수 + Zod + Prisma 수정)
  ↓
3-2-2 (관리자 레이아웃) ← 1-4 (NextAuth ADMIN)
  ↓
3-2-3 (영수증 OCR API + 업로드 UI) ← 3-2-1
  ↓
3-2-4 (제경비 CRUD + OCR 통합) ← 3-2-1, 3-2-2, 3-2-3
3-2-5 (로컬 폴더 감시 CLI) ← 3-2-1, 3-2-3
3-2-6 (예산 관리) ← 3-2-1, 3-2-2
3-2-7 (결산 보고서) ← 3-2-1, 3-2-2
  ↓
3-2-8 (투명성 공개 페이지) ← 3-2-1, 3-2-7
  ↓
3-2-9 (빌드 검증)
```

---

### 3-1. 후원 시스템 (토스페이먼츠 연동)

> **우선순위 6 (마지막)** — 토스페이먼츠 가맹점 등록 필요 (❗ 외부 블로커)
> 가맹점 미등록 시에도 UI + 결제 플로우 코드는 구현하고, 테스트 키 확보 후 연동 검증

#### 3-1-1. 토스페이먼츠 유틸 + 상수

**추가 설치**: `npm install @tosspayments/tosspayments-sdk`

**파일**:

| 파일 | 설명 |
|------|------|
| `src/lib/payments/toss.ts` | 토스 결제 승인 API 서버 유틸 |
| `src/lib/constants/donate.ts` | 후원 페이지 상수 (기존 donation.ts 확장) |
| `src/lib/validations/donate.ts` | 후원 Zod 스키마 |

**toss.ts 서버 유틸**:

```typescript
const TOSS_SECRET = process.env.TOSS_SECRET_KEY!
const TOSS_API_URL = 'https://api.tosspayments.com/v1/payments'

export async function confirmPayment(paymentKey: string, orderId: string, amount: number) {
  const response = await fetch(`${TOSS_API_URL}/confirm`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${TOSS_SECRET}:`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '결제 승인에 실패했습니다')
  }
  return response.json()
}
```

**Zod 스키마**:

```typescript
export const donateSchema = z.object({
  donorName: z.string().min(2).max(50),
  donorEmail: z.string().email(),
  phone: z.string().regex(/^01[016789]-?\d{3,4}-?\d{4}$/),
  amount: z.number().int().min(1000, '최소 1,000원 이상이어야 합니다'),
  type: z.enum(['REGULAR', 'ONE_TIME']),
  isAnonymous: z.boolean().default(false),
  privacyAgreed: z.literal(true, { message: '개인정보처리방침에 동의해야 합니다' }),
})
```

**의존성**: 없음

---

#### 3-1-2. 후원 페이지

**파일**: `src/app/(main)/donate/page.tsx` (서버) + `src/app/(main)/donate/donate-form.tsx` (클라이언트)

**상세**:

- **탭**: 정기 후원(REGULAR) / 일시 후원(ONE_TIME) — Tabs shadcn/ui
- **금액 선택**: 4개 프리셋 (1만/3만/5만/10만) + 직접 입력 Input
  - URL `?amount=30000` 쿼리 → DonationCTA에서 전달받은 금액 자동 선택
- **개인정보 입력**:
  | 필드 | 타입 | 필수 |
  |------|------|------|
  | 이름 | Input | ✅ |
  | 이메일 | Input (email) | ✅ |
  | 전화번호 | Input (tel) | ✅ |
  | 익명 후원 | Checkbox | ❌ |
  | 개인정보처리방침 동의 | Checkbox | ✅ |
- **"후원하기" 버튼**:
  1. `react-hook-form` + `donateSchema` 클라이언트 검증
  2. `orderId` 생성: `PCK-{yyyyMMdd}-{nanoid(8)}`
  3. Donation 레코드 PENDING 상태 DB 생성 (Server Action)
  4. 토스페이먼츠 SDK `requestPayment()` 호출 → 결제창 이동
- **반응형**: 2열(md+) — 좌측 금액선택 / 우측 개인정보 입력
- 다크모드 + 접근성

**의존성**: 3-1-1

---

#### 3-1-3. 결제 콜백 + 성공/실패 페이지

**파일**:

| 파일 | 설명 |
|------|------|
| `src/app/(main)/donate/success/page.tsx` | 결제 성공 페이지 (서버) |
| `src/app/(main)/donate/fail/page.tsx` | 결제 실패 페이지 |
| `src/app/api/donate/confirm/route.ts` | 결제 승인 API Route |

**결제 성공 페이지 플로우**:

```
1. 토스 결제 완료 → /donate/success?paymentKey=&orderId=&amount= 리다이렉트
2. success page.tsx (서버):
   a. confirmPayment(paymentKey, orderId, amount) — 토스 API 승인
   b. prisma.donation.update({ where: { orderId }, data: { paymentKey, status: 'COMPLETED', receiptUrl } })
   c. Resend 감사 이메일 발송 (donorName, amount, orderId)
3. 감사 화면 표시: "후원해 주셔서 감사합니다!" + 금액 + 영수증 링크
```

**결제 실패 페이지**:

- `?code=&message=` 쿼리 파라미터 → 에러 메시지 표시
- "다시 시도하기" → `/donate` 링크

**의존성**: 3-1-1, 3-1-2

---

#### 3-1-4. Rate Limiting 설정

**파일**: `src/lib/rate-limit.ts`

**상세**:

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const donateRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10회/분
  prefix: 'donate',
})

export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5회/분
  prefix: 'login',
})
```

**적용 위치**:

- `/api/donate/confirm` → `donateRateLimit` (IP 기반)
- 로그인 Server Action → `loginRateLimit` (IP 기반)
- Upstash Redis 미설정 시 graceful skip (rate limiting 비활성화)

**의존성**: Upstash Redis 생성 필요 (❗ 외부 작업)

---

#### 3-1-5. 빌드 검증

- `tsc --noEmit` + `npm run lint` + `npm run build`
- `/donate`, `/donate/success`, `/donate/fail` 라우트 확인
- Rate Limiting 단위 테스트

---

### Phase 3 구현 순서 요약

| 순서 | 작업 | 소항목 수 | 외부 의존 | 핵심 패턴 |
|------|------|-----------|-----------|-----------|
| 1 | 3-5 네트워크 지도 | 4 | 없음 | react-simple-maps + dynamic import SSR off |
| 2 | 3-3 교육 신청 | 5 | 없음 | react-hook-form + Server Action (Newsletter 패턴) |
| 3 | 3-4 커뮤니티 | 6 | 없음 | NextAuth 인증 + Prisma CRUD + middleware |
| 4 | 3-6 다국어 | 4 | 없음 | next-intl + [locale] 라우트 마이그레이션 |
| 5 | 3-2 재정 투명성 | 7 | Recharts 설치 | 관리자 레이아웃 + Prisma aggregate + 도넛 차트 |
| 6 | 3-1 후원 시스템 | 5 | ❗ 토스 가맹점 + Upstash | 토스 SDK + 결제 승인 API + Rate Limit |
| **합계** | | **31** | | |

---

### Phase 3 완료 체크포인트

| 검증 항목     | 방법                  | 기대 결과          |
| ------------- | --------------------- | ------------------ |
| 네트워크 지도 | /network              | 50개국 핀 + 한국 강조 + 클릭 패널 |
| 교육 소개     | /education            | Sanity 기수 목록 + 모집 상태 |
| 교육 신청     | /education/apply 폼 제출 | DB 저장 + 이메일 |
| 로그인        | /login 이메일 인증    | 세션 생성 + 리다이렉트 |
| 회원가입      | /register 폼 제출     | DB 저장 + 자동 로그인 |
| 커뮤니티 인증 | 비로그인 → /community | /login 리다이렉트 |
| 게시글 CRUD   | 글쓰기/수정/삭제      | DB 반영 + 권한 체크 |
| 댓글 CRUD     | 댓글 작성/삭제        | DB 반영 + 본인만 삭제 |
| 다국어        | 헤더 KO/EN 토글       | 한/영 전환 + URL prefix |
| ADMIN 권한    | 일반 회원 → /admin    | 접근 거부 |
| 재정 CRUD     | 제경비 입력/수정/삭제 | DB 반영 |
| 예산 현황     | /admin/finance/budget | 집행률 프로그레스바 |
| 투명성 페이지 | /transparency         | 도넛 차트 + 보고서 |
| 후원 결제     | 토스 테스트 키 결제   | 성공 → DB + 이메일 |
| Rate Limiting | 로그인 6회 시도       | 429 응답 |
| 빌드          | `npm run build`       | 에러 0건 |

---

## Phase 4 — 마무리 및 배포

### 4-1. SEO 최적화

**파일**:

| 파일                       | 설명                                   |
| -------------------------- | -------------------------------------- |
| `src/app/sitemap.ts`       | 동적 사이트맵 (정적 + Sanity 동적 URL) |
| `src/app/robots.ts`        | robots.txt (크롤링 규칙)               |
| `src/app/api/og/route.tsx` | 동적 OG 이미지 (@vercel/og)            |
| 각 page.tsx                | `generateMetadata` 함수 추가           |

**메타데이터 전략**:

- 모든 페이지에 title, description, openGraph 설정
- 뉴스 상세: 동적 OG 이미지 (제목 + 카테고리 + 로고)
- canonical URL 설정
- 구조화 데이터 (JSON-LD): Organization, WebSite

**의존성**: Phase 2~3 페이지 완료

---

### 4-2. 성능 최적화

**방법**:

- `next/image`: 모든 이미지에 적용, lazy loading, sizes 속성
- `dynamic import`: 무거운 컴포넌트 코드 스플리팅 (PeaceMap, 차트)
- 번들 분석: `@next/bundle-analyzer`로 크기 확인
- 폰트: `next/font/google`로 최적 로딩

**Core Web Vitals 목표**:

- LCP < 2.5초
- FID < 100ms
- CLS < 0.1

**의존성**: 전체 기능 완료

---

### 4-3. 전체 테스트 실행

**명령어**:

```bash
# 단위 + 통합 테스트
npm test -- --coverage

# E2E (선택)
npx playwright test
```

**커버리지 목표**: 핵심 비즈니스 로직 70%+

**핵심 테스트 항목**:

- Zod 스키마 유효성 (후원, 교육 신청, 게시글)
- Zustand 스토어 (언어, 다크모드, 인증)
- 후원 폼 제출 플로우
- 로그인/회원가입 플로우
- 권한 체크 (ADMIN only 경로)

**의존성**: 모든 기능 완료

---

### 4-4. CI/CD 최종 검증

**방법**:

1. feature 브랜치에서 develop으로 PR 생성
2. GitHub Actions CI 자동 실행 확인 (lint + typecheck + build)
3. CI 통과 후 develop 머지
4. develop → main PR 생성
5. CI 통과 + Vercel Preview 배포 확인
6. main 머지 → Vercel 프로덕션 자동 배포

**의존성**: 4-3 완료

---

### 4-5. 프로덕션 배포

**방법**:

1. Vercel 프로젝트 설정:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - 환경변수: .env.example의 모든 키에 실제 값 설정
2. 커스텀 도메인 연결 (paxchristikorea.org 또는 신규 도메인)
3. SSL 인증서 자동 발급 (Vercel 제공)
4. 최종 점검: 모든 페이지 접속 + 기능 동작 확인

**의존성**: 4-4 완료

---

### Phase 4 완료 체크포인트

| 검증 항목       | 방법                     | 기대 결과       |
| --------------- | ------------------------ | --------------- |
| sitemap.xml     | /sitemap.xml 접속        | 전체 URL 목록   |
| robots.txt      | /robots.txt 접속         | 크롤링 규칙     |
| OG 이미지       | SNS 공유                 | 미리보기 표시   |
| Lighthouse 성능 | Lighthouse 실행          | Performance 90+ |
| Core Web Vitals | LCP, CLS 측정            | 기준 충족       |
| 테스트 커버리지 | `npm test -- --coverage` | 70%+            |
| CI 파이프라인   | PR 생성 → CI 실행        | 전체 통과       |
| 프로덕션 빌드   | `npm run build`          | 에러 0건        |
| 배포 확인       | 프로덕션 URL 접속        | 정상            |
| SSL             | HTTPS 접속               | 유효한 인증서   |

---

## 외부 작업 목록 (수동 처리 필요)

| 작업                     | 시점         | 비고                   |
| ------------------------ | ------------ | ---------------------- |
| GitHub 리포지토리 생성   | Phase 0 이후 | 수동 생성, remote 연결 |
| Supabase 프로젝트 생성   | Phase 1-3 전 | DATABASE_URL 확보      |
| Sanity.io 프로젝트 생성  | Phase 1-5 전 | PROJECT_ID 확보        |
| 토스페이먼츠 가맹점 등록 | Phase 3-1 전 | 테스트키/실제키 확보   |
| 카카오 개발자 앱 등록    | Phase 1-4 전 | CLIENT_ID/SECRET 확보  |
| Upstash Redis 생성       | Phase 3-1 전 | REST_URL/TOKEN 확보    |
| Resend 계정 생성         | Phase 3-1 전 | API_KEY 확보           |
| Vercel 프로젝트 연결     | Phase 4-5 전 | GitHub 연동            |
| 도메인 구매/연결         | Phase 4-5 전 | DNS 설정               |
