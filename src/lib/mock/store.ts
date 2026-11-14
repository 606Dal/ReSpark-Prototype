import type {
  Account,
  AlarmTemplate,
  BoardConfig,
  ChatMessage,
  ChatRoom,
  Destination,
  Inquiry,
  NotificationItem,
  Product,
  Purchase,
  Report,
  RestrictionItem,
  Review,
  Settlement,
  TermsDoc,
  User,
  WishItem,
} from "@/types";
import {
  MOCK_ACCOUNTS,
  MOCK_ALARM_TEMPLATES,
  MOCK_BOARDS,
  MOCK_CATEGORIES,
  MOCK_CHATS,
  MOCK_DESTINATIONS,
  MOCK_FAQ,
  MOCK_INQUIRIES,
  MOCK_MESSAGES,
  MOCK_NOTICES,
  MOCK_NOTIFICATIONS,
  MOCK_PASSWORDS,
  MOCK_PRODUCTS,
  MOCK_PROHIBITED,
  MOCK_PURCHASES,
  MOCK_REPORTS,
  MOCK_RESTRICTIONS,
  MOCK_REVIEWS,
  MOCK_SETTLEMENTS,
  MOCK_TERMS,
  MOCK_USERS,
  MOCK_WISHLIST,
} from "./data";

function seed() {
  return {
    users: structuredClone(MOCK_USERS) as User[],
    passwords: { ...MOCK_PASSWORDS } as Record<string, string>,
    categories: structuredClone(MOCK_CATEGORIES),
    products: structuredClone(MOCK_PRODUCTS).map((p) => ({
      ...p,
      productUuid: crypto.randomUUID?.() ?? `p-${p.id}`,
      sellerRatingAvg: 4.7,
      sellerReviewCount: 12,
      sellerTradeCount: 34,
      price: Math.min(100, p.price),
    })) as Product[],
    destinations: structuredClone(MOCK_DESTINATIONS) as Destination[],
    accounts: structuredClone(MOCK_ACCOUNTS) as Account[],
    wishlist: structuredClone(MOCK_WISHLIST) as WishItem[],
    purchases: structuredClone(MOCK_PURCHASES) as Purchase[],
    chats: structuredClone(MOCK_CHATS) as ChatRoom[],
    messages: structuredClone(MOCK_MESSAGES) as ChatMessage[],
    notices: structuredClone(MOCK_NOTICES),
    faq: structuredClone(MOCK_FAQ),
    inquiries: structuredClone(MOCK_INQUIRIES) as Inquiry[],
    reports: structuredClone(MOCK_REPORTS) as Report[],
    settlements: structuredClone(MOCK_SETTLEMENTS) as Settlement[],
    restrictions: structuredClone(MOCK_RESTRICTIONS) as RestrictionItem[],
    notifications: structuredClone(MOCK_NOTIFICATIONS) as NotificationItem[],
    reviews: structuredClone(MOCK_REVIEWS) as Review[],
    terms: structuredClone(MOCK_TERMS) as TermsDoc[],
    boards: structuredClone(MOCK_BOARDS) as BoardConfig[],
    alarmTemplates: structuredClone(MOCK_ALARM_TEMPLATES) as AlarmTemplate[],
    prohibited: [...MOCK_PROHIBITED],
    nextIds: {
      product: 200,
      wish: 10,
      purchase: 10,
      chat: 10,
      message: 100,
      payment: 10,
      report: 10,
      inquiry: 10,
      review: 10,
      notice: 10,
      faq: 10,
      settlement: 10,
      notification: 10,
      account: 10,
      destination: 10,
      category: 100,
      board: 10,
      alarm: 10,
      terms: 10,
    },
  };
}

export let store = seed();

export function resetStore() {
  store = seed();
  return store;
}

export function findUserByEmail(email: string) {
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserByUuid(uuid: string) {
  return store.users.find((u) => u.uuid === uuid);
}

export function getProductById(id: number) {
  return store.products.find((p) => p.id === id && !p.deleted);
}

export function enrichWish(item: WishItem): WishItem {
  return { ...item, product: getProductById(item.productId) };
}

export function enrichPurchase(item: Purchase): Purchase {
  return { ...item, product: getProductById(item.productId) };
}
