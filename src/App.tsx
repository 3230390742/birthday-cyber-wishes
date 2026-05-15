import { AnimatePresence, motion } from 'framer-motion';
import { Gift, Home, Music, Music2, Send, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Background } from './components/Background';
import { GiftPage } from './components/GiftPage';
import { HallPage } from './components/HallPage';
import { HomePage } from './components/HomePage';
import { SendPage } from './components/SendPage';
import { randomGift } from './data';
import { useAmbientMusic } from './hooks/useAmbientMusic';
import { useWishes } from './hooks/useWishes';
import type { GiftCard, Page } from './types';

const pageMotion = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

function App() {
  const { wishes, energy, addWish, isLoading, error } = useWishes();
  const [page, setPage] = useState<Page>('home');
  const [musicOn, setMusicOn] = useState(false);
  const [gift, setGift] = useState<GiftCard | null>(null);
  useAmbientMusic(musicOn);

  const navItems = useMemo(
    () => [
      { page: 'home' as Page, label: '首页', icon: Home },
      { page: 'hall' as Page, label: '大厅', icon: Sparkles },
      { page: 'send' as Page, label: '祝福', icon: Send },
      { page: 'gift' as Page, label: '回礼', icon: Gift },
    ],
    [],
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-night text-white">
      <Background musicOn={musicOn} />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-5 flex items-center justify-between gap-3 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 shadow-neon backdrop-blur-xl sm:px-5">
          <button
            onClick={() => setPage('home')}
            className="flex min-w-0 items-center gap-2 rounded-full px-2 py-2 text-left transition hover:bg-white/10"
            aria-label="回到首页"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-candy/20 text-warm shadow-warm">
              <Gift size={20} />
            </span>
            <span className="hidden font-semibold tracking-wide sm:block">生日宇宙祝福站</span>
          </button>

          <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-black/20 p-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.page}
                  onClick={() => setPage(item.page)}
                  className={`relative grid h-10 w-10 place-items-center rounded-full transition sm:w-auto sm:px-4 ${
                    page === item.page ? 'text-night' : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-label={item.label}
                  title={item.label}
                >
                  {page === item.page && (
                    <motion.span
                      layoutId="active-nav"
                      className="absolute inset-0 rounded-full bg-neonBlue shadow-neon"
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon size={18} />
                    <span className="hidden text-sm font-semibold sm:inline">{item.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => setMusicOn((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-neonBlue transition hover:border-neonBlue/60 hover:bg-neonBlue/15"
            aria-label={musicOn ? '关闭背景音乐' : '开启背景音乐'}
            title={musicOn ? '关闭背景音乐' : '开启背景音乐'}
          >
            {musicOn ? <Music2 size={18} /> : <Music size={18} />}
          </button>
        </header>

        {(isLoading || error) && (
          <div className="mb-4 rounded-lg border border-white/10 bg-black/35 px-4 py-3 text-sm text-white/72 shadow-neon backdrop-blur-xl">
            {isLoading ? '正在连接生日祝福服务器...' : error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.section
            key={page}
            {...pageMotion}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex flex-1"
          >
            {page === 'home' && <HomePage wishes={wishes} energy={energy} onEnter={() => setPage('hall')} />}
            {page === 'hall' && <HallPage wishes={wishes} musicOn={musicOn} onSend={() => setPage('send')} />}
            {page === 'send' && (
              <SendPage
                onSubmit={async (wish) => {
                  const saved = await addWish(wish);
                  setGift(randomGift(saved.id));
                  setPage('gift');
                }}
              />
            )}
            {page === 'gift' && <GiftPage gift={gift} onSendAnother={() => setPage('send')} />}
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}

export default App;
