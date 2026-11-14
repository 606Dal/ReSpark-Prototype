import type {
  Account,
  Category,
  ChatMessage,
  ChatRoom,
  Destination,
  FaqItem,
  Inquiry,
  Notice,
  Product,
  Purchase,
  Report,
  Settlement,
  User,
  WishItem,
} from "@/types";

export const MOCK_USERS: User[] = [
  {
    id: 1,
    uuid: "11111111-1111-1111-1111-111111111111",
    email: "buyer@respark.test",
    status: "ACTIVE",
    nickname: "MinaBuyer",
    membershipTf: false,
    reportCount: 0,
    lastLoginAt: "2026-11-06T10:00:00Z",
    createdAt: "2025-01-10T08:00:00Z",
    role: "USER",
  },
  {
    id: 2,
    uuid: "22222222-2222-2222-2222-222222222222",
    email: "seller@respark.test",
    status: "ACTIVE",
    nickname: "KenSeller",
    membershipTf: true,
    reportCount: 1,
    lastLoginAt: "2026-11-07T02:30:00Z",
    createdAt: "2024-11-01T08:00:00Z",
    role: "USER",
  },
  {
    id: 3,
    uuid: "33333333-3333-3333-3333-333333333333",
    email: "admin@respark.test",
    status: "ACTIVE",
    nickname: "ReSparkAdmin",
    membershipTf: false,
    reportCount: 0,
    lastLoginAt: "2026-11-07T01:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    role: "ADMIN",
  },
  {
    id: 4,
    uuid: "44444444-4444-4444-4444-444444444444",
    email: "tokyo.shop@respark.test",
    status: "SUSPENDED",
    nickname: "TokyoShop",
    membershipTf: false,
    reportCount: 4,
    lastLoginAt: "2026-10-20T12:00:00Z",
    createdAt: "2025-03-15T08:00:00Z",
    role: "USER",
  },
];

/** Prototype login passwords are mock-only (not real auth). */
export const MOCK_PASSWORDS: Record<string, string> = {
  "buyer@respark.test": "buyer1234",
  "seller@respark.test": "seller1234",
  "admin@respark.test": "admin1234",
};

/** Requirements v2: depth1 item type, depth2 country */
export const MOCK_CATEGORIES: Category[] = [
  { id: 1, categoryParentId: null, depth: 1, name: "Figure", deleted: false },
  { id: 2, categoryParentId: null, depth: 1, name: "Plamodel", deleted: false },
  { id: 3, categoryParentId: null, depth: 1, name: "TCG", deleted: false },
  { id: 4, categoryParentId: null, depth: 1, name: "Lego", deleted: false },
  { id: 5, categoryParentId: null, depth: 1, name: "Art Toy", deleted: false },
  { id: 6, categoryParentId: null, depth: 1, name: "Doll", deleted: false },
  { id: 7, categoryParentId: null, depth: 1, name: "Squishy / Fidget", deleted: false },
  { id: 11, categoryParentId: 1, depth: 2, name: "Japan", deleted: false },
  { id: 12, categoryParentId: 1, depth: 2, name: "China", deleted: false },
  { id: 13, categoryParentId: 1, depth: 2, name: "Taiwan", deleted: false },
  { id: 14, categoryParentId: 1, depth: 2, name: "USA", deleted: false },
  { id: 15, categoryParentId: 2, depth: 2, name: "Japan", deleted: false },
  { id: 16, categoryParentId: 3, depth: 2, name: "USA", deleted: false },
  { id: 17, categoryParentId: 4, depth: 2, name: "Denmark", deleted: false },
  { id: 18, categoryParentId: 5, depth: 2, name: "China", deleted: false },
  { id: 19, categoryParentId: 6, depth: 2, name: "Germany", deleted: false },
  { id: 20, categoryParentId: 7, depth: 2, name: "Czech", deleted: false },
];

