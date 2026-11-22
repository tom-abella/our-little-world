let ctx = null;
let master = null;
let timer = null;
let step = 0;
let noiseBuffer = null;

// The hub/prologue keeps the gentle music-box loop.
const DEFAULT_TRACK = {
  id: "default",
  stepMs: 480,
  stepsPerBar: 4,
  melody: [
    659.25, 783.99, 1046.5, 783.99,
    880.0, 659.25, 523.25, 659.25,
    698.46, 880.0, 1046.5, 880.0,
    783.99, 987.77, 1174.66, 987.77,
  ],
  chords: [
    [261.63, 329.63, 392.0], // C
    [220.0, 261.63, 329.63], // Am
    [174.61, 220.0, 261.63], // F
    [196.0, 246.94, 293.66], // G
  ],
  bass: [130.81, 110.0, 87.31, 98.0],
  style: "musicbox",
};

// Month 1: an original, slow R&B-flavoured loop (no vocals).
const MONTH_ONE_TRACK = {
  id: "monthOne",
  stepMs: 375, // 8th notes at ~80 BPM
  stepsPerBar: 8,
  melody: [
    349.23, null, 440.0, null, 523.25, null, 440.0, null,
    392.0, null, 493.88, null, 587.33, null, 493.88, null,
    329.63, null, 392.0, null, 493.88, null, 392.0, null,
    523.25, null, 493.88, null, 440.0, null, 392.0, null,
  ],
  chords: [
    [146.83, 174.61, 220.0, 261.63, 329.63], // Dm9
    [196.0, 246.94, 293.66, 349.23], // G7
    [130.81, 164.81, 196.0, 246.94, 293.66], // Cmaj9
    [110.0, 130.81, 164.81, 196.0, 246.94], // Am9
  ],
  bass: [73.42, 98.0, 65.41, 55.0],
  style: "chill",
};

const TRACKS = {
  default: DEFAULT_TRACK,
  monthOne: MONTH_ONE_TRACK,
};

let currentTrack = DEFAULT_TRACK;

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

// Rounder electric-piano style lead for the Month 1 track.
function ep(freq, at, dur, vol) {
  note(freq, at, dur, "triangle", vol, 0.015);
  note(freq * 2, at, dur * 0.5, "sine", vol * 0.16, 0.015);
}

function getNoise() {
  if (noiseBuffer) return noiseBuffer;
  const length = Math.floor(ctx.sampleRate * 2);
  noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return noiseBuffer;
}

function noiseHit(at, dur, vol, freq, type) {
  const src = ctx.createBufferSource();
  src.buffer = getNoise();
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = 0.7;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(vol, at + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(filter).connect(gain).connect(master);
  src.start(at, Math.random() * 1.2);
  src.stop(at + dur + 0.02);
}

function kick(at) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(120, at);
  osc.frequency.exponentialRampToValueAtTime(45, at + 0.12);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(0.03, at + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.28);
  osc.connect(gain).connect(master);
  osc.start(at);
  osc.stop(at + 0.3);
}

function snare(at) {
  noiseHit(at, 0.12, 0.012, 1800, "bandpass");
  note(190, at, 0.09, "triangle", 0.006, 0.005);
}

function playStep() {
  if (!ctx || ctx.state !== "running") return;
  const track = currentTrack;
  const at = ctx.currentTime + 0.03;
  const bar = Math.floor(step / track.stepsPerBar) % track.chords.length;
  const stepInBar = step % track.stepsPerBar;
  const barSeconds = (track.stepMs * track.stepsPerBar) / 1000;

  if (track.style === "chill") {
    if (stepInBar === 0) {
      chord(track.chords[bar], at, barSeconds * 0.98, 0.008);
      note(track.bass[bar], at, barSeconds * 0.92, "sine", 0.016, 0.06);
    }
    if (stepInBar === 4) {
      note(track.bass[bar] * 1.5, at, 0.55, "sine", 0.008, 0.04);
    }

    const melody = track.melody[step % track.melody.length];
    if (melody) ep(melody, at, 0.9, 0.014);

    if (stepInBar === 0 || stepInBar === 4) kick(at);
    if (stepInBar === 2 || stepInBar === 6) snare(at);
    noiseHit(at, 0.035, stepInBar % 2 === 0 ? 0.006 : 0.004, 7500, "highpass");
  } else {
    bell(track.melody[step % track.melody.length], at, 1.0, 0.028);
    if (stepInBar === 0) {
      chord(track.chords[bar], at, barSeconds * 1.05, 0.012);
      note(track.bass[bar], at, barSeconds * 1.05, "sine", 0.018, 0.5);
    }
  }

  step++;
}

function begin() {
  if (timer) return;
  timer = setInterval(playStep, currentTrack.stepMs);
}

export function setMusicTrack(id) {
  const next = TRACKS[id];
  if (!next || next === currentTrack) return;
  currentTrack = next;
  step = 0;
  if (timer) {
    clearInterval(timer);
    timer = null;
    begin();
  }
}

export function startMusic() {
  if (typeof window === "undefined") return;
  if (!ctx) setup();
  if (!ctx) return;
  if (timer) return;

  if (ctx.state === "running") {
    begin();
    return;
  }

  // Autoplay policies keep the context suspended until the first gesture.
  // Try to resume now; if the browser blocks it, the next call starts it.
  const resumed = ctx.resume();
  if (resumed?.then) {
    resumed
      .then(() => {
        if (ctx.state === "running") begin();
      })
      .catch(() => {});
  }
}

export function stopMusic() {
  if (timer) clearInterval(timer);
  timer = null;
}
