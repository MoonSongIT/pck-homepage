# 운영 이관 체크리스트 (check_operation.md)

> 작성일: 2026-03-30
> 용도: plan_operation.md의 각 단계별 완료 여부 추적
> 사용법: 각 항목 완료 시 `[ ]` → `[x]`로 변경하고 날짜/메모 기록

---

## Phase 1: 사전 준비 (D-14)

### 1-1. 운영 계정(ajornamento@gmail.com) 서비스 가입

| 완료 | 서비스 | 완료일 | 메모 |
|:----:|--------|--------|------|
| [ ] | Vercel | | |
| [ ] | GitHub (조직 생성 포함) | | |
| [ ] | Supabase | | |
| [ ] | Sanity.io | | |
| [ ] | 토스페이먼츠 | | 사업자등록번호 필요 |
| [ ] | 카카오 개발자 | | 카카오 계정 필요 |
| [ ] | Resend | | |
| [ ] | Anthropic | | 결제 카드 등록 |
| [ ] | Upstash (선택) | | |

### 1-2. 도메인 준비

- [ ] 도메인 이전 방식 결정 (기존 이전 / 신규 등록)
  - 결정 사항: _______________
- [ ] 기존 도메인 관리자에게 권한 요청 (Inames 계정, 가비아 DNS)
- [ ] 도메인 만료일 확인: _______________
- [ ] 현재 DNS 레코드 전체 백업 (스크린샷)
- [ ] MX 레코드 존재 여부 확인 (이메일 서비스)
  - 결과: _______________
- [ ] TXT 레코드 확인 (SPF, DKIM)
  - 결과: _______________

### 1-3. 도메인 등록 정보 변경

- [ ] Inames 계정 접근 확보
- [ ] 도메인 등록자(Registrant) 정보 변경
  - [ ] 등록자명 → 팍스크리스티코리아 / 운영 담당자
  - [ ] 이메일 → ajornamento@gmail.com
  - [ ] 연락처 → 운영 담당자 전화번호
- [ ] 관리 담당자(Admin Contact) 정보 변경
- [ ] WHOIS 정보 업데이트 확인
- [ ] (선택) 도메인 등록업체 이전 (Inames → 가비아/기타)
  - [ ] Auth Code 발급
  - [ ] Transfer Lock 해제
  - [ ] 새 등록업체에서 이전 신청
  - [ ] 이전 승인 메일 확인 → 승인
  - [ ] 이전 완료 확인 (5~7일 소요)

### 1-4. GitHub 리포지토리 이관

- [ ] 이관 방식 결정 (Transfer / Fork+Push)
  - 결정 사항: _______________
- [ ] 이관 실행
- [ ] 새 리포에서 main, develop 브랜치 확인
- [ ] GitHub Actions / CI 설정 확인
- [ ] Branch protection rules 재설정

---

## Phase 2: 서비스 생성 및 설정 (D-7)

### 2-1. Supabase

- [ ] 신규 프로젝트 생성 (ap-northeast-1 리전)
- [ ] DATABASE_URL 확보
- [ ] SUPABASE_URL 확보
- [ ] SUPABASE_SERVICE_KEY 확보
- [ ] Storage 버킷 생성
  - [ ] `receipts` (비공개)
  - [ ] `reports` (공개)
- [ ] 스키마 적용: `npx prisma migrate deploy`
- [ ] 마이그레이션 성공 확인

### 2-2. Sanity.io

- [ ] 이관 방식 결정 (멤버 추가+소유권 이전 / 신규 생성)
  - 결정 사항: _______________
- [ ] NEXT_PUBLIC_SANITY_PROJECT_ID 확보
- [ ] SANITY_API_TOKEN 발급 (Editor 권한)
- [ ] 콘텐츠 마이그레이션 (기존 데이터가 있는 경우)
  - [ ] `sanity dataset export` 실행
  - [ ] 새 프로젝트에 `sanity dataset import` 실행
  - [ ] 콘텐츠 정상 확인
- [ ] CORS origins에 운영 도메인 추가

### 2-3. 토스페이먼츠

