# 운영 이관 계획서 (plan_operation.md)

> 작성일: 2026-03-30
> 목적: 개발 환경(moonsongit@gmail.com) → 운영 환경(ajornamento@gmail.com) 이관
> 도메인 변경 및 등록 정보 변경 포함

---

## 1. 이관 개요

### 1-1. 현재 상태 (개발)

| 항목 | 현재 값 |
|------|---------|
| **관리 계정** | `moonsongit@gmail.com` |
| **Vercel 프로젝트** | MoonSongIT 계정 소유 |
| **GitHub 리포** | `MoonSongIT/pck-homepage` |
| **Supabase 프로젝트** | moonsongit 계정 소유 |
| **Sanity 프로젝트** | moonsongit 계정 소유 |
| **도메인** | `paxchristikorea.org` (가비아/Inames) |
| **카카오 개발자** | moonsongit 계정 앱 |
| **토스페이먼츠** | moonsongit 계정 (테스트키) |
| **Resend** | moonsongit 계정 |
| **Upstash Redis** | moonsongit 계정 |
| **Anthropic** | moonsongit 계정 |

### 1-2. 목표 상태 (운영)

| 항목 | 목표 값 |
|------|---------|
| **운영 관리 계정** | `ajornamento@gmail.com` |
| **도메인** | 신규 도메인 또는 기존 `paxchristikorea.org` 이전 |
| **모든 외부 서비스** | ajornamento 계정 소유 또는 공동 관리 |
| **결제** | 실제키(라이브키)로 전환 |
| **DB** | 운영용 데이터로 초기화 |

---

## 2. 이관 대상 서비스 목록

### 2-1. 인프라 서비스 (필수)

| # | 서비스 | 용도 | 이관 방식 | 난이도 |
|---|--------|------|-----------|--------|
| 1 | **Vercel** | 호스팅/배포 | 팀 이관 또는 신규 프로젝트 | 중 |
| 2 | **GitHub** | 소스코드 | 리포 Transfer 또는 Fork | 중 |
| 3 | **Supabase** | DB + Storage | 신규 프로젝트 생성 + 데이터 마이그레이션 | 상 |
| 4 | **Sanity.io** | CMS | 프로젝트 멤버 추가 또는 신규 생성 | 중 |

### 2-2. 외부 API 서비스 (필수)

| # | 서비스 | 용도 | 이관 방식 | 난이도 |
|---|--------|------|-----------|--------|
| 5 | **토스페이먼츠** | 후원 결제 | 단체 사업자 명의 신규 가입 + 실제키 발급 | 상 |
| 6 | **카카오 개발자** | 소셜 로그인 | 신규 앱 등록 (ajornamento 계정) | 중 |
| 7 | **Resend** | 이메일 발송 | 신규 계정 + 도메인 인증 | 하 |
| 8 | **Anthropic** | 영수증 OCR | 신규 API 키 발급 | 하 |

### 2-3. 외부 API 서비스 (선택)

| # | 서비스 | 용도 | 이관 방식 | 난이도 |
|---|--------|------|-----------|--------|
| 9 | **Upstash Redis** | 속도 제한 | 신규 DB 생성 | 하 |
| 10 | **Google Search Console** | SEO | 신규 속성 등록 | 하 |
| 11 | **Google Analytics** | 트래픽 분석 | 신규 속성 등록 | 하 |

### 2-4. 도메인 관련

| # | 항목 | 현재 | 목표 | 난이도 |
|---|------|------|------|--------|
| 12 | **도메인 등록** | Inames (가비아 DNS) | ajornamento 명의 이전 또는 신규 등록 | 상 |
| 13 | **DNS 관리** | 가비아 | Vercel DNS 또는 가비아 유지 | 중 |
| 14 | **SSL 인증서** | 없음 (Clickn) | Vercel 자동 발급 | 자동 |

---

## 3. 이관 단계별 계획

### Phase 1: 사전 준비 (D-14)

#### 3-1. 운영 계정 서비스 가입

`ajornamento@gmail.com`으로 아래 서비스에 **미리 가입**합니다.

