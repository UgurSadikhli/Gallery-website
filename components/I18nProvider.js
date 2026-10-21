'use client';
import { createContext, useContext } from 'react';

const Ctx = createContext({ locale: 'az', dict: {} });

export function I18nProvider({ locale, dict, children }) {
  return <Ctx.Provider value={{ locale, dict }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const { locale, dict } = useContext(Ctx);
  return { locale, t: (k) => dict[k] ?? k };
}