- [ ] 사업자 정보 등록 (591-80-01356)
- [ ] 심사 신청
- [ ] 심사 완료 확인
- [ ] 실제(라이브)키 발급
  - [ ] NEXT_PUBLIC_TOSS_CLIENT_KEY (live_ck_...) 확보
  - [ ] TOSS_SECRET_KEY (live_sk_...) 확보
- [ ] 정산 계좌 등록
- [ ] 허용 도메인에 운영 도메인 추가

### 2-4. 카카오 개발자

- [ ] 새 애플리케이션 등록 (팍스크리스티코리아)
- [ ] AUTH_KAKAO_ID (REST API 키) 확보
- [ ] AUTH_KAKAO_SECRET (Client Secret) 확보
- [ ] 카카오 로그인 활성화
- [ ] Redirect URI 설정: `https://<운영도메인>/api/auth/callback/kakao`
- [ ] 동의 항목 설정 (이메일 필수, 닉네임 필수)
- [ ] (선택) 비즈 앱 전환

### 2-5. Resend

- [ ] 신규 계정 생성
- [ ] RESEND_API_KEY 확보
- [ ] 운영 도메인 등록
  - [ ] MX 레코드 추가
  - [ ] TXT 레코드 추가 (SPF/DKIM)
  - [ ] 도메인 인증 완료
- [ ] 발신 주소 설정: `noreply@<운영도메인>`

### 2-6. Anthropic

- [ ] 신규 계정 생성
- [ ] 결제 수단 등록
- [ ] ANTHROPIC_API_KEY 확보

### 2-7. Upstash Redis (선택)

- [ ] Redis DB 생성 (ap-northeast-1)
- [ ] UPSTASH_REDIS_REST_URL 확보
- [ ] UPSTASH_REDIS_REST_TOKEN 확보

### 2-8. 환경변수 수집 완료 확인

| # | 변수명 | 확보 | 값 확인 |
|---|--------|:----:|:-------:|
| 1 | DATABASE_URL | [ ] | [ ] |
| 2 | NEXTAUTH_SECRET | [ ] | [ ] |
| 3 | NEXTAUTH_URL | [ ] | [ ] |
| 4 | NEXT_PUBLIC_SANITY_PROJECT_ID | [ ] | [ ] |
| 5 | NEXT_PUBLIC_SANITY_DATASET | [ ] | [ ] |
| 6 | SANITY_API_TOKEN | [ ] | [ ] |
| 7 | NEXT_PUBLIC_TOSS_CLIENT_KEY | [ ] | [ ] |
| 8 | TOSS_SECRET_KEY | [ ] | [ ] |
| 9 | RESEND_API_KEY | [ ] | [ ] |
| 10 | AUTH_KAKAO_ID | [ ] | [ ] |
| 11 | AUTH_KAKAO_SECRET | [ ] | [ ] |
| 12 | SUPABASE_URL | [ ] | [ ] |
| 13 | SUPABASE_SERVICE_KEY | [ ] | [ ] |
| 14 | ANTHROPIC_API_KEY | [ ] | [ ] |
| 15 | UPSTASH_REDIS_REST_URL | [ ] | [ ] |
| 16 | UPSTASH_REDIS_REST_TOKEN | [ ] | [ ] |

---

## Phase 3: Vercel 배포 (D-Day)

### 3-1. Vercel 프로젝트

- [ ] GitHub 리포 연결
- [ ] Framework: Next.js 자동 감지 확인
- [ ] Node.js 버전: 22.x 설정
- [ ] 환경변수 16개 모두 입력
  - [ ] Production 환경
  - [ ] Preview 환경
- [ ] 첫 배포 성공 확인
- [ ] 빌드 로그에 에러 없음 확인

### 3-2. DB 초기화

- [ ] `npx prisma migrate deploy` 성공
- [ ] 운영 사이트에서 ajornamento@gmail.com 회원가입
- [ ] Prisma Studio에서 해당 사용자 role → ADMIN 변경
- [ ] 관리자 로그인 테스트 (`/admin` 접근)

### 3-3. 도메인 연결

- [ ] Vercel에 운영 도메인 추가
- [ ] www 서브도메인 추가
- [ ] DNS 레코드 변경
  - [ ] A 레코드: @ → 76.76.21.21
  - [ ] CNAME: www → cname.vercel-dns.com
  - [ ] MX 레코드 유지 확인 (삭제 금지!)
  - [ ] TXT 레코드 유지 확인 (삭제 금지!)
