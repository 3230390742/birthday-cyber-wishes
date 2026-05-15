import { useEffect } from 'react';

const notes = [523.25, 659.25, 783.99, 987.77, 880, 783.99, 659.25, 587.33];

export function useAmbientMusic(isPlaying: boolean) {
  useEffect(() => {
    if (!isPlaying) return;

    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextClass) return;

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
  }, [isPlaying]);
}
