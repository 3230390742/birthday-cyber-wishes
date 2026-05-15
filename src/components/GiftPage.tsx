import { motion } from 'framer-motion';
import { Copy, Download, Gift, Send, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { randomGift } from '../data';
import type { GiftCard } from '../types';

export function GiftPage({
  gift,
  onSendAnother,
}: {
  gift: GiftCard | null;
  onSendAnother: () => void;
}) {
  const fallback = useMemo(() => randomGift('preview'), []);
  const card = gift ?? fallback;
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function saveCard() {
    const content = `感谢你的祝福！\n称号：${card.title}\n${card.blessing}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'birthday-return-card.txt';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid w-full place-items-center py-6">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
        <motion.section
          initial={{ rotateX: 18, scale: 0.92 }}
          animate={{ rotateX: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-lg border border-warm/30 bg-[linear-gradient(135deg,rgba(34,211,238,.14),rgba(255,94,168,.12),rgba(255,209,102,.16))] p-6 shadow-warm backdrop-blur-xl sm:p-9"
        >
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-neonBlue/30" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full border border-candy/25" />
          <div className="relative">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm text-white/70">
                <Sparkles size={16} className="text-warm" /> 回礼卡片已生成
              </div>
              <Gift className="text-warm" size={34} />
            </div>

            <div className="space-y-5">
              <h2 className="text-4xl font-black leading-tight sm:text-6xl">感谢你的祝福！</h2>
              <div className="rounded-lg border border-neonBlue/25 bg-black/30 p-5 shadow-neon">
                <div className="text-sm text-neonBlue">你的随机称号</div>
                <div className="mt-2 text-3xl font-black text-warm">{card.title}</div>
              </div>
              <p className="rounded-lg border border-white/10 bg-white/[0.06] p-5 text-lg leading-8 text-white/82">
                {card.blessing}
              </p>
            </div>
          </div>
        </motion.section>

        <aside className="rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-neon backdrop-blur-xl">
          <h3 className="text-2xl font-black">回礼操作</h3>
          <p className="mt-2 leading-7 text-white/62">
            可以保存这张回礼卡的文字版，或复制当前祝福链接发给朋友。
          </p>
          <div className="mt-5 grid gap-3">
            <button
              onClick={saveCard}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-neonBlue px-5 py-3 font-black text-night shadow-neon transition hover:scale-[1.02]"
            >
              <Download size={18} /> 保存卡片
            </button>
            <button
              onClick={copyLink}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-candy/40 bg-candy/15 px-5 py-3 font-black text-white transition hover:bg-candy hover:text-white"
            >
              <Copy size={18} /> {copied ? '已复制' : '复制祝福链接'}
            </button>
            <button
              onClick={onSendAnother}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 font-black text-white/80 transition hover:border-warm/50 hover:text-warm"
            >
              <Send size={18} /> 再送一条祝福
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
