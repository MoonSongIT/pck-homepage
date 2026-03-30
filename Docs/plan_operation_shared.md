# 운영 이관 계획서 — 공동 관리 버전 (plan_operation_shared.md)

> 작성일: 2026-03-30
> 목적: 개발자(moonsongit@gmail.com)가 기존 서비스에 운영자(ajornamento@gmail.com)를 멤버로 추가하여 공동 관리
> 전략: **기존 프로젝트/계정을 유지하면서 멤버 초대** → 안정적 전환, 데이터 마이그레이션 불필요

---

## 1. 이관 전략 비교

### 왜 "공동 관리" 방식인가?

| 항목 | 전체 이관 (기존 버전) | 공동 관리 (이 버전) |
|------|:---------------------:|:-------------------:|
| 데이터 마이그레이션 | 필요 (DB, CMS 등) | **불필요** |
| 환경변수 변경 | 전체 교체 (16개) | **최소 변경** (2~3개) |
| 서비스 중단 위험 | 높음 | **낮음** |
| 기존 콘텐츠 손실 위험 | 있음 | **없음** |
| 작업 소요 시간 | 2주+ | **3~5일** |
| 난이도 | 상 | **하~중** |

### 핵심 원칙

```
1. 과금이 발생하는 민감한 서비스 → 운영자 별도 계정
2. 그 외 모든 서비스 → 기존 프로젝트에 멤버 추가
3. 기존 환경변수(API 키) → 최대한 유지
4. 도메인 + 콜백 URL만 변경
```

---

## 2. 서비스별 이관 방식 분류

### 2-1. 멤버 추가 (기존 프로젝트 유지)

> 기존 moonsongit 프로젝트에 ajornamento를 멤버로 초대합니다.
> API 키/환경변수 변경 없이 그대로 사용할 수 있습니다.

| # | 서비스 | 멤버 기능 | ajornamento 권한 | 환경변수 변경 |
|---|--------|-----------|-----------------|:-------------:|
| 1 | **GitHub** | Collaborator / Organization | Admin (Write) | 없음 |
| 2 | **Vercel** | Team Member | Admin | 없음 |
| 3 | **Supabase** | Organization Member | Admin | 없음 |
| 4 | **Sanity.io** | Project Member | Administrator | 없음 |
| 5 | **카카오 개발자** | 팀원 초대 | 관리자 | 없음 |
| 6 | **Resend** | Team Member | Admin | 없음 |
| 7 | **Upstash** | Team Member | Admin | 없음 |

### 2-2. 별도 계정 필요 (과금/사업자 민감)

> 운영자 명의로 별도 가입이 필요한 서비스입니다.

| # | 서비스 | 사유 | 환경변수 변경 |
|---|--------|------|:-------------:|
| 8 | **Anthropic** | API 호출 과금 (사용량 기반 결제) | `ANTHROPIC_API_KEY` 교체 |
| 9 | **토스페이먼츠** | 실결제 PG, 사업자 명의+정산 계좌 필요 | `TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY` 교체 |

### 2-3. 도메인 관련 (별도 절차)

| # | 항목 | 이관 방식 |
|---|------|-----------|
| 10 | **도메인 등록 (Inames)** | 등록자 정보 변경 또는 관리 위임 |
| 11 | **DNS 관리 (가비아)** | 가비아 계정 공유 또는 DNS 레코드 변경 대행 |

---

## 3. 서비스별 멤버 추가 절차

### 3-1. GitHub — Collaborator 추가

```
담당: moonsongit (리포 Owner)
경로: github.com/MoonSongIT/pck-homepage
      → Settings → Collaborators → Add people

작업:
  1. ajornamento@gmail.com (또는 GitHub 유저네임) 검색
  2. 권한: Write (Push, Merge 가능) 또는 Admin
  3. 초대 발송 → ajornamento가 이메일로 수락

결과:
  - ajornamento가 코드 Push, PR 머지, 브랜치 관리 가능
  - 리포 삭제/이전은 Owner만 가능 (안전)
```

**향후 소유권 이전이 필요한 경우:**

