"use client";

import {
  ArrowLeft,
  Bell,
  Heart,
  MessageCircle,
  Search,
  Settings,
  User,
  type LucideProps,
} from "lucide-react";

const base = { strokeWidth: 2 } as const;

export function IconSearch(props: LucideProps) {
  return <Search {...base} {...props} />;
}
export function IconChat(props: LucideProps) {
  return <MessageCircle {...base} {...props} />;
}
export function IconBell(props: LucideProps) {
  return <Bell {...base} {...props} />;
}
export function IconHeart(props: LucideProps) {
  return <Heart {...base} {...props} />;
}
export function IconUser(props: LucideProps) {
  return <User {...base} {...props} />;
}
export function IconSettings(props: LucideProps) {
  return <Settings {...base} {...props} />;
}
export function IconBack(props: LucideProps) {
  return <ArrowLeft {...base} {...props} />;
}
