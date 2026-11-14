# ReSpark Stage 1 — Implementation Report

작성일: 2026-11-14  
범위: Next.js Mock 프로토타입 고도화 (Backend/DB/PG/OAuth/Docker **미연동**)  
기준: 요구사항정의서(v2) 107기능 · SQL(Last) 타입 참고 · 이벤트스토밍 보조만

> `npm run build` / 자동 테스트는 이번 작업에서 **실행하지 않음**. 아래 상태는 코드·경로 기준으로 정리.

---

## 1. 요약

| 구분 | 설명 | 대략 규모 |
| --- | --- | --- |
| 화면·동작 시연 가능 (P0/P1 중심) | 라우트 + Mock API + 주요 버튼 연결 | ~70+ 기능 |
| Stub / 디자인 검토용 UI (P2/P3) | 화면·모달·안내만, 실연동 없음 | ~25 기능 |
| 의도적 축소 / Stage 2 | 배치·실PG·실OAuth·실번역API·WebSocket | 소수 |

초기 갭 분석(구현6 / 부분36 / 미구현65) 대비, Stage 1 고도화로 **대부분 기능을 화면 또는 Stub UI에 매핑**했다.  
“완료”는 **디자인 시연 가능**을 뜻하며, 운영 수준의 완결을 의미하지 않는다.

---

## 2. 완료·시연 가능 (Mock)

| ID | 기능 | 비고 |
| --- | --- | --- |
| F-001~F-004 | 홈·카드·헤더·푸터 | 찜수·인기=찜→조회수·EN/KO·알림/약관/FAQ 링크 |
| F-005~F-009 | 가입/로그인(소셜 Stub 포함) | 비번규칙·마케팅동의·성공→`/` |
| F-011 | 로그아웃 | `/` |
| F-012,F-013 | 비번 찾기/변경 | Mock 인증 코드 UI |
| F-014~F-019 | 판매 등록·미디어·AI힌트·금지품목·수정·삭제 | USD 0–100, 예약중삭제불가, SOLD수정불가 |
| F-020~F-023 | 채팅 생성·메시지·번역·수락·판매자정보 | leave soft, attach UI stub |
| F-025~F-031 | 목록/필터/정렬/5×5/상세/신고진입 | |
| F-032~F-041 | FAQ/공지/문의/결제/신고 | 분리 라우트 |
| F-042~F-058 | 마이페이지 전 구간 | 계좌·배송지·리뷰·제재·탈퇴·취소 |
| F-059 | 이용약관 | `/terms` |
| F-061~F-064 | 관리자 로그인·상품 | |
| F-065~F-069 | 카테고리·회원 목록/상세/검색 | CRUD Stub+API |
| F-070~F-074 | 문의 답변 관리 UI | Stub 액션 |
| F-077~F-086 | 거래·신고처리·정산 요청/취소 | PG 없음 |
| F-087~F-096 | 공지/FAQ/리뷰 관리 UI | Stub |
| F-097~F-107 | 알림·게시판 관리 UI | Stub |

추가 화면: `/demo` 초기화, `/privacy/retention`, `/notifications`, `/trade/[id]/seller-info`

---

## 3. 부분 구현 / Stub

| ID | 내용 | Stage 2 |
| --- | --- | --- |
| F-005,F-008 | 소셜 버튼만 (실 OAuth 없음) | Provider 연동 |
| F-016 | AI 시세 Mock 키워드/가격대 | 인식·시세 API |
| F-021 | 미디어 첨부는 toast Stub; 도배·경고는 부분 | WebSocket, Mongo, 필터 |
| F-022 | leave는 있음, 영구삭제 UX 단순 | soft-delete 정책 확정 |
| F-024 | 알림 목록·FIFO 안내 (가격하락 자동 생성 약함) | Alarm 배치 |
| F-051 | 구매확정 Mock · 5일 자동확정 안내는 문구 | 스케줄러 |
| F-060 | 관리자 전용 가입 화면 없음 | 운영자 온보딩 |
| F-075,F-076 | 운영자 검색/조회 전용 화면 없음 | Admin user 모델 |
| F-080 | 약관 **추가만** 관리자 UI 미완 (사용자 조회는 있음) | Terms admin |
| F-083 | Accept/Reject Mock · 3회 자동제재는 안내 | 제재 엔진 |
| F-084~F-086 | 정산 상태 변경만 · 이체/에스크로 없음 | PG |
| F-087~F-107 | 관리 테이블 Stub (Create 메시지만인 항목 있음) | 실 CRUD+권한 |

