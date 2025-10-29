"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { translations, Language } from "../locales";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") {
    return "en"; // Default for SSR
  }
  
  const localStorageLang = localStorage.getItem("nestor-iriondo-language") as Language | null;
  if (localStorageLang) {
    return localStorageLang;
  }
  
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith("es")) return "es";
  if (browserLang.startsWith("de")) return "de";
  
  return "en";
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  
  useEffect(() => {
    setLanguage(getInitialLanguage());
  }, []);

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nestor-iriondo-language", language);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