- [ ] DNS 전파 확인: `nslookup <운영도메인>` → 76.76.21.21
- [ ] SSL 인증서 자동 발급 확인 (🔒 자물쇠)

---

## Phase 4: 외부 서비스 콜백 URL (D-Day)

- [ ] 카카오 로그인 Redirect URI 변경
- [ ] 토스페이먼츠 허용 도메인 변경
- [ ] Sanity CORS origins 추가
- [ ] Supabase Auth Site URL 변경

---

## Phase 5: 검증 (D+1 ~ D+7)

### 5-1. 기본 접속 테스트

- [ ] `https://<운영도메인>` 정상 표시
- [ ] `https://www.<운영도메인>` → non-www 리다이렉트
- [ ] `http://<운영도메인>` → https 리다이렉트
- [ ] SSL 인증서 유효 (브라우저 자물쇠)

### 5-2. 페이지 로드 테스트

| 완료 | 페이지 | 경로 | 결과 |
|:----:|--------|------|------|
| [ ] | 홈 | `/` | |
| [ ] | 소개 | `/about` | |
| [ ] | 뉴스 목록 | `/news` | |
| [ ] | 뉴스 상세 | `/news/[slug]` | |
| [ ] | 교육 | `/education` | |
| [ ] | 네트워크 | `/network` | |
| [ ] | 후원 | `/donate` | |
| [ ] | 투명성 | `/transparency` | |
| [ ] | 커뮤니티 | `/community` | |
| [ ] | 영어 버전 | `/en` | |
| [ ] | 관리자 | `/admin` | |
| [ ] | Sanity Studio | `/studio` | |

### 5-3. 인증 기능 테스트

| 완료 | 기능 | 테스트 절차 | 결과 |
|:----:|------|------------|------|
| [ ] | 이메일 회원가입 | `/register` → 정보 입력 | |
| [ ] | 이메일 로그인 | `/login` → 이메일/비밀번호 | |
| [ ] | 카카오 로그인 | `/login` → 카카오 버튼 | |
| [ ] | 로그아웃 | 헤더 → 로그아웃 | |
| [ ] | 비밀번호 표시/숨기기 | `/login` → 토글 버튼 | |
| [ ] | 관리자 전용 접근 | `/admin` → ADMIN 계정 | |
| [ ] | 비인가 접근 차단 | `/admin` → 일반 계정 | |

### 5-4. 결제 기능 테스트

| 완료 | 항목 | 테스트 절차 | 결과 |
|:----:|------|------------|------|
| [ ] | 후원 페이지 로드 | `/donate` 접속 | |
| [ ] | 금액 선택 | 금액 버튼 클릭 | |
| [ ] | 토스 결제창 호출 | 결제하기 클릭 → 토스 팝업 | |
| [ ] | 결제 승인 | 결제 완료 → 성공 페이지 | |
| [ ] | 결제 내역 확인 | 토스 대시보드에서 확인 | |

> ⚠️ 실제키 전환 전에는 테스트 결제로 확인, 전환 후 소액 실결제 테스트

### 5-5. CMS 콘텐츠 테스트

| 완료 | 항목 | 테스트 절차 | 결과 |
|:----:|------|------------|------|
| [ ] | Studio 접속 | `/studio` → 로그인 | |
| [ ] | 뉴스 작성 | Studio → 뉴스 → 새 문서 | |
| [ ] | 뉴스 발행 | Publish → 사이트에서 확인 | |
| [ ] | 이미지 업로드 | Studio → 이미지 첨부 | |
| [ ] | 연혁/임원진 | Studio → 해당 스키마 확인 | |

### 5-6. 이메일 기능 테스트

| 완료 | 항목 | 결과 |
|:----:|------|------|
| [ ] | 뉴스레터 구독 이메일 발송 | |
| [ ] | 발신 주소 정상 (`noreply@<운영도메인>`) | |
| [ ] | 스팸함이 아닌 수신함으로 도착 | |

### 5-7. 기타 기능 테스트

