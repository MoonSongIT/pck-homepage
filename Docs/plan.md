# PCK 웹사이트 리뉴얼 — 전체 구현 계획서

> 최종 수정: 2026-03-20
> 프로젝트: 팍스크리스티코리아(Pax Christi Korea) 공식 웹사이트 리뉴얼
> 기술 스택: Next.js 15 + TypeScript + Tailwind CSS v4 + Supabase + Sanity.io

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

**파일**:

| 파일                                        | 설명                                     |
| ------------------------------------------- | ---------------------------------------- |
| `src/app/(main)/news/page.tsx`              | 뉴스 목록 (카테고리 필터 + 페이지네이션) |
| `src/app/(main)/news/[slug]/page.tsx`       | 뉴스 상세 (Portable Text)                |
| `src/app/(main)/activities/page.tsx`        | 활동 목록                                |
| `src/app/(main)/activities/[slug]/page.tsx` | 활동 상세                                |
| `src/components/molecules/NewsCard.tsx`     | 뉴스 카드 컴포넌트                       |
| `src/app/api/og/route.tsx`                  | 동적 OG 이미지 생성                      |

**뉴스 목록 상세**:

- ISR: `revalidate: 3600` (1시간)
- 카테고리 필터: 한반도평화, 국제활동, 교육, 공지 (URL searchParams)
- 페이지네이션: 12건씩, 이전/다음 버튼
- 검색: 클라이언트 사이드 필터링 (제목 + 본문)
- Skeleton UI: 로딩 상태

**OG 이미지 생성**:

- `@vercel/og` ImageResponse
- 게시글 제목 + 카테고리 + PCK 로고

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

### 3-1. 후원 시스템 (토스페이먼츠 연동)

**파일**:

| 파일                                  | 설명                                    |
| ------------------------------------- | --------------------------------------- |
| `src/app/(main)/donate/page.tsx`      | 후원 페이지 (정기/일시 탭, 금액 선택)   |
| `src/app/api/donate/route.ts`         | 결제 승인 API                           |
| `src/app/api/donate/confirm/route.ts` | 결제 확인 콜백                          |
| `src/lib/payments/toss.ts`            | 토스페이먼츠 유틸 (API 호출, 서명 검증) |
| `src/hooks/useDonation.ts`            | 후원 상태 관리 훅                       |

**후원 페이지 상세**:

- 탭: 정기 후원 / 일시 후원
- 금액 선택: 1만원, 3만원, 5만원, 직접 입력
- 개인정보 입력: 이름, 이메일, 전화번호
- 개인정보처리방침 동의 체크박스 (필수)
- "후원하기" 버튼 → 토스페이먼츠 결제창
- 결제 완료 → 감사 페이지 + 이메일 (Resend)

**API 플로우**:

1. 클라이언트에서 토스페이먼츠 SDK로 결제 요청
2. 결제 성공 → `/api/donate/confirm`으로 paymentKey 전달
3. 서버에서 토스페이먼츠 결제 승인 API 호출
4. 승인 성공 → Donation 레코드 DB 저장
5. Resend로 감사 이메일 발송

**보안**:

- TOSS_SECRET_KEY는 서버 사이드에서만 사용
- Rate Limiting: 10회/분 (Upstash Redis)

**의존성**: 1-3 (DB), 1-4 (인증)

---

### 3-2. 재정 투명성 시스템

**관리자 페이지** (ADMIN 전용):

| 파일                                            | 설명                              |
| ----------------------------------------------- | --------------------------------- |
| `src/app/(admin)/layout.tsx`                    | 관리자 레이아웃 (ADMIN 권한 체크) |
| `src/app/(admin)/finance/page.tsx`              | 재정 관리 종합 현황 대시보드      |
| `src/app/(admin)/finance/expenses/page.tsx`     | 제경비 목록/검색/필터             |
| `src/app/(admin)/finance/expenses/new/page.tsx` | 제경비 입력 폼                    |
| `src/app/(admin)/finance/budget/page.tsx`       | 예산 편성/집행 현황               |
| `src/app/(admin)/finance/budget/new/page.tsx`   | 예산 항목 등록                    |
| `src/app/(admin)/finance/donations/page.tsx`    | 후원금 입금 내역                  |
| `src/app/(admin)/finance/reports/page.tsx`      | 결산 보고서 생성/관리             |

