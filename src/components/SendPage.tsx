import { motion } from 'framer-motion';
import { Cake, Send, Sparkles } from 'lucide-react';
import { FormEvent, useState } from 'react';
import type { Wish, WishType } from '../types';

const types: WishType[] = ['朋友', '家人', '同学', '神秘人'];

export function SendPage({ onSubmit }: { onSubmit: (wish: Omit<Wish, 'id' | 'createdAt'>) => void | Promise<void> }) {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<WishType>('朋友');
  const [burst, setBurst] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!nickname.trim() || !message.trim() || isSubmitting) return;
    setSubmitError(null);
    setIsSubmitting(true);
    setBurst(true);
    window.setTimeout(async () => {
      try {
        await onSubmit({ nickname: nickname.trim(), message: message.trim(), type });
      } catch (error) {
        setBurst(false);
        setIsSubmitting(false);
        const message = error instanceof Error ? error.message : '未知错误';
        setSubmitError(`提交失败：${message}`);
      }
    }, 650);
  }

  return (
    <div className="grid w-full place-items-center py-6">
      <form
        onSubmit={submit}
        className="relative w-full max-w-3xl overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-neon backdrop-blur-xl sm:p-8"
      >
        <div className="mb-7 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-warm/20 text-warm shadow-warm">
            <Cake size={24} />
          </span>
          <div>
            <h2 className="text-3xl font-black">发送祝福</h2>
            <p className="mt-1 text-white/60">把你的祝福写进生日宇宙。</p>
          </div>
        </div>

        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-white/75">昵称</span>
            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              maxLength={20}
              className="rounded-lg border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-neonBlue focus:shadow-neon"
              placeholder="例如：小星星"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-white/75">祝福内容</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={180}
              rows={6}
              className="resize-none rounded-lg border border-white/10 bg-black/35 px-4 py-3 leading-7 text-white outline-none transition placeholder:text-white/30 focus:border-neonBlue focus:shadow-neon"
              placeholder="写下你想送给寿星的话..."
            />
          </label>

          <div className="grid gap-2">
            <span className="text-sm font-semibold text-white/75">祝福类型</span>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {types.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setType(item)}
                  className={`rounded-full border px-4 py-3 font-semibold transition ${
                    type === item
                      ? 'border-neonBlue bg-neonBlue text-night shadow-neon'
                      : 'border-white/10 bg-white/[0.04] text-white/70 hover:border-candy/50 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!nickname.trim() || !message.trim() || isSubmitting}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#22d3ee,#ff5ea8,#ffd166)] px-6 py-4 font-black text-night shadow-neon transition disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Send size={19} /> {isSubmitting ? '正在发送祝福...' : '提交并生成回礼卡片'}
        </motion.button>

        {submitError && <p className="mt-3 text-center text-sm text-candy">{submitError}</p>}

        {burst && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            {Array.from({ length: 28 }, (_, index) => (
              <motion.span
                key={index}
                className="absolute h-2 w-2 rounded-full bg-warm shadow-warm"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(index) * (90 + (index % 6) * 22),
                  y: Math.sin(index) * (90 + (index % 6) * 22),
                  opacity: 0,
                  scale: 0.2,
                }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            ))}
            <Sparkles className="text-warm" size={72} />
          </div>
        )}
      </form>
    </div>
  );
}
