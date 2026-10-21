'use client';
import { motion } from 'framer-motion';
import { useI18n } from './I18nProvider';

export default function Hero({ imageId }) {
  const { t } = useI18n();
  const words = t('hero.title').split(' ');
  return (
    <section className="relative flex min-h-[85svh] items-center justify-center overflow-hidden">
      {imageId && (
        <motion.img src={`/api/paintings/${imageId}/image`} alt="" initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 0.35 }}
          transition={{ duration: 2.4, ease: 'easeOut' }} className="absolute inset-0 h-full w-full object-cover blur-[3px]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/30 via-canvas/60 to-canvas" />
      <div className="relative px-6 text-center">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-xs uppercase tracking-[0.4em] text-gold">{t('hero.eyebrow')}</motion.p>
        <h1 className="mt-6 font-display text-5xl font-medium italic leading-[0.95] sm:text-7xl md:text-9xl">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-2 pr-4 align-bottom">
              <motion.span className="inline-block" initial={{ y: '110%' }} animate={{ y: 0 }}
                transition={{ delay: 0.35 + i * 0.14, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}>{w}</motion.span>
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mx-auto mt-8 max-w-md text-ivory/60">{t('hero.sub')}</motion.p>
        <motion.a href="#collection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="btn-gold mt-10 inline-block">{t('hero.cta')}</motion.a>
      </div>
    </section>
  );
}