```
옵션 A: Organization 생성 (권장)
  1. GitHub에서 Organization 생성 (예: PaxChristiKorea)
  2. moonsongit, ajornamento 모두 Owner로 등록
  3. 리포를 Organization으로 Transfer
  → 두 사람 모두 동등한 관리 권한

옵션 B: 리포 Transfer
  Settings → Danger Zone → Transfer ownership
  → ajornamento 계정으로 이전 (moonsongit은 Collaborator로 유지)
```

### 3-2. Vercel — Team Member 초대

```
담당: moonsongit (프로젝트 Owner)
경로: vercel.com → 프로젝트 → Settings → Members

작업:
  1. ajornamento@gmail.com 초대
  2. 역할: Admin (환경변수 확인, 배포 관리 가능)
  3. 초대 수락 확인

결과:
  - ajornamento가 배포 상태 확인, 롤백, 로그 조회 가능
  - 환경변수 조회/수정 가능 (Admin 역할)
  - 기존 프로젝트 URL(.vercel.app)과 설정 그대로 유지

⚠️ 참고: Vercel Hobby 플랜은 Team 기능 제한적
   → Pro 플랜($20/월) 업그레이드 시 팀 기능 완전 지원
   → 또는 ajornamento를 프로젝트에 직접 초대 (Hobby에서도 가능)
```

### 3-3. Supabase — Organization Member 추가

```
담당: moonsongit (프로젝트 Owner)
경로: supabase.com → Organization Settings → Members

작업:
  1. ajornamento@gmail.com 초대
  2. 역할: Admin (DB 조회, Storage 관리 가능)
  3. 초대 수락 확인

결과:
  - 동일 프로젝트, 동일 DB 사용 → 데이터 마이그레이션 불필요
  - DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_KEY 변경 없음
  - ajornamento가 Prisma Studio, DB 백업, Storage 관리 가능

⚠️ Free 플랜: Organization 당 멤버 제한 있을 수 있음
   → 필요 시 Pro 플랜 업그레이드
```

### 3-4. Sanity.io — Project Member 추가

```
담당: moonsongit (프로젝트 Owner)
경로: manage.sanity.io → 프로젝트 선택 → Members

작업:
  1. Invite member → ajornamento@gmail.com
  2. 역할: Administrator
     - Administrator: 프로젝트 설정, API 토큰 관리, CORS 설정 가능
     - Editor: 콘텐츠 편집만 가능
  3. 초대 수락 확인

결과:
  - NEXT_PUBLIC_SANITY_PROJECT_ID 변경 없음
  - SANITY_API_TOKEN 변경 없음
  - ajornamento가 /studio에서 콘텐츠 관리 가능
  - 기존 모든 콘텐츠(뉴스, 연혁, 임원진 등) 그대로 유지
```

### 3-5. 카카오 개발자 — 팀원 초대

```
담당: moonsongit (앱 소유자)
경로: developers.kakao.com → 내 애플리케이션 → 팍스크리스티코리아 → 팀 관리

작업:
  1. 팀원 초대 → ajornamento의 카카오 계정 (이메일 또는 카카오 ID)
  2. 권한: 관리자 (앱 설정 변경 가능)
  3. 초대 수락 확인

결과:
  - AUTH_KAKAO_ID, AUTH_KAKAO_SECRET 변경 없음
  - Redirect URI 설정을 ajornamento가 직접 변경 가능
  - 동의 항목, 비즈 앱 전환 등 관리 가능

⚠️ 카카오는 앱 소유자 변경(이전) 기능이 제한적
   → 팀원으로 관리자 권한 부여가 현실적인 방법
   → 향후 필요 시 새 앱 생성 후 키 교체
```

### 3-6. Resend — Team Member 초대

```
담당: moonsongit (계정 Owner)
경로: resend.com → Settings → Team

작업:
  1. Invite member → ajornamento@gmail.com
  2. 역할: Admin
  3. 초대 수락 확인

결과:
  - RESEND_API_KEY 변경 없음
  - 도메인 인증 설정, 이메일 로그 확인 가능
  - 발신 도메인 변경 시 ajornamento가 직접 설정 가능
```

