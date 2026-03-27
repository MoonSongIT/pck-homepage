# 추가 기능 구현 계획

---

## Feature 5: 역할별 Admin/Studio 버튼 표시

### 개요

로그인 사용자의 역할(ADMIN/EDITOR)에 따라 Header에 Admin, Studio 버튼을 조건부 표시.
데스크탑에서는 해당 페이지로 이동, 모바일에서는 "데스크탑에서 작업해 주세요" 토스트 메시지 표시.

### 역할별 동작

| 역할 | Admin 버튼 | Studio 버튼 | 비고 |
|------|-----------|------------|------|
| ADMIN | ✅ `/admin` 이동 | ✅ `/studio` 이동 | 모든 관리 기능 |
| EDITOR | ❌ 미표시 | ✅ `/studio` 이동 | CMS 편집만 가능 |
| MEMBER | ❌ 미표시 | ❌ 미표시 | 일반 사용자 |

### 모바일 동작

- Admin 버튼: `/admin`으로 정상 이동 (모바일에서도 허용)
- Studio 버튼: 이동하지 않고 토스트 메시지 표시 (Sanity Studio는 데스크탑 전용)
- 메시지: "관리 기능은 데스크탑에서 이용해 주세요" (Sonner toast)

### 구현 방식

1. `session.user.role` 값으로 ADMIN/EDITOR 판별
2. Header (데스크탑): 로그인 버튼 왼쪽에 역할별 버튼 배치
3. MobileNav: 로그인 상태 섹션에 역할별 버튼 표시 + toast 메시지
4. 미들웨어: `/studio` 접근 권한을 ADMIN + EDITOR로 확장

### 변경 파일

| 파일 | 작업 |
|------|------|
| `src/components/organisms/Header.tsx` | 수정 — 역할별 Admin/Studio 버튼 추가 |
| `src/components/organisms/MobileNav.tsx` | 수정 — 역할별 버튼 + 모바일 토스트 메시지 |
| `src/lib/auth.config.ts` | 수정 — `/studio` EDITOR 접근 허용 |
| `src/i18n/messages/ko.json` | 수정 — 관리 버튼/토스트 번역 키 추가 |
| `src/i18n/messages/en.json` | 수정 — 관리 버튼/토스트 번역 키 추가 |

---

## Feature 4: Sanity CMS 내장형 Studio 연동

### 개요

Sanity Studio를 Next.js 앱 내부에 `/studio` 라우트로 내장(embedded)하여,
하나의 프로젝트에서 웹사이트 + CMS 관리 화면을 함께 관리하는 방식.
스키마 4개(post, education, teamMember, timeline)를 정의하고,
기존 Mock 데이터를 Sanity 실데이터로 교체하는 작업.

### Step 1: 외부 설정 (수동, 웹에서 진행)

