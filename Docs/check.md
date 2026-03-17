# PCK 웹사이트 리뉴얼 — 진도 체크리스트

> 최종 수정: 2026-03-17
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

| #   | 작업 항목                   | 상태 | 세부 내용                                                                 | 블로커/비고       |
| --- | --------------------------- | ---- | ------------------------------------------------------------------------- | ----------------- |
| 2-1 | 공통 레이아웃               | ⬜   | Header(2단), Footer(4열), WaveDivider, Logo, MobileNav                    | Phase 1 완료 필요 |
| 2-2 | 메인 홈페이지               | ⬜   | Hero(슬라이더+타이핑), ImpactCounter, LatestNews, DonationCTA, Newsletter | 2-1 의존          |
| 2-3 | 단체 소개 + 타임라인 + 임원 | ⬜   | about/, history/(타임라인), team/(프로필카드)                             | 2-1 의존          |
| 2-4 | 뉴스/활동 목록 + 상세 (ISR) | ⬜   | ISR revalidate:3600, 카테고리 필터, 페이지네이션, OG 이미지               | 1-5 (Sanity) 의존 |

### Phase 2 완료 체크포인트

- [ ] Header: 360px~1440px 반응형 정상
- [ ] Hero: 이미지 전환 + 타이핑 애니메이션
- [ ] Impact Counter: 뷰포트 진입 시 카운트업
- [ ] 뉴스 카드: Sanity 데이터 3건 표시
- [ ] 타임라인: 스크롤 시 fade-in
- [ ] ISR: Cache-Control 헤더 확인
- [ ] WaveDivider: 섹션 전환부 정상 렌더링
- [ ] 다크모드: 전체 컬러 전환 정상
- [ ] Lighthouse 접근성: 90+
- [ ] 컴포넌트 단위 테스트: Header, Footer, NewsCard 통과

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

| Phase    | 전체 항목 | 완료   | 진행률  |
| -------- | --------- | ------ | ------- |
| Phase 0  | 7         | 7      | 100%    |
| Phase 1  | 6         | 6      | 100%    |
| Phase 2  | 4         | 0      | 0%      |
| Phase 3  | 6         | 0      | 0%      |
| Phase 4  | 5         | 0      | 0%      |
| **전체** | **28**    | **13** | **46%** |
