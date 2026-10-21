'use client';
import { usePathname } from 'next/navigation';
import { useI18n } from './I18nProvider';

const EMAIL = 'sadikhli.ughur@gmail.com';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useI18n();
  if (pathname.startsWith('/admin')) return null;
  return (
    <footer className="mt-24 border-t border-ivory/10 px-6 py-8 sm:mt-32">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 text-center text-xs text-ivory/35 md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} Atelier · {t('footer.rights')}</p>
        <p>
          {t('footer.credit')}{' '}
          <a href={`mailto:${EMAIL}`} className="text-ivory/50 transition hover:text-gold">Ughur Sadikhli</a>
          <span className="mx-1.5">·</span>
          <a href={`mailto:${EMAIL}`} className="transition hover:text-gold">{EMAIL}</a>
        </p>
      </div>
    </footer>
  );
}
