'use client';
import { useRouter } from 'next/navigation';
import { LOCALES } from '@/lib/dictionaries';
import { useI18n } from './I18nProvider';

export default function LangSwitcher() {
  const { locale } = useI18n();
  const router = useRouter();
  const set = (l) => {
    document.cookie = `locale=${l}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };
  return (
    <div className="flex rounded-full border border-ivory/15 p-0.5 text-[11px] font-medium tracking-wider">
      {LOCALES.map((l) => (
        <button key={l} onClick={() => set(l)}
          className={`rounded-full px-2.5 py-1 transition ${locale === l ? 'bg-gold text-canvas' : 'text-ivory/60 hover:text-ivory'}`}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
