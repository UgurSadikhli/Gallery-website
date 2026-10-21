'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import LikeButton from './LikeButton';
import { useI18n } from './I18nProvider';

export default function Gallery({ paintings }) {
  const { t } = useI18n();
  const [filter, setFilter] = useState('all');
  const hasSale = paintings.some((p) => p.is_for_sale);
  const active = hasSale ? filter : 'all';
  const visible = useMemo(() => (active === 'sale' ? paintings.filter((p) => p.is_for_sale) : paintings), [active, paintings]);
  const filters = [{ key: 'all', label: t('gallery.all') }, { key: 'sale', label: t('gallery.sale') }];

  return (
    <section id="collection" className="mx-auto max-w-7xl scroll-mt-20 px-6">
      <div className="flex flex-col items-start justify-between gap-6 pb-12 pt-10 md:flex-row md:items-end">
        <h2 className="font-display text-5xl italic md:text-7xl">{t('gallery.title')}<span className="text-gold">.</span></h2>
        {hasSale && (
        <div className="inline-flex rounded-full border border-ivory/15 p-1">
          {filters.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`relative rounded-full px-5 py-2 text-sm transition-colors ${active === f.key ? 'text-canvas' : 'text-ivory/60 hover:text-ivory'}`}>
              {active === f.key && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="py-24 text-center text-ivory/40">{active === 'sale' ? t('gallery.emptySale') : t('gallery.empty')}</p>
      ) : (
        <motion.div layout className="columns-1 gap-7 sm:columns-2 lg:columns-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.article key={p.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.06 }} whileHover={{ y: -6 }}
                className="group relative mb-7 break-inside-avoid bg-surface p-2.5 ring-1 ring-ivory/10 transition-shadow duration-500 hover:shadow-[0_25px_60px_-15px_rgba(201,161,91,0.25)]">
                <Link href={`/painting/${p.id}`} className="relative block overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/paintings/${p.id}/image`} alt={p.title || t('common.untitled')} loading="lazy"
                    className="block h-auto w-full transition-transform duration-700 group-hover:scale-105" />
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/20 to-transparent p-5 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                    {p.is_for_sale && <span className="mb-2 w-fit rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-canvas">{t('common.forSale')}</span>}
                    <h3 className="font-display text-2xl italic">{p.title || t('common.untitled')}</h3>
                    {p.medium && <p className="text-xs text-white/70">{p.medium}</p>}
                  </div>
                </Link>
                <span className="pointer-events-none absolute left-5 top-5 font-display text-sm text-white/0 mix-blend-difference transition group-hover:text-white/80">{String(i + 1).padStart(2, '0')}</span>
                <LikeButton id={p.id} initialCount={p.likes_count} className="absolute bottom-5 right-5 bg-canvas/80 text-ivory opacity-0 backdrop-blur group-hover:opacity-100 focus:opacity-100 [@media(hover:none)]:opacity-100" />
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
