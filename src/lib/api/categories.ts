import type { Category } from "@/types";
import { apiFetch } from "./client";

export async function fetchCategories() {
  return apiFetch<Category[]>("/api/categories");
}
