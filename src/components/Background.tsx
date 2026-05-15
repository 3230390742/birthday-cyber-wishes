import { motion } from 'framer-motion';

const particles = Array.from({ length: 48 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 61) % 100}%`,
  delay: (index % 9) * 0.35,
  size: 2 + (index % 4),
}));

export function Background({ musicOn }: { musicOn: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.22),transparent_28%),radial-gradient(circle_at_78%_22%,rgba(255,94,168,0.18),transparent_24%),radial-gradient(circle_at_50%_90%,rgba(255,209,102,0.12),transparent_26%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(34,211,238,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,.25)_1px,transparent_1px)] [background-size:48px_48px]" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
        className="absolute -left-36 top-16 h-80 w-80 rounded-full border border-neonBlue/25"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 62, repeat: Infinity, ease: 'linear' }}
        className="absolute -right-24 bottom-10 h-96 w-96 rounded-full border border-candy/20"
      />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,.8)]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.25, 1, 0.25],
            scale: [1, 1.6, 1],
          }}
          transition={{ duration: 3.5 + (particle.id % 5), delay: particle.delay, repeat: Infinity }}
        />
      ))}
      {musicOn && (
        <div className="absolute bottom-8 left-8 flex h-12 items-end gap-1 opacity-70">
          {[18, 32, 24, 42, 28].map((height, index) => (
            <motion.span
              key={height}
              className="w-1.5 rounded-full bg-neonBlue shadow-neon"
              animate={{ height: [10, height, 14] }}
              transition={{ duration: 0.8, delay: index * 0.1, repeat: Infinity }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
