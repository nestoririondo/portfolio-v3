import { en } from "./en";
import { de } from "./de";
import { es } from "./es";

export const translations = {
  en,
  de,
  es,
};

export type Language = "en" | "de" | "es";
export type TranslationKey = keyof typeof en;