# PCK Homepage — 프로젝트 지침

## 프로젝트 개요
팍스크리스티코리아(Pax Christi Korea) 공식 웹사이트 리뉴얼.
가톨릭 국제 평화운동 비영리 NGO 단체 사이트.

## 기술 스택
- **프레임워크**: Next.js 16 (App Router, React 19, Turbopack)
- **언어**: TypeScript 5.x (strict mode)
- **스타일링**: Tailwind CSS v4 + CSS Variables 디자인 토큰
- **UI**: shadcn/ui + Radix UI
- **애니메이션**: Framer Motion 11
- **DB**: Supabase (PostgreSQL) + Prisma ORM
- **CMS**: Sanity.io v3
- **인증**: NextAuth.js v5 (이메일 + 카카오)
- **결제**: 토스페이먼츠 API
- **다국어**: next-intl (한국어 기본 / 영어)
- **상태 관리**: Zustand (전역) + TanStack Query (서버)
- **기타**: next-themes, Resend, Upstash Redis, @vercel/og

## 코드 스타일

### 네이밍
- 컴포넌트: PascalCase (`HeroSection`, `NewsCard`)
- 훅: camelCase + use 접두사 (`useDonation`, `useIntersection`)
- 유틸: camelCase (`formatCurrency`, `validateEmail`)
- 상수: SCREAMING_SNAKE_CASE (`MAX_UPLOAD_SIZE`, `API_BASE_URL`)

### 컴포넌트 패턴
- 함수형 화살표 함수: `const Hero = () => {}`
- `"use client"` 최소화 — 서버 컴포넌트 우선
- Props 타입은 컴포넌트 파일 내 인라인 정의

### Import 순서
```
1. React / Next.js
2. 외부 라이브러리
3. 내부 컴포넌트 (@/components/*)
4. 유틸 / 훅 (@/lib/*, @/hooks/*)
5. 타입 (@/types/*)
```

### 포맷팅
- 세미콜론 없음
- 작은 따옴표
- 탭 너비 2
- trailing comma: es5

## 디렉토리 구조
```
src/
├── app/
│   ├── (main)/      # 공개 페이지 (홈, 소개, 뉴스, 후원 등)
│   ├── (admin)/     # 관리자 전용 (ADMIN 권한)
│   ├── (auth)/      # 로그인, 회원가입
│   ├── api/         # API Routes
│   └── [locale]/    # 다국어 라우트 (en)
├── components/
│   ├── atoms/       # Button, Badge, Tag, Icon
│   ├── molecules/   # NewsCard, EventCard, MemberCard
│   ├── organisms/   # Header, Footer, HeroSection, PeaceMap
│   └── templates/   # MainLayout, ArticleLayout
├── lib/
│   ├── sanity/      # Sanity 클라이언트 + GROQ 쿼리
│   ├── prisma/      # Prisma 클라이언트
│   └── payments/    # 토스페이먼츠 유틸
├── hooks/           # 커스텀 훅
├── stores/          # Zustand 스토어
├── types/           # 전역 TypeScript 타입
└── i18n/            # 한/영 번역 파일
```

## 자주 사용하는 명령어
```bash
npm run dev          # 개발 서버 (Turbopack)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint
npx tsc --noEmit     # TypeScript 타입 체크
npx prisma studio    # DB 브라우저
npx prisma migrate dev  # DB 마이그레이션
npx prisma generate  # Prisma Client 재생성
npm test             # Vitest 테스트
npm test -- --coverage  # 커버리지 리포트
```

## 디자인 토큰 (컬러)
```
peace-navy:   #1a3a5c  (주요 텍스트, 헤더 배경)
peace-sky:    #4a90d9  (링크, 강조)
peace-olive:  #6b8f47  (성공, 긍정)
peace-cream:  #f8f4ed  (섹션 배경)
peace-gold:   #c9a84c  (강조 배지)
peace-orange: #e8911a  (후원 CTA 버튼)
```

## 보안 주의사항
- `dangerouslySetInnerHTML` 사용 금지 (Sanity Portable Text 렌더러 사용)
- 환경변수: NEXT_PUBLIC_ 접두사 없는 변수는 서버 사이드 전용
- 입력값 검증: 클라이언트(Zod) + 서버(Server Actions Zod 재검증) 이중 검증
- 보호 경로: /community/*, /admin/*, /api/donate, /api/finance/* (middleware)

## 브랜치 전략
- `main`: 프로덕션 배포 (PR 필수)
- `develop`: 개발 통합 (PR 필수)
- `feature/*`: 기능 개발
- `hotfix/*`: 긴급 수정
