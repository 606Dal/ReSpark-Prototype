import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";
import type { ReportTargetType } from "@/types";

export async function GET() {
  return ok(
    [...store.reports].sort((a, b) => +new Date(a.reportedAt) - +new Date(b.reportedAt))
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.description?.trim() || !body.reporterId || !body.targetType) {
    return fail("reporterId, targetType, description required");
  }
  const item = {
    id: store.nextIds.report++,
    reporterId: body.reporterId,
    targetUserId: body.targetUserId ?? 0,
    targetType: body.targetType as ReportTargetType,
    targetUuid: body.targetUuid ?? String(body.productId ?? ""),
    reportedAt: new Date().toISOString(),
    description: body.description.trim(),
    status: "OPEN" as const,
    reportCategory: body.reportCategory || "OTHER",
  };
  store.reports.unshift(item);
  return ok(item, "Report submitted (cannot edit/view again)", { status: 201 });
}
