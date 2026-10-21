'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/95 p-4">
      <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"><X size={22} /></button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }} src={src} alt={alt} className="max-h-full max-w-full object-contain" />
    </motion.div>
  );
}
