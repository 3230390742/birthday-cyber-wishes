import { Music2 } from 'lucide-react';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${rest}`;
}

export function MusicProgress({
  currentTime,
  duration,
  source,
  onSeek,
}: {
  currentTime: number;
  duration: number;
  source: 'track' | 'synth' | 'idle';
  onSeek: (time: number) => void;
}) {
  const canSeek = source === 'track' && duration > 0;
  const progress = canSeek ? (currentTime / duration) * 100 : 0;

  return (
    <div className="hidden min-w-[230px] max-w-xs flex-1 items-center gap-3 rounded-full border border-neonBlue/20 bg-black/25 px-3 py-2 shadow-[0_0_18px_rgba(34,211,238,.16)] backdrop-blur-md md:flex">
      <Music2 size={16} className={source === 'track' ? 'text-warm' : 'text-neonBlue'} />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-3 text-[11px] text-white/52">
          <span className="truncate">{source === 'track' ? 'Cornfield Chase' : '生日宇宙氛围音'}</span>
          <span className="shrink-0">
            {formatTime(currentTime)} / {canSeek ? formatTime(duration) : '--:--'}
          </span>
        </div>
        <div className="relative h-3">
          <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/12" />
          <div
            className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,#22d3ee,#ff5ea8,#ffd166)] shadow-neon"
            style={{ width: `${progress}%` }}
          />
          <input
            aria-label="音乐播放进度"
            disabled={!canSeek}
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={canSeek ? currentTime : 0}
            onChange={(event) => onSeek(Number(event.target.value))}
            className="music-range absolute inset-0 h-3 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