const media = (
  id: number,
  productId: number,
  label: string,
  order = 0,
  thumb = true
): Product["media"][number] => ({
  id,
  productId,
  thumbnailed: thumb,
  displayOrder: order,
  expiredAt: "2027-02-07T00:00:00Z",
  fileType: "IMAGE",
  fileName: `/mock/${label}.jpg`,
  fileSize: 240_000,
  // Local SVG demos — picsum.photos was unreliable (timeouts / blocked network).
  url: `/products/p-${productId}.svg`,
});

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 101,
    userUuid: "22222222-2222-2222-2222-222222222222",
    title: "Nendoroid Limited Figure Set",
    description:
      "Lightly used A7C II body only. Shutter count under 3k. Box and strap included. Ships from Tokyo.",
    price: 95,
    status: "ON_SALE",
    deliveryFee: true,
    deleted: false,
    categoryIds: [1, 11],
    country: "JP",
    condition: "USED_A",
    viewCount: 1284,
    likeCount: 86,
    createdAt: "2026-11-01T09:00:00Z",
    media: [media(1, 101, "camera", 0, true)],
    sellerNickname: "KenSeller",
    sellerUuid: "22222222-2222-2222-2222-222222222222",
  },
  {
    id: 102,
    userUuid: "22222222-2222-2222-2222-222222222222",
    title: "Pokemon TCG Booster Box (sealed)",
    description:
      "Battery health 94%. Always used with case and glass. Original box and cable included.",
    price: 88,
    status: "ON_SALE",
    deliveryFee: false,
    deleted: false,
    categoryIds: [3, 16],
    country: "KR",
    condition: "USED_S",
    viewCount: 2103,
    likeCount: 142,
    createdAt: "2026-11-03T11:20:00Z",
    media: [media(2, 102, "phone", 0, true)],
    sellerNickname: "KenSeller",
    sellerUuid: "22222222-2222-2222-2222-222222222222",
  },
  {
    id: 103,
    userUuid: "22222222-2222-2222-2222-222222222222",
    title: "BJD Doll Outfit Bundle",
    description:
      "Authentic Coach bag purchased in NYC. Minor corner wear. Dust bag included.",
    price: 42,
    status: "RESERVED",
    deliveryFee: true,
    deleted: false,
    categoryIds: [6, 19],
    country: "US",
    condition: "USED_B",
    viewCount: 540,
    likeCount: 33,
    createdAt: "2026-10-28T07:00:00Z",
    media: [media(3, 103, "bag", 0, true)],
    sellerNickname: "KenSeller",
    sellerUuid: "22222222-2222-2222-2222-222222222222",
  },
  {
    id: 104,
    userUuid: "44444444-4444-4444-4444-444444444444",
    title: "Lego Creator Expert Set",
    description:
      "Console + dock + joy-cons. Perfect for travel. No games included.",
    price: 55,
    status: "ON_SALE",
    deliveryFee: true,
    deleted: false,
    categoryIds: [4, 17],
    country: "JP",
    condition: "USED_A",
    viewCount: 890,
    likeCount: 51,
    createdAt: "2026-11-05T14:00:00Z",
    media: [media(4, 104, "switch", 0, true)],
    sellerNickname: "TokyoShop",
    sellerUuid: "44444444-4444-4444-4444-444444444444",
  },
  {
    id: 105,
    userUuid: "22222222-2222-2222-2222-222222222222",
    title: "Pop Mart Blind Box Lot",
    description:
      "Flame orange cast iron pot. Barely used. Heavy item — shipping fee separate.",
    price: 36,
    status: "SOLD",
    deliveryFee: false,
    deleted: false,
    categoryIds: [5, 18],
    country: "FR",
    condition: "USED_S",
    viewCount: 402,
    likeCount: 28,
    createdAt: "2026-09-12T10:00:00Z",
    media: [media(5, 105, "pot", 0, true)],
    sellerNickname: "KenSeller",
    sellerUuid: "22222222-2222-2222-2222-222222222222",
  },
  {
    id: 106,
    userUuid: "22222222-2222-2222-2222-222222222222",
    title: "Squishy Fidget Pack (10pcs)",
    description:
      "Full set with all barrels. Purchased 2025. Works perfectly, smoke-free home.",
    price: 72,
    status: "ON_SALE",
    deliveryFee: true,
    deleted: false,
    categoryIds: [7, 20],
    country: "KR",
    condition: "USED_A",
    viewCount: 1550,
    likeCount: 97,
    createdAt: "2026-11-06T16:40:00Z",
    media: [media(6, 106, "dyson", 0, true)],
    sellerNickname: "KenSeller",
    sellerUuid: "22222222-2222-2222-2222-222222222222",
  },
];

export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: 1,
    userId: 1,
    uuid: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    name: "Mina Kim",
    phoneNumber: "+82-10-1234-5678",
    address: "Seoul, Gangnam-gu, Teheran-ro 12",
    detailedAddress: "101-1203",
    postcode: "06236",
    defaultAddress: true,
    deleted: false,
  },
];

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 1,
    userId: 2,
    name: "KEN SATO",
    accountNumber: "110-***-****21",
    bankName: "Mizuho Bank",
    bankCode: "0001",
    basicAccount: true,
    deleted: false,
  },
];

export const MOCK_WISHLIST: WishItem[] = [
  {
    id: 1,
    productId: 101,
    userUuid: "11111111-1111-1111-1111-111111111111",
  },
  {
    id: 2,
    productId: 106,
    userUuid: "11111111-1111-1111-1111-111111111111",
  },
];

