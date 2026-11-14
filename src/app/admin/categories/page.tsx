"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { useI18n } from "@/components/providers/LocaleProvider";
import type { Category } from "@/types";

type Cat = Category & { deleted?: boolean };

export default function AdminCategoriesPage() {
  const { t, locale } = useI18n();
  const isKo = locale === "ko";
  const [items, setItems] = useState<Cat[]>([]);
  const [selectedL1, setSelectedL1] = useState<number | null>(null);
  const [selectedL2, setSelectedL2] = useState<number | null>(null);
  const [selectedL3, setSelectedL3] = useState<number | null>(null);
  const [draft1, setDraft1] = useState("");
  const [draft2, setDraft2] = useState("");
  const [draft3, setDraft3] = useState("");
  const [draft4, setDraft4] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const j = await fetch("/api/admin/categories").then((r) => r.json());
    if (!j.success) throw new Error(j.message);
    setItems(j.data || []);
  }, []);

  useEffect(() => {
    load().catch((e: Error) => setError(e.message));
  }, [load]);

  const level1 = useMemo(
    () => items.filter((c) => c.depth === 1 || c.categoryParentId == null).sort((a, b) => b.id - a.id),
    [items]
  );

  const level2 = useMemo(
    () =>
      selectedL1 == null
        ? []
        : items
            .filter((c) => c.categoryParentId === selectedL1)
            .sort((a, b) => b.id - a.id),
    [items, selectedL1]
  );

  // Stage 1 SQL is depth 1–2 only; columns 3–4 stay ready for future children
  const level3 = useMemo(
    () =>
      selectedL2 == null
        ? []
        : items.filter((c) => c.categoryParentId === selectedL2).sort((a, b) => b.id - a.id),
    [items, selectedL2]
  );

  const level4 = useMemo(
    () =>
      selectedL3 == null
        ? []
        : items.filter((c) => c.categoryParentId === selectedL3).sort((a, b) => b.id - a.id),
    [items, selectedL3]
  );

  async function createCategory(name: string, parentId: number | null, depth: number) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setError("");
    setMsg("");
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: trimmed,
        categoryParentId: parentId,
        depth,
      }),
    });
    const j = await res.json();
    if (!j.success) {
      setError(j.message || (isKo ? "생성 실패" : "Create failed"));
      return;
    }
    setMsg(isKo ? `"${trimmed}" 생성됨` : `Created "${trimmed}"`);
    await load();
  }

  async function removeCategory(id: number) {
    setError("");
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const j = await res.json();
    if (!j.success) {
      setError(j.message || (isKo ? "삭제 실패" : "Delete failed"));
      return;
    }
    if (selectedL1 === id) {
      setSelectedL1(null);
      setSelectedL2(null);
      setSelectedL3(null);
    } else if (selectedL2 === id) {
      setSelectedL2(null);
      setSelectedL3(null);
    } else if (selectedL3 === id) {
      setSelectedL3(null);
    }
    await load();
  }

  function Column({
    title,
    hint,
    enabled,
    draft,
    setDraft,
    onCreate,
    list,
    selectedId,
    onSelect,
    emptyText,
  }: {
    title: string;
    hint: string;
    enabled: boolean;
    draft: string;
    setDraft: (v: string) => void;
    onCreate: () => void;
    list: Cat[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    emptyText: string;
  }) {
    return (
      <div
        className={`flex min-h-[28rem] flex-col rounded-xl border border-line bg-white ${
          enabled ? "" : "opacity-50"
        }`}
      >
        <div className="border-b border-line bg-[#eef5f1] px-3 py-2">
          <p className="text-sm font-bold text-ink">{title}</p>
          <p className="text-[11px] text-muted">{hint}</p>
        </div>
        <div className="border-b border-line p-2">
          <form
            className="flex gap-1"
            onSubmit={(e) => {
              e.preventDefault();
              if (!enabled) return;
              onCreate();
            }}
          >
            <input
              className="input h-9 flex-1 text-sm"
              placeholder={enabled ? (isKo ? "이름 입력 후 Enter" : "Type name + Enter") : "—"}
              value={draft}
              disabled={!enabled}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary h-9 px-2 text-xs"
              disabled={!enabled || !draft.trim()}
            >
              {isKo ? "추가" : "Add"}
            </button>
          </form>
        </div>
        <ul className="flex-1 space-y-1 overflow-y-auto p-2">
          {!enabled && (
            <li className="p-3 text-center text-xs text-muted">
              {isKo ? "왼쪽에서 상위 카테고리를 선택하세요" : "Select a parent on the left"}
            </li>
          )}
          {enabled && list.length === 0 && (
            <li className="p-3 text-center text-xs text-muted">{emptyText}</li>
          )}
          {enabled &&
            list.map((c) => (
              <li key={c.id}>
                <div
                  className={`flex items-center gap-1 rounded-lg border px-2 py-2 text-sm ${
                    selectedId === c.id
                      ? "border-brand bg-brand/10 font-semibold text-brand"
                      : "border-transparent hover:bg-[#f4f8f6]"
                  }`}
                >
                  <button
                    type="button"
                    className="min-w-0 flex-1 truncate text-left"
                    onClick={() => onSelect(c.id)}
                  >
                    {c.name}
                  </button>
                  <button
                    type="button"
                    className="shrink-0 text-[11px] text-rose-700"
                    onClick={() => removeCategory(c.id)}
                    title={t("common.delete")}
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="display text-2xl font-bold text-ink">{t("admin.categories")}</h1>
          <MockBadge />
        </div>
      </div>
      <p className="text-sm text-muted">
        {isKo
          ? "1열: 대분류 → 항목 클릭 시 2열에 중분류 입력. 새 항목은 각 열 맨 위에 추가됩니다."
          : "Col 1: top category → click to edit children in Col 2. New items appear at the top."}
      </p>
      {error && <p className="text-sm text-rose-700">{error}</p>}
      {msg && <p className="text-sm text-emerald-700">{msg}</p>}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Column
          title={isKo ? "1 · 대분류" : "1 · Level 1"}
          hint={isKo ? "최상위 카테고리" : "Top-level"}
          enabled
          draft={draft1}
          setDraft={setDraft1}
          onCreate={async () => {
            await createCategory(draft1, null, 1);
            setDraft1("");
          }}
          list={level1}
          selectedId={selectedL1}
          onSelect={(id) => {
            setSelectedL1(id);
            setSelectedL2(null);
            setSelectedL3(null);
            setDraft2("");
            setDraft3("");
            setDraft4("");
          }}
          emptyText={isKo ? "대분류가 없습니다" : "No top categories"}
        />

        <Column
          title={isKo ? "2 · 중분류" : "2 · Level 2"}
          hint={
            selectedL1
              ? `${isKo ? "상위" : "Parent"}: ${level1.find((c) => c.id === selectedL1)?.name ?? ""}`
              : isKo
                ? "대분류 선택 필요"
                : "Select level 1"
          }
          enabled={selectedL1 != null}
          draft={draft2}
          setDraft={setDraft2}
          onCreate={async () => {
            if (selectedL1 == null) return;
            await createCategory(draft2, selectedL1, 2);
            setDraft2("");
          }}
          list={level2}
          selectedId={selectedL2}
          onSelect={(id) => {
            setSelectedL2(id);
            setSelectedL3(null);
            setDraft3("");
            setDraft4("");
          }}
          emptyText={isKo ? "중분류가 비어 있습니다" : "No mid categories yet"}
        />

        <Column
          title={isKo ? "3 · 하위" : "3 · Level 3"}
          hint={
            selectedL2
              ? `${isKo ? "상위" : "Parent"}: ${level2.find((c) => c.id === selectedL2)?.name ?? ""}`
              : isKo
                ? "중분류 선택 필요 (Stage 1 예비)"
                : "Select level 2 (reserved)"
          }
          enabled={selectedL2 != null}
          draft={draft3}
          setDraft={setDraft3}
          onCreate={async () => {
            if (selectedL2 == null) return;
            await createCategory(draft3, selectedL2, 3);
            setDraft3("");
          }}
          list={level3}
          selectedId={selectedL3}
          onSelect={(id) => {
            setSelectedL3(id);
            setDraft4("");
          }}
          emptyText={isKo ? "하위 카테고리가 비어 있습니다" : "No child categories yet"}
        />

        <Column
          title={isKo ? "4 · 하위" : "4 · Level 4"}
          hint={
            selectedL3
              ? `${isKo ? "상위" : "Parent"}: ${level3.find((c) => c.id === selectedL3)?.name ?? ""}`
              : isKo
                ? "3열 선택 필요"
                : "Select level 3"
          }
          enabled={selectedL3 != null}
          draft={draft4}
          setDraft={setDraft4}
          onCreate={async () => {
            if (selectedL3 == null) return;
            await createCategory(draft4, selectedL3, 4);
            setDraft4("");
          }}
          list={level4}
          selectedId={null}
          onSelect={() => undefined}
          emptyText={isKo ? "하위 카테고리가 비어 있습니다" : "No child categories yet"}
        />
      </div>
    </div>
  );
}