| 완료 | 항목 | 결과 |
|:----:|------|------|
| [ ] | 다국어 전환 (한/영) | |
| [ ] | 다크모드 전환 | |
| [ ] | 모바일 반응형 (375px, 768px) | |
| [ ] | 게시글 작성/수정/삭제 | |
| [ ] | 댓글 작성/삭제 | |
| [ ] | 영수증 OCR 업로드 | |
| [ ] | PDF 보고서 다운로드 | |

### 5-8. SEO 및 메타데이터

| 완료 | 항목 | 확인 방법 | 결과 |
|:----:|------|-----------|------|
| [ ] | sitemap.xml | `https://<운영도메인>/sitemap.xml` | |
| [ ] | robots.txt | `https://<운영도메인>/robots.txt` | |
| [ ] | OG 태그 미리보기 | 카카오톡/페이스북 공유 테스트 | |
| [ ] | Google Search Console | 새 속성 등록 + sitemap 제출 | |
| [ ] | Google Analytics | 추적 코드 설정 (선택) | |

### 5-9. 보안 검증

| 완료 | 항목 | 확인 방법 | 결과 |
|:----:|------|-----------|------|
| [ ] | HTTPS 강제 | http → https 리다이렉트 | |
| [ ] | 보호 경로 차단 | `/admin`, `/api/finance/*` 비인가 접근 | |
| [ ] | 환경변수 미노출 | 브라우저 소스에서 서버 키 검색 | |
| [ ] | Rate Limiting | API 엔드포인트 연속 요청 테스트 | |

### 5-10. 성능 검증

| 완료 | 항목 | 목표 | 결과 |
|:----:|------|------|------|
| [ ] | Lighthouse Performance | 90+ | |
| [ ] | Lighthouse Accessibility | 95+ | |
| [ ] | Lighthouse Best Practices | 95+ | |
| [ ] | Lighthouse SEO | 100 | |
| [ ] | Core Web Vitals (LCP) | < 2.5s | |
| [ ] | Core Web Vitals (FID) | < 100ms | |
| [ ] | Core Web Vitals (CLS) | < 0.1 | |

---

## Phase 6: 안정화 및 정리 (D+7)

### 6-1. 개발 환경 정리

- [ ] 개발용 Vercel 프로젝트 상태 결정 (유지/삭제)
- [ ] 개발용 Supabase 프로젝트 상태 결정 (유지/삭제)
- [ ] 개발용 카카오 앱 비활성화
- [ ] 개발용 토스페이먼츠 테스트키 관리
- [ ] 불필요한 API 키 폐기

### 6-2. 운영 안정화

- [ ] Vercel Logs 모니터링 설정
- [ ] 에러 알림 설정 (선택: Sentry, Vercel Alerts 등)
- [ ] 백업 정책 수립
  - [ ] Supabase DB 자동 백업 확인
  - [ ] Sanity 콘텐츠 백업 주기 결정
- [ ] 도메인 자동 갱신 설정 확인

### 6-3. 인수인계

- [ ] 운영자(ajornamento)에게 관리자 매뉴얼 전달
  - [ ] Sanity Studio 사용법
  - [ ] Vercel 대시보드 사용법
  - [ ] 긴급 롤백 절차
- [ ] 긴급 연락처 교환
- [ ] 정기 점검 일정 합의

---

## 최종 확인

### 이관 완료 서명

| 항목 | 확인자 | 날짜 |
|------|--------|------|
| Phase 1-4 완료 (기술 이관) | | |
| Phase 5 완료 (기능 검증) | | |
| Phase 6 완료 (안정화) | | |
| **운영 이관 최종 완료** | | |

---

### 이관 후 정기 점검 일정

| 주기 | 점검 항목 | 담당 |
|------|-----------|------|
| 매주 | Vercel Logs 에러 확인 | |
| 매월 | Lighthouse 점수 재측정 | |
| 분기 | npm 패키지 업데이트 확인 | |
| 분기 | Supabase DB 백업 확인 | |
| 연간 | 도메인 갱신 확인 | |
| 연간 | SSL 인증서 확인 (자동 갱신) | |
| 연간 | 토스페이먼츠 계약 갱신 확인 | |
