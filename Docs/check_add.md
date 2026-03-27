# 추가 기능 체크리스트

---

## Feature 5: 역할별 Admin/Studio 버튼 표시

### 구현 체크

- [x] Header — ADMIN: Admin + Studio 버튼 표시
- [x] Header — EDITOR: Studio 버튼만 표시
- [x] Header — MEMBER: 버튼 미표시
- [x] MobileNav — ADMIN/EDITOR: 버튼 표시 + 토스트 메시지
- [x] 미들웨어 — `/studio` EDITOR 접근 허용
- [x] 번역 키 추가 (ko.json, en.json)

### 기능 체크

- [x] 데스크탑: Admin 버튼 클릭 → `/admin` 이동
- [x] 데스크탑: Studio 버튼 클릭 → `/studio` 이동
- [x] 모바일: Admin 버튼 클릭 → `/admin` 이동 (허용)
- [x] 모바일: Studio 버튼 클릭 → 토스트 메시지 "데스크탑에서 이용해 주세요" 표시
- [x] EDITOR 사용자 `/studio` 접근 허용
- [x] EDITOR 사용자 `/admin` 접근 차단
- [x] MEMBER 사용자 Admin/Studio 버튼 미표시

### 빌드 체크

- [x] TypeScript 타입 오류 없음
- [x] 프로덕션 빌드 성공

---

## Feature 4: Sanity CMS 내장형 Studio 연동

### Step 1: 외부 설정 (수동)

- [x] sanity.io/manage에서 프로젝트 생성 (`PCKHomePage`, ID: `zochskv5`)
- [x] Project ID 확보 (`zochskv5`)
- [x] API 토큰 생성 (Editor 권한)
- [x] CORS Origins 설정 (`https://pck-homepage.vercel.app` + `localhost:3000`)

### Step 2: 환경변수

- [x] `.env.local`에 `NEXT_PUBLIC_SANITY_PROJECT_ID=zochskv5` 설정
- [x] `.env.local`에 `SANITY_API_TOKEN` 설정
- [x] 환경변수 적용 확인 (dev 서버 재시작)

### Step 3: 패키지 설치

- [x] `sanity` 패키지 설치
- [x] `@sanity/vision` 패키지 설치
- [x] `npm run build` 정상 확인

### Step 4: 스키마 구현 체크

- [x] `src/sanity/schemaTypes/post.ts` — 뉴스/활동 스키마 (7필드)
- [x] `src/sanity/schemaTypes/education.ts` — 평화학교 스키마 (9필드)
- [x] `src/sanity/schemaTypes/teamMember.ts` — 임원진 스키마 (5필드)
- [x] `src/sanity/schemaTypes/timeline.ts` — 연혁 스키마 (3필드)
- [x] `src/sanity/schemaTypes/index.ts` — 전체 스키마 export
- [x] 기존 `src/types/sanity.ts` 타입과 필드명 일치 확인
- [x] 기존 `src/lib/sanity/queries.ts` GROQ 쿼리와 필드명 일치 확인

### Step 5: Studio 설정 체크

- [x] `sanity.config.ts` 생성 (프로젝트 루트)
- [x] `src/app/studio/[[...tool]]/page.tsx` 생성 (Studio 라우트, `'use client'` + NextStudio)
- [x] `src/app/studio/[[...tool]]/layout.tsx` 생성 (metadata + viewport)
- [x] 중복 `<html>` 태그 렌더링하던 상위 `studio/layout.tsx` 제거

### Step 6: Next.js 설정 체크

- [x] `next.config.ts`에 `cdn.sanity.io` remotePatterns 추가 (기존 설정 확인)

### Step 7: Studio 기능 체크

- [x] `localhost:3000/studio` 접속 시 Sanity Studio 로드 (로그인 화면 정상 표시)
- [x] ADMIN 미인증 시 `/studio` 접근 차단 (로그인 페이지로 리다이렉트)
- [ ] 좌측 메뉴에 스키마 4개 표시 (뉴스/활동, 평화학교 교육, 임원진, 연혁)
- [ ] 각 스키마에서 문서 생성 가능
- [ ] 이미지 업로드 정상 동작
- [ ] Portable Text 에디터 정상 동작
- [ ] Vision 플러그인에서 GROQ 쿼리 테스트 가능

### Step 8: 샘플 데이터 체크

- [x] post 데이터 입력 완료 (Sanity Studio에서 관리 중)
- [x] teamMember 데이터 입력 완료
- [x] timeline 데이터 입력 완료
- [x] education 데이터 입력 완료

### Step 9: 실데이터 연동 체크

- [x] 홈 LatestNews — `LATEST_POSTS_QUERY` 연동 (ISR 1시간)
- [x] 연혁 페이지 — `TIMELINE_QUERY` 연동 (ISR 1시간)
- [x] 임원진 페이지 — `TEAM_MEMBERS_QUERY` 연동 (ISR 1시간)
- [x] 뉴스 목록 — `POSTS_PAGINATED_QUERY` + 페이지네이션 동작
- [x] 뉴스 상세 — `POST_QUERY` + Portable Text 렌더링 정상
- [x] 평화학교 목록 — `EDUCATIONS_QUERY` 연동
- [ ] 평화학교 상세 — `EDUCATION_QUERY` 페이지 미구현 (쿼리는 준비됨)

### 빌드 체크

