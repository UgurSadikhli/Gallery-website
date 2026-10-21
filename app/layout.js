import './globals.css';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { I18nProvider } from '@/components/I18nProvider';
import { dictionaries } from '@/lib/dictionaries';
import { getLocale } from '@/lib/i18n-server';

const display = Cormorant_Garamond({ subsets: ['latin', 'latin-ext', 'cyrillic'], weight: ['400', '500', '600', '700'], style: ['normal', 'italic'], variable: '--font-display' });
const sans = Inter({ subsets: ['latin', 'latin-ext', 'cyrillic'], variable: '--font-sans' });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Atelier', template: '%s · Atelier' },
  description: 'Digital art exhibition',
};

export default function RootLayout({ children }) {
  const locale = getLocale();
  const theme = cookies().get('theme')?.value === 'light' ? 'light' : 'dark';
  return (
    <html lang={locale} data-theme={theme} className={`${display.variable} ${sans.variable}`}>
      <body>
        <I18nProvider locale={locale} dict={dictionaries[locale]}>
          <Navbar />
          {children}
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
