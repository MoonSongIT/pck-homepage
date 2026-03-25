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