| 서비스 | 가입 URL | 비고 |
|--------|----------|------|
| Vercel | vercel.com | GitHub 연동 필요 |
| GitHub | github.com | 조직(Organization) 생성 권장 |
| Supabase | supabase.com | Google 로그인 가능 |
| Sanity.io | sanity.io | Google 로그인 가능 |
| 토스페이먼츠 | developers.tosspayments.com | **사업자등록번호 필요** (591-80-01356) |
| 카카오 개발자 | developers.kakao.com | 카카오 계정 필요 |
| Resend | resend.com | 이메일 인증 |
| Anthropic | console.anthropic.com | 결제 카드 등록 필요 |
| Upstash | upstash.com | 선택 |

#### 3-2. 도메인 준비

**옵션 A: 기존 도메인 이전** (paxchristikorea.org)

```
1. Inames 계정 확보 (기존 관리자에게 요청)
2. 도메인 등록자(Registrant) 정보를 ajornamento로 변경
3. 가비아 DNS 관리 권한 이전
4. 또는 네임서버를 Vercel DNS로 변경
```

**옵션 B: 신규 도메인 등록**

```
1. 원하는 도메인 구매 (예: paxchristikorea.kr, paxchristi.kr 등)
2. ajornamento@gmail.com 명의로 등록
3. Vercel에 도메인 연결
```

#### 3-3. GitHub 리포지토리 이관

**방법 1: Repository Transfer (권장)**

```bash
# MoonSongIT 계정에서:
# Settings → Danger Zone → Transfer ownership
# → ajornamento의 GitHub 계정 또는 조직으로 이전
```

**방법 2: Fork + 새 리포 생성**

```bash
# ajornamento 계정에서:
git clone https://github.com/MoonSongIT/pck-homepage.git
cd pck-homepage
git remote set-url origin https://github.com/<new-org>/pck-homepage.git
git push -u origin main
git push -u origin develop
```

---

### Phase 2: 서비스 생성 및 설정 (D-7)

#### 3-4. Supabase 신규 프로젝트

```
1. ajornamento 계정으로 supabase.com 로그인
2. New Project 생성
   - 이름: pck-homepage-prod
   - Region: Northeast Asia (ap-northeast-1)
   - DB 비밀번호 설정 (안전하게 보관)
3. Connection string 복사 → 새 DATABASE_URL
4. Settings > API → SUPABASE_URL, SUPABASE_SERVICE_KEY 복사
5. Storage 버킷 생성:
   - receipts (비공개)
   - reports (공개)
```

**데이터 마이그레이션:**

```bash
# 스키마 적용 (새 DB에)
DATABASE_URL="새_연결문자열" npx prisma migrate deploy

# 필요 시 기존 데이터 내보내기/가져오기
# 개발 DB에서 운영에 필요한 데이터만 선별 이관
```

#### 3-5. Sanity.io 프로젝트

**방법 1: 멤버 추가 (기존 프로젝트 유지)**

```
1. manage.sanity.io → 기존 프로젝트 → Members
2. ajornamento@gmail.com을 Administrator로 초대
3. 소유권 이전: Settings → Transfer ownership
```

**방법 2: 신규 프로젝트 생성**

```
1. ajornamento 계정으로 새 프로젝트 생성
2. 기존 스키마는 코드에 포함되어 있으므로 자동 적용
3. 콘텐츠 마이그레이션: sanity dataset export / import
   npx sanity dataset export production ./backup.tar.gz
   # 새 프로젝트에서:
   npx sanity dataset import ./backup.tar.gz production
4. 새 NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_API_TOKEN 발급
```

#### 3-6. 토스페이먼츠 (실제키 발급)

```
⚠️ 실제 결제를 위해 반드시 사업자 명의로 가입해야 함

1. ajornamento 계정으로 developers.tosspayments.com 가입
2. 사업자 정보 등록:
   - 사업자등록번호: 591-80-01356
   - 단체명: 팍스크리스티코리아
   - 정산 계좌 등록
3. 심사 완료 후 실제(라이브)키 발급:
   - NEXT_PUBLIC_TOSS_CLIENT_KEY = live_ck_...
   - TOSS_SECRET_KEY = live_sk_...
4. 허용 도메인에 운영 도메인 추가
```

