import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useColorScheme } from "react-native";

export type ThemePreference = "system" | "light" | "dark";
type ThemeState = {
  preference: ThemePreference;
  scheme: "light" | "dark";
  setPreference: (preference: ThemePreference) => void;
};

const KEY = "spanish-risale.theme.v1";
const Context = createContext<ThemeState | null>(null);

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const changedByUser = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((saved) => {
      if (!changedByUser.current && (saved === "system" || saved === "light" || saved === "dark")) {
        setPreferenceState(saved);
      }
    }).catch(() => undefined);
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    changedByUser.current = true;
    setPreferenceState(next);
    void AsyncStorage.setItem(KEY, next);
  }, []);

  const scheme = preference === "system" ? (systemScheme === "dark" ? "dark" : "light") : preference;
  const value = useMemo(() => ({ preference, scheme, setPreference }), [preference, scheme, setPreference]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAppTheme() {
  const context = useContext(Context);
  if (!context) throw new Error("ThemeProvider is missing.");
  return context;
}
