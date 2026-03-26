# 추가 기능 체크리스트

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
