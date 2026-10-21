import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, LOCALES, dictionaries } from './dictionaries';

export function getLocale() {
  const v = cookies().get('locale')?.value;
  return LOCALES.includes(v) ? v : DEFAULT_LOCALE;
}

export function getDict() {
  const locale = getLocale();
  return { locale, t: (k) => dictionaries[locale][k] ?? k };
}
