export type TranslateRequest = {
  text: string;
  sourceLanguage?: string;
  targetLanguage: "en" | "ko";
};

export type TranslateResult = {
  translatedText: string;
  mock: true;
  provider: "mock";
};

export interface Translator {
  translate(req: TranslateRequest): Promise<TranslateResult>;
}
