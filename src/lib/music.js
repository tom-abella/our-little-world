let ctx = null;
let timer = null;
let step = 0;

const MELODY = [
  523.25, 659.25, 783.99, 987.77, 880.0, 783.99, 659.25, 587.33, 523.25,
  659.25, 783.99, 1046.5, 880.0, 783.99, 659.25, 587.33,
];
const BASS = [261.63, 220.0, 174.61, 196.0];

function note(freq, at, dur, type, vol) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(vol, at + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

export function startMusic() {
  if (typeof window === "undefined") return;
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") ctx.resume();
  if (timer) return;
  timer = setInterval(() => {
    const at = ctx.currentTime + 0.02;
    note(MELODY[step % MELODY.length], at, 0.42, "triangle", 0.045);
    if (step % 2 === 0) {
      note(BASS[(step / 2) % BASS.length], at, 0.7, "sine", 0.04);
    }
    step++;
  }, 320);
}

export function stopMusic() {
  if (timer) clearInterval(timer);
  timer = null;
}
