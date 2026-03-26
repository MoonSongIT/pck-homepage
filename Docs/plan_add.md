# 추가 기능 구현 계획

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
