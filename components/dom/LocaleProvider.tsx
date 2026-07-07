"use client";

import { createContext, useContext } from "react";
import { locales, DEFAULT_LOCALE, type Locale, type Content } from "@/content";

interface LocaleValue {
  locale: Locale;
  t: Content;
}

const LocaleContext = createContext<LocaleValue>({
  locale: DEFAULT_LOCALE,
  t: locales[DEFAULT_LOCALE],
});

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={{ locale, t: locales[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

/** Read the active locale's content anywhere below <LocaleProvider>. */
export function useContent() {
  return useContext(LocaleContext);
}
