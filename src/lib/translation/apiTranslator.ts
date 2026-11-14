import type { TranslateRequest, TranslateResult, Translator } from "./types";

/** Stage 2 placeholder — do not call real translation APIs in Stage 1. */
export const apiTranslator: Translator = {
  async translate(_req: TranslateRequest): Promise<TranslateResult> {
    throw new Error(
      "Real translation API is not connected. Set translator to mock."
    );
  },
};