export const MOCK_PURCHASES: Purchase[] = [
  {
    id: 1,
    purchaseUuid: "ORD-2026-00081",
    sellerUuid: "22222222-2222-2222-2222-222222222222",
    buyerUuid: "11111111-1111-1111-1111-111111111111",
    productId: 105,
    tradeStatus: "CONFIRMED",
    cancelReason: null,
    canceledBy: null,
    createdAt: "2026-09-20T08:00:00Z",
    paymentMethod: "CARD",
    amount: 180,
    trackingNumber: "JP123456789KR",
  },
  {
    id: 2,
    purchaseUuid: "ORD-2026-00102",
    sellerUuid: "22222222-2222-2222-2222-222222222222",
    buyerUuid: "11111111-1111-1111-1111-111111111111",
    productId: 103,
    tradeStatus: "IN_PROGRESS",
    cancelReason: null,
    canceledBy: null,
    createdAt: "2026-11-04T09:30:00Z",
    paymentMethod: "PAYPAL",
    amount: 210,
    trackingNumber: "US998877665KR",
  },
];

export const MOCK_CHATS: ChatRoom[] = [
  {
    id: 1,
    productId: 101,
    buyerId: 1,
    sellerId: 2,
    lastMessageAt: "2026-11-07T03:10:00Z",
    productTitle: "Nendoroid Limited Figure Set",
    counterpartNickname: "KenSeller",
    lastMessagePreview: "Yes, I can ship tomorrow.",
    unreadCount: 1,
    purchaseRequested: false,
    purchaseAccepted: false,
    deleted: false,
  },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    chatId: 1,
    senderId: 1,
    content: "Is the battery included?",
    sourceLanguage: "en",
    messageType: "TEXT",
    sentAt: "2026-11-07T03:00:00Z",
    warningType: null,
  },
  {
    id: 2,
    chatId: 1,
    senderId: 2,
    content: "Yes, original battery and charger are included.",
    sourceLanguage: "en",
    messageType: "TEXT",
    sentAt: "2026-11-07T03:05:00Z",
    warningType: null,
  },
  {
    id: 3,
    chatId: 1,
    senderId: 1,
    content: "Great. Can you ship tomorrow?",
    sourceLanguage: "en",
    messageType: "TEXT",
    sentAt: "2026-11-07T03:08:00Z",
    warningType: null,
  },
  {
    id: 4,
    chatId: 1,
    senderId: 2,
    content: "Yes, I can ship tomorrow.",
    sourceLanguage: "en",
    messageType: "TEXT",
    sentAt: "2026-11-07T03:10:00Z",
    warningType: null,
  },
];

export const MOCK_NOTICES: Notice[] = [
  {
    id: 1,
    noticeType: "GENERAL",
    title: "Welcome to ReSpark prototype",
    content: "This is a stage-1 mock prototype. Payments and OAuth are simulated.",
    published: true,
    createdAt: "2026-11-01T00:00:00Z",
  },
  {
    id: 2,
    noticeType: "POLICY_CHANGE",
    title: "Safe payment policy update",
    content: "External direct payments between users are prohibited.",
    published: true,
    createdAt: "2026-10-15T00:00:00Z",
  },
  {
    id: 3,
    noticeType: "FRAUD_PREVENTION",
    title: "Watch out for phishing links in chat",
    content: "Never click unknown payment links. Use in-app checkout only.",
    published: true,
    createdAt: "2026-09-01T00:00:00Z",
  },
];

export const MOCK_FAQ: FaqItem[] = [
  {
    id: 1,
    question: "How does international shipping work?",
    answer:
      "Sellers set a return address and buyers provide a customs code on checkout. Couriers are selected after payment confirmation.",
    sortOrder: 1,
    isVisible: true,
    category: "Shipping",
    author: "admin",
  },
  {
    id: 2,
    question: "When is settlement paid to sellers?",
    answer:
      "After buyer confirmation (or auto-confirm 5 days after delivery), settlement is requested. In production this is escrow-based.",
    sortOrder: 2,
    isVisible: true,
    category: "Settlement",
    author: "admin",
  },
  {
    id: 3,
    question: "Can I cancel a trade?",
    answer:
      "Yes. Provide a cancel reason (10+ characters). If the seller does not respond for 3 days, cancel is auto-approved.",
    sortOrder: 3,
    isVisible: true,
    category: "Trade",
    author: "admin",
  },
];

export const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 1,
    userId: 1,
    userEmail: "buyer@respark.test",
    inquiredAt: "2026-11-02T10:00:00Z",
    description: "My tracking number is not updating.",
    status: "REVIEWING",
  },
];

export const MOCK_REPORTS: Report[] = [
  {
    id: 1,
    reporterId: 1,
    targetUserId: 4,
    targetType: "USER",
    targetUuid: "44444444-4444-4444-4444-444444444444",
    reportedAt: "2026-10-18T12:00:00Z",
    description: "Asked to pay outside the app via bank transfer.",
    status: "RESOLVED",
    reportCategory: "EXTERNAL_PAYMENT",
  },
];

