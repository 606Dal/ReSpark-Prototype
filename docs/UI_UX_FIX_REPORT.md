# ReSpark Stage 1 — UI/UX 개선 및 오류 수정 보고

작성일: 2026-11-14

## 1. 이미지 로딩 실패 원인

| 항목 | 결과 |
| --- | --- |
| 원인 | Mock 데이터가 `https://picsum.photos/seed/...` 외부 CDN을 사용. 요청이 **타임아웃/네트워크 차단**으로 실패(로컬에서 HEAD 요청 30초+ 무응답) |
| Next.js 이미지 설정 | `<img>` 직접 사용이라 `images.domains` 문제는 아님 |
| 조치 | `public/products/p-101.svg` ~ `p-106.svg` 로컬 데모 이미지로 교체. `SafeImage`로 실패 시 `/placeholders/product.svg` 표시 |
| 신규 등록 | `POST /api/products`도 로컬 SVG URL 사용 |

## 2. 채팅 메시지 정렬

| 항목 | 결과 |
| --- | --- |
| 원인 | flex column 기본 `stretch` + `ml-auto`만으로 좌우 구분이 약하고, `user`를 렌더마다 `readUser()`만 호출해 세션 동기화가 불안정할 수 있음 |
| 조치 | 메시지 행을 `justify-end/start/center`로 감쌈. `Number(user.id) === Number(senderId)` 비교. SYSTEM/`senderId===0`은 중앙. 로그인 사용자를 state로 유지 |

## 3. 주요 UI 변경

- Header: 넓은 검색창, 작은 EN/KO, 채팅·알림·찜 아이콘+배지, 로그인/회원가입 우측 배치
- ProductCard: 하트 아이콘, 찜 filled/outline, 하단 텍스트 `찜 N` → Heart 아이콘+숫자
- Footer: Stage 1 Mock 문구 제거, 서비스형 카피 + 약관/고객센터/FAQ/공지/문의 링크
- Login: 이메일 로그인 → OR → 소셜 순서
- Chat: 나가기 확인 모달(ESC/바깥 클릭), 뒤로 화살표 아이콘
- 마이페이지: EN/KO 키 확장 및 화면 적용

## 4. 패키지

- `lucide-react` 프로젝트 로컬 설치 (아이콘)

## 5. 미실행

- `npm run build` / 테스트 미실행 (요청사항)
- Git commit/push 없음