**제경비 입력 폼**:

- 필드: 날짜, 항목명, 카테고리(인건비/사무비/행사비/교통비/기타), 금액, 비고, 증빙파일
- Zod 검증: 금액 > 0, 날짜 유효성, 필수 필드
- 증빙파일: Supabase Storage 또는 Cloudflare Images 업로드

**예산 관리**:

- 연도별·카테고리별 예산 편성
- 집행 금액 = 해당 카테고리 Expense 합계 (자동 계산)
- 잔액 = 편성액 - 집행액 (자동)
- 집행률 프로그레스 바 시각화

**결산 보고서**:

- 연도 선택 → 수입(후원금 총액) / 지출(Expense 총액) 자동 집계
- 카테고리별 지출 비율 차트
- PDF 생성 (선택적 — 서버 사이드 PDF 생성 또는 업로드)
- isPublished 토글로 공개/비공개

**공개 페이지** (로그인 불필요):

| 파일                                          | 설명                  |
| --------------------------------------------- | --------------------- |
| `src/app/(main)/transparency/page.tsx`        | 연도별 재정 현황 요약 |
| `src/app/(main)/transparency/[year]/page.tsx` | 연도별 상세 보고서    |

**투명성 페이지 상세**:

- 연도 선택 드롭다운
- 수입·지출 총액 요약 카드
- 카테고리별 지출 비율: 도넛 차트 (Recharts)
- 결산 보고서 PDF 다운로드 링크
- isPublished=true인 보고서만 표시

**API**:

- `POST /api/finance/expenses` — 제경비 생성 (ADMIN)
- `GET /api/finance/expenses` — 제경비 목록 (ADMIN)
- `PUT /api/finance/expenses/[id]` — 제경비 수정 (ADMIN)
- `DELETE /api/finance/expenses/[id]` — 제경비 삭제 (ADMIN)
- `POST /api/finance/budget` — 예산 항목 생성 (ADMIN)
- `GET /api/finance/budget` — 예산 목록 (ADMIN)
- `GET /api/finance/reports` — 결산 보고서 조회 (공개)
- `POST /api/finance/reports` — 결산 보고서 생성 (ADMIN)

**의존성**: 1-3 (DB), 1-4 (인증, ADMIN 권한)

---

### 3-3. 평화학교 교육 신청

**파일**:

| 파일                                      | 설명                           |
| ----------------------------------------- | ------------------------------ |
| `src/app/(main)/education/page.tsx`       | 평화학교 소개 + 현재 기수 일정 |
| `src/app/(main)/education/apply/page.tsx` | 교육 신청 폼                   |
| `src/app/(admin)/education/page.tsx`      | 신청 목록 관리 (ADMIN)         |

**신청 폼 필드**:

- 이름 (필수, 2~50자)
- 이메일 (필수, 이메일 형식)
- 전화번호 (필수, 한국 전화번호 형식)
- 소속 (선택)
- 지원 동기 (필수, 10~500자)
- 개인정보처리방침 동의 (필수)

**플로우**:

1. 폼 제출 → Zod 클라이언트 검증 → Server Action으로 서버 재검증
2. DB 저장 (EducationApplication 모델)
3. Resend로 신청 확인 이메일 발송 (신청자 + 관리자)
4. 성공 페이지 표시

**의존성**: 1-3 (DB), 1-5 (Sanity — 기수 정보)

---

### 3-4. 회원 커뮤니티 (인증 + 게시판)

**파일**:

