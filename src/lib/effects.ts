export let audioCtx: AudioContext | null = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playEffect(type: 'coin' | 'success' | 'chest-shake' | 'chest-burst' | 'click' | 'error' | 'tier-switch' | 'magic') {
  try {
    // Attempt haptics if supported
    if ('vibrate' in navigator) {
      if (type === 'coin' || type === 'click' || type === 'tier-switch') navigator.vibrate(20);
      else if (type === 'success' || type === 'magic') navigator.vibrate([100, 50, 100]);
      else if (type === 'chest-shake') navigator.vibrate(40);
      else if (type === 'chest-burst') navigator.vibrate([200, 100, 200, 100, 400]);
      else if (type === 'error') navigator.vibrate([50, 100, 50]);
    }

    const ctx = initAudio();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'coin') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(2000, t + 0.1);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, t); // A4
      osc.frequency.setValueAtTime(554.37, t + 0.1); // C#5
      osc.frequency.setValueAtTime(659.25, t + 0.2); // E5
      osc.frequency.setValueAtTime(880, t + 0.3); // A5
      
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
      osc.start(t);
      osc.stop(t + 0.8);
    } else if (type === 'chest-shake') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, t);
      osc.frequency.linearRampToValueAtTime(150, t + 0.1);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    } else if (type === 'chest-burst') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.4);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
      osc.start(t);
      osc.stop(t + 0.6);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
      osc.start(t);
      osc.stop(t + 0.05);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(100, t + 0.2);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
      osc.start(t);
      osc.stop(t + 0.3);
    } else if (type === 'tier-switch') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    } else if (type === 'magic') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, t); // A5
      osc.frequency.setValueAtTime(1108.73, t + 0.1); // C#6
      osc.frequency.setValueAtTime(1318.51, t + 0.2); // E6
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
      osc.start(t);
      osc.stop(t + 0.6);
    }
  } catch (e) {
    // Silently ignore if audio context blocked or unsupported
  }
}
