/** ReSpark domain types — aligned with ReSpark_SQL.pdf column structure */

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
  userUuid: string;
  title: string;
  description: string;
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
  lastMessageAt: string | null;
  productTitle: string;
  counterpartNickname: string;
  lastMessagePreview: string;
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
  createdAt: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface Inquiry {
  id: number;
  userId: number;
  userEmail: string;
  inquiredAt: string;
  description: string;
  status: InquiryStatus;
}

export interface Report {
  id: number;
  reporterId: number;
  targetUserId: number;
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
