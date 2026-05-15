import { motion } from 'framer-motion';
import { Cake, Gift, Rocket, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BIRTHDAY_TARGET } from '../data';
import type { Wish } from '../types';

function getTimeLeft() {
  const diff = Math.max(0, new Date(BIRTHDAY_TARGET).getTime() - Date.now());
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;
  return {
    days: Math.floor(diff / day),
    hours: Math.floor((diff % day) / hour),
    minutes: Math.floor((diff % hour) / minute),
    seconds: Math.floor((diff % minute) / 1000),
  };
}

export function HomePage({
  wishes,
  energy,
  onEnter,
}: {
  wishes: Wish[];
  energy: number;
  onEnter: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const blocks = [
    ['天', timeLeft.days],
    ['时', timeLeft.hours],
    ['分', timeLeft.minutes],
    ['秒', timeLeft.seconds],
  ];

  return (
    <div className="grid w-full content-center gap-8 py-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
      <section className="space-y-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-warm/30 bg-warm/10 px-4 py-2 text-sm font-semibold text-warm shadow-warm">
          <Star size={16} /> 5 月 16 日生日信号已锁定
        </div>
        <div className="space-y-5">
          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-normal text-white sm:text-6xl lg:text-7xl">
            生日宇宙
            <span className="block text-transparent bg-clip-text bg-[linear-gradient(90deg,#22d3ee,#ff5ea8,#ffd166)]">
              祝福发射站
            </span>
          </h1>
          <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
            收集每一条祝福，把它们点亮成漂浮星星。提交祝福后，你会收到一张专属回礼卡片。
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:max-w-xl">
          {blocks.map(([label, value]) => (
            <motion.div
              key={label}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-lg border border-white/10 bg-white/[0.06] p-3 text-center shadow-neon backdrop-blur-md sm:p-4"
            >
              <div className="text-3xl font-black text-neonBlue sm:text-4xl">{String(value).padStart(2, '0')}</div>
              <div className="mt-1 text-sm text-white/60">{label}</div>
            </motion.div>
          ))}
        </div>

        <div className="max-w-xl rounded-lg border border-white/10 bg-black/25 p-4 backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-white/80">祝福能量</span>
            <span className="text-warm">{wishes.length} 条祝福</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#a855f7,#ff5ea8,#ffd166)]"
              initial={{ width: 0 }}
              animate={{ width: `${energy}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 0 34px rgba(34, 211, 238, .62)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onEnter}
          className="inline-flex items-center gap-3 rounded-full bg-neonBlue px-7 py-4 font-black text-night shadow-neon transition"
        >
          <Rocket size={20} /> 进入生日宇宙
        </motion.button>
      </section>

      <motion.section
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative min-h-[390px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] p-6 shadow-neon backdrop-blur-xl"
      >
        <div className="absolute inset-6 rounded-full border border-neonBlue/25" />
        <div className="absolute inset-16 rounded-full border border-candy/20" />
        <div className="relative grid h-full min-h-[340px] place-items-center">
          <div className="relative grid h-52 w-52 place-items-center rounded-full bg-[radial-gradient(circle,#ffd166_0%,#ff5ea8_45%,#36164f_72%,transparent_73%)] shadow-warm">
            <Cake className="text-night" size={86} />
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-10 rounded-full border-2 border-dashed border-neonBlue/45"
            />
          </div>
          <Gift className="absolute left-8 top-10 text-warm" size={42} />
          <Star className="absolute bottom-10 right-10 text-neonBlue" size={38} />
          <Star className="absolute right-16 top-16 text-candy" size={24} />
        </div>
      </motion.section>
    </div>
  );
}
