import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

export async function GET() {
  return ok(store.boards);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.boardName) return fail("boardName required");
  const item = {
    id: store.nextIds.board++,
    boardName: body.boardName,
    category: body.category || "CUSTOM",
    userWriteEnable: Boolean(body.userWriteEnable),
    fixedEnable: Boolean(body.fixedEnable),
    reservationEnable: Boolean(body.reservationEnable),
    mediaEnable: Boolean(body.mediaEnable),
    used: body.used !== false,
  };
  store.boards.push(item);
  return ok(item, undefined, { status: 201 });
}