---

## 4. 미구현에 가까운 항목

| ID | 이유 |
| --- | --- |
| F-060 | 관리자 회원가입 전용 플로우 없음 (데모 계정 사용) |
| F-075,F-076 | 운영자정보 전용 화면 미작성 |
| 실연동 전부 | S3, PG, OAuth, Kafka, MySQL, Mongo, 번역 API, 푸시 |

이벤트스토밍 전용 기능은 요구사항(v2)에 없는 경우 **구현하지 않음**.

---

## 5. 주요 변경 영역 (파일)

```text
src/app/(shop)/          # 다수 신규·보강 페이지 (sell, support, mypage, trade, report, …)
src/app/admin/           # FAQ/notices/inquiries/reviews/categories/boards/alarms/members|trades detail
src/app/api/             # accounts, destinations, reports, reviews, translate, demo/reset, admin/*
src/components/          # Header i18n, AdminShell menus, ProductCard wishes, Toast/Modal
src/lib/api/             # client + domain modules
src/lib/adapters/        # mock/real 분리 골격
src/lib/i18n/ + messages/en.json|ko.json
src/lib/translation/     # Mock Translator
src/lib/mock/            # store/data (toy categories, reset)
.env.example
DESIGN_SCREEN_CHECKLIST.md
STAGE1_IMPLEMENTATION_REPORT.md
README.md
scripts/gen-pages*.mjs   # 페이지 생성 보조 (개발용)
```

---

## 6. 미검증 항목

- `npm run build` / `npm run lint` / E2E **미실행**
- 모든 관리자 Stub Create가 서버에 persist 되는지 화면별 편차 있음 (일부는 toast만)
- 채팅 도배 제한·외부거래 경고의 전 분기 수동 시연 권장
- KO 번역 커버리지: 내비·공통·핵심 플로우 우선. 일부 신규 페이지는 영어 라벨 잔존 가능
- Windows 외 OS 미검증

---

## 7. Stage 2 연동 시 필요 작업

1. `NEXT_PUBLIC_API_MODE=real` + `NEXT_PUBLIC_API_BASE_URL` → Gateway  
2. `lib/adapters/real` 구현, 인증(JWT/쿠키) 맞춤  
3. 응답 envelope·에러코드·페이징을 Gateway 스펙에 정렬  
4. 채팅 WebSocket + Mongo(또는 확정 저장소)  
5. S3 업로드, PG/에스크로, OAuth, 번역 API, 알림 푸시  
6. C-01~C-13 문서 불일치 해소 후 DDL/서비스 확정  
7. soft-delete·보존기간 배치, 자동 구매확정/취소  
8. 관리자 CRUD를 Stub에서 실 API로 교체

---

## 8. 요구사항 ↔ SQL 미해결 불일치 (유지)

`FEATURE_GAP_ANALYSIS.md` **C-01 ~ C-13** 그대로 유효.

특히 Stage 1에서 **앱 정책을 v2로 적용**한 항목:

| ID | Stage 1 처리 |
| --- | --- |
| C-04 | 가격 **USD 0–100** 검증 (SQL BIGINT 범위와 별개) |
| C-05 | 판매자정보 화면에서 수수료 **10% 예시** 표시 · Settlement Mock 수치는 별도 |
| C-01 | 채팅은 메모리 Mock (Mongo/SQL 미선택) |
| C-02,C-13 | Product에 like/view·리뷰 통계 필드를 Mock 내장 |

SQL DDL / 실제 DB는 **변경하지 않음**.

---

## 9. 데모 계정

| 역할 | Email | Password |
| --- | --- | --- |
| Buyer | buyer@respark.test | buyer1234 |
| Seller | seller@respark.test | seller1234 |
| Admin | admin@respark.test | admin1234 |

데이터 초기화: `/demo` 또는 `POST /api/demo/reset`
