/** ReSpark domain types — aligned with ReSparkSQL_Last.pdf (+ Stage 1 mock fields) */

export type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED" | "WITHDRAWN" | "DORMANT";
export type ProductStatus = "ON_SALE" | "RESERVED" | "SOLD";
export type TradeStatus = "IN_PROGRESS" | "CONFIRMED" | "CANCELED";
export type SettlementStatus =
  | "REQUESTED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELED"
  | "FAILED";
export type ReportStatus = "OPEN" | "REVIEWING" | "RESOLVED" | "REJECTED";
export type InquiryStatus = "RECEIVED" | "REVIEWING" | "ANSWERED";
export type NoticeType = "GENERAL" | "POLICY_CHANGE" | "FRAUD_PREVENTION";
export type MessageType = "TEXT" | "IMAGE" | "VIDEO" | "SYSTEM";
export type PaymentStatus = "READY" | "APPROVED" | "FAILED" | "CANCELED";
export type MediaFileType = "IMAGE" | "VIDEO";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  mock?: boolean;
}

export interface User {
  id: number;
  uuid: string;
  email: string;
  status: UserStatus;
  nickname: string;
  profileImage?: string;
  membershipTf: boolean;
  reportCount: number;
  lastLoginAt: string;
  createdAt: string;
  role: "USER" | "ADMIN";
}

export interface Category {
  id: number;
  categoryParentId: number | null;
  depth: number;
  name: string;
  deleted: boolean;
}

export interface ProductMedia {
  id: number;
  productId: number;
  thumbnailed: boolean;
  displayOrder: number;
  expiredAt: string;
  fileType: MediaFileType;
  fileName: string;
  fileSize: number;
  /** Prototype display URL (placeholder) */
  url: string;
}

export interface Product {
  id: number;
  productUuid?: string;
  userUuid: string;
  title: string;
  description: string;
  /** Requirements v2: USD 0–100 (C-04 vs SQL BIGINT noted in gap analysis) */
  price: number;
  status: ProductStatus;
  deliveryFee: boolean;
  deleted: boolean;
  categoryIds: number[];
  country: string;
  condition: "NEW" | "USED_S" | "USED_A" | "USED_B";
  viewCount: number;
  likeCount: number;
  createdAt: string;
  media: ProductMedia[];
  sellerNickname: string;
  sellerUuid: string;
  sellerRatingAvg?: number;
  sellerReviewCount?: number;
  sellerTradeCount?: number;
}

export interface Destination {
  id: number;
  userId: number;
  uuid: string;
  name: string;
  phoneNumber: string;
  address: string;
  detailedAddress: string;
  postcode: string;
  defaultAddress: boolean;
  deleted: boolean;
}

export interface Account {
  id: number;
  userId: number;
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  basicAccount: boolean;
  deleted: boolean;
}

export interface WishItem {
  id: number;
  productId: number;
  userUuid: string;
  product?: Product;
}

export interface Purchase {
  id: number;
  purchaseUuid: string;
  sellerUuid: string;
  buyerUuid: string;
  productId: number;
  tradeStatus: TradeStatus;
  cancelReason: string | null;
  canceledBy: string | null;
  createdAt: string;
  product?: Product;
  paymentMethod?: string;
  amount?: number;
  trackingNumber?: string;
}

export interface ChatRoom {
  id: number;
  productId: number;
  buyerId: number;
  sellerId: number;
  lastMessageAt: string | null;
  productTitle: string;
  counterpartNickname: string;
  lastMessagePreview: string;
  unreadCount: number;
  purchaseRequested: boolean;
  purchaseAccepted: boolean;
  deleted: boolean;
}

export interface ChatMessage {
  id: number;
  chatId: number;
  senderId: number;
  content: string | null;
  sourceLanguage: string;
  messageType: MessageType;
  sentAt: string;
  warningType: string | null;
  meta?: {
    action?: "PURCHASE_REQUEST" | "ACCEPT" | "PAY_LINK" | "WARNING";
    productId?: number;
  };
}

export interface Payment {
  id: number;
  buyerId: number;
  amount: number;
  paymentMethod: string;
  platformFee: number;
  status: PaymentStatus;
  productNameSnapshot: string;
  productPriceSnapshot: number;
  tradeId: number;
  approvedAt: string | null;
  mock: true;
}

export interface Notice {
  id: number;
  noticeType: NoticeType;
  title: string;
  content: string;
  published: boolean;
  fixed?: boolean;
  createdAt: string;
  author?: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
  isVisible: boolean;
  category?: string;
  author?: string;
}

export interface Inquiry {
  id: number;
  userId: number;
  userEmail: string;
  inquiredAt: string;
  description: string;
  status: InquiryStatus;
  category?: string;
  title?: string;
  answer?: string | null;
  answeredAt?: string | null;
}

export type ReportTargetType = "PRODUCT" | "USER" | "REVIEW" | "CHAT";

export interface Report {
  id: number;
  reporterId: number;
  targetUserId: number;
  targetType: ReportTargetType;
  targetUuid: string;
  reportedAt: string;
  description: string;
  status: ReportStatus;
  reportCategory: string;
}

export interface Settlement {
  id: number;
  uuid: string;
  tradeId: number;
  accountId: number;
  type: "SELLER" | "BUYER";
  status: SettlementStatus;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  requestedAt: string;
  completedAt: string | null;
  sellerEmail: string;
}

export interface Review {
  id: number;
  tradeId: number;
  userId: number;
  productId: number;
  rating: number;
  content: string | null;
  createdAt: string;
  productTitle: string;
  authorNickname: string;
}

export interface AuthSession {
  user: User;
  token: string;
  mock: true;
}

export interface RestrictionItem {
  id: number;
  userUuid: string;
  restrictedAt: string;
  releasedAt: string | null;
  durationLabel: string;
  reason: string;
}

export interface NotificationItem {
  id: number;
  userUuid: string;
  type: "PRICE_DROP" | "CHAT" | "TRADE" | "MARKETING" | "SYSTEM";
  title: string;
  body: string;
  read: boolean;
  sentAt: string;
}

export interface BoardConfig {
  id: number;
  boardName: string;
  category: string;
  userWriteEnable: boolean;
  fixedEnable: boolean;
  reservationEnable: boolean;
  mediaEnable: boolean;
  used: boolean;
}

export interface AlarmTemplate {
  id: number;
  type: string;
  title: string;
  body: string;
}

export interface TermsDoc {
  id: number;
  title: string;
  version: string;
  content: string;
  required: boolean;
}

export interface PurchaseExtra {
  buyerAddress?: string;
  customsCode?: string;
  membershipTf?: boolean;
  settlementStatus?: SettlementStatus | null;
  feeAmount?: number;
  netAmount?: number;
}
