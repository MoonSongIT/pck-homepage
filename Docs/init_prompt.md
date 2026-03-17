## 🎯 작업 목표
가톨릭 국제 평화운동 단체 **팍스크리스티코리아(Pax Christi Korea)** 공식 웹사이트를
현재 쇼핑몰 솔루션 기반의 구식 UI에서 **현대적인 비영리 NGO 사이트**로 완전 리뉴얼한다.
단체의 정체성(평화·연대·영성)을 시각적으로 표현하고, 후원·회원관리·교육신청·
다국어 지원 등 실질적인 운영 기능을 추가한다.
또한 **예산 집행 내역 공개 및 후원금 관리 투명성 확보**를 위한 기능을 포함하여,
후원자와 회원이 단체의 재정 운용 현황을 신뢰할 수 있도록 한다.
기술 구현은 **운영비 절감과 안정성**을 최우선으로 하며, 무료/오픈소스 도구와
서버리스 아키텍처를 적극 활용하여 비영리 단체의 지속 가능한 운영을 뒷받침한다.
---
## 🏗️ 프로젝트 아키텍처
- 렌더링 전략: SSG(정적 페이지) + ISR(뉴스/활동, 1시간 revalidate) + CSR(커뮤니티)
- 프로젝트 구조: Next.js 15 App Router + Route Groups
- 상태 관리: Zustand(전역: 언어·다크모드·인증) + TanStack Query(서버 상태)
- 배포 환경: Vercel (비영리 무료 플랜) + GitHub Actions CI/CD
---
## 🔧 기술 스택
- 언어: TypeScript 5.x (strict mode)
- 프레임워크: Next.js 15 (App Router, React 19)
- 스타일링: Tailwind CSS v4 + CSS Variables 디자인 토큰
- UI 라이브러리: shadcn/ui + Radix UI
- 애니메이션: Framer Motion 11
- 다국어: next-intl (한국어 기본 / 영어)
- 백엔드/API: Next.js Server Actions + API Routes
- CMS: Sanity.io v3 (비영리 무료 플랜, 관리자 콘텐츠 편집용)
- DB & ORM: Supabase(PostgreSQL) + Prisma ORM
- 인증: NextAuth.js v5 (이메일 + 카카오 소셜 로그인)
- 결제: 토스페이먼츠 API (후원 정기/일시)
- 캐시/Rate Limit: Upstash Redis
- 이미지 최적화: next/image + Cloudflare Images CDN
- 폼 검증: React Hook Form + Zod
- 기타: next-themes(다크모드), @vercel/og(동적 OG 이미지), Resend(이메일 발송)
---
## 📁 디렉토리 구조
```
src/
├── app/
│   ├── (main)/
│   │   ├── page.tsx                 # 메인 홈
│   │   ├── about/
│   │   │   ├── page.tsx             # 단체 소개
│   │   │   ├── history/page.tsx     # 창립 역사 타임라인
│   │   │   └── team/page.tsx        # 임원 소개
│   │   ├── activities/
│   │   │   ├── page.tsx             # 활동 목록
│   │   │   └── [slug]/page.tsx      # 활동 상세
│   │   ├── news/
│   │   │   ├── page.tsx             # 뉴스/공지 목록
│   │   │   └── [slug]/page.tsx      # 뉴스 상세
│   │   ├── education/
│   │   │   ├── page.tsx             # 평화학교 소개
│   │   │   └── apply/page.tsx       # 교육 신청 폼
│   │   ├── network/page.tsx         # 국제 평화 네트워크 지도
│   │   ├── donate/page.tsx          # 후원 페이지
│   │   ├── community/
│   │   │   ├── page.tsx             # 커뮤니티 게시판 (회원 전용)
│   │   │   └── [id]/page.tsx        # 게시글 상세
│   │   ├── transparency/
│   │   │   ├── page.tsx             # 재정 투명성 공개 페이지 (일반 회원/후원자 열람)
│   │   │   └── [year]/page.tsx      # 연도별 결산 보고서 상세
│   │   └── contact/page.tsx         # 문의
│   ├── (admin)/
│   │   ├── layout.tsx               # 관리자 전용 레이아웃 (ADMIN 권한 체크)
│   │   ├── page.tsx                 # 관리자 대시보드 (회원·후원·뉴스 통계)
│   │   ├── finance/
│   │   │   ├── page.tsx             # 재정 관리 종합 현황
│   │   │   ├── expenses/
│   │   │   │   ├── page.tsx         # 제경비 사용내역 목록/검색
│   │   │   │   └── new/page.tsx     # 제경비 사용내역 입력 폼
│   │   │   ├── budget/
│   │   │   │   ├── page.tsx         # 예산 편성/집행 현황 (연도·항목별)
│   │   │   │   └── new/page.tsx     # 예산 항목 등록/편집
│   │   │   ├── donations/
│   │   │   │   └── page.tsx         # 후원금 입금 내역/관리
│   │   │   └── reports/
│   │   │       ├── page.tsx         # 결산 보고서 생성/관리
│   │   │       └── [year]/page.tsx  # 연도별 결산 보고서 상세
│   │   ├── members/page.tsx         # 회원 관리
│   │   ├── education/page.tsx       # 교육 신청 목록 관리
│   │   └── posts/page.tsx           # 뉴스/게시글 관리
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── donate/route.ts
│   │   ├── finance/
│   │   │   ├── expenses/route.ts    # 제경비 CRUD API
│   │   │   ├── budget/route.ts      # 예산 CRUD API
│   │   │   └── reports/route.ts     # 결산 보고서 생성 API
│   │   ├── newsletter/route.ts
│   │   └── revalidate/route.ts
│   └── [locale]/                    # 다국어 라우트 (en)
├── components/
│   ├── atoms/                       # Button, Badge, Tag, Icon
│   ├── molecules/                   # NewsCard, EventCard, MemberCard
│   ├── organisms/                   # Header, Footer, HeroSection, PeaceMap
│   └── templates/                   # MainLayout, ArticleLayout
├── lib/
│   ├── sanity/                      # Sanity 클라이언트 + 쿼리
│   ├── supabase/                    # Supabase 클라이언트
│   ├── prisma/                      # Prisma 클라이언트
│   └── payments/                    # 토스페이먼츠 유틸
├── hooks/                           # useIntersection, useDonation 등
├── stores/                          # Zustand stores
├── types/                           # 전역 TypeScript 타입
└── i18n/                            # 한/영 번역 파일
```
---
## 📝 상세 요구사항
### 필수 기능
**1. 메인 홈페이지**
- 풀스크린 Hero: 평화 이미지 슬라이더 + `"그리스도의 평화"` 메시지 타이핑 애니메이션
- Impact Counter 섹션: 창립 연도, 회원 수, 활동 국가, 진행 캠페인 수를 카운터 애니메이션으로 표시 (뷰포트 진입 시 IntersectionObserver 트리거)
- 최신 뉴스/활동 3건 카드 그리드 (Sanity CMS 연동)
- 후원 CTA 섹션: 목표 금액 대비 달성률 프로그레스 바 포함
- 뉴스레터 구독 폼 (이메일 입력 → Resend API로 구독 처리)
**2. 단체 소개 섹션**
- `about/` 페이지: 비전·미션·핵심가치 카드 레이아웃
- `history/` 페이지: 창립(2019) ~ 현재 주요 활동 수직 타임라인 컴포넌트
- `team/` 페이지: 공동대표·임원진 프로필 카드 (역할·사진·소개)
**3. 국제 평화 네트워크 지도 (`network/` 페이지)**
- react-simple-maps 또는 Leaflet.js 사용
- 팍스크리스티 가입 50개국 핀 표시 (순차 등장 애니메이션)
- 각 나라 핀 클릭 시 해당 지부 정보 툴팁/패널 표시
- 한국(PCK) 핀 강조 표시
**4. 뉴스/활동 게시판**
- Sanity CMS에서 관리하는 포스트 목록 (ISR, revalidate: 3600)
- 카테고리 필터: 한반도 평화 / 국제 활동 / 교육 / 공지
- 검색 기능 (클라이언트 사이드 필터링)
- 무한 스크롤 또는 페이지네이션 (12개씩)
- 개별 포스트: OG 이미지 자동 생성 (@vercel/og)
**5. 평화학교 교육 신청 시스템**
- 현재 기수 일정 표시 (Sanity CMS에서 관리)
- 온라인 신청 폼: 이름, 이메일, 전화번호, 소속, 지원 동기 (Zod 유효성 검사)
- 신청 완료 시 이메일 자동 발송 (Resend)
- 관리자 어드민에서 신청 목록 확인 가능
**6. 후원 시스템**
- 정기 후원 / 일시 후원 탭 전환
- 후원 금액 선택 버튼 (1만원/3만원/5만원/직접입력)
- 토스페이먼츠 결제창 연동
- 후원 완료 후 감사 이메일 자동 발송
- 후원 내역 Supabase DB 저장
**7. 재정 투명성 시스템 (관리자 입력 / 일반 공개)**
- **관리자 전용 (ADMIN 권한)**
  - 제경비 사용내역 입력: 날짜, 항목명, 카테고리(인건비/사무비/행사비/교통비/기타), 금액, 비고, 증빙파일 첨부
  - 예산 편성/집행 관리: 연도별·항목별 예산 등록, 집행 금액 입력, 잔액 자동 계산
  - 후원금 입금 내역 관리: 정기/일시 후원 입금 현황, 미입금 알림
  - 결산 보고서 생성: 연도별 수입/지출 요약 자동 생성, PDF 다운로드
