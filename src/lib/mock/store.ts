import type {
  ChatMessage,
  ChatRoom,
  Product,
  Purchase,
  User,
  WishItem,
} from "@/types";
import {
  MOCK_ACCOUNTS,
  MOCK_CATEGORIES,
  MOCK_CHATS,
  MOCK_DESTINATIONS,
  MOCK_FAQ,
  MOCK_INQUIRIES,
  MOCK_MESSAGES,
  MOCK_NOTICES,
  MOCK_PASSWORDS,
  MOCK_PRODUCTS,
  MOCK_PURCHASES,
  MOCK_REPORTS,
  MOCK_SETTLEMENTS,
  MOCK_USERS,
  MOCK_WISHLIST,
} from "./data";

/** In-memory mutable store for Route Handlers (process lifetime only). */
export const store = {
  users: structuredClone(MOCK_USERS) as User[],
  passwords: { ...MOCK_PASSWORDS },
  categories: structuredClone(MOCK_CATEGORIES),
  products: structuredClone(MOCK_PRODUCTS) as Product[],
  destinations: structuredClone(MOCK_DESTINATIONS),
  accounts: structuredClone(MOCK_ACCOUNTS),
  wishlist: structuredClone(MOCK_WISHLIST) as WishItem[],
  purchases: structuredClone(MOCK_PURCHASES) as Purchase[],
  chats: structuredClone(MOCK_CHATS) as ChatRoom[],
  messages: structuredClone(MOCK_MESSAGES) as ChatMessage[],
  notices: structuredClone(MOCK_NOTICES),
  faq: structuredClone(MOCK_FAQ),
  inquiries: structuredClone(MOCK_INQUIRIES),
  reports: structuredClone(MOCK_REPORTS),
  settlements: structuredClone(MOCK_SETTLEMENTS),
  nextIds: {
    product: 200,
    wish: 10,
    purchase: 10,
    chat: 10,
    message: 100,
    payment: 10,
  },
};

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
  return {
    ...item,
    product: getProductById(item.productId),
  };
}

export function enrichPurchase(item: Purchase): Purchase {
  return {
    ...item,
    product: getProductById(item.productId),
  };
}
