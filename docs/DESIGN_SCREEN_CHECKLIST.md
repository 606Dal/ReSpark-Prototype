# ReSpark Stage 1 — Design Screen Checklist

기준: 요구사항정의서(v2) · `FEATURE_GAP_ANALYSIS.md` 기능 ID  
용도: 디자인팀 화면·상태·버튼 검토  
언어: EN 기본 / KO 전환 (`Header` EN|KO)  
데이터: Mock (`mock: true`) · 실제 PG/OAuth/S3/WebSocket 없음

검토 상태 범례: `□` 미검토 · 시연 가능 여부는 Implementation Report 참고

---

## 사용자 화면

| 기능 ID | 화면 | URL | UI | 주요 버튼·동작 | 상태 | i18n | Mock | 검토 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F-001,F-002 | Home | `/` | Hero, New/Popular grids, ProductCard | Browse, List item, card→detail, wish on card | loading / empty / data | EN/KO labels | Y | □ |
| F-003,F-025,F-042 | Header | layout | Logo, search, nav, unread, EN/KO | Search, Login/Signup/Logout, Chat, Notifications | guest / logged-in / badge | Y | Y | □ |
| F-004,F-059 | Footer | layout | Company, links | Support, FAQ, Notices, Terms, Admin, Demo reset | — | Y | Y | □ |
| F-005,F-006,F-007 | Sign up | `/signup` | Email/pw/terms/marketing/verify, social stubs | Check email, Social LINE/Google/X/Apple, Submit→`/` | validation / duplicate / loading | partial | Y | □ |
| F-008,F-009 | Login | `/login` | Email/pw, social stubs | Login→`/` (admin→`/admin`), Forgot link | blank / fail / loading | partial | Y | □ |
| F-012 | Forgot password | `/password/forgot` | Email→code→new pw | Send code, Save (mock) | steps | UI | Y | □ |
| F-013 | Change password | `/password/change` | Email, current, code, new | Submit mock | validation | UI | Y | □ |
| F-010 | Withdraw | `/mypage/withdraw` | Password confirm, retention notice | Confirm withdraw | confirm | UI | Y | □ |
| F-014~F-017 | Sell create | `/sell` | Gallery file input 1–10, 1st/2nd category, USD 0–100, AI hint | Publish, AI hint, Prohibited, Clear media | validation / publishing | EN labels | Y | □ |
| F-017 | Prohibited | `/sell/prohibited` | List | Back | — | EN | Y | □ |
| F-018,F-019 | Sell manage | `/sell/manage` | Status tabs, cards | Edit, status select, soft delete | RESERVED delete blocked / SOLD lock | EN | Y | □ |
| F-018 | Sell edit | `/sell/[id]/edit` | Form | Save / Back | SOLD locked | EN | Y | □ |
| F-026~F-030 | Product list | `/products` | Filters, sort, 5×5 paging (desktop), wish | Filter, sort, page, wish | loading / empty / error | Y | Y | □ |
| F-031,F-020,F-041 | Product detail | `/products/[id]` | Gallery, seller stats, wish count | Chat, Buy, Wish, Report | 404 / sold | Y | Y | □ |
| F-021,F-022 | Chat list/room | `/chat`, `/chat/[id]` | Messages, attach UI, translate, system msgs | Send, Attach, Translate, Accept, Pay, Leave | spam lock toast / warning | Y | Y | □ |
| F-023 | Seller info | `/trade/[id]/seller-info` | Account/address autofill, fee display | Save & notify | after accept | EN | Y | □ |
| F-039,F-040 | Payment | `/payment/[productId]` | Destination, customs, methods, terms | Pay (mock) | terms off disabled | EN | Y | □ |
| F-041 | Report | `/report` | Type, category, body, photo stub | Submit | success / login | EN | Y | □ |
| F-032~F-038 | Support hub | `/support` | Entry cards | FAQ / Notices / Inquiries | — | EN | Y | □ |
| F-032,F-033 | FAQ | `/support/faq`, `/support/faq/[id]` | List + detail | Open | empty | EN | Y | □ |
| F-037,F-038 | Notices | `/support/notices`, `.../[id]` | List + detail | Open | empty | EN | Y | □ |
| F-034~F-036 | Inquiries | `/support/inquiries`, `/new`, `/[id]` | List, form, answer | New, Submit | login / waiting | EN | Y | □ |
| F-043~F-048 | My page | `/mypage`, `/profile` | Menu grid, profile | All menu entries | login required | EN | Y | □ |
| F-045 | Accounts | `/mypage/accounts` | CRUD, max 5, default | Add / default / delete | limit | EN | Y | □ |
| F-057,F-058 | Destinations | `/mypage/destinations` | CRUD, default delete block | Add / default / delete | default locked | EN | Y | □ |
| F-047 | Wishlist | `/mypage/wishlist` | Cards | Open product | empty | EN | Y | □ |
| F-049~F-051 | Purchases | `/mypage/purchases`, `/[id]` | List, detail, confirm | Confirm, Cancel, Review | status | EN | Y | □ |
| F-056 | Cancel trade | `/mypage/purchases/[id]/cancel` | Reason + detail≥10 | Request cancel | validation | EN | Y | □ |
| F-052,F-053 | Sales | `/mypage/sales`, `/[id]` | List, detail, settlement note | Review, Cancel | status | EN | Y | □ |
| F-054,F-055 | Reviews | `/reviews/new`, `/mypage/reviews` | Stars, text, media stub | Submit | empty | EN | Y | □ |
| F-046 | Restrictions | `/mypage/restrictions` | History table | — | empty | EN | Y | □ |
| F-024 | Notifications | `/notifications` | List max 50 policy | — | empty / unread | EN | Y | □ |
| F-059 | Terms | `/terms` | Versioned terms | — | — | EN | Y | □ |
| — | Retention | `/privacy/retention` | Policy copy | Withdraw link | — | EN | Y | □ |
| — | Demo reset | `/demo` | Reset control | Reset mock store | success | EN | Y | □ |

