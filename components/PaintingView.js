'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Mail, ZoomIn } from 'lucide-react';
import LikeButton from './LikeButton';
import Lightbox from './Lightbox';
import { useI18n } from './I18nProvider';

const money = (v) => Number(v).toLocaleString('en-US', { style: 'currency', currency: process.env.NEXT_PUBLIC_CURRENCY || 'USD' });

export default function PaintingView({ painting: p, contactEmail }) {
  const { t } = useI18n();
  const [zoom, setZoom] = useState(false);
  const title = p.title || t('common.untitled');
  const src = `/api/paintings/${p.id}/image`;
  const mailto = `mailto:${contactEmail || ''}?subject=${encodeURIComponent(`${t('detail.inquiry')}: ${title}`)}`;
  const rows = [['detail.by', p.artist_name], ['detail.date', p.date_drawn], ['detail.medium', p.medium], ['detail.dimensions', p.dimensions]].filter(([, v]) => v);

  return (
    <article className="mx-auto max-w-7xl px-6 py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-ivory/50 transition hover:text-gold"><ArrowLeft size={16} /> {t('detail.back')}</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <button onClick={() => setZoom(true)} aria-label="Zoom" className="group relative cursor-zoom-in self-start bg-surface p-3 ring-1 ring-ivory/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={title} className="block h-auto w-full" />
          <span className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full bg-canvas/80 px-3 py-1.5 text-xs opacity-0 backdrop-blur transition group-hover:opacity-100"><ZoomIn size={14} /> {t('detail.zoom')}</span>
        </button>

        <div className="lg:sticky lg:top-24 lg:self-start">
          {p.is_for_sale && <span className="mb-5 inline-block rounded-full border border-gold/60 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-gold">{t('detail.acq')}</span>}
          <h1 className="font-display text-4xl font-medium italic leading-[1.05] sm:text-5xl md:text-6xl">{title}</h1>
          {p.description && <p className="mt-6 whitespace-pre-line leading-relaxed text-ivory/70">{p.description}</p>}
          <dl className="mt-8 divide-y divide-ivory/10 border-y border-ivory/10 text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-3"><dt className="text-ivory/45">{t(k)}</dt><dd className="text-right">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-6 flex items-center justify-between">
            <LikeButton id={p.id} initialCount={p.likes_count} className="border border-ivory/20 hover:bg-ivory/10" />
            <span className="text-sm text-ivory/40">{p.likes_count} {t('detail.likes')}</span>
          </div>
          {p.is_for_sale && (
            <div className="mt-8 border border-gold/30 bg-gold/5 p-6">
              {p.price != null && <p className="font-display text-4xl text-gold">{money(p.price)}</p>}
              <motion.a href={mailto} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-gold mt-4 flex w-full items-center justify-center gap-2">
                <Mail size={17} /> {t('detail.inquire')}
              </motion.a>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>{zoom && <Lightbox src={src} alt={title} onClose={() => setZoom(false)} />}</AnimatePresence>
    </article>
  );
}