1. [sanity.io/manage](https://www.sanity.io/manage) → 새 프로젝트 생성 (`pax-christi-korea`)
2. **Project ID** 확보 (대시보드 상단에 표시)
3. **API 토큰 생성**: Settings → API → Tokens → "Editor" 권한 → `SANITY_API_TOKEN` 확보
4. **CORS Origins 설정**: `http://localhost:3000` + 프로덕션 도메인 추가 (Allow credentials ✅)

### Step 2: 환경변수 업데이트

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=<발급받은 PROJECT_ID>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<발급받은 토큰>
```

### Step 3: 패키지 설치

```bash
npm install sanity @sanity/vision --legacy-peer-deps
```

### Step 4: Sanity 스키마 4개 작성

| 스키마 | 파일 | 용도 | 주요 필드 |
|--------|------|------|-----------|
| `post` | `src/sanity/schemaTypes/post.ts` | 뉴스/활동 | title, slug, category, excerpt, body(Portable Text), mainImage, publishedAt |
| `education` | `src/sanity/schemaTypes/education.ts` | 평화학교 | title, slug, description, body, startDate, endDate, isRecruiting, curriculum[] |
| `teamMember` | `src/sanity/schemaTypes/teamMember.ts` | 임원진 | name, role, bio, photo, order |
| `timeline` | `src/sanity/schemaTypes/timeline.ts` | 연혁 | year, title, description |
| (index) | `src/sanity/schemaTypes/index.ts` | 스키마 묶기 | schemaTypes[] export |

- 기존 `src/types/sanity.ts` 타입과 `src/lib/sanity/queries.ts` GROQ 쿼리에 정확히 매칭되도록 필드 정의

### Step 5: Sanity Studio 설정 파일 생성

| 파일 | 위치 | 내용 |
|------|------|------|
| `sanity.config.ts` | 프로젝트 루트 | defineConfig — projectId, dataset, plugins(structureTool, visionTool), schema |
| `src/sanity/env.ts` | src/sanity/ | 환경변수 헬퍼 (projectId, dataset, apiVersion) |

### Step 6: Studio 라우트 생성 (`/studio`)

| 파일 | 내용 |
|------|------|
| `src/app/studio/[[...tool]]/page.tsx` | `'use client'` + `NextStudio` 컴포넌트로 Sanity Studio 렌더링 |

- `next-sanity/studio`의 `NextStudio` 사용
- catch-all 라우트 `[[...tool]]`로 Studio 내부 네비게이션 지원

### Step 7: Next.js 설정 업데이트

| 파일 | 작업 |
|------|------|
| `next.config.ts` | `images.remotePatterns`에 `cdn.sanity.io` 도메인 추가 |

### Step 8: 샘플 데이터 입력

- `localhost:3000/studio` 접속하여 각 스키마별 테스트 데이터 입력
- post 2~3건, teamMember 3~5명, timeline 5~10건, education 1~2건

### Step 9: 실데이터 연동 (Mock → Sanity 교체)

| 페이지 | 파일 | Mock 교체 대상 | Sanity 쿼리 |
|--------|------|---------------|-------------|
| 홈 최신뉴스 | `LatestNews.tsx` | `MOCK_NEWS` | `LATEST_POSTS_QUERY` |
| 연혁 | `about/history/page.tsx` | 하드코딩 데이터 | `TIMELINE_QUERY` |
| 임원진 | `about/team/page.tsx` | 하드코딩 데이터 | `TEAM_MEMBERS_QUERY` |
| 뉴스 목록 | `news/page.tsx` | 신규 구현 | `POSTS_PAGINATED_QUERY` + `POSTS_COUNT_QUERY` |
| 뉴스 상세 | `news/[slug]/page.tsx` | 신규 구현 | `POST_QUERY` + Portable Text 렌더링 |
| 평화학교 목록 | `education/page.tsx` | Mock/미구현 | `EDUCATIONS_QUERY` |
| 평화학교 상세 | `education/[slug]/page.tsx` | Mock/미구현 | `EDUCATION_QUERY` |

### 변경/생성 파일 목록 (전체)

| 파일 | 작업 |
|------|------|
| `package.json` | `sanity`, `@sanity/vision` 의존성 추가 |
| `.env.local` | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_API_TOKEN` 값 설정 |
| `sanity.config.ts` | 신규 — Sanity Studio 설정 |
| `src/sanity/env.ts` | 신규 — 환경변수 헬퍼 |
| `src/sanity/schemaTypes/index.ts` | 신규 — 스키마 export |
| `src/sanity/schemaTypes/post.ts` | 신규 — 뉴스/활동 스키마 |
| `src/sanity/schemaTypes/education.ts` | 신규 — 평화학교 스키마 |
| `src/sanity/schemaTypes/teamMember.ts` | 신규 — 임원진 스키마 |
| `src/sanity/schemaTypes/timeline.ts` | 신규 — 연혁 스키마 |
| `src/app/studio/[[...tool]]/page.tsx` | 신규 — Studio 라우트 |
| `next.config.ts` | 수정 — `cdn.sanity.io` 이미지 도메인 추가 |
| `src/components/organisms/LatestNews.tsx` | 수정 — Mock → Sanity 연동 |
| `src/app/[locale]/(main)/about/history/page.tsx` | 수정 — 연혁 Sanity 연동 |
| `src/app/[locale]/(main)/about/team/page.tsx` | 수정 — 임원진 Sanity 연동 |
| `src/app/[locale]/(main)/news/page.tsx` | 수정/신규 — 뉴스 목록 Sanity 연동 |
| `src/app/[locale]/(main)/news/[slug]/page.tsx` | 수정/신규 — 뉴스 상세 Sanity 연동 |
| `src/app/[locale]/(main)/education/page.tsx` | 수정/신규 — 평화학교 목록 Sanity 연동 |
| `src/app/[locale]/(main)/education/[slug]/page.tsx` | 수정/신규 — 평화학교 상세 Sanity 연동 |

---

## Feature 3: 영수증 이미지 팝업 미리보기

### 개요

제경비 관리 테이블(`ExpenseTable`)에서 영수증 아이콘(ExternalLink) 클릭 시
새 탭으로 이동하는 대신, Dialog 팝업으로 영수증 이미지를 바로 보여주는 기능.

### 현재 동작

- `ExpenseTable.tsx` 206~218행: `<a href={receipt} target="_blank">` → 새 탭에서 이미지 열림

### 구현 방식

- shadcn/ui `Dialog` 컴포넌트를 활용한 이미지 팝업
- 영수증 아이콘 클릭 → state에 선택된 영수증 URL 저장 → Dialog open
- Dialog 내부에 `<img>` 태그로 이미지 표시 (object-contain, max-h 제한)
- 닫기: 오버레이 클릭 / X 버튼 / ESC 키

### 변경 파일

| 파일 | 작업 |
|------|------|
| `src/components/organisms/ExpenseTable.tsx` | 수정 — `<a>` 태그를 `<button>` + Dialog로 교체, 영수증 미리보기 state 추가 |

### 기술 상세

- `useState<string | null>` 로 선택된 영수증 URL 관리
- `Dialog` + `DialogContent`로 모달 팝업
- 이미지: `object-contain`, `max-h-[80vh]`, `rounded-lg`
- ExternalLink 아이콘을 Eye(보기) 아이콘으로 변경 고려
- 기존 `<a>` 태그 제거 → `<button onClick>` 으로 교체

---

## Feature 2: 모바일 영수증 사진 촬영 기능

### 개요

지출 등록 페이지(`/admin/finance/expenses/new`)의 영수증 스캔 탭에서
모바일 기기 사용 시 '사진 촬영' 버튼을 표시하여 카메라로 바로 영수증을 찍고 OCR 분석하는 기능.

### 구현 방식

- HTML `<input type="file" capture="environment">` 속성 활용
- `capture="environment"` → 후면 카메라 바로 실행
- 모바일에서만 표시: Tailwind `sm:hidden` 클래스 적용
- 촬영된 이미지는 기존 `processFile()` 파이프라인으로 동일하게 OCR 처리

### 변경 파일

| 파일 | 작업 |
|------|------|
| `src/components/organisms/ReceiptUploader.tsx` | 수정 — Camera 아이콘 import, cameraRef 추가, 사진촬영 버튼 + hidden input(capture) 추가 |

### 기술 상세

- `lucide-react`의 `Camera` 아이콘 사용
- `cameraRef`로 별도의 `<input capture="environment">` 참조
- 파일 선택과 동일한 `handleChange` 핸들러 재사용
- 데스크탑(`sm:` 이상)에서는 버튼 숨김 처리

---

## Feature 1: 오시는 길 탭 추가

# 오시는 길 탭 추가 — 구현 계획

## 개요

단체소개(/about) 페이지에 '오시는 길' 탭을 '임원진' 옆에 추가.
Kakao Maps JavaScript SDK를 사용하여 사무실 위치를 지도에 표시.

## 주소 정보

- **출처**: `src/lib/constants/navigation.ts` → `CONTACT_INFO.address`
- **주소**: 서울 마포구 토정로2길 33 (국제카톨릭형제회한국본부) 210호

## 지도 컴포넌트 선택: Kakao Maps JavaScript SDK

- **방식**: Kakao Maps JavaScript SDK 직접 사용 (Next.js Script 태그 로드)
- **타입 정의**: `src/types/kakao-maps.d.ts` 커스텀 선언
- **선택 이유**:
  - 한국 주소/POI 데이터 최고 수준
  - 한국 사용자에게 가장 익숙한 UI
  - Geocoder(주소→좌표 변환) 내장
  - 무료 사용량 충분 (일 30만 호출)

## 구현 완료 내역

### Step 1: 환경변수 설정
- `.env.local`에 `NEXT_PUBLIC_KAKAO_MAP_KEY` 추가
- Kakao Developers에서 JavaScript 키 발급 및 도메인 등록

### Step 2: Kakao Map 클라이언트 컴포넌트 생성
- `src/app/[locale]/(main)/about/location/kakao-map.tsx`
- Next.js `Script` 태그로 SDK 로드 (`autoload=false` + `libraries=services`)
- `Geocoder.addressSearch()`로 주소 → 좌표 변환
- 마커 + 인포윈도우(팍스크리스티코리아) 표시
- 다크모드 대응: 인포윈도우에 명시적 `color/background` 지정

### Step 3: 오시는 길 페이지 생성
- `src/app/[locale]/(main)/about/location/page.tsx`
- 카카오 지도 + 연락처 카드 + 대중교통 안내 카드 (2열 그리드)

### Step 4: 탭 네비게이션 추가
- `layout.tsx`의 `navItems`에 `navLocation` 항목 추가 (임원진 다음)

### Step 5: 번역 키 추가
- `ko.json`: 10개 키 (navLocation, locationTitle 등)
- `en.json`: 10개 키 (Directions, Contact Information 등)

### Step 6: 상수 파일 업데이트
- `about.ts`의 `ABOUT_NAV`에 오시는 길 항목 추가

## 최종 변경 파일 목록

| 파일 | 작업 |
|------|------|
| `package.json` | react-kakao-maps-sdk 의존성 추가 |
| `src/app/[locale]/(main)/about/location/page.tsx` | 신규 — 오시는 길 페이지 |
| `src/app/[locale]/(main)/about/location/kakao-map.tsx` | 신규 — 지도 클라이언트 컴포넌트 |
| `src/types/kakao-maps.d.ts` | 신규 — Kakao Maps SDK 타입 정의 |
| `src/app/[locale]/(main)/about/layout.tsx` | 수정 — navItems에 탭 추가 |
| `src/i18n/messages/ko.json` | 수정 — 번역 키 10개 추가 |
| `src/i18n/messages/en.json` | 수정 — 번역 키 10개 추가 |
| `src/lib/constants/about.ts` | 수정 — ABOUT_NAV 업데이트 |
| `.env.local` | 수정 — NEXT_PUBLIC_KAKAO_MAP_KEY 추가 |
