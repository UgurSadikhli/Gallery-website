'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, ExternalLink, Heart, LogOut, Palette, Pencil, Plus, Tag, Trash2, Upload, X } from 'lucide-react';
import LangSwitcher from '../LangSwitcher';
import ThemeToggle from '../ThemeToggle';
import { useI18n } from '../I18nProvider';

function Switch({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-gold' : 'bg-ivory/20'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-canvas transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="border border-ivory/10 bg-surface p-5">
      <Icon size={18} className="text-gold" />
      <p className="mt-4 font-display text-4xl sm:text-5xl">{value ?? '–'}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-ivory/50">{label}</p>
    </motion.div>
  );
}

function PaintingModal({ painting, onClose, onSaved }) {
  const { t } = useI18n();
  const edit = !!painting;
  const [f, setF] = useState({
    title: painting?.title || '', description: painting?.description || '', date_drawn: painting?.date_drawn || '',
    artist_name: painting?.artist_name || '', medium: painting?.medium || '', dimensions: painting?.dimensions || '',
    price: painting?.price ?? '', is_for_sale: !!painting?.is_for_sale,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(edit ? `/api/paintings/${painting.id}/image?v=${Date.now()}` : null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const inputRef = useRef(null);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  function pick(fl) {
    if (!fl || !fl.type.startsWith('image/')) return;
    setFile(fl); setPreview(URL.createObjectURL(fl));
  }

  async function submit(e) {
    e.preventDefault(); setErr('');
    if (!edit && !file) return setErr(t('admin.imageRequired'));
    setBusy(true);
    const fd = new FormData();
    for (const [k, v] of Object.entries(f)) fd.set(k, String(v));
    if (file) fd.set('image', file);
    const res = await fetch(edit ? `/api/admin/paintings/${painting.id}` : '/api/admin/paintings', { method: edit ? 'PUT' : 'POST', body: fd });
    setBusy(false);
    if (!res.ok) { const d = await res.json().catch(() => ({})); return setErr(d.error || t('admin.error')); }
    onSaved();
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
      <motion.form onSubmit={submit} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
        className="my-8 w-full max-w-2xl space-y-5 border border-ivory/10 bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl italic">{edit ? t('admin.edit') : t('admin.add')}</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <div onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files[0]); }}
          className="flex min-h-40 cursor-pointer items-center justify-center overflow-hidden border border-dashed border-ivory/25 bg-canvas transition hover:border-gold">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="max-h-72 w-full object-contain" />
          ) : (
            <p className="flex items-center gap-2 p-6 text-sm text-ivory/50"><Upload size={18} /> {t('admin.dropImage')}</p>
          )}
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => pick(e.target.files[0])} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="label">{t('admin.fTitle')}</label><input className="input" value={f.title} onChange={set('title')} /></div>
          <div className="sm:col-span-2"><label className="label">{t('admin.fDesc')}</label><textarea className="input" rows={3} value={f.description} onChange={set('description')} /></div>
          <div><label className="label">{t('admin.fDate')}</label><input className="input" value={f.date_drawn} onChange={set('date_drawn')} placeholder="Autumn 2025" /></div>
          <div><label className="label">{t('admin.fArtist')}</label><input className="input" value={f.artist_name} onChange={set('artist_name')} /></div>
          <div><label className="label">{t('admin.fMedium')}</label><input className="input" value={f.medium} onChange={set('medium')} placeholder="Oil on canvas" /></div>
          <div><label className="label">{t('admin.fDims')}</label><input className="input" value={f.dimensions} onChange={set('dimensions')} placeholder="60 x 80 cm" /></div>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-3 text-sm"><Switch checked={f.is_for_sale} onChange={() => setF((s) => ({ ...s, is_for_sale: !s.is_for_sale }))} label={t('admin.fSale')} />{t('admin.fSale')}</label>
          {f.is_for_sale && <div className="w-40"><label className="label">{t('admin.fPrice')}</label><input className="input" type="number" min="0" step="0.01" value={f.price} onChange={set('price')} /></div>}
        </div>
        {err && <p className="text-sm text-red-400">{err}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" className="btn-ghost" onClick={onClose}>{t('admin.cancel')}</button>
          <button className="btn-gold" disabled={busy}>{busy ? t('admin.saving') : t('admin.save')}</button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function BioEditor() {
  const { t } = useI18n();
  const [f, setF] = useState({ bio: '', bio_ru: '', bio_en: '', email: '', instagram_url: '' });
  const [avatar, setAvatar] = useState(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  useEffect(() => {
    fetch('/api/admin/profile').then((r) => r.json()).then((p) => p && setF({ bio: p.bio || '', bio_ru: p.bio_ru || '', bio_en: p.bio_en || '', email: p.email || '', instagram_url: p.instagram_url || '' }));
  }, []);

  async function submit(e) {
    e.preventDefault(); setBusy(true); setMsg('');
    const fd = new FormData();
    for (const [k, v] of Object.entries(f)) fd.set(k, v);
    if (avatar) fd.set('avatar', avatar);
    const res = await fetch('/api/admin/profile', { method: 'PUT', body: fd });
    setBusy(false);
    setMsg(res.ok ? t('admin.saved') : (await res.json().catch(() => ({}))).error || t('admin.error'));
  }

  return (
    <form onSubmit={submit} className="space-y-4 border border-ivory/10 bg-surface p-6">
      <h2 className="font-display text-3xl italic">{t('admin.bioSection')}</h2>
      {[['bio', 'admin.bioAz'], ['bio_ru', 'admin.bioRu'], ['bio_en', 'admin.bioEn']].map(([k, l]) => (
        <div key={k}><label className="label">{t(l)}</label><textarea className="input" rows={4} required={k === 'bio'} value={f[k]} onChange={set(k)} /></div>
      ))}
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label">{t('admin.contactEmail')}</label><input className="input" type="email" value={f.email} onChange={set('email')} /></div>
        <div><label className="label">Instagram URL</label><input className="input" value={f.instagram_url} onChange={set('instagram_url')} placeholder="https://instagram.com/..." /></div>
      </div>
      <div><label className="label">{t('admin.avatar')}</label><input type="file" accept="image/jpeg,image/png,image/webp" className="text-sm text-ivory/60" onChange={(e) => setAvatar(e.target.files[0] || null)} /></div>
      <div className="flex items-center gap-4"><button className="btn-gold" disabled={busy}>{busy ? t('admin.saving') : t('admin.save')}</button>{msg && <span className="text-sm text-gold">{msg}</span>}</div>
    </form>
  );
}

export default function Dashboard() {
  const { t } = useI18n();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [modal, setModal] = useState(undefined); // undefined = closed, null = new, object = edit
  const [ts, setTs] = useState(Date.now());

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/paintings');
    if (r.status === 401) return router.push('/admin/login');
    setData(await r.json()); setTs(Date.now());
  }, [router]);
  useEffect(() => { load(); }, [load]);

  async function toggleSale(p) {
    const fd = new FormData(); fd.set('is_for_sale', String(!p.is_for_sale));
    await fetch(`/api/admin/paintings/${p.id}`, { method: 'PUT', body: fd }); load();
  }
  async function remove(p) {
    if (!confirm(t('admin.confirmDelete'))) return;
    await fetch(`/api/admin/paintings/${p.id}`, { method: 'DELETE' }); load();
  }
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' }); router.push('/admin/login'); router.refresh();
  }

  const s = data?.stats;
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:space-y-10 sm:px-6 sm:py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl italic sm:text-5xl">{t('admin.title')}</h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LangSwitcher />
          <Link href="/" className="btn-ghost flex items-center gap-2"><ExternalLink size={14} /> {t('admin.viewSite')}</Link>
          <button onClick={logout} className="btn-ghost flex items-center gap-2"><LogOut size={14} /> {t('admin.logout')}</button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Palette} label={t('admin.statTotal')} value={s?.total} />
        <StatCard icon={Heart} label={t('admin.statLikes')} value={s?.likes} />
        <StatCard icon={Eye} label={t('admin.statViews')} value={s?.views} />
        <StatCard icon={Tag} label={t('admin.statSale')} value={s?.for_sale} />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-3xl italic">{t('admin.paintings')}</h2>
          <button className="btn-gold flex items-center gap-2" onClick={() => setModal(null)}><Plus size={16} /> {t('admin.add')}</button>
        </div>
        <div className="overflow-x-auto border border-ivory/10 bg-surface">
          <table className="w-full text-sm">
            <tbody>
              {data?.paintings.map((p) => (
                <tr key={p.id} className="border-b border-ivory/5 last:border-0">
                  <td className="w-20 p-2 sm:w-24 sm:p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/paintings/${p.id}/image?v=${ts}`} alt="" loading="lazy" className="h-14 w-16 object-cover sm:h-16 sm:w-20" />
                  </td>
                  <td className="p-3"><p className="font-medium">{p.title || t('common.untitled')}</p><p className="text-xs text-ivory/40">{p.medium}</p></td>
                  <td className="hidden whitespace-nowrap p-3 text-ivory/50 sm:table-cell"><Heart size={13} className="mr-1 inline" />{p.likes_count} <Eye size={13} className="ml-3 mr-1 inline" />{p.views_count}</td>
                  <td className="p-3"><Switch checked={!!p.is_for_sale} onChange={() => toggleSale(p)} label={t('admin.fSale')} /></td>
                  <td className="whitespace-nowrap p-3 text-right">
                    <button onClick={() => setModal(p)} className="mr-2 rounded-full p-2 hover:bg-ivory/10" aria-label={t('admin.edit')}><Pencil size={15} /></button>
                    <button onClick={() => remove(p)} className="rounded-full p-2 text-red-400 hover:bg-red-400/10" aria-label={t('admin.delete')}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data && data.paintings.length === 0 && <p className="p-8 text-center text-ivory/40">{t('gallery.empty')}</p>}
        </div>
      </section>

      <BioEditor />
      <AnimatePresence>
        {modal !== undefined && <PaintingModal key={modal?.id ?? 'new'} painting={modal} onClose={() => setModal(undefined)} onSaved={() => { setModal(undefined); load(); }} />}
      </AnimatePresence>
    </div>
  );
}
