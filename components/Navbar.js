'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import LangSwitcher from './LangSwitcher';
import ThemeToggle from './ThemeToggle';
import { useI18n } from './I18nProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]); // close menu after navigating
  if (pathname.startsWith('/admin')) return null;

  const links = [{ href: '/', label: t('nav.gallery') }, { href: '/about', label: t('nav.about') }];
  const isActive = (href) => (href === '/' ? pathname === '/' || pathname.startsWith('/painting') : pathname === href);

  return (
    <header className="sticky top-0 z-40 border-b border-ivory/10 bg-canvas/80 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 sm:py-4">
          <Link href="/" className="font-display text-2xl italic tracking-tight sm:text-3xl">Atelier<span className="text-gold">.</span></Link>

          {/* Desktop / tablet */}
          <div className="hidden items-center gap-8 md:flex">
            <ul className="flex gap-7 text-sm">
              {links.map((l) => (
                <li key={l.href} className="relative">
                  <Link href={l.href} className={isActive(l.href) ? 'text-ivory' : 'text-ivory/50 transition hover:text-ivory'}>{l.label}</Link>
                  {isActive(l.href) && <motion.span layoutId="nav-underline" className="absolute -bottom-1.5 left-0 right-0 h-px bg-gold" />}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3"><ThemeToggle /><LangSwitcher /></div>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu"
              className="rounded-full border border-ivory/15 p-2 text-ivory/80 transition hover:text-gold">
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }} className="overflow-hidden md:hidden">
              <ul className="flex flex-col pb-3 pt-1">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={() => setOpen(false)}
                      className={`block px-1 py-3 font-display text-3xl italic ${isActive(l.href) ? 'text-gold' : 'text-ivory/80'}`}>{l.label}</Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-ivory/10 py-4"><LangSwitcher /></div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
