import { AnimatePresence, motion } from 'framer-motion';
import { Gift, MessageCircle, Send, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';
import type { Wish } from '../types';

const iconMap = [Star, MessageCircle, Gift, Sparkles];
const colors = ['border-neonBlue/50 text-neonBlue', 'border-candy/50 text-candy', 'border-warm/50 text-warm'];

export function HallPage({
  wishes,
  musicOn,
  onSend,
}: {
  wishes: Wish[];
  musicOn: boolean;
  onSend: () => void;
}) {
  const [selected, setSelected] = useState<Wish | null>(null);

  return (
    <div className="grid w-full gap-5 py-4 lg:grid-cols-[1fr_340px]">
      <section className="relative min-h-[620px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-neon backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(34,211,238,.14),transparent_34%)]" />
        {wishes.map((wish, index) => {
          const Icon = iconMap[index % iconMap.length];
          const left = 8 + ((index * 23) % 78);
          const top = 10 + ((index * 31) % 74);
          return (
            <motion.button
              key={wish.id}
              onClick={() => setSelected(wish)}
              className={`absolute flex max-w-[170px] items-center gap-2 rounded-full border bg-black/35 px-3 py-2 text-left text-sm shadow-neon backdrop-blur-md transition hover:bg-white/10 ${colors[index % colors.length]}`}
              style={{ left: `${left}%`, top: `${top}%` }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1, y: [0, -10 - (index % 4) * 3, 0] }}
              transition={{
                opacity: { duration: 0.35, delay: index * 0.04 },
                scale: { duration: 0.35, delay: index * 0.04 },
                y: { duration: 3.5 + (index % 4), repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <Icon size={18} className="shrink-0" />
              <span className="truncate font-semibold">{wish.nickname}</span>
            </motion.button>
          );
        })}
        <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/70 backdrop-blur-md">
          祝福大厅 · {wishes.length} 个光点
        </div>
      </section>

      <aside className="flex flex-col gap-4">
        <div className="rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-neon backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-black">当前频道</h2>
            <span className={`h-3 w-3 rounded-full ${musicOn ? 'bg-neonBlue shadow-neon' : 'bg-white/25'}`} />
          </div>
          <p className="leading-7 text-white/68">
            点击漂浮的祝福光点可以展开内容。背景音乐开关在顶部右侧。
          </p>
          <button
            onClick={onSend}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-candy px-5 py-3 font-black text-white shadow-[0_0_24px_rgba(255,94,168,.38)] transition hover:scale-[1.02] hover:bg-warm hover:text-night"
          >
            <Send size={18} /> 发送我的祝福
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected?.id ?? 'empty'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-[260px] rounded-lg border border-neonBlue/25 bg-black/35 p-5 shadow-neon backdrop-blur-xl"
          >
            {selected ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-neonBlue">{selected.type}</div>
                  <h3 className="mt-1 text-2xl font-black">{selected.nickname}</h3>
                </div>
                <p className="whitespace-pre-wrap rounded-lg border border-white/10 bg-white/[0.05] p-4 leading-8 text-white/82">
                  {selected.message}
                </p>
                <div className="text-xs text-white/45">{new Date(selected.createdAt).toLocaleString('zh-CN')}</div>
              </div>
            ) : (
              <div className="grid min-h-[220px] place-items-center text-center text-white/58">
                <div>
                  <Sparkles className="mx-auto mb-3 text-warm" size={34} />
                  选择一个漂浮光点查看祝福
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </aside>
    </div>
  );
}