- [x] TypeScript 타입 오류 없음 (`npx tsc --noEmit`)
- [x] 프로덕션 빌드 성공 (`npm run build`)
- [x] `/studio` 라우트 정상 생성
- [x] Sanity 이미지 로드 정상 (`cdn.sanity.io`)
- [ ] 다크모드에서 Studio 및 연동 페이지 정상 표시

### 반응형 체크

- [ ] 뉴스 목록/상세 모바일 레이아웃 정상
- [ ] 임원진 카드 모바일 레이아웃 정상
- [ ] 연혁 타임라인 모바일 레이아웃 정상

### 접근성 체크

- [ ] 뉴스 카드 키보드 네비게이션 가능
- [ ] 이미지 alt 텍스트 Sanity에서 가져와 적용
- [ ] Portable Text 본문 시맨틱 HTML 렌더링

---

## Feature 3: 영수증 이미지 팝업 미리보기

### 구현 체크

- [x] 영수증 미리보기 state 추가 (`previewReceipt: string | null`)
- [x] `<a>` 태그를 `<button>` 으로 교체
- [x] shadcn/ui Dialog 컴포넌트로 팝업 구현
- [x] Dialog 내 `<img>` 태그로 영수증 이미지 표시
- [x] Dialog 닫기 시 state 초기화
- [x] ExternalLink 아이콘을 Eye 아이콘으로 변경

### 기능 체크

- [ ] 영수증 아이콘 클릭 시 팝업으로 이미지 표시
- [ ] 새 탭 이동 없이 인라인 팝업으로 동작
- [ ] 오버레이 클릭 / X 버튼 / ESC 키로 닫기
- [ ] 영수증 없는 행은 기존과 동일하게 "—" 표시

### 반응형 체크

- [ ] 모바일: 팝업이 화면에 맞게 표시
- [ ] 데스크탑: 적절한 크기의 모달로 표시

### 접근성 체크

- [ ] 키보드(Enter/Space)로 팝업 열기 가능
- [ ] ESC로 닫기 가능
- [ ] aria-label 적절히 설정

---

## Feature 2: 모바일 영수증 사진 촬영

### 구현 체크

- [x] Camera 아이콘 import 추가 (lucide-react)
- [x] cameraRef (useRef) 추가
- [x] 사진 촬영 버튼 UI 추가 (파일 선택 옆)
- [x] hidden input에 `capture="environment"` 속성 설정
- [x] 모바일 전용 표시 (`sm:hidden`)
- [x] 기존 handleChange 핸들러 재사용으로 OCR 파이프라인 연결

### 기능 체크

- [ ] 모바일에서 '사진 촬영' 버튼 표시 확인
- [ ] 데스크탑에서 '사진 촬영' 버튼 숨김 확인
- [ ] 버튼 클릭 시 후면 카메라 실행
- [ ] 촬영 후 이미지 미리보기 표시
- [ ] 촬영 이미지 OCR 분석 정상 동작
- [ ] 스캔 중 버튼 비활성화 확인

### 반응형 체크

- [ ] 모바일(< 640px): 파일 선택 + 사진 촬영 버튼 나란히 표시
- [ ] 태블릿/데스크탑(≥ 640px): 파일 선택 버튼만 표시

---

## Feature 1: 오시는 길 탭 추가

# 오시는 길 탭 추가 — 체크리스트

## 구현 체크

- [x] react-kakao-maps-sdk 패키지 설치
- [x] NEXT_PUBLIC_KAKAO_MAP_KEY 환경변수 설정
- [x] 오시는 길 페이지 생성 (`/about/location/page.tsx`)
- [x] Kakao Map 클라이언트 컴포넌트 생성 (`kakao-map.tsx`)
- [x] 탭 네비게이션에 '오시는 길' 추가 (layout.tsx)
- [x] 한국어 번역 키 추가 (ko.json)
- [x] 영어 번역 키 추가 (en.json)
- [x] 상수 파일 업데이트 (about.ts)
- [x] Kakao Maps SDK 타입 정의 추가 (kakao-maps.d.ts)

## 기능 체크

- [x] 탭 클릭 시 /about/location 으로 이동
- [x] '임원진' 탭 바로 옆에 '오시는 길' 탭 표시
- [x] 활성 탭 스타일 정상 적용
- [x] 지도에 사무실 위치 마커 표시
- [x] 마커 클릭 시 인포윈도우(주소) 표시
- [x] 주소 정보가 Footer와 동일한 소스(CONTACT_INFO) 사용
- [x] 대중교통 안내 정보 표시
- [x] 다크모드에서 인포윈도우 텍스트 가시성 수정

## 반응형 체크

- [x] 모바일(< 640px): 지도 높이 적절, 탭 가로 스크롤
- [x] 태블릿(640px ~ 1024px): 정상 레이아웃
- [x] 데스크탑(> 1024px): 정상 레이아웃

## 접근성 체크

- [x] aria-current="page" 적용
- [x] 키보드 네비게이션 가능
- [x] 스크린리더에서 탭 라벨 읽힘

## 다국어 체크

- [x] 한국어: "오시는 길" 표시
- [x] 영어: "Directions" 표시

## 빌드 체크

- [x] TypeScript 타입 오류 없음 (`npx tsc --noEmit`)
- [x] 프로덕션 빌드 성공 (`npm run build`)
- [x] /ko/about/location, /en/about/location 라우트 생성 확인
- [x] 다크모드에서 정상 표시
