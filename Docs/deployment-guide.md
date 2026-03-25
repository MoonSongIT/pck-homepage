# PCK 웹사이트 — Vercel 배포 및 외부 서비스 설정 가이드

> 최종 수정: 2026-03-25
> 대상: Phase 4-5 프로덕션 배포 담당자

---

## 목차

1. [배포 전 체크리스트](#1-배포-전-체크리스트)
2. [외부 서비스 계정 생성](#2-외부-서비스-계정-생성)
3. [환경변수 전체 목록](#3-환경변수-전체-목록)
4. [Vercel 프로젝트 설정](#4-vercel-프로젝트-설정)
5. [커스텀 도메인 연결](#5-커스텀-도메인-연결)
6. [DB 마이그레이션](#6-db-마이그레이션)
7. [프로덕션 스모크 테스트](#7-프로덕션-스모크-테스트)
8. [배포 후 운영 관리](#8-배포-후-운영-관리)

---

## 1. 배포 전 체크리스트

### 코드 검증 (완료)

| 단계 | 명령어 | 결과 |
|------|--------|------|
| ① ESLint | `npm run lint` | ✅ 0 errors |
| ② TypeScript | `npx tsc --noEmit` | ✅ 통과 |
| ③ Vitest | `npx vitest run` | ✅ 89 tests passed |
| ④ Build | `npm run build` | ✅ 성공 |
| ⑤ PR | PR #13 (develop → main) | ✅ 생성 완료 |

### 외부 서비스 준비 상태

| 서비스 | 용도 | 상태 | 우선순위 |
|--------|------|------|----------|
| Supabase | DB + Storage | ✅ 완료 | 필수 |
| Sanity.io | CMS 콘텐츠 관리 | ⏳ 프로젝트 생성 필요 | 필수 |
| 토스페이먼츠 | 후원 결제 | ✅ 테스트키 확보 (실제키 교체 필요) | 필수 |
| Anthropic | 영수증 OCR | ✅ 완료 | 필수 |
| Resend | 이메일 발송 | ⏳ 계정 확인 필요 | 필수 |
| 카카오 개발자 | 소셜 로그인 | ⏳ 앱 등록 필요 | 선택 |
| Upstash Redis | 속도 제한 | ⏳ 생성 필요 | 선택 |
| Vercel | 호스팅 | ⏳ 프로젝트 생성 필요 | 필수 |

---

## 2. 외부 서비스 계정 생성

### 2-1. Supabase (DB + Storage) — ✅ 완료

> 이미 설정 완료. 아래는 신규 생성 시 참고용.

1. [supabase.com](https://supabase.com) 가입/로그인
2. **New Project** → Region: `Northeast Asia (ap-northeast-1)` 선택
3. 프로젝트 생성 후 **Settings > Database**:
   - `Connection string (Prisma)` 복사 → `DATABASE_URL`
4. **Settings > API**:
   - `Project URL` 복사 → `SUPABASE_URL`
   - `service_role secret` 복사 → `SUPABASE_SERVICE_KEY`
5. **Storage** 탭 → 버킷 생성:
   - `receipts` (비공개) — 영수증 이미지
   - `reports` (공개) — PDF 결산 보고서

### 2-2. Sanity.io (CMS)

1. [sanity.io](https://sanity.io) 가입/로그인
2. **Create New Project** → 프로젝트명: `pck-homepage`
3. **manage.sanity.io** → 프로젝트 선택:
   - **Settings > General** → `Project ID` 복사 → `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - Dataset: `production` (기본값) → `NEXT_PUBLIC_SANITY_DATASET`
4. **Settings > API > Tokens** → **Add API token**:
   - 이름: `pck-website`
   - 권한: `Editor`
   - 토큰 복사 → `SANITY_API_TOKEN`

> Sanity Studio는 `/studio` 경로에서 접근 가능 (이미 구현됨)

### 2-3. 토스페이먼츠 (결제)

1. [developers.tosspayments.com](https://developers.tosspayments.com) 로그인
2. **개발 정보** 탭:
   - 테스트 → 실제로 전환
   - `클라이언트 키` 복사 → `NEXT_PUBLIC_TOSS_CLIENT_KEY`
   - `시크릿 키` 복사 → `TOSS_SECRET_KEY`

> ⚠️ **반드시 실제키로 교체** (테스트키는 실결제 불가)

### 2-4. Resend (이메일)

1. [resend.com](https://resend.com) 가입/로그인
2. **Settings > API Keys** → **Create API Key**:
   - 이름: `pck-homepage`
   - 키 복사 → `RESEND_API_KEY`
3. **Domains** → 커스텀 도메인 추가 (프로덕션용):
   - `paxchristikorea.org` 또는 서브도메인 등록
   - DNS에 MX/TXT 레코드 추가 (Resend 안내 참조)
   - 발신 주소: `noreply@paxchristikorea.org`

> 미설정 시 `noreply@resend.dev` 샌드박스 모드로 동작

### 2-5. 카카오 개발자 (소셜 로그인) — 선택

1. [developers.kakao.com](https://developers.kakao.com) 로그인
2. **내 애플리케이션** → **애플리케이션 추가**:
   - 앱 이름: `팍스크리스티코리아`
3. **앱 키** 탭:
   - `REST API 키` 복사 → `KAKAO_CLIENT_ID`
4. **보안** 탭:
   - `Client Secret` 발급 → `KAKAO_CLIENT_SECRET`
5. **카카오 로그인** 탭:
   - 활성화: ON
   - Redirect URI: `https://paxchristikorea.org/api/auth/callback/kakao`
6. **동의 항목**:
   - 이메일: 필수 동의
   - 프로필 정보(닉네임): 필수 동의

### 2-6. Upstash Redis (속도 제한) — 선택

1. [upstash.com](https://upstash.com) 가입/로그인
2. **Redis** → **Create Database**:
   - Region: `ap-northeast-1` (Tokyo)
   - 이름: `pck-rate-limit`
3. **REST API** 탭:
   - `UPSTASH_REDIS_REST_URL` 복사
   - `UPSTASH_REDIS_REST_TOKEN` 복사

> 미설정 시 속도 제한이 graceful skip되어 기능 자체는 정상 동작

### 2-7. Anthropic Claude (영수증 OCR) — ✅ 완료

1. [console.anthropic.com](https://console.anthropic.com) 로그인
2. **API keys** → **Create Key**:
   - 키 복사 → `ANTHROPIC_API_KEY`

---

## 3. 환경변수 전체 목록

### 필수 환경변수 (10개)

| # | 변수명 | 설명 | 획득처 | 보안 |
|---|--------|------|--------|------|
| 1 | `DATABASE_URL` | Supabase PostgreSQL 연결 문자열 | Supabase Settings > Database | 🔒 서버 전용 |
| 2 | `NEXTAUTH_SECRET` | JWT 서명 비밀키 (32자+) | `openssl rand -base64 32` | 🔒 서버 전용 |
| 3 | `NEXTAUTH_URL` | 사이트 기본 URL | 프로덕션 도메인 | 공개 가능 |
| 4 | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity 프로젝트 ID | Sanity manage 페이지 | 공개 가능 |
| 5 | `NEXT_PUBLIC_SANITY_DATASET` | Sanity 데이터셋 | 고정: `production` | 공개 가능 |
| 6 | `SANITY_API_TOKEN` | Sanity API 토큰 | Sanity Settings > Tokens | 🔒 서버 전용 |
| 7 | `NEXT_PUBLIC_TOSS_CLIENT_KEY` | 토스 클라이언트 키 | 토스 개발자 센터 | 공개 가능 |
| 8 | `TOSS_SECRET_KEY` | 토스 시크릿 키 | 토스 개발자 센터 | 🔒 서버 전용 |
| 9 | `RESEND_API_KEY` | Resend 이메일 API 키 | Resend 대시보드 | 🔒 서버 전용 |
| 10 | `ANTHROPIC_API_KEY` | Claude API 키 (OCR) | Anthropic Console | 🔒 서버 전용 |

### Supabase Storage (2개)

| # | 변수명 | 설명 | 획득처 | 보안 |
|---|--------|------|--------|------|
| 11 | `SUPABASE_URL` | Supabase 프로젝트 URL | Supabase Settings > API | 공개 가능 |
| 12 | `SUPABASE_SERVICE_KEY` | Supabase Service Role Key | Supabase Settings > API | 🔒 서버 전용 |

### 선택 환경변수 (4개)

| # | 변수명 | 설명 | 미설정 시 동작 |
|---|--------|------|----------------|
| 13 | `KAKAO_CLIENT_ID` | 카카오 로그인 클라이언트 ID | 카카오 로그인 비활성화 (이메일 로그인만 사용) |
| 14 | `KAKAO_CLIENT_SECRET` | 카카오 로그인 시크릿 | 카카오 로그인 비활성화 |
| 15 | `UPSTASH_REDIS_REST_URL` | Upstash Redis URL | 속도 제한 비활성화 (기능 정상 동작) |
| 16 | `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis 토큰 | 속도 제한 비활성화 |

### NEXTAUTH_SECRET 생성 명령어

```bash
# macOS / Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])

# Node.js (어디서든)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 4. Vercel 프로젝트 설정

### 4-1. 프로젝트 생성

1. [vercel.com](https://vercel.com) 로그인
2. **Add New** → **Project**
3. **Import Git Repository**:
   - GitHub 연결 → `MoonSongIT/pck-homepage` 선택
4. **Configure Project**:
   - Framework Preset: `Next.js` (자동 감지)
   - Root Directory: `.` (기본값)
   - Build Command: `npm run build` (기본값)
   - Output Directory: `.next` (기본값)
   - Install Command: `npm ci` (기본값)
5. **Environment Variables** 섹션에서 위 환경변수 입력
6. **Deploy** 클릭

### 4-2. 환경변수 입력

Vercel 대시보드 → 프로젝트 → **Settings** → **Environment Variables**

```
# ── 필수 (Production + Preview) ──
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=생성된_시크릿_키
NEXTAUTH_URL=https://paxchristikorea.org
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token
NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_...
TOSS_SECRET_KEY=live_sk_...
RESEND_API_KEY=re_...
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...

# ── 선택 ──
KAKAO_CLIENT_ID=your_kakao_id
KAKAO_CLIENT_SECRET=your_kakao_secret
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...
```

> ⚠️ **Environment**: `Production`, `Preview`, `Development` 체크박스 모두 선택
> ⚠️ `NEXT_PUBLIC_` 접두사가 없는 변수는 서버에서만 접근 가능 (보안)

### 4-3. Prisma 빌드 훅

Vercel은 빌드 시 자동으로 `npm run build`를 실행합니다.
`prisma generate`가 빌드 전에 실행되어야 하므로 `package.json`에 이미 설정되어 있습니다:

```json
// package.json의 postinstall 훅이 없다면 아래 추가:
"scripts": {
  "postinstall": "prisma generate"
}
```

### 4-4. 배포 설정 확인

| 설정 | 값 | 위치 |
|------|-----|------|
| Node.js 버전 | 22.x | Vercel Settings > General |
| Framework | Next.js (자동 감지) | 자동 |
| 빌드 명령 | `npm run build` | 기본값 |
| Git 연동 | `main` 브랜치 자동 배포 | Vercel Settings > Git |
| Preview | PR 생성 시 자동 Preview 배포 | 자동 |

---

## 5. 커스텀 도메인 연결

### 5-1. Vercel 도메인 추가

1. Vercel 대시보드 → 프로젝트 → **Settings** → **Domains**
2. **Add** 클릭 → `paxchristikorea.org` 입력
3. Vercel이 DNS 설정 안내를 표시

### 5-2. DNS 레코드 설정

도메인 레지스트라 (GoDaddy, Namecheap, 가비아 등)에서 설정:

#### A 레코드 (루트 도메인)

| 타입 | 호스트 | 값 | TTL |
|------|--------|-----|-----|
| A | `@` | `76.76.21.21` | 300 |

#### CNAME 레코드 (www 서브도메인)

| 타입 | 호스트 | 값 | TTL |
|------|--------|-----|-----|
| CNAME | `www` | `cname.vercel-dns.com` | 300 |

### 5-3. SSL 인증서

- Vercel이 **자동으로** Let's Encrypt SSL 인증서를 발급합니다
- DNS 전파 후 (최대 48시간, 보통 10분 내) 자동 활성화
- 확인: `https://paxchristikorea.org` 접속 → 🔒 자물쇠 아이콘

### 5-4. 도메인 전파 확인

```bash
# DNS 전파 확인
nslookup paxchristikorea.org
dig paxchristikorea.org A

# 또는 온라인 도구
# https://dnschecker.org/#A/paxchristikorea.org
```

---

## 6. DB 마이그레이션

### 6-1. 최초 배포 시 (Supabase에 스키마 적용)

```bash
# 로컬에서 실행 (DATABASE_URL이 프로덕션 DB를 가리키도록 설정)
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

> ⚠️ `migrate dev`가 아닌 **`migrate deploy`** 사용 (프로덕션에서는 dev 금지)

### 6-2. 관리자 계정 시드

```bash
# Prisma Studio로 첫 번째 관리자 계정의 role을 ADMIN으로 변경
DATABASE_URL="postgresql://..." npx prisma studio
```

1. Prisma Studio에서 `User` 테이블 열기
2. 회원가입으로 생성된 첫 번째 사용자의 `role`을 `ADMIN`으로 변경
3. 저장

---

## 7. 프로덕션 스모크 테스트

배포 완료 후 아래 항목을 수동으로 검증합니다.

### 7-1. 페이지 로드 테스트

| # | 페이지 | URL | 확인 항목 |
|---|--------|-----|-----------|
| 1 | 홈 | `/` | 히어로 슬라이드, 최신 뉴스, 후원 CTA |
| 2 | 소개 | `/about` | 연혁, 임원진, 조직 소개 |
| 3 | 뉴스 | `/news` | 목록 로드, 카테고리 필터, 페이지네이션 |
| 4 | 뉴스 상세 | `/news/[slug]` | Portable Text 렌더링, 관련 뉴스 |
| 5 | 교육 | `/education` | 커리큘럼, 신청 폼 |
| 6 | 네트워크 | `/network` | 세계지도 (PeaceMap), 국가 목록 |
| 7 | 후원 | `/donate` | 결제 폼, 금액 선택, 토스 연동 |
| 8 | 투명성 | `/transparency` | 연도별 결산, PDF 다운로드 |
| 9 | 커뮤니티 | `/community` | 게시판 (로그인 필요) |
| 10 | 영어 | `/en` | 다국어 전환 동작 |

### 7-2. 기능 테스트

| # | 기능 | 테스트 절차 | 예상 결과 |
|---|------|------------|-----------|
| 1 | 회원가입 | `/register` → 이름/이메일/비밀번호 입력 | 계정 생성, 로그인 페이지 리다이렉트 |
| 2 | 로그인 | `/login` → 이메일/비밀번호 입력 | 세션 생성, 홈으로 이동 |
| 3 | 후원 결제 | `/donate` → 금액 선택 → 토스 결제 | 결제 승인, 성공 페이지 |
| 4 | 게시글 작성 | `/community` → 글쓰기 → 제출 | 게시글 등록, 목록 표시 |
| 5 | 댓글 작성 | 게시글 상세 → 댓글 입력 | 댓글 등록, 실시간 갱신 |
| 6 | 뉴스레터 구독 | 푸터 → 이메일 입력 → 구독 | 구독 완료 메시지 |
| 7 | 관리자 접근 | `/admin` → ADMIN 계정 로그인 | 대시보드 접근 가능 |
| 8 | 비인가 접근 | `/admin` → 일반 계정 | 403 또는 리다이렉트 |

### 7-3. SEO 및 메타데이터 검증

| # | 항목 | 확인 방법 |
|---|------|-----------|
| 1 | sitemap.xml | `https://paxchristikorea.org/sitemap.xml` 접속 |
| 2 | robots.txt | `https://paxchristikorea.org/robots.txt` 접속 |
| 3 | OG 이미지 | [opengraph.xyz](https://www.opengraph.xyz) 에서 URL 입력 |
| 4 | 구조화 데이터 | [Google Rich Results Test](https://search.google.com/test/rich-results) |
| 5 | Lighthouse | Chrome DevTools > Lighthouse > 전체 카테고리 실행 |

**Lighthouse 목표 점수:**

| 카테고리 | 목표 |
|----------|------|
| Performance | 90+ |
| Accessibility | 95+ |
| Best Practices | 95+ |
| SEO | 100 |

### 7-4. 보안 검증

| # | 항목 | 확인 방법 |
|---|------|-----------|
| 1 | HTTPS 강제 | `http://` 접속 시 `https://`로 리다이렉트 |
| 2 | 보호 경로 | `/admin`, `/api/finance/*` 비인가 접근 차단 |
| 3 | 환경변수 노출 | 브라우저 소스에서 `TOSS_SECRET_KEY` 등 서버 변수 미노출 확인 |
| 4 | CORS | API 엔드포인트 외부 도메인 접근 차단 |

---

## 8. 배포 후 운영 관리

### 8-1. 배포 흐름 (자동)

```
feature/* 브랜치 → develop PR → CI 통과 → develop 머지
                                              ↓
                              develop → main PR → CI 통과 → main 머지
                                                                ↓
                                                    Vercel 자동 프로덕션 배포
```

- **Preview 배포**: PR 생성 시 자동 (고유 URL 발급)
- **프로덕션 배포**: `main` 브랜치 push 시 자동
- **롤백**: Vercel 대시보드 → Deployments → 이전 배포 "Promote to Production"

### 8-2. 모니터링

| 도구 | 용도 | URL |
|------|------|-----|
| Vercel Analytics | 페이지 성능, Core Web Vitals | Vercel 대시보드 > Analytics |
| Vercel Logs | 서버 함수 로그, 에러 추적 | Vercel 대시보드 > Logs |
| Supabase Dashboard | DB 상태, 쿼리 성능 | supabase.com > 프로젝트 |
| Sanity Studio | 콘텐츠 관리 | `https://paxchristikorea.org/studio` |

### 8-3. 정기 점검 사항

| 주기 | 작업 |
|------|------|
| 매주 | Vercel Logs에서 에러 확인 |
| 매월 | Lighthouse 점수 재측정 |
| 분기 | npm 패키지 업데이트 (`npm outdated`) |
| 분기 | Supabase DB 백업 확인 |
| 연간 | SSL 인증서 갱신 (Vercel 자동, 확인만) |
| 연간 | 토스페이먼츠 API 키 갱신 여부 확인 |

### 8-4. 긴급 롤백 절차

```bash
# 1. Vercel CLI로 즉시 롤백
npx vercel rollback

# 2. 또는 Vercel 대시보드에서:
#    Deployments → 정상 작동하던 배포 → ··· → Promote to Production

# 3. 코드 수정 필요 시:
git checkout -b hotfix/issue-description
# 수정 후
git push origin hotfix/issue-description
# main으로 직접 PR 생성 (hotfix 전략)
```

---

## 부록: 전체 배포 단계 요약 (순서대로)

```
1️⃣  외부 서비스 계정 생성 (Sanity, Resend 등)
          ↓
2️⃣  환경변수 수집 (16개)
          ↓
3️⃣  Vercel 프로젝트 생성 + GitHub 연동
          ↓
4️⃣  Vercel에 환경변수 입력
          ↓
5️⃣  PR #13 머지 (develop → main)
          ↓
6️⃣  Vercel 자동 배포 시작
          ↓
7️⃣  DB 마이그레이션 (prisma migrate deploy)
          ↓
8️⃣  관리자 계정 시드 (role: ADMIN)
          ↓
9️⃣  커스텀 도메인 연결 + DNS 설정
          ↓
🔟  SSL 확인 + 스모크 테스트
          ↓
✅  프로덕션 라이브!
```
