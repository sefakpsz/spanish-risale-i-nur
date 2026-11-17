import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type Language = "en" | "es";
type LanguageState = { language: Language; setLanguage: (language: Language) => void };
const KEY = "lumbre.idioma.v1";
const Context = createContext<LanguageState | null>(null);

function getSystemLanguage(): Language {
  const locales = getLocales();
  for (const locale of locales) {
    if (locale.languageCode === "es") return "es";
    if (locale.languageCode === "en") return "en";
  }
  return "es";
}

export function LanguageProvider({ children }: React.PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>(getSystemLanguage);
  const changedByUser = useRef(false);
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((saved) => {
      if (!changedByUser.current && (saved === "en" || saved === "es")) setLanguageState(saved);
    }).catch(() => undefined);
  }, []);
  const setLanguage = useCallback((next: Language) => {
    changedByUser.current = true;
    setLanguageState(next);
    void AsyncStorage.setItem(KEY, next);
  }, []);
  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useLanguage() {
  const context = useContext(Context);
  if (!context) throw new Error("LanguageProvider is missing.");
  return context;
}