#### 3-7. 카카오 개발자

```
1. ajornamento 카카오 계정으로 developers.kakao.com 로그인
2. 내 애플리케이션 → 애플리케이션 추가
   - 앱 이름: 팍스크리스티코리아
3. 앱 키:
   - REST API 키 → AUTH_KAKAO_ID
4. 보안:
   - Client Secret 발급 → AUTH_KAKAO_SECRET
5. 카카오 로그인:
   - 활성화: ON
   - Redirect URI: https://<운영도메인>/api/auth/callback/kakao
6. 동의 항목:
   - 이메일: 필수
   - 프로필 정보(닉네임): 필수
7. 비즈 앱 전환 (선택, 더 많은 사용자 지원)
```

#### 3-8. Resend (이메일)

```
1. ajornamento 계정으로 resend.com 가입
2. API Keys → Create API Key → RESEND_API_KEY
3. Domains → 운영 도메인 추가
   - DNS에 MX/TXT 레코드 추가 (Resend 안내에 따라)
   - 발신 주소: noreply@<운영도메인>
```

#### 3-9. 기타 서비스

| 서비스 | 작업 |
|--------|------|
| **Anthropic** | ajornamento 계정 가입 → API Key 발급 → ANTHROPIC_API_KEY |
| **Upstash** | ajornamento 계정 가입 → Redis DB 생성 (ap-northeast-1) → URL/TOKEN 복사 |

---

### Phase 3: Vercel 배포 및 도메인 연결 (D-Day)

#### 3-10. Vercel 프로젝트 생성

```
1. ajornamento 계정으로 vercel.com 로그인
2. Add New → Project → GitHub 리포 연결
3. Framework: Next.js (자동 감지)
4. 환경변수 입력 (Phase 2에서 수집한 모든 키)
5. Deploy
```

#### 3-11. 환경변수 전체 교체

```env
# === 인증 ===
NEXTAUTH_SECRET=<새로 생성: openssl rand -base64 32>
NEXTAUTH_URL=https://<운영도메인>

# === DB ===
DATABASE_URL=<새 Supabase 연결 문자열>

# === Sanity CMS ===
NEXT_PUBLIC_SANITY_PROJECT_ID=<새 프로젝트 ID>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<새 토큰>

# === 결제 (실제키!) ===
NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_<새키>
TOSS_SECRET_KEY=live_sk_<새키>

# === 이메일 ===
RESEND_API_KEY=re_<새키>

# === 카카오 ===
AUTH_KAKAO_ID=<새 REST API 키>
AUTH_KAKAO_SECRET=<새 Client Secret>

# === Supabase Storage ===
SUPABASE_URL=https://<새프로젝트>.supabase.co
SUPABASE_SERVICE_KEY=<새 service_role key>

# === OCR ===
ANTHROPIC_API_KEY=sk-ant-<새키>

# === Rate Limiting (선택) ===
UPSTASH_REDIS_REST_URL=<새 URL>
UPSTASH_REDIS_REST_TOKEN=<새 토큰>
```

#### 3-12. 도메인 연결

```
1. Vercel 대시보드 → Settings → Domains
2. 운영 도메인 추가 (예: paxchristikorea.org)
3. www 서브도메인도 추가 (www → non-www 리다이렉트)
4. DNS 설정:
   - A 레코드: @ → 76.76.21.21
   - CNAME: www → cname.vercel-dns.com
5. SSL 자동 발급 대기 (수 분)
```

#### 3-13. DB 초기화 및 관리자 설정

```bash
# 스키마 적용
DATABASE_URL="새_URL" npx prisma migrate deploy

# 관리자 계정 생성
# 1. 운영 사이트에서 ajornamento@gmail.com으로 회원가입
# 2. Prisma Studio에서 해당 사용자 role을 ADMIN으로 변경
DATABASE_URL="새_URL" npx prisma studio
```

---

### Phase 4: 외부 서비스 콜백 URL 변경 (D-Day)