### 3-7. Upstash — Team Member 초대

```
담당: moonsongit (계정 Owner)
경로: console.upstash.com → Team → Members

작업:
  1. Invite → ajornamento@gmail.com
  2. 역할: Admin
  3. 초대 수락 확인

결과:
  - UPSTASH_REDIS_REST_URL, TOKEN 변경 없음
  - Redis 모니터링, 설정 변경 가능
```

---

## 4. 별도 계정이 필요한 서비스

### 4-1. Anthropic (영수증 OCR) — 과금 이관

```
사유: API 호출마다 과금 발생, 결제 카드가 moonsongit 명의

작업:
  1. ajornamento@gmail.com으로 console.anthropic.com 가입
  2. 결제 수단(카드) 등록 — 운영 단체 법인카드 또는 담당자 카드
  3. API Keys → Create Key → 새 키 발급
  4. Vercel 환경변수 업데이트:
     ANTHROPIC_API_KEY = sk-ant-<새키>
  5. 재배포 (Vercel에서 Redeploy)

확인:
  - 영수증 OCR 기능 테스트 (/admin → 영수증 업로드)
  - Anthropic 대시보드에서 사용량 청구 확인
```

### 4-2. 토스페이먼츠 (후원 결제) — 사업자 명의 필수

```
사유: 실제 결제 PG 서비스, 단체 사업자 명의+정산 계좌 필요

작업:
  1. ajornamento 계정으로 developers.tosspayments.com 가입
     (또는 단체 공용 계정 생성)
  2. 사업자 정보 등록:
     - 사업자등록번호: 591-80-01356
     - 단체명: 팍스크리스티코리아
     - 정산 계좌: 단체 명의 통장
  3. 심사 신청 → 승인 대기 (보통 1~3 영업일)
  4. 심사 완료 후 실제(라이브)키 발급:
     - NEXT_PUBLIC_TOSS_CLIENT_KEY = live_ck_...
     - TOSS_SECRET_KEY = live_sk_...
  5. 허용 도메인 설정: 운영 도메인 추가
  6. Vercel 환경변수 업데이트:
     NEXT_PUBLIC_TOSS_CLIENT_KEY = live_ck_<새키>
     TOSS_SECRET_KEY = live_sk_<새키>
  7. 재배포

확인:
  - /donate → 소액(1,000원) 실결제 테스트
  - 토스 대시보드에서 거래 내역 확인
  - 정산 계좌로 정산 예정 확인

⚠️ 심사 완료 전까지 기존 테스트키로 운영 가능
   (테스트 모드 → 실결제 불가, 기능 동작만 확인)
```

---

## 5. 도메인 및 콜백 URL 변경

### 5-1. 도메인 등록 정보 변경

```
현재: paxchristikorea.org (Inames 등록, 가비아 DNS)

옵션 A: 등록자 정보만 변경 (권장, 가장 간단)
  1. Inames 계정 접근 (기존 관리자에게 요청)
  2. 등록자 이메일 → ajornamento@gmail.com
  3. 관리 담당자 연락처 변경
  4. 가비아 DNS 계정 정보도 ajornamento에게 공유

옵션 B: 가비아 계정 공동 관리
  1. 가비아 계정 로그인 정보를 ajornamento에게 전달
  2. 또는 가비아 부관리자 기능 활용 (유료 계정)
```

### 5-2. DNS 레코드 변경 (Vercel 연결)

```
가비아 DNS 관리 패널에서:

[변경]
  A      @    139.150.65.235  →  76.76.21.21        TTL: 300
[추가]
  CNAME  www  (없음)          →  cname.vercel-dns.com  TTL: 300
[유지 — 절대 삭제 금지]
  MX 레코드 (이메일 관련)
  TXT 레코드 (SPF, DKIM)
```

### 5-3. Vercel 도메인 등록

```
Vercel 대시보드 → 프로젝트 → Settings → Domains
  1. paxchristikorea.org 추가
  2. www.paxchristikorea.org 추가 (www → non-www 리다이렉트)
  3. SSL 인증서 자동 발급 대기
```