- **일반 공개 (투명성 페이지 `/transparency`)**
  - 연도별 재정 현황 요약 (수입·지출 총액, 항목별 비율 차트)
  - 결산 보고서 열람/다운로드
  - 후원금 사용처 시각화 (도넛 차트 등)
**8. 회원 커뮤니티 (로그인 필수)**
- 자유게시판, 평화 나눔 게시판 2개 운영
- 글쓰기/수정/삭제 (본인만)
- 댓글 기능
- 비로그인 시 로그인 페이지로 리다이렉트 (Next.js middleware)
**9. 다국어 지원 (한/영)**
- next-intl 기반, 기본 언어 한국어
- 메인 소개 페이지, About, Network 페이지 영어 번역 제공
- 언어 전환 토글 버튼 (Header 우측)
---
### UI/UX 요구사항
**헤더 (2단 구조)**
- 상단 바(Top Bar): 연락처·SNS 링크·한/영 언어 전환 토글 (항상 노출)
- 메인 내비게이션(Main Nav): 로고 + 메뉴 + 후원 CTA 버튼
  - 메뉴 순서: **단체 소개 → 활동 → 교육 → 뉴스 → 네트워크 → 재정 공개** (방문자 궁금증 흐름 순)
  - 후원 버튼: 주황색/골드 계열(`--color-peace-gold` 또는 `#e8911a`)로 강조, 항상 우측 고정
  - 모바일: 햄버거 메뉴 + 후원 버튼은 축소되지 않고 항상 노출