---

## 관리자 화면

| 기능 ID | 화면 | URL | UI | 주요 동작 | 상태 | i18n | Mock | 검토 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F-061,F-062 | Admin login / shell | `/admin/login`, layout | Sidebar menus | Login, Logout | auth gate | EN | Y | □ |
| — | Dashboard | `/admin` | Summary cards | Navigate | — | EN | Y | □ |
| F-063,F-064 | Products | `/admin/products` | Table | Delete soft | reserved blocked | EN | Y | □ |
| F-065,F-066 | Categories | `/admin/categories` | Table CRUD stubs | Create/Edit/Delete/Toggle | empty | EN | Y | □ |
| F-067~F-069 | Members | `/admin/members`, `/[id]` | Search, detail | Restrict, membership | — | EN | Y | □ |
| F-070~F-074 | Inquiries | `/admin/inquiries` | Table Answer | Answer / Edit / Delete | — | EN | Y | □ |
| F-077~F-079 | Trades | `/admin/trades`, `/[id]` | Search, detail | Open | — | EN | Y | □ |
| F-081~F-083 | Reports | `/admin/reports` | List actions | Review / Accept / Reject | status change | EN | Y | □ |
| F-084~F-086 | Settlements | `/admin/settlements` | Table | Request / Cancel | no PG | EN | Y | □ |
| F-087~F-090 | Notices admin | `/admin/notices` | CRUD stubs | Create/Edit/Delete | — | EN | Y | □ |
| F-091~F-094 | FAQ admin | `/admin/faq` | CRUD stubs | Create/Edit/Delete | — | EN | Y | □ |
| F-095,F-096 | Reviews admin | `/admin/reviews` | Table | Hide/Delete stub | — | EN | Y | □ |
| F-097~F-101 | Alarms | `/admin/alarms` | Templates + send stub | Send preview | — | EN | Y | □ |
| F-102~F-107 | Boards | `/admin/boards` | Board/category stub | CRUD stubs | — | EN | Y | □ |
| F-060,F-075,F-076,F-080 | Admin signup / operators / terms add | — | Not as full flows | Use Members + Terms user page | Stub / deferred | — | Y | □ |

---

## 공통 UI 컴포넌트 점검

| 컴포넌트 | 사용처 | 비고 | 검토 |
| --- | --- | --- | --- |
| Header / Footer | shop layout | EN/KO, unread badge | □ |
| AdminShell | admin layout | role gate | □ |
| ProductCard | home, list, wishlist | wish count button | □ |
| StatusBadge | product/trade | ON_SALE / RESERVED / SOLD · trade | □ |
| MockBadge | most screens | MOCK label | □ |
| Modal / Toast | providers | confirm / feedback | □ |
| Forms / tables | sell, admin, mypage | validation messages | □ |
| Pagination 5×5 | `/products` | desktop priority, responsive grid | □ |

---

## 시연 권장 플로우 (디자인 리뷰)

1. EN → KO 전환 후 새로고침 유지 확인  
2. `seller@respark.test` 로그인 → `/sell` 미디어+등록 → manage/edit  
3. `buyer@respark.test` → 상품 상세 Buy → chat 구매요청 → seller Accept → seller-info → Pay  
4. 구매 내역 Confirm / Cancel 사유 화면  
5. Report → Admin Accept/Reject  
6. Admin Categories / FAQ / Notices / Settlements Request·Cancel  
7. `/demo` 데이터 초기화  

---

## 확인 필요 (정책)

- **C-04**: 상품 가격 USD **0–100** — UI/API 반영. 범위가 낮아 보이면 요구사항 재확인.  
- **C-05**: 정산 수수료 10% 표시(판매자 정보) vs Mock settlement 수치 — Stage 2 확정.  