### 5-4. 환경변수 변경 (도메인 관련만)

```env
# 변경 필요 (2개)
NEXTAUTH_URL=https://paxchristikorea.org          # 기존: https://pck-homepage.vercel.app
NEXTAUTH_SECRET=<새로 생성 권장: openssl rand -base64 32>

# 변경 없음 — 기존 값 그대로 유지
DATABASE_URL=<기존 값 유지>
NEXT_PUBLIC_SANITY_PROJECT_ID=<기존 값 유지>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<기존 값 유지>
RESEND_API_KEY=<기존 값 유지>
AUTH_KAKAO_ID=<기존 값 유지>
AUTH_KAKAO_SECRET=<기존 값 유지>
SUPABASE_URL=<기존 값 유지>
SUPABASE_SERVICE_KEY=<기존 값 유지>
UPSTASH_REDIS_REST_URL=<기존 값 유지>
UPSTASH_REDIS_REST_TOKEN=<기존 값 유지>

# 변경 필요 — 별도 계정 서비스 (2~3개)
ANTHROPIC_API_KEY=sk-ant-<ajornamento 계정 새 키>
NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_<새 실제키>
TOSS_SECRET_KEY=live_sk_<새 실제키>
```

### 5-5. 외부 서비스 콜백 URL 변경

| 서비스 | 설정 위치 | 변경 내용 | 담당 |
|--------|-----------|-----------|------|
| **카카오 로그인** | developers.kakao.com → 앱 → 카카오 로그인 | Redirect URI 추가: `https://paxchristikorea.org/api/auth/callback/kakao` | moonsongit 또는 ajornamento (팀원) |
| **토스페이먼츠** | developers.tosspayments.com → 개발 정보 | 허용 도메인: `paxchristikorea.org` 추가 | ajornamento (새 계정) |
| **Sanity CORS** | manage.sanity.io → API → CORS origins | `https://paxchristikorea.org` 추가 | moonsongit 또는 ajornamento (멤버) |
| **Supabase Auth** | supabase.com → Authentication → URL Config | Site URL: `https://paxchristikorea.org` | moonsongit 또는 ajornamento (멤버) |

---

## 6. 이관 단계별 계획

### Phase 1: 멤버 초대 (D-3)

```
소요 시간: 1~2시간 (moonsongit이 각 서비스에서 초대)

순서:
  1. GitHub → Collaborator 추가
  2. Vercel → Member 초대
  3. Supabase → Organization Member 추가
  4. Sanity → Project Member 추가
  5. 카카오 개발자 → 팀원 초대
  6. Resend → Team Member 초대
  7. Upstash → Team Member 초대

ajornamento 작업:
  - 각 서비스 초대 이메일 수락 (7개)
  - 로그인 후 대시보드 접근 확인
```

### Phase 2: 별도 계정 서비스 설정 (D-3 ~ D-1)

```
ajornamento 작업:

  ① Anthropic (30분)
     - console.anthropic.com 가입
     - 결제 카드 등록
     - API Key 발급

  ② 토스페이먼츠 (심사 대기 포함 1~3일)
     - developers.tosspayments.com 가입
     - 사업자 정보 등록 + 심사 신청
     - 심사 완료 후 라이브키 발급

moonsongit 또는 ajornamento 작업:
  ③ Vercel 환경변수 업데이트 (3개만)
     - ANTHROPIC_API_KEY
     - NEXT_PUBLIC_TOSS_CLIENT_KEY
     - TOSS_SECRET_KEY
```

### Phase 3: 도메인 전환 (D-Day)

```
1. 가비아 DNS 레코드 변경 (§5-2)
2. Vercel에 도메인 등록 (§5-3)
3. Vercel 환경변수 변경 (§5-4)
   - NEXTAUTH_URL 변경
   - NEXTAUTH_SECRET 재생성 (권장)
4. 외부 서비스 콜백 URL 변경 (§5-5)
5. Vercel 재배포
6. DNS 전파 대기 (10분~1시간)
7. SSL 인증서 자동 발급 확인
```

