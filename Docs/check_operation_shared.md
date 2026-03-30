# 운영 이관 체크리스트 — 공동 관리 버전 (check_operation_shared.md)

> 작성일: 2026-03-30
> 용도: plan_operation_shared.md의 각 단계별 완료 여부 추적
> 전략: 멤버 추가 중심, 과금 서비스(Anthropic, 토스)만 별도 계정
> 사용법: 각 항목 완료 시 `[ ]` → `[x]`로 변경하고 날짜/메모 기록

---

## Phase 1: 멤버 초대 (D-3)

### 1-1. moonsongit → ajornamento 멤버 추가

| 완료 | 서비스 | 경로 | ajornamento 권한 | 완료일 |
|:----:|--------|------|:----------------:|--------|
| [ ] | GitHub | Settings → Collaborators → Add people | Admin (Write) | |
| [ ] | Vercel | Settings → Members → Invite | Admin | |
| [ ] | Supabase | Organization Settings → Members | Admin | |
| [ ] | Sanity.io | manage.sanity.io → Members → Invite | Administrator | |
| [ ] | 카카오 개발자 | 앱 → 팀 관리 → 팀원 초대 | 관리자 | |
| [ ] | Resend | Settings → Team → Invite | Admin | |
| [ ] | Upstash | Team → Members → Invite | Admin | |

### 1-2. ajornamento 초대 수락 및 접근 확인

| 완료 | 서비스 | 초대 수락 | 대시보드 접근 | 메모 |
|:----:|--------|:---------:|:------------:|------|
| [ ] | GitHub | [ ] | [ ] | 리포 코드 열람 가능 확인 |
| [ ] | Vercel | [ ] | [ ] | 프로젝트 배포 상태 확인 가능 |
| [ ] | Supabase | [ ] | [ ] | DB 테이블 목록 확인 가능 |
| [ ] | Sanity.io | [ ] | [ ] | /studio 접속 + 콘텐츠 편집 가능 |
| [ ] | 카카오 개발자 | [ ] | [ ] | 앱 설정 페이지 접근 가능 |
| [ ] | Resend | [ ] | [ ] | 이메일 로그 확인 가능 |
| [ ] | Upstash | [ ] | [ ] | Redis DB 상태 확인 가능 |

---

## Phase 2: 별도 계정 서비스 (D-3 ~ D-1)

### 2-1. Anthropic (과금 이관)

- [ ] ajornamento@gmail.com으로 console.anthropic.com 가입
- [ ] 결제 수단(카드) 등록
  - 카드 종류: _______________
- [ ] API Key 생성
  - [ ] 키 이름: `pck-homepage-prod`
  - [ ] 키 값 안전하게 보관
- [ ] 새 ANTHROPIC_API_KEY 확보 완료

### 2-2. 토스페이먼츠 (사업자 명의 실결제)

- [ ] ajornamento 계정으로 developers.tosspayments.com 가입
  - (또는 단체 공용 계정 생성)
- [ ] 사업자 정보 등록
  - [ ] 사업자등록번호: 591-80-01356
  - [ ] 단체명: 팍스크리스티코리아
  - [ ] 대표자명: _______________
- [ ] 정산 계좌 등록
  - 은행/계좌: _______________
- [ ] 심사 신청일: _______________
- [ ] 심사 완료일: _______________
- [ ] 실제(라이브)키 발급
  - [ ] NEXT_PUBLIC_TOSS_CLIENT_KEY (live_ck_...) 확보
  - [ ] TOSS_SECRET_KEY (live_sk_...) 확보
- [ ] 허용 도메인에 운영 도메인 추가

### 2-3. 환경변수 업데이트 (변경 필요한 것만)

| # | 변수명 | 변경 사유 | 새 값 확보 | Vercel 반영 |
|---|--------|-----------|:----------:|:-----------:|
| 1 | NEXTAUTH_URL | 도메인 변경 | [ ] | [ ] |
| 2 | NEXTAUTH_SECRET | 보안 강화 (재생성 권장) | [ ] | [ ] |
| 3 | ANTHROPIC_API_KEY | 과금 이관 | [ ] | [ ] |
| 4 | NEXT_PUBLIC_TOSS_CLIENT_KEY | 사업자 실제키 | [ ] | [ ] |
| 5 | TOSS_SECRET_KEY | 사업자 실제키 | [ ] | [ ] |

### 2-4. 변경 없이 유지되는 환경변수 확인

> 아래 변수들은 기존 값을 그대로 사용합니다. Vercel에 이미 설정되어 있는지 확인만 합니다.

| # | 변수명 | Vercel에 설정됨 |
|---|--------|:---------------:|
| 1 | DATABASE_URL | [ ] |
| 2 | NEXT_PUBLIC_SANITY_PROJECT_ID | [ ] |
| 3 | NEXT_PUBLIC_SANITY_DATASET | [ ] |
| 4 | SANITY_API_TOKEN | [ ] |
| 5 | RESEND_API_KEY | [ ] |
| 6 | AUTH_KAKAO_ID | [ ] |
| 7 | AUTH_KAKAO_SECRET | [ ] |
| 8 | SUPABASE_URL | [ ] |
| 9 | SUPABASE_SERVICE_KEY | [ ] |
| 10 | UPSTASH_REDIS_REST_URL | [ ] |
| 11 | UPSTASH_REDIS_REST_TOKEN | [ ] |