**Hero 섹션**
- 흑백 또는 저채도(desaturated) 사진 사용 — 평화·연대를 상징하는 인물 뒷모습 구도 권장
- 사진 위에 반투명 네이비 오버레이(`--color-peace-navy`, opacity 0.5~0.6)
- 타이핑 애니메이션 텍스트는 화이트 컬러로 대비 확보
**섹션 구분선 — 웨이브(Wave Divider)**
- 섹션 간 전환 요소로 SVG 웨이브 구분선 적극 활용
- 파랑 계열 대신 PCK 컬러 토큰으로 재해석:
  - 밝은 배경 → 네이비(`--color-peace-navy`) 웨이브
  - 네이비 배경 → 크림(`--color-peace-cream`) 웨이브
  - 포인트 구간 → 스카이블루(`--color-peace-sky`) 웨이브
- 웨이브 높이: 데스크톱 60~80px / 모바일 40~50px
**일반 요구사항**
- 반응형: 모바일 퍼스트 (360px ~ 1440px)
- 다크모드: next-themes 기반, 시스템 설정 자동 감지
- 접근성: WCAG 2.1 AA (고령 사용자 고려 — 최소 폰트 16px, 충분한 명도 대비)
- 로딩 상태: Skeleton UI (뉴스 카드, 임원진 프로필)
- 에러 상태: Next.js error.tsx + not-found.tsx 전용 페이지
- 빈 상태: 검색 결과 없음, 게시글 없음 일러스트 + 안내 텍스트
- 스크롤 진입 애니메이션: Framer Motion `whileInView` 패턴 (fade-up, duration 0.5s)
- 페이지 전환: Framer Motion AnimatePresence (slide 효과)
**컬러 디자인 토큰 (Tailwind CSS v4)**
```css
:root {
  --color-peace-navy: #1a3a5c;   /* 주요 텍스트, 헤더 배경 */
  --color-peace-sky: #4a90d9;    /* 링크, 강조 */
  --color-peace-olive: #6b8f47;  /* 성공, 긍정적 상태 */
  --color-peace-cream: #f8f4ed;  /* 섹션 배경 */
  --color-peace-gold: #c9a84c;   /* 강조 배지, 후원 버튼 포인트 */
  --color-peace-orange: #e8911a; /* 후원 CTA 버튼 강조 (대안) */
}
```
---
### API & 데이터 요구사항
**Sanity 스키마 (주요)**
```typescript
// post.ts
export default {
  name: 'post',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'category', type: 'string',
      options: { list: ['한반도평화','국제활동','교육','공지'] } },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'mainImage', type: 'image' },
    { name: 'body', type: 'array', of: [{ type: 'block' }] },
  ]
}
```
**Prisma 스키마 (주요)**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(MEMBER)
  createdAt DateTime @default(now())
  donations Donation[]
  posts     CommunityPost[]
}
model Donation {
  id        String   @id @default(cuid())
  userId    String
  amount    Int
  type      DonationType  // REGULAR | ONE_TIME
  status    String
  createdAt DateTime @default(now())
  user      User @relation(fields: [userId], references: [id])
}
model Expense {
  id          String          @id @default(cuid())
  date        DateTime                            // 지출 일자
  title       String                              // 항목명
  category    ExpenseCategory                     // 카테고리
  amount      Int                                 // 금액
  note        String?                             // 비고
  receiptUrl  String?                             // 증빙파일 URL
  createdBy   String                              // 입력 관리자 ID
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  creator     User            @relation("ExpenseCreator", fields: [createdBy], references: [id])
  budgetItem  BudgetItem?     @relation(fields: [budgetItemId], references: [id])
  budgetItemId String?
}
model BudgetItem {
  id          String   @id @default(cuid())
  year        Int                                 // 예산 연도
  category    ExpenseCategory                     // 예산 항목 카테고리
  title       String                              // 예산 항목명
  planned     Int                                 // 편성 금액
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  expenses    Expense[]                           // 해당 항목에 연결된 지출 내역
}
model FinanceReport {
  id          String   @id @default(cuid())
  year        Int      @unique                    // 결산 연도
  totalIncome Int                                 // 총 수입
  totalExpense Int                                // 총 지출
  pdfUrl      String?                             // 결산 보고서 PDF URL
  isPublished Boolean  @default(false)            // 공개 여부
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
enum Role { ADMIN EDITOR MEMBER }
enum DonationType { REGULAR ONE_TIME }
enum ExpenseCategory { PERSONNEL OFFICE EVENT TRANSPORT OTHER }
```
**API 에러 응답 형식**
```typescript
interface ApiError {
  success: false;
  error: {
    code: string;      // 'UNAUTHORIZED' | 'NOT_FOUND' | 'VALIDATION_ERROR'
    message: string;
    details?: unknown;
  }
}
```
---
### 선택적 요구사항
1. 카카오맵 API 연동 — 오프라인 행사 장소 지도 표시
2. RSS 피드 생성 (`/feed.xml`) — 뉴스 구독자 지원
3. PWA 지원 — `manifest.json` + 오프라인 캐시 (Service Worker)
4. 관리자 대시보드 (`/admin`) — 회원 수, 후원 현황, 뉴스 발행 수 통계 차트 (Recharts)
---
## ⚠️ 제약사항 및 주의사항
- 쇼핑몰 관련 UI 패턴(장바구니, 상품 등) 완전 제거
- 종교적 이미지 사용 시 저작권 확인 필수 (무료 라이선스 이미지만)
- 개인정보 수집(후원자, 회원) 시 개인정보처리방침 동의 체크박스 필수
- 토스페이먼츠 테스트 키와 실제 키 환경변수로 엄격히 분리
- Sanity 무료 플랜 제한: API 요청 10만건/월 — ISR 간격 적절히 설정
- next-intl 라우팅: locale prefix 방식 사용 (`/en/about` 형태)
- `"use client"` 최소화 — 서버 컴포넌트 우선 설계
---
## 🎨 코드 스타일 가이드
- 네이밍: 컴포넌트 PascalCase / 훅 camelCase `use` 접두사 / 유틸 camelCase / 상수 SCREAMING_SNAKE_CASE
- 컴포넌트: 함수형 화살표 함수 (`const Hero = () => {}`)
- Import 순서: React → Next.js → 외부 라이브러리 → 내부 컴포넌트 → 타입
- 주석: 복잡한 비즈니스 로직에만 JSDoc 인라인 주석
- ESLint: Next.js 기본 + `@typescript-eslint/recommended`
- Prettier: 탭 너비 2, 세미콜론 없음, 작은 따옴표
---
## 🔒 보안 요구사항
- 인증 보호 경로: `/community/*`, `/admin/*`, `/api/donate`, `/api/finance/*` — Next.js middleware로 보호
- 재정 관리 경로 (`/admin/finance/*`): ADMIN 역할만 접근 허용 (Role 기반 권한 체크)
- 입력값 검증: 클라이언트(React Hook Form + Zod) + 서버(Server Actions Zod 재검증)
- 환경변수:
```
  NEXTAUTH_SECRET=
  DATABASE_URL=           # Supabase connection string
  NEXT_PUBLIC_SANITY_PROJECT_ID=
  TOSS_CLIENT_KEY=        # 테스트/실제 분리
  TOSS_SECRET_KEY=
  RESEND_API_KEY=
  KAKAO_CLIENT_ID=
  UPSTASH_REDIS_REST_URL=
```
- Rate Limiting: 로그인 API 5회/분, 후원 API 10회/분 (Upstash Redis)
- XSS: Sanity Portable Text 렌더러 사용 (직접 dangerouslySetInnerHTML 금지)
---
## 🧪 테스트 요구사항
- 단위 테스트: Vitest — Zod 스키마 유효성, 유틸 함수, Zustand store
- 통합 테스트: Testing Library — 후원 폼 제출 플로우, 로그인/회원가입 플로우
- E2E (선택): Playwright — 메인 홈 접속, 후원 결제 완료, 회원 로그인 후 게시글 작성
- 커버리지 목표: 핵심 비즈니스 로직 70% 이상
---
## 📤 예상 출력 형식
- 파일 단위로 분리하여 출력
- 각 파일 상단에 파일 경로 주석 포함 (`// src/components/organisms/HeroSection.tsx`)
- 타입 정의 파일(`src/types/index.ts`) 먼저 출력
- Prisma 스키마(`prisma/schema.prisma`) 두 번째 출력
- 코드 블록 언어 명시 (` ```tsx `, ` ```ts `, ` ```prisma ` 등)
- 각 컴포넌트에 간단한 사용 예시 주석 포함
---
## 🛠️ 개발 환경 및 도구
- **개발 도구**: Claude Code 데스크탑 앱 (AI 페어 프로그래밍 기반 개발)
- **형상 관리**: GitHub 리포지토리 연동, 브랜치 전략(main/develop/feature-*)
- **CI/CD**: GitHub Actions — PR 시 자동 린트·테스트·빌드 검증, main 머지 시 Vercel 자동 배포
- **프로젝트 관리 문서** (`Docs/` 디렉토리):
  - `plan.md` — 구현 계획: Phase별 작업 항목, 담당 범위, 예상 일정, 의존성 정리
  - `check.md` — 진도 체크: 각 작업 항목의 완료 상태(⬜/🔄/✅), 이슈·블로커 기록
  - `test.md` — 테스트 관리: 단위/통합/E2E 테스트 목록, 실행 순서, 커버리지 현황, 결과 기록
---
## 💡 구현 순서 (권장)
```
Phase 0 — 개발 환경 및 형상 관리 설정
  0-1. GitHub 리포지토리 생성 + .gitignore, LICENSE 설정
  0-2. 브랜치 전략 수립 (main / develop / feature-* / hotfix-*)
  0-3. GitHub Actions CI 파이프라인 구성
       - PR 생성 시: ESLint + TypeScript 타입 체크 + Vitest 단위 테스트
       - develop → main 머지 시: 전체 테스트 + Vercel 프로덕션 자동 배포
  0-4. Docs/ 관리 문서 초기 생성
       - plan.md: Phase별 구현 계획 작성
       - check.md: 진도 체크리스트 초기화
       - test.md: 테스트 전략 및 목록 초기화
  0-5. Claude Code 데스크탑 앱 프로젝트 연결 + CLAUDE.md 프로젝트 지침 설정

Phase 1 — 기반 설정 (1주차)
  1-1. Next.js 15 프로젝트 초기화 + TypeScript strict 설정
  1-2. Tailwind CSS v4 + 디자인 토큰 설정
  1-3. shadcn/ui 설치 + 커스텀 컴포넌트 초기화
  1-4. Prisma + Supabase 연결 + 스키마 마이그레이션
  1-5. NextAuth v5 설정 (이메일 + 카카오)
  1-6. Sanity.io 프로젝트 생성 + 스키마 정의
  ── ✅ 체크포인트: 기반 설정 단위 테스트 통과 → develop 머지 → check.md 갱신

Phase 2 — 핵심 페이지 구현 (2~3주차)
  2-1. 공통 레이아웃 (Header 2단 구조, Footer, Navigation)
  2-2. 메인 홈페이지 (Hero, Impact Counter, 뉴스 그리드)
  2-3. 단체 소개 + 타임라인
  2-4. 뉴스/활동 목록 + 상세 페이지 (ISR)
  ── ✅ 체크포인트: 컴포넌트 단위 테스트 + 페이지 렌더링 테스트 → check.md 갱신

Phase 3 — 기능 구현 (4~5주차)
  3-1. 후원 시스템 (토스페이먼츠 연동)
  3-2. 재정 투명성 시스템 (관리자 재정 관리 + 공개 페이지)
  3-3. 평화학교 신청 폼
  3-4. 회원 커뮤니티 (인증 + 게시판)
  3-5. 국제 네트워크 지도
  3-6. 다국어(한/영) 적용
  ── ✅ 체크포인트: 기능별 단위 테스트 + 통합 테스트 → test.md 결과 기록 → check.md 갱신

Phase 4 — 마무리 및 배포 (6주차)
  4-1. SEO 최적화 (sitemap, robots, OG 이미지)
  4-2. 성능 최적화 (Core Web Vitals)
  4-3. 전체 테스트 실행 (단위 + 통합 + E2E) → test.md 최종 결과 정리
  4-4. GitHub Actions 배포 파이프라인 최종 검증
  4-5. Vercel 프로덕션 배포 + 커스텀 도메인 연결
  ── ✅ 최종 체크포인트: plan.md 완료 확인, check.md 전 항목 ✅, test.md 커버리지 70%+ 확인
```
---
## 📌 후속 개선 가이드
이 프롬프트로 생성된 코드를 기반으로 다음 단계 확장이 가능합니다:
- **온라인 미사/기도 모임 스트리밍**: 유튜브 라이브 API 연동
- **전자서명 캠페인**: 서명 수 집계 + 공유 기능
- **회원 앱 (React Native)**: Expo + 동일 Supabase 백엔드 공유
- **AI 평화 뉴스 요약**: Claude API 연동 — 국제 평화 뉴스 자동 요약 발행
