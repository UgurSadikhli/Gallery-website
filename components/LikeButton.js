'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const KEY = 'liked_paintings';
const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const write = (ids) => { try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch {} };

export default function LikeButton({ id, initialCount = 0, className = '' }) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [pop, setPop] = useState(0);
  useEffect(() => setLiked(read().includes(id)), [id]);

  async function onClick(e) {
    e.preventDefault(); e.stopPropagation();
    if (liked) return;
    setLiked(true); setCount((c) => c + 1); setPop((p) => p + 1); // optimistic
    write([...new Set([...read(), id])]);
    const undo = (keepLiked) => {
      setCount((c) => c - 1);
      if (!keepLiked) { setLiked(false); write(read().filter((x) => x !== id)); }
    };
    try {
      const res = await fetch(`/api/paintings/${id}/like`, { method: 'POST' });
      if (res.ok) setCount((await res.json()).likes_count);
      else if (res.status === 409) undo(true);
      else undo(false);
    } catch { undo(false); }
  }

  return (
    <button onClick={onClick} aria-label="Like" aria-pressed={liked} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${className}`}>
      <motion.span key={pop} animate={pop ? { scale: [1, 1.7, 0.9, 1] } : {}} transition={{ duration: 0.45 }} className="inline-flex">
        <Heart size={17} className={liked ? 'fill-gold text-gold' : ''} />
      </motion.span>
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