---

## Phase 3: 도메인 전환 (D-Day)

### 3-1. 도메인 등록 정보 변경

- [ ] Inames 계정 접근 확보
- [ ] 등록자(Registrant) 정보 변경
  - [ ] 이메일 → ajornamento@gmail.com
  - [ ] 연락처 → 운영 담당자 전화번호
- [ ] 관리 담당자(Admin Contact) 정보 변경
- [ ] WHOIS 정보 업데이트 확인
- [ ] 도메인 만료일 확인: _______________
- [ ] 자동 갱신 설정 확인

### 3-2. DNS 레코드 변경 전 백업

- [ ] 가비아 DNS 관리 패널 접근 확인
- [ ] 현재 DNS 레코드 전체 스크린샷 저장
- [ ] MX 레코드 기록: _______________
- [ ] TXT 레코드 기록: _______________

### 3-3. Vercel 도메인 등록

- [ ] Vercel → Settings → Domains → 운영 도메인 추가
- [ ] www 서브도메인 추가

### 3-4. DNS 레코드 변경

- [ ] A 레코드 변경: @ → 76.76.21.21 (TTL: 300)
- [ ] CNAME 추가: www → cname.vercel-dns.com (TTL: 300)
- [ ] MX 레코드 유지 확인 (삭제하지 않았는지!)
- [ ] TXT 레코드 유지 확인 (삭제하지 않았는지!)

### 3-5. Vercel 환경변수 업데이트

- [ ] NEXTAUTH_URL → `https://paxchristikorea.org`
- [ ] NEXTAUTH_SECRET → 새 값 (재생성한 경우)
- [ ] ANTHROPIC_API_KEY → ajornamento 계정 키
- [ ] NEXT_PUBLIC_TOSS_CLIENT_KEY → 라이브키 (심사 완료 시)
- [ ] TOSS_SECRET_KEY → 라이브키 (심사 완료 시)
- [ ] Vercel 재배포 (Redeploy)

### 3-6. 외부 서비스 콜백 URL 변경

| 완료 | 서비스 | 변경 내용 | 담당 |
|:----:|--------|-----------|------|
| [ ] | 카카오 로그인 | Redirect URI 추가: `https://paxchristikorea.org/api/auth/callback/kakao` | moonsongit 또는 ajornamento |
| [ ] | 토스페이먼츠 | 허용 도메인: `paxchristikorea.org` | ajornamento (새 계정) |
| [ ] | Sanity CORS | origins 추가: `https://paxchristikorea.org` | moonsongit 또는 ajornamento |
| [ ] | Supabase Auth | Site URL: `https://paxchristikorea.org` | moonsongit 또는 ajornamento |

### 3-7. DNS 전파 및 SSL 확인

- [ ] DNS 전파 확인: `nslookup paxchristikorea.org` → 76.76.21.21
- [ ] SSL 인증서 자동 발급 확인 (브라우저 자물쇠)
- [ ] `https://paxchristikorea.org` 접속 성공

---

## Phase 4: 검증 (D-Day ~ D+1)

### 4-1. 기본 접속 테스트

- [ ] `https://paxchristikorea.org` 정상 표시
- [ ] `https://www.paxchristikorea.org` → non-www 리다이렉트
- [ ] `http://paxchristikorea.org` → https 리다이렉트
- [ ] SSL 인증서 유효

### 4-2. 페이지 로드 테스트

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

### 4-3. 인증 기능 테스트

| 완료 | 기능 | 결과 |
|:----:|------|------|
| [ ] | 이메일 회원가입 | |
| [ ] | 이메일 로그인 | |
| [ ] | 카카오 로그인 | |
| [ ] | 로그아웃 | |
| [ ] | 관리자 접근 (`/admin`) | |
| [ ] | 비인가 접근 차단 | |

### 4-4. 결제 기능 테스트

| 완료 | 항목 | 결과 |
|:----:|------|------|
| [ ] | 후원 페이지 로드 | |
| [ ] | 토스 결제창 호출 | |
| [ ] | 결제 승인 (테스트 또는 소액 실결제) | |
| [ ] | 토스 대시보드에서 거래 내역 확인 | |

> 토스 심사 미완료 시: 테스트키로 기능 동작만 확인, 실결제는 심사 후 재테스트

### 4-5. CMS 테스트 (ajornamento 계정으로)

| 완료 | 항목 | 결과 |
|:----:|------|------|
| [ ] | `/studio` 접속 (ajornamento Sanity 계정) | |
| [ ] | 뉴스 작성 → Publish → 사이트 반영 확인 | |
| [ ] | 이미지 업로드 | |
| [ ] | 기존 콘텐츠 정상 표시 (연혁, 임원진 등) | |

### 4-6. 이메일 테스트

| 완료 | 항목 | 결과 |
|:----:|------|------|
| [ ] | 이메일 발송 기능 동작 | |
| [ ] | 발신 주소 정상 | |