| 서비스 | 설정 위치 | 변경 내용 |
|--------|-----------|-----------|
| **카카오 로그인** | developers.kakao.com → 앱 → 카카오 로그인 | Redirect URI: `https://<운영도메인>/api/auth/callback/kakao` |
| **토스페이먼츠** | developers.tosspayments.com → 개발 정보 | 허용 도메인: `<운영도메인>` |
| **Sanity CORS** | manage.sanity.io → API → CORS origins | `https://<운영도메인>` 추가 |
| **Supabase Auth** | supabase.com → Authentication → URL Configuration | Site URL: `https://<운영도메인>` |

---

### Phase 5: 검증 및 안정화 (D+1 ~ D+7)

```
D+0  배포 완료, 기본 접속 테스트
D+1  전체 기능 스모크 테스트 (check_operation.md 참조)
D+2  SEO 설정 (Google Search Console, sitemap 제출)
D+3  모니터링 시작 (Vercel Logs, Supabase Dashboard)
D+7  안정화 확인 → 개발 환경 서비스 정리
```

---

## 4. 도메인 등록 정보 변경 절차

### 4-1. 기존 도메인(paxchristikorea.org) 등록자 변경

```
현재 등록업체: Inames Co., Ltd.
현재 DNS 관리: 가비아 (gabia.com)

등록자(Registrant) 변경 절차:
1. Inames 계정 로그인 (기존 관리자에게 접근 권한 확보)
2. 도메인 관리 → paxchristikorea.org 선택
3. 등록자 정보 변경:
   - 등록자명: 팍스크리스티코리아 (또는 담당자명)
   - 이메일: ajornamento@gmail.com
   - 연락처: 운영 담당자 전화번호
4. 관리 담당자(Admin Contact) 정보도 동일하게 변경
5. WHOIS 정보 업데이트 확인

⚠️ .org 도메인은 ICANN 정책에 따라 등록자 변경 시
   60일간 이전 잠금(Transfer Lock)이 걸릴 수 있음
```

### 4-2. 도메인 이전(Transfer) — 등록업체 변경 시

```
현재: Inames → 이전 대상: 가비아 직접 관리 또는 Vercel Domains

절차:
1. Inames에서 Auth Code (인증 코드) 발급 요청
2. 도메인 Transfer Lock 해제
3. 새 등록업체에서 도메인 이전 신청 + Auth Code 입력
4. 기존 등록자 이메일로 승인 메일 확인 → 승인
5. 이전 완료 (보통 5~7일 소요)
6. 새 등록업체에서 네임서버 설정

⚠️ 도메인 만료 30일 이내에는 이전 불가
⚠️ 이전 중 DNS 서비스는 유지됨 (다운타임 없음)
```

### 4-3. 네임서버 변경 옵션

| 옵션 | 네임서버 | 장점 | 단점 |
|------|----------|------|------|
| **A. 가비아 유지** | ns.gabia.co.kr | 변경 최소화, MX 레코드 유지 용이 | 가비아 계정 관리 필요 |
| **B. Vercel DNS** | ns1.vercel-dns.com | Vercel 통합 관리, 빠른 전파 | 이메일 등 기존 레코드 재설정 필요 |
| **C. Cloudflare** | *.ns.cloudflare.com | 무료 CDN, DDoS 보호, 관리 편리 | 추가 서비스 가입 필요 |

---

## 5. 계정 권한 이관 매트릭스

| 서비스 | 개발자(moonsongit) | 운영자(ajornamento) | 이관 후 개발자 권한 |
|--------|:-------------------:|:-------------------:|:-------------------:|
| GitHub | Owner → Member | Member → Owner | Collaborator (유지) |
| Vercel | Owner → 해제 | Owner | Viewer (선택) |
| Supabase | Owner | Owner (새 프로젝트) | 접근 불필요 |
| Sanity | Admin | Owner | Editor (선택) |
| 토스페이먼츠 | - | Owner (새 계정) | 접근 불필요 |
| 카카오 개발자 | - | Owner (새 앱) | 접근 불필요 |
| 도메인 (Inames) | - | 등록자 | 접근 불필요 |
| 도메인 (가비아 DNS) | - | 관리자 | 접근 불필요 |

