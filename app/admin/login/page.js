'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LangSwitcher from '@/components/LangSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import { useI18n } from '@/components/I18nProvider';

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('');
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    setBusy(false);
    if (!res.ok) return setErr(res.status === 401 ? t('admin.loginError') : t('admin.error'));
    router.push('/admin'); router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="absolute right-6 top-6 flex items-center gap-3"><ThemeToggle /><LangSwitcher /></div>
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-5 border border-ivory/10 bg-surface p-8">
        <h1 className="font-display text-4xl italic">Atelier<span className="text-gold">.</span></h1>
        <div><label className="label">{t('admin.email')}</label><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><label className="label">{t('admin.password')}</label><input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button className="btn-gold w-full" disabled={busy}>{t('admin.login')}</button>
      </motion.form>
    </div>
  );
}