### 4-7. 영수증 OCR 테스트 (Anthropic 키 교체 확인)

| 완료 | 항목 | 결과 |
|:----:|------|------|
| [ ] | 영수증 이미지 업로드 | |
| [ ] | OCR 결과 정상 반환 | |
| [ ] | Anthropic 대시보드에서 ajornamento 계정 사용량 확인 | |

### 4-8. 기타 기능 테스트

| 완료 | 항목 | 결과 |
|:----:|------|------|
| [ ] | 다국어 전환 (한/영) | |
| [ ] | 다크모드 전환 | |
| [ ] | 모바일 반응형 | |
| [ ] | 게시글 작성/수정/삭제 | |
| [ ] | 댓글 작성/삭제 | |
| [ ] | PDF 보고서 다운로드 | |

### 4-9. SEO 및 메타데이터

| 완료 | 항목 | 결과 |
|:----:|------|------|
| [ ] | `/sitemap.xml` 정상 | |
| [ ] | `/robots.txt` 정상 | |
| [ ] | OG 태그 (카카오톡 공유 테스트) | |
| [ ] | Google Search Console 등록 + sitemap 제출 | |

### 4-10. 보안 검증

| 완료 | 항목 | 결과 |
|:----:|------|------|
| [ ] | HTTPS 강제 리다이렉트 | |
| [ ] | 보호 경로 차단 (`/admin`, `/api/finance/*`) | |
| [ ] | 브라우저 소스에서 서버 키 미노출 | |

### 4-11. 성능 검증

| 완료 | 항목 | 목표 | 결과 |
|:----:|------|------|------|
| [ ] | Lighthouse Performance | 90+ | |
| [ ] | Lighthouse Accessibility | 95+ | |
| [ ] | Lighthouse Best Practices | 95+ | |
| [ ] | Lighthouse SEO | 100 | |

---

## Phase 5: 안정화 (D+7)

### 5-1. 모니터링 확인

- [ ] Vercel Logs — 에러 없음 확인 (7일간)
- [ ] Supabase — DB 정상 동작 확인
- [ ] Anthropic — ajornamento 계정 사용량/결제 정상
- [ ] 토스페이먼츠 — 정산 정상 진행 확인

### 5-2. 멤버 권한 최종 정리

| 완료 | 서비스 | moonsongit 유지 권한 | ajornamento 최종 권한 |
|:----:|--------|:--------------------:|:--------------------:|
| [ ] | GitHub | Collaborator (유지) | Admin |
| [ ] | Vercel | Owner (유지) | Admin |
| [ ] | Supabase | Owner (유지) | Admin |
| [ ] | Sanity | Owner (유지) | Administrator |
| [ ] | 카카오 | Owner (유지) | 관리자 |
| [ ] | Resend | Owner (유지) | Admin |
| [ ] | Upstash | Owner (유지) | Admin |
| [ ] | Anthropic | - | Owner |
| [ ] | 토스페이먼츠 | - | Owner |

### 5-3. 도메인 최종 확인

- [ ] 도메인 등록자 정보 ajornamento 반영 확인
- [ ] 도메인 자동 갱신 설정
- [ ] 만료일 캘린더 등록: _______________

### 5-4. 문서화 및 인수인계

- [ ] 운영자(ajornamento) 접근 가능 서비스 목록 전달
- [ ] Sanity Studio 사용법 안내
- [ ] Vercel 대시보드 기본 사용법 안내
- [ ] 긴급 장애 시 연락 체계 합의
  - 1차: _______________
  - 2차: _______________
- [ ] 정기 점검 일정 합의

---

## 최종 확인

### 이관 완료 서명

| 항목 | 확인자 | 날짜 |
|------|--------|------|
| Phase 1 완료 (멤버 초대 7건) | | |
| Phase 2 완료 (Anthropic + 토스 별도 계정) | | |
| Phase 3 완료 (도메인 전환) | | |
| Phase 4 완료 (기능 검증) | | |
| Phase 5 완료 (안정화) | | |
| **운영 이관 최종 완료** | | |

---

### 이관 후 정기 점검 일정

| 주기 | 점검 항목 | 담당 |
|------|-----------|------|
| 매주 | Vercel Logs 에러 확인 | ajornamento |
| 매월 | Anthropic 사용량/청구 확인 | ajornamento |
| 매월 | 토스페이먼츠 정산 확인 | ajornamento |
| 분기 | npm 패키지 업데이트 | moonsongit |
| 분기 | Supabase DB 백업 확인 | 공동 |
| 연간 | 도메인 갱신 확인 | ajornamento |
| 연간 | SSL 인증서 확인 (자동 갱신) | 자동 |

---

### 향후 완전 이관 필요 시

공동 관리에서 완전 분리가 필요해지면 `plan_operation.md`(전체 이관 버전)를 참조하세요.
핵심 추가 작업:
- Supabase 신규 프로젝트 + 데이터 마이그레이션
- Sanity 소유권 이전
- GitHub Organization 생성 + 리포 이전
- Resend/Upstash 새 계정 + 키 교체
- 환경변수 전체(16개) 교체
