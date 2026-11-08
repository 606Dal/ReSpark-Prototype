# ReSpark — Stage 1 Prototype

글로벌 중고거래 중개 플랫폼 **ReSpark**의 1단계 프로토타입입니다.  
Next.js App Router + TypeScript + Tailwind로 주요 화면과 Mock API 흐름만 확인합니다.

> 실제 MySQL / MongoDB / Kafka / Spring Boot / Docker / 결제 PG / 소셜 OAuth는 연결하지 않습니다.

---

## 참고 자료 분석 요약

| 자료 | 반영 내용 |
| --- | --- |
| 요구사항 정의서 | 메인, 상품, 판매, 채팅, 결제, 마이페이지, 고객센터, 관리자 화면 범위 |
| 이벤트스토밍 2차 | 회원가입/로그인, 상품 CRUD, 채팅, 결제, 구매확정/취소, 정산, 관리자 도메인 흐름 |
| ReSpark_SQL | `Product`, `User`, `Purchase`, `Payment`, `Settlement`, `CHAT` 등 컬럼 기반 Mock 타입 |

---

## 1단계 구현 화면

### 사용자

- `/` 메인 (신상품 / 인기상품)
- `/products` 상품 목록 · 필터 · 정렬
- `/products/[id]` 상품 상세
- `/login`, `/signup` 이메일 로그인/회원가입 (**Mock**)
- `/sell`, `/sell/manage` 판매 등록 · 판매 관리
- `/chat`, `/chat/[id]` 채팅 목록 · 채팅방 (**번역 API Mock**)
- `/payment/[productId]` 결제 (**Mock**)
- `/mypage`, `/mypage/wishlist`, `/mypage/purchases`, `/mypage/purchases/[id]`, `/mypage/sales`
- `/support` FAQ · 공지 · 문의

### 관리자

- `/admin/login`
- `/admin` 대시보드
- `/admin/members`, `/admin/products`, `/admin/trades`, `/admin/settlements`, `/admin/reports`

---

## Mock API 목록

| Method | Path | 설명 |
| --- | --- | --- |
| POST | `/api/auth/login` | 이메일 로그인 |
| POST | `/api/auth/signup` | 회원가입 |
| GET | `/api/auth/me` | 세션 사용자 |
| GET/POST | `/api/products` | 상품 목록/등록 |
| GET/PATCH/DELETE | `/api/products/[id]` | 상세/상태변경/소프트삭제 |
| GET | `/api/categories` | 카테고리 |
| GET/POST | `/api/wishlist` | 찜 조회/토글 |
| GET | `/api/purchases` | 구매/판매 내역 |
| GET/PATCH | `/api/purchases/[id]` | 상세/확정/취소 |
| GET/POST | `/api/chats` | 채팅방 |
| GET/POST | `/api/chats/[id]/messages` | 메시지 |
| POST | `/api/payment` | Mock 결제 |
| GET | `/api/notices`, `/api/faq` | 고객센터 |
| POST | `/api/inquiries` | 문의 접수 |
| GET | `/api/admin/*` | 관리자 조회 API |

공통 응답 형식:

```json
{ "success": true, "data": {}, "message": "...", "mock": true }
```

---

## 디렉터리 구조

```text
src/
  app/
    (shop)/          # 사용자 화면
    admin/           # 관리자 화면
    api/             # Next.js Route Handlers (Mock)
  components/        # UI 컴포넌트
  lib/
    api/             # 프론트 API 호출 모듈 (2단계에서 Gateway URL로 교체)
    auth/            # 브라우저 Mock 세션 (localStorage)
    mock/            # SQL 기반 Mock 데이터/스토어
    format.ts
  types/             # 도메인 타입
```

2단계 전환 시 `lib/api/*`와 `types/*`를 유지하고, `NEXT_PUBLIC_API_BASE_URL`만 Spring API Gateway로 바꾸면 됩니다.

---

## 실행 방법

```bash
npm install
npm run dev
```

브라우저: [http://localhost:3000](http://localhost:3000)

### 데모 계정

| 역할 | 이메일 | 비밀번호 |
| --- | --- | --- |
| 구매자 | `buyer@respark.test` | `buyer1234` |
| 판매자 | `seller@respark.test` | `seller1234` |
| 관리자 | `admin@respark.test` | `admin1234` |

---

## Mock / 미구현 기능

- 소셜 회원가입·로그인 (LINE, Google, X, Apple)
- 실제 결제 PG / 에스크로 / Apple·Google Pay
- 정산 이체, 환율 적용
- 채팅 번역 API, 비속어 필터, 푸시 알림
- 사진·동영상 실업로드, 시세 그래프
- MySQL / MongoDB / Kafka / Eureka / Docker / CI·CD

위 항목은 화면에서 `MOCK` 뱃지 또는 안내 문구로 구분합니다.
