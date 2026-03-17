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

| #   | 작업 항목                       | 상태 | 세부 내용                                             | 블로커/비고                      |
| --- | ------------------------------- | ---- | ----------------------------------------------------- | -------------------------------- |
| 1-1 | Tailwind CSS v4 디자인 토큰     | ✅   | @theme 6개 컬러 + .dark 다크모드 + Noto Sans KR/Inter |                                  |
| 1-2 | shadcn/ui 설치 + 초기 컴포넌트  | ✅   | radix-nova preset + 12개 컴포넌트 (toast→sonner 대체) |                                  |
| 1-3 | Prisma + Supabase 연결 + 스키마 | ✅   | 12모델+4enum 스키마, PrismaPg 어댑터, 클라이언트 싱글톤 | ⏳ DB 연결은 Supabase 생성 후    |
| 1-4 | NextAuth.js v5 설정             | ⬜   | Credentials + Kakao, PrismaAdapter, middleware        | 1-3 의존, ❗ 카카오 앱 등록 필요 |
| 1-5 | Sanity.io v3 연결 + 스키마      | ⬜   | 클라이언트 + GROQ 쿼리 + 4개 스키마                   | ❗ Sanity 프로젝트 생성 필요     |
| 1-6 | 추가 라이브러리 설치            | ⬜   | zustand, tanstack-query, framer-motion, next-intl 등  | Phase 0 완료 필요                |

### Phase 1 완료 체크포인트

- [ ] 브라우저 DevTools에서 CSS 변수 6개 확인
- [ ] shadcn/ui Button 렌더링 정상
- [ ] `npx prisma db push` — 스키마 동기화 성공
- [ ] `/api/auth/signin` — 로그인 폼 표시
- [ ] Sanity 테스트 쿼리 — 데이터 반환
- [ ] `npm run build` — 에러 0건

### Phase 1 외부 작업 체크리스트

- [ ] Supabase 프로젝트 생성 → DATABASE_URL 확보
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

| Phase    | 전체 항목 | 완료  | 진행률  |
| -------- | --------- | ----- | ------- |
| Phase 0  | 7         | 7     | 100%    |
| Phase 1  | 6         | 3     | 50%     |
| Phase 2  | 4         | 0     | 0%      |
| Phase 3  | 6         | 0     | 0%      |
| Phase 4  | 5         | 0     | 0%      |
| **전체** | **28**    | **10** | **36%** |
