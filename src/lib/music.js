let ctx = null;
let master = null;
let timer = null;
let step = 0;

// A slow, music-box style loop in C major: C - Am - F - G.
const MELODY = [
  659.25, 783.99, 1046.5, 783.99,
  880.0, 659.25, 523.25, 659.25,
  698.46, 880.0, 1046.5, 880.0,
  783.99, 987.77, 1174.66, 987.77,
];
const CHORDS = [
  [261.63, 329.63, 392.0], // C
  [220.0, 261.63, 329.63], // Am
  [174.61, 220.0, 261.63], // F
  [196.0, 246.94, 293.66], // G
];
const BASS = [130.81, 110.0, 87.31, 98.0];
const STEP_MS = 480;
const STEPS_PER_BAR = 4;

function setup() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  ctx = new AudioCtx();
  master = ctx.createGain();
  master.gain.value = 0.9;
  const warmth = ctx.createBiquadFilter();
  warmth.type = "lowpass";
  warmth.frequency.value = 2400;
  warmth.Q.value = 0.2;
  master.connect(warmth).connect(ctx.destination);
}

function note(freq, at, dur, type, vol, attack = 0.02) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(vol, at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain).connect(master);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

// Soft bell: a sine with a quiet octave shimmer on top.
function bell(freq, at, dur, vol) {
  note(freq, at, dur, "sine", vol, 0.015);
  note(freq * 2, at, dur * 0.6, "sine", vol * 0.22, 0.015);
}

function chord(freqs, at, dur, vol) {
  for (const freq of freqs) note(freq, at, dur, "sine", vol, 0.7);
}

export function startMusic() {
  if (typeof window === "undefined") return;
  if (!ctx) setup();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();
  if (timer) return;
  timer = setInterval(() => {
    const at = ctx.currentTime + 0.03;
    const bar = Math.floor(step / STEPS_PER_BAR) % CHORDS.length;
    bell(MELODY[step % MELODY.length], at, 1.0, 0.028);
    if (step % STEPS_PER_BAR === 0) {
      const barSeconds = (STEP_MS * STEPS_PER_BAR) / 1000;
      chord(CHORDS[bar], at, barSeconds * 1.05, 0.012);
      note(BASS[bar], at, barSeconds * 1.05, "sine", 0.018, 0.5);
    }
    step++;
  }, STEP_MS);
}

export function stopMusic() {
  if (timer) clearInterval(timer);
  timer = null;
}