| 파일                                          | 설명                                |
| --------------------------------------------- | ----------------------------------- |
| `src/app/(main)/community/page.tsx`           | 게시판 목록 (자유게시판 / 평화나눔) |
| `src/app/(main)/community/[id]/page.tsx`      | 게시글 상세 + 댓글                  |
| `src/app/(main)/community/write/page.tsx`     | 글쓰기                              |
| `src/app/(main)/community/[id]/edit/page.tsx` | 글수정 (본인만)                     |

**게시판 구조**:

- 2개 게시판: 자유게시판(FREE), 평화 나눔(PEACE_SHARING) — BoardType enum
- 목록: 제목, 작성자, 날짜, 댓글 수 표시
- 페이지네이션: 20건씩

**권한**:

- 비로그인 → `/login`으로 리다이렉트 (middleware)
- 글쓰기: MEMBER 이상
- 수정/삭제: 본인 글만 (userId 비교)
- 댓글: 작성 MEMBER 이상, 삭제 본인만

**의존성**: 1-3 (DB), 1-4 (인증)

---

### 3-5. 국제 네트워크 지도

**파일**:

| 파일                                    | 설명                 |
| --------------------------------------- | -------------------- |
| `src/app/(main)/network/page.tsx`       | 네트워크 지도 페이지 |
| `src/components/organisms/PeaceMap.tsx` | 세계 지도 컴포넌트   |

**상세**:

- `react-simple-maps` + TopoJSON 세계 지도
- 팍스크리스티 가입 50개국 핀 표시
- 순차 등장 애니메이션 (Framer Motion staggerChildren)
- 한국 핀: 다른 색상(peace-gold)으로 강조 + 맥동 애니메이션
- 핀 클릭 → 지부 정보 패널 (국가명, 지부명, 설립 연도, 웹사이트 URL)
- 반응형: 데스크톱 풀 지도, 모바일 줌 + 스와이프

**데이터**: 정적 JSON (50개국 좌표 + 지부 정보)

**의존성**: 2-1 (레이아웃)

---

### 3-6. 다국어(한/영) 적용

**파일**:

| 파일                          | 설명                        |
| ----------------------------- | --------------------------- |
| `src/i18n/ko.json`            | 한국어 번역 파일            |
| `src/i18n/en.json`            | 영어 번역 파일              |
| `src/i18n/request.ts`         | next-intl 요청 설정         |
| `src/i18n/routing.ts`         | 라우팅 설정 (locale prefix) |
| `src/app/[locale]/layout.tsx` | 다국어 레이아웃             |

**적용 범위**:

- 메인 홈페이지
- About (소개, 연혁, 임원)
- Network (네트워크 지도)
- Header/Footer 공통 텍스트

**라우팅**:

- 기본 언어(ko): `/about`, `/news` (prefix 없음)
- 영어: `/en/about`, `/en/news`
- 언어 전환: Header 우측 토글 버튼 (KO | EN)

**의존성**: 2-1 이후 (Header에 언어 전환 토글)

---

### Phase 3 완료 체크포인트

| 검증 항목     | 방법                  | 기대 결과          |
| ------------- | --------------------- | ------------------ |
| 후원 결제     | 토스 테스트 키로 결제 | 성공 → DB 저장     |
| 감사 이메일   | 후원 완료 후          | Resend 발송 확인   |
| ADMIN 권한    | 일반 회원 → /admin    | 접근 거부          |
| 재정 CRUD     | 제경비 입력/수정/삭제 | DB 반영            |
| 투명성 페이지 | /transparency         | 차트 + 보고서 표시 |
| 교육 신청     | 폼 제출               | DB 저장 + 이메일   |
| 커뮤니티 인증 | 비로그인 → /community | 리다이렉트         |
| 게시글 권한   | 타인 글 수정 시도     | 거부               |
| 네트워크 지도 | /network              | 50개국 핀 표시     |
| 다국어        | 헤더 토글             | 한/영 전환         |
| Rate Limiting | 로그인 6회 시도       | 429 응답           |
| 통합 테스트   | `npm test`            | 주요 플로우 통과   |

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