### Phase 4: 검증 (D-Day ~ D+1)

```
check_operation_shared.md 참조
```

### Phase 5: 안정화 (D+7)

```
1. 모니터링 확인 (Vercel Logs, 에러 없음)
2. 도메인 등록 정보 변경 최종 확인
3. 개발자 ↔ 운영자 역할 정리
```

---

## 7. 환경변수 변경 요약

### 전체 이관 버전과 비교

| 환경변수 | 전체 이관 | 공동 관리 (이 버전) |
|----------|:---------:|:------------------:|
| DATABASE_URL | 교체 | **유지** |
| NEXTAUTH_SECRET | 교체 | 재생성 (권장) |
| NEXTAUTH_URL | 교체 | **교체** (도메인 변경) |
| NEXT_PUBLIC_SANITY_PROJECT_ID | 교체 | **유지** |
| NEXT_PUBLIC_SANITY_DATASET | 유지 | **유지** |
| SANITY_API_TOKEN | 교체 | **유지** |
| NEXT_PUBLIC_TOSS_CLIENT_KEY | 교체 | **교체** (사업자 실제키) |
| TOSS_SECRET_KEY | 교체 | **교체** (사업자 실제키) |
| RESEND_API_KEY | 교체 | **유지** |
| AUTH_KAKAO_ID | 교체 | **유지** |
| AUTH_KAKAO_SECRET | 교체 | **유지** |
| SUPABASE_URL | 교체 | **유지** |
| SUPABASE_SERVICE_KEY | 교체 | **유지** |
| ANTHROPIC_API_KEY | 교체 | **교체** (과금 이관) |
| UPSTASH_REDIS_REST_URL | 교체 | **유지** |
| UPSTASH_REDIS_REST_TOKEN | 교체 | **유지** |
| **변경 필요 항목** | **16개 전부** | **4~5개만** |

---

## 8. 계정 권한 매트릭스

| 서비스 | moonsongit 역할 | ajornamento 역할 | 비고 |
|--------|:---------------:|:----------------:|------|
| **GitHub** | Owner | Collaborator (Admin) | 향후 Org 이전 가능 |
| **Vercel** | Owner | Admin Member | 배포/환경변수 관리 가능 |
| **Supabase** | Owner | Admin Member | DB/Storage 접근 가능 |
| **Sanity** | Owner | Administrator | 콘텐츠+설정 관리 가능 |
| **카카오** | Owner | 팀원 (관리자) | 앱 설정 변경 가능 |
| **Resend** | Owner | Admin Member | 도메인/이메일 관리 가능 |
| **Upstash** | Owner | Admin Member | Redis 관리 가능 |
| **Anthropic** | - (기존 유지/해지) | **Owner** (새 계정) | 과금 분리 |
| **토스페이먼츠** | - (테스트 유지) | **Owner** (새 계정) | 사업자 명의, 실결제 |
| **도메인** | - | 등록자/관리자 | 이메일 변경 |

---

## 9. 비용 변화

| 항목 | 변경 전 (moonsongit 부담) | 변경 후 | 부담 주체 |
|------|:------------------------:|:-------:|:---------:|
| Vercel | 무료 (Hobby) | 무료 유지 (또는 Pro $20/월) | 공동 |
| Supabase | 무료 (Free) | 무료 유지 | 공동 |
| Sanity | 무료 (Free) | 무료 유지 | 공동 |
| Resend | 무료 (Free) | 무료 유지 | 공동 |
| Upstash | 무료 (Free) | 무료 유지 | 공동 |
| **Anthropic** | 사용량 과금 | → ajornamento 부담 | **ajornamento** |
| **토스페이먼츠** | 테스트만 | → 실결제 수수료 | **단체 (ajornamento)** |
| 도메인 | ~$10-15/년 | 유지 | 단체 |

---

## 10. 전체 타임라인

