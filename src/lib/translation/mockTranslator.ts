import type { TranslateRequest, TranslateResult, Translator } from "./types";

const dictionary: Record<string, { en?: string; ko?: string }> = {
  "Is the battery included?": {
    ko: "배터리가 포함되어 있나요?",
  },
  "Yes, original battery and charger are included.": {
    ko: "네, 정품 배터리와 충전기가 포함되어 있습니다.",
  },
  "Great. Can you ship tomorrow?": {
    ko: "좋아요. 내일 발송 가능한가요?",
  },
  "Yes, I can ship tomorrow.": {
    ko: "네, 내일 발송 가능합니다.",
  },
  "배터리가 포함되어 있나요?": {
    en: "Is the battery included?",
  },
};

export const mockTranslator: Translator = {
  async translate(req: TranslateRequest): Promise<TranslateResult> {
    await new Promise((r) => setTimeout(r, 350));
    const hit = dictionary[req.text]?.[req.targetLanguage];
    if (hit) {
      return { translatedText: hit, mock: true, provider: "mock" };
    }
    const prefix = req.targetLanguage === "ko" ? "[KO-MOCK] " : "[EN-MOCK] ";
    return {
      translatedText: `${prefix}${req.text}`,
      mock: true,
      provider: "mock",
    };
  },
};
