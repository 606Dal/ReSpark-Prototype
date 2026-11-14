# ReSpark — Stage 1 Prototype

글로벌 중고거래 중개 플랫폼 **ReSpark**의 Stage 1 기능형 프로토타입입니다.  
디자인팀 검토와 사용자 흐름 시연을 위해 Next.js App Router + TypeScript + Tailwind로 화면과 Mock API를 제공합니다.

> **Stage 1에서 하지 않는 것:** MySQL, MongoDB, Kafka, Spring Boot, Docker, 실제 결제 PG, 실제 OAuth, AWS, 실번역 API, WebSocket.

관련 문서:

- `FEATURE_GAP_ANALYSIS.md` — 107기능 갭 분석 (요구사항 v2 우선)
- `SCREEN_MAPPING.md` — 화면·URL 매핑
- `DESIGN_SCREEN_CHECKLIST.md` — 디자인 검토 체크리스트
- `STAGE1_IMPLEMENTATION_REPORT.md` — 구현 보고

---

## Windows 10 실행 방법

프로젝트 폴더에서:

```bash
npm install
npm run dev
```

브라우저: [http://localhost:3000](http://localhost:3000)

시스템 PATH·전역 npm 패키지·Docker·DB 설치는 필요하지 않습니다.  
프로젝트 로컬 의존성만 사용합니다.

환경 변수는 `.env.example`을 참고해 필요 시 `.env.local`을 만듭니다 (커밋하지 않음).

```env
NEXT_PUBLIC_API_MODE=mock
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

---

## Mock 환경 설명

- UI → `src/lib/api/*` → 같은 오리진 `/api/*` Route Handler → `src/lib/mock/store` 메모리
- 응답 형식: `{ "success": true, "data": {}, "message": "...", "mock": true }`
- 세션: 브라우저 `localStorage` (보안 인증 아님)
- `NEXT_PUBLIC_API_MODE=real` 및 Real Adapter는 Stage 2용 골격만 존재
- 서버 재시작 시 메모리 Mock은 초기화될 수 있음 → `/demo`에서 리셋

---

## 데모 계정

| 역할 | 이메일 | 비밀번호 |
| --- | --- | --- |
| 구매자 | `buyer@respark.test` | `buyer1234` |
| 판매자 | `seller@respark.test` | `seller1234` |
| 관리자 | `admin@respark.test` | `admin1234` |

---

## 언어 전환 (EN / KO)

- Header의 **EN | KO** 선택
- 기본 언어: English
- 선택값은 브라우저에 저장되어 새로고침 후에도 유지
- 정적 UI(메뉴·버튼·검증 문구)는 `src/messages/en.json`, `ko.json`
- 상품명·채팅·리뷰·문의 본문 등 **사용자 작성 원문은 번역하지 않음**
- 채팅 메시지별 Translate → Mock Translator (`/api/translate`)

화폐 표시는 **USD** (환율 변환 없음).

---

## 데이터 초기화

1. 브라우저에서 `/demo` 열기  
2. Reset 실행  
또는 `POST /api/demo/reset`

---

## 주요 화면 URL

### 사용자

| URL | 설명 |
| --- | --- |
| `/` | 메인 (신상품·인기) |
| `/products` | 목록·필터·정렬·5×5 |
| `/products/[id]` | 상세·찜·구매·신고 |
| `/login`, `/signup` | 로그인·회원가입 (+소셜 Stub) |
| `/password/forgot`, `/password/change` | 비밀번호 |
| `/sell`, `/sell/manage`, `/sell/[id]/edit` | 판매 등록·관리·수정 |
| `/sell/prohibited` | 금지 품목 |
| `/chat`, `/chat/[id]` | 채팅 |
| `/trade/[id]/seller-info` | 판매자 정보 입력 |
| `/payment/[productId]` | Mock 결제 |
| `/report` | 신고 |
| `/mypage` … | 프로필·찜·구매/판매·계좌·배송지·리뷰·제재·탈퇴 |
| `/support` … | FAQ·공지·문의 |
| `/terms` | 이용약관 |
| `/notifications` | 알림 |
| `/demo` | Mock 리셋 |

### 관리자

| URL | 설명 |
| --- | --- |
| `/admin/login` | 관리자 로그인 |
| `/admin` | 대시보드 |
| `/admin/members`, `/admin/members/[id]` | 회원 |
| `/admin/products`, `/admin/categories` | 상품·카테고리 |
| `/admin/trades`, `/admin/trades/[id]` | 거래 |
| `/admin/settlements` | 정산 요청/취소 Mock |
| `/admin/reports` | 신고 수락/거절 |
| `/admin/faq`, `/admin/notices`, `/admin/inquiries` | 고객센터 관리 |
| `/admin/reviews`, `/admin/alarms`, `/admin/boards` | 리뷰·알림·게시판 Stub |

---

## 시연용 거래 흐름

1. 판매자 로그인 → `/sell` 등록  
2. 구매자 로그인 → 상품 상세 **Buy** → 채팅 구매 요청  
3. 판매자 **Accept** → `/trade/.../seller-info`  
4. 구매자 **Pay** (`/payment/...`) Mock 결제  
5. `/mypage/purchases` 확정 또는 `/cancel`  
6. 관리자 정산·신고 화면에서 상태 변경 확인  

---

## 디렉터리 요약

```text
src/
  app/(shop)/     사용자 화면
  app/admin/      관리자 화면
  app/api/        Mock Route Handlers
  components/     UI
  lib/api/        프론트 API 클라이언트 (Stage 2 Gateway 교체 지점)
  lib/adapters/   mock | real 골격
  lib/i18n/       로케일
  lib/translation/ Mock Translator
  lib/mock/       시연 데이터·스토어
  messages/       en.json / ko.json
  types/          도메인 타입 (SQL 참고)
```

---

## 실제 API 미연동 안내

화면에 **MOCK** 뱃지가 붙어 있으면 시연용입니다.  
URL만 바꿔도 Spring MSA에 자동 연동되지 않습니다. Stage 2에서 인증·응답 스키마·에러 코드·페이징을 Gateway에 맞춘 뒤 `lib/adapters/real`을 구현해야 합니다.

가격 입력 범위는 요구사항(v2) 기준 **USD 0–100**입니다. 범위가 비정상적으로 보이면 정책 재확인이 필요합니다 (C-04).
