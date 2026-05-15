import { useCallback, useEffect, useRef, useState } from 'react';

const notes = [523.25, 659.25, 783.99, 987.77, 880, 783.99, 659.25, 587.33];
const musicFile = '/audio/cornfield-chase.mp3';

function startSynthMusic() {
  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContextClass) return () => {};

  const context = new AudioContextClass();
  const master = context.createGain();
  const delay = context.createDelay();
  const feedback = context.createGain();
  const filter = context.createBiquadFilter();

  master.gain.value = 0.045;
  delay.delayTime.value = 0.22;
  feedback.gain.value = 0.28;
  filter.type = 'lowpass';
  filter.frequency.value = 2200;

  master.connect(filter);
  filter.connect(context.destination);
  master.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(filter);

  let step = 0;
  let stopped = false;

  function playNote() {
    if (stopped) return;

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const frequency = notes[step % notes.length];

    oscillator.type = step % 4 === 0 ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.detune.setValueAtTime(step % 3 === 0 ? 5 : -4, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.32, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);

    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(now);
    oscillator.stop(now + 0.62);

    step += 1;
  }

  void context.resume().then(playNote);
  const timer = window.setInterval(playNote, 720);

  return () => {
    stopped = true;
    window.clearInterval(timer);
    void context.close();
  };
}

export function useAmbientMusic(isPlaying: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [source, setSource] = useState<'track' | 'synth' | 'idle'>('idle');

  useEffect(() => {
    if (!isPlaying) {
      setCurrentTime(0);
      setDuration(0);
      setSource('idle');
      return;
    }

    let cleanup = () => {};
    let didFallback = false;
    const audio = new Audio(musicFile);
    audioRef.current = audio;
    audio.loop = true;
    audio.volume = 0.45;
    audio.preload = 'auto';

    function fallbackToSynth() {
      if (didFallback) return;
      didFallback = true;
      setSource('synth');
      setCurrentTime(0);
      setDuration(0);
      cleanup = startSynthMusic();
    }

    function updateProgress() {
      setCurrentTime(audio.currentTime);
    }

    function updateDuration() {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    }

    function markTrackReady() {
      if (!didFallback) {
        setSource('track');
      }
    }

    audio.addEventListener('error', fallbackToSynth);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('playing', markTrackReady);
    void audio.play().catch(fallbackToSynth);

    return () => {
      audio.pause();
      audioRef.current = null;
      audio.removeEventListener('error', fallbackToSynth);
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('playing', markTrackReady);
      cleanup();
    };
  }, [isPlaying]);

  const seek = useCallback(
    (nextTime: number) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      audio.currentTime = Math.min(duration, Math.max(0, nextTime));
      setCurrentTime(audio.currentTime);
    },
    [duration],
  );

  return { currentTime, duration, source, seek };
}
