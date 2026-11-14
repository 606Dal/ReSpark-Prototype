import { fail, ok } from "@/lib/api/response";
import { getTranslator } from "@/lib/translation/translationService";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    text?: string;
    targetLanguage?: "en" | "ko";
  };
  if (!body.text?.trim() || !body.targetLanguage) {
    return fail("text and targetLanguage are required.");
  }
  try {
    const result = await getTranslator().translate({
      text: body.text,
      targetLanguage: body.targetLanguage,
    });
    return ok(result, "Mock translation");
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Translate failed", 500);
  }
}
