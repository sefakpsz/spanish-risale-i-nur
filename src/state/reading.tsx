import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type ReadingState = {
  progress: Record<string, number>;
  bookmarks: string[];
  ready: boolean;
  setProgress: (bookId: string, chapterIndex: number) => void;
  toggleBookmark: (bookId: string, chapterId: string) => void;
  isBookmarked: (bookId: string, chapterId: string) => boolean;
};

const KEY = "lumbre.reading-state.v1";
const LEGACY_KEY = "lumbre.estado-lectura.v1";
const Context = createContext<ReadingState | null>(null);

export function ReadingProvider({ children }: React.PropsWithChildren) {
  const [progress, setProgressState] = useState<Record<string, number>>({});
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then(async (stored) => {
      const raw = stored ?? await AsyncStorage.getItem(LEGACY_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { progress?: Record<string, number>; bookmarks?: string[] };
        setProgressState(saved.progress ?? {});
        setBookmarks(saved.bookmarks ?? []);
      }
    }).catch(() => undefined).finally(() => setReady(true));
  }, []);

  const persist = useCallback((nextProgress: Record<string, number>, nextBookmarks: string[]) => {
    void AsyncStorage.setItem(KEY, JSON.stringify({ progress: nextProgress, bookmarks: nextBookmarks }));
  }, []);
  const setProgress = useCallback((bookId: string, chapterIndex: number) => {
    setProgressState((current) => {
      const next = { ...current, [bookId]: chapterIndex };
      persist(next, bookmarks);
      return next;
    });
  }, [bookmarks, persist]);
  const toggleBookmark = useCallback((bookId: string, chapterId: string) => {
    const key = `${bookId}:${chapterId}`;
    setBookmarks((current) => {
      const next = current.includes(key) ? current.filter((item) => item !== key) : [...current, key];
      persist(progress, next);
      return next;
    });
  }, [persist, progress]);
  const isBookmarked = useCallback((bookId: string, chapterId: string) => bookmarks.includes(`${bookId}:${chapterId}`), [bookmarks]);
  const value = useMemo(() => ({ progress, bookmarks, ready, setProgress, toggleBookmark, isBookmarked }), [progress, bookmarks, ready, setProgress, toggleBookmark, isBookmarked]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useReading() {
  const context = useContext(Context);
  if (!context) throw new Error("ReadingProvider is missing.");
  return context;
}
