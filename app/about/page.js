import { Instagram, Mail } from 'lucide-react';
import { getProfile } from '@/lib/queries';
import { getDict } from '@/lib/i18n-server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'About' };

export default async function AboutPage() {
  const profile = await getProfile();
  const { t, locale } = getDict();
  const bio = ({ az: profile?.bio, ru: profile?.bio_ru, en: profile?.bio_en })[locale] || profile?.bio;
  const pill = 'inline-flex items-center gap-2 rounded-full border border-ivory/20 px-5 py-2.5 text-sm transition hover:border-gold hover:text-gold';
  return (
    <section className="mx-auto grid max-w-6xl gap-14 px-6 py-16 md:grid-cols-[1fr_1.3fr] md:py-24">
      <div className="relative md:sticky md:top-24 md:self-start">
        <div className="absolute -bottom-4 -right-4 h-full w-full border border-gold/40" />
        {profile?.has_avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/api/profile/avatar" alt="" className="relative aspect-[4/5] w-full object-cover" />
        ) : (
          <div className="relative aspect-[4/5] w-full bg-surface" />
        )}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-gold">{t('about.eyebrow')}</p>
        <h1 className="mt-4 font-display text-5xl font-medium italic leading-none sm:text-6xl md:text-8xl">{t('about.title')}</h1>
        <p className="mt-12 whitespace-pre-line text-lg leading-8 text-ivory/75 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl sm:first-letter:text-8xl first-letter:italic first-letter:leading-[0.8] first-letter:text-gold">{bio}</p>
        <div className="mt-12 flex flex-wrap gap-3 border-t border-ivory/10 pt-8">
          {profile?.email && <a href={`mailto:${profile.email}`} className={pill}><Mail size={16} /> {profile.email}</a>}
          {profile?.instagram_url && <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className={pill}><Instagram size={16} /> Instagram</a>}
        </div>
      </div>
    </section>
  );
}