```
[D-3]   Phase 1: 멤버 초대 (1~2시간)
          ├─ moonsongit → 7개 서비스에 ajornamento 멤버 추가
          └─ ajornamento → 초대 수락 + 대시보드 접근 확인
              │
[D-3]   Phase 2: 별도 계정 설정 시작
          ├─ ajornamento → Anthropic 가입 + API 키 발급
          └─ ajornamento → 토스페이먼츠 가입 + 사업자 심사 신청
              │
[D-Day]  Phase 3: 도메인 전환
          ├─ DNS 레코드 변경 (가비아)
          ├─ Vercel 도메인 등록
          ├─ 환경변수 4~5개 업데이트
          ├─ 콜백 URL 변경 (카카오, 토스, Sanity, Supabase)
          ├─ Vercel 재배포
          └─ SSL 인증서 확인
              │
[D+1]   Phase 4: 검증
          └─ check_operation_shared.md 체크리스트 실행
              │
[D+7]   Phase 5: 안정화
          ├─ 모니터링 안정 확인
          ├─ 도메인 등록 정보 변경 완료
          └─ 역할 정리 완료
              │
        ✅ 공동 관리 이관 완료 (총 ~10일, 실작업 ~3일)
```

---

## 11. 위험 요소 및 대응

| 위험 | 영향 | 대응 |
|------|------|------|
| moonsongit 계정 비활성화/삭제 시 | 서비스 Owner 권한 상실 | 중요 서비스는 점진적으로 소유권 이전 |
| Vercel Hobby 플랜 멤버 제한 | 초대 실패 | Pro 플랜 업그레이드 또는 계정 공유 |
| 카카오 앱 소유자 변경 불가 | 앱 관리 제한 | 팀원 관리자 권한으로 대부분 커버 가능 |
| 토스페이먼츠 심사 지연 | 실결제 불가 | 심사 전까지 테스트키로 운영 |
| DNS 전파 지연 | 일시적 접속 불가 | TTL 300초, 심야 작업, 전파 전 기존 사이트 유지 |

---

## 12. 향후 완전 이관이 필요한 경우

공동 관리로 운영하다가 완전 분리가 필요해지면:

```
1단계 (즉시): GitHub Organization 생성 → 리포 이전
2단계 (선택): Vercel 프로젝트를 ajornamento 계정으로 재생성
3단계 (선택): Supabase 프로젝트 마이그레이션
4단계 (선택): Sanity 소유권 이전 (manage.sanity.io → Transfer)
5단계 (선택): 카카오 새 앱 생성 → 키 교체
6단계 (선택): Resend 새 계정 → 키 교체

→ 기존 plan_operation.md 참조
```

---

## 부록: moonsongit이 수행할 작업 요약

| # | 작업 | 서비스 | 소요 시간 |
|---|------|--------|-----------|
| 1 | Collaborator 추가 | GitHub | 2분 |
| 2 | Member 초대 | Vercel | 2분 |
| 3 | Member 추가 | Supabase | 2분 |
| 4 | Member 초대 | Sanity | 2분 |
| 5 | 팀원 초대 | 카카오 개발자 | 3분 |
| 6 | Member 초대 | Resend | 2분 |
| 7 | Member 초대 | Upstash | 2분 |
| 8 | 환경변수 업데이트 (4~5개) | Vercel | 5분 |
| 9 | 콜백 URL 변경 | 카카오, Sanity 등 | 10분 |
| 10 | DNS 변경 (또는 안내) | 가비아 | 10분 |
| | **합계** | | **~40분** |

## 부록: ajornamento가 수행할 작업 요약

| # | 작업 | 서비스 | 소요 시간 |
|---|------|--------|-----------|
| 1 | 초대 7건 수락 | 각 서비스 | 15분 |
| 2 | Anthropic 가입 + 키 발급 | Anthropic | 15분 |
| 3 | 토스페이먼츠 가입 + 심사 | 토스 | 30분 + 대기 |
| 4 | 대시보드 접근 테스트 | 각 서비스 | 20분 |
| 5 | 도메인 등록 정보 변경 | Inames/가비아 | 별도 |
| | **합계 (심사 대기 제외)** | | **~1.5시간** |