export const MOCK_RESTRICTIONS = [
  {
    id: 1,
    userUuid: "44444444-4444-4444-4444-444444444444",
    restrictedAt: "2026-10-19T00:00:00Z",
    releasedAt: "2026-10-22T00:00:00Z",
    durationLabel: "3 days",
    reason: "External payment solicitation (report accepted)",
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    userUuid: "11111111-1111-1111-1111-111111111111",
    type: "PRICE_DROP" as const,
    title: "Price drop",
    body: "A wishlisted item dropped in price (mock).",
    read: false,
    sentAt: "2026-11-07T04:00:00Z",
  },
  {
    id: 2,
    userUuid: "11111111-1111-1111-1111-111111111111",
    type: "CHAT" as const,
    title: "New chat message",
    body: "KenSeller replied in your chat.",
    read: false,
    sentAt: "2026-11-07T03:10:00Z",
  },
];

export const MOCK_REVIEWS = [
  {
    id: 1,
    tradeId: 1,
    userId: 1,
    productId: 105,
    rating: 5,
    content: "Fast shipping and item as described.",
    createdAt: "2026-09-27T10:00:00Z",
    productTitle: "Pop Mart Blind Box Lot",
    authorNickname: "MinaBuyer",
  },
  {
    id: 2,
    tradeId: 2,
    userId: 1,
    productId: 103,
    rating: 4,
    content: "Good condition. Packaging was careful.",
    createdAt: "2026-10-12T08:00:00Z",
    productTitle: "BJD Doll Outfit Bundle",
    authorNickname: "MinaBuyer",
  },
  {
    id: 3,
    tradeId: 0,
    userId: 4,
    productId: 101,
    rating: 5,
    content: "Nendoroid looks brand new. Highly recommend this seller.",
    createdAt: "2026-11-01T12:00:00Z",
    productTitle: "Nendoroid Limited Figure Set",
    authorNickname: "TokyoShop",
  },
  {
    id: 4,
    tradeId: 0,
    userId: 1,
    productId: 101,
    rating: 4,
    content: "Nice figure set. Delivery took a bit longer than expected.",
    createdAt: "2026-11-05T09:30:00Z",
    productTitle: "Nendoroid Limited Figure Set",
    authorNickname: "MinaBuyer",
  },
];

export const MOCK_TERMS = [
  {
    id: 1,
    title: "Terms of Service",
    version: "2026.11",
    content: "Mock terms of service for ReSpark Stage 1 prototype.",
    required: true,
  },
  {
    id: 2,
    title: "Privacy Policy",
    version: "2026.11",
    content: "Mock privacy policy. Personal data handling is simulated only.",
    required: true,
  },
];

export const MOCK_BOARDS = [
  {
    id: 1,
    boardName: "Notice",
    category: "NOTICE",
    userWriteEnable: false,
    fixedEnable: true,
    reservationEnable: true,
    mediaEnable: true,
    used: true,
  },
  {
    id: 2,
    boardName: "Inquiry",
    category: "INQUIRY",
    userWriteEnable: true,
    fixedEnable: false,
    reservationEnable: false,
    mediaEnable: true,
    used: true,
  },
];

export const MOCK_ALARM_TEMPLATES = [
  {
    id: 1,
    type: "PRICE_DROP",
    title: "Price drop alert",
    body: "A wishlisted product price has changed.",
  },
  {
    id: 2,
    type: "TRADE",
    title: "Trade update",
    body: "Your trade status has been updated.",
  },
];

export const MOCK_PROHIBITED = [
  "Flammable / hazardous materials",
  "Weapons (guns, knives, etc.)",
  "Currency and securities",
  "Medicines / pharmaceuticals",
  "Food items",
];

export const MOCK_SETTLEMENTS: Settlement[] = [
  {
    id: 1,
    uuid: "ssssssss-ssss-ssss-ssss-ssssssssssss",
    tradeId: 1,
    accountId: 1,
    type: "SELLER",
    status: "COMPLETED",
    grossAmount: 180,
    feeAmount: 9,
    netAmount: 171,
    requestedAt: "2026-09-26T10:00:00Z",
    completedAt: "2026-09-26T10:40:00Z",
    sellerEmail: "seller@respark.test",
  },
  {
    id: 2,
    uuid: "tttttttt-tttt-tttt-tttt-tttttttttttt",
    tradeId: 2,
    accountId: 1,
    type: "SELLER",
    status: "REQUESTED",
    grossAmount: 210,
    feeAmount: 10.5,
    netAmount: 199.5,
    requestedAt: "2026-11-07T01:00:00Z",
    completedAt: null,
    sellerEmail: "seller@respark.test",
  },
];