---

## 6. 비용 정리

| 항목 | 비용 | 주기 | 비고 |
|------|------|------|------|
| **도메인 (.org)** | ~$10-15/년 | 연간 | Inames/가비아 기준 |
| **Vercel** | 무료 (Hobby) | - | Pro 필요 시 $20/월 |
| **Supabase** | 무료 (Free tier) | - | Pro 필요 시 $25/월 |
| **Sanity** | 무료 (Free tier) | - | Growth 필요 시 $15/월 |
| **Resend** | 무료 (100통/일) | - | Pro 필요 시 $20/월 |
| **Upstash** | 무료 (Free tier) | - | - |
| **Anthropic API** | 사용량 기반 | - | 영수증 OCR용, 소액 |
| **토스페이먼츠** | 결제 수수료 | 건당 | PG 수수료 (약 2.5~3.5%) |

---

## 7. 전체 타임라인

```
[D-14]  Phase 1: 사전 준비
          ├─ ajornamento 계정으로 각 서비스 가입
          ├─ 도메인 이전 준비 (관리자 연락, Auth Code 확보)
          └─ GitHub 리포 이관 방식 결정
              │
[D-7]   Phase 2: 서비스 생성
          ├─ Supabase 신규 프로젝트 + 스키마 적용
          ├─ Sanity 프로젝트 이관/생성 + 콘텐츠 마이그레이션
          ├─ 토스페이먼츠 사업자 심사 신청
          ├─ 카카오/Resend/Anthropic/Upstash 설정
          └─ 환경변수 시트 완성
              │
[D-Day]  Phase 3-4: 배포 및 전환
          ├─ Vercel 프로젝트 생성 + 환경변수 입력
          ├─ DB 마이그레이션 + 관리자 시드
          ├─ 도메인 DNS 전환
          ├─ 외부 서비스 콜백 URL 변경
          └─ SSL 인증서 발급 확인
              │
[D+1~7]  Phase 5: 검증 및 안정화
          ├─ 스모크 테스트 (check_operation.md)
          ├─ SEO 설정 (Search Console, sitemap)
          ├─ 모니터링 안정화
          └─ 개발 환경 서비스 정리/해지
              │
         ✅ 운영 이관 완료
```

---

## 8. 위험 요소 및 대응

| 위험 | 영향 | 대응 |
|------|------|------|
| 토스페이먼츠 사업자 심사 지연 | 결제 기능 사용 불가 | D-14에 심사 신청, 심사 완료 전까지 테스트키 운영 |
| 도메인 등록자 변경 실패 | 도메인 관리 불가 | 단체 증빙서류로 Inames/가비아 고객센터 통해 해결 |
| Supabase 데이터 마이그레이션 실패 | 기존 데이터 손실 | 이관 전 전체 백업, 단계별 검증 |
| DNS 전파 지연 | 일시적 접속 불가 (최대 48시간) | TTL 300초, 심야 시간 작업, 전파 전 기존 사이트 유지 |
| Sanity 콘텐츠 누락 | CMS 콘텐츠 손실 | dataset export/import로 전체 백업 후 이관 |
| 카카오 로그인 Redirect URI 불일치 | 카카오 로그인 실패 | 전환 즉시 Redirect URI 변경, 이전 URI도 당분간 유지 |

---

## 부록: 개발자(moonsongit) 인수인계 체크리스트

이관 완료 후 개발자가 확인해야 할 사항:

- [ ] 운영 환경에서 모든 기능 정상 동작 확인
- [ ] 운영자(ajornamento)에게 관리자 매뉴얼 전달
- [ ] Sanity Studio 사용법 교육
- [ ] 긴급 연락처 공유 (장애 발생 시)
- [ ] 개발 환경 서비스 유지/해지 결정
  - 개발/테스트 목적으로 유지할 서비스 선별
  - 불필요한 서비스 해지 (비용 절감)
- [ ] `.env` 파일 내 개발 키와 운영 키가 혼용되지 않도록 정리
