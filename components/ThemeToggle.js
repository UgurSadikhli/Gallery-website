'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');
  useEffect(() => setTheme(document.documentElement.dataset.theme || 'dark'), []);
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
  };
  return (
    <button onClick={toggle} aria-label="Toggle theme" className="rounded-full border border-ivory/15 p-2 text-ivory/70 transition hover:text-gold">
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
