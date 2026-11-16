let ctx = null;
let master = null;

function ensure() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function blip(at, freq, dur, vol, type) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(vol, at + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain).connect(master);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

// A soft two-note chirp played whenever a new dialogue line appears.
export function playDialogueBlip() {
  const audio = ensure();
  if (!audio) return;
  const at = audio.currentTime + 0.01;
  blip(at, 783.99, 0.055, 0.06, "triangle");
  blip(at + 0.065, 1046.5, 0.075, 0.045, "triangle");
}

// Call once from a click to unlock audio on stricter browsers.
export function unlockSfx() {
  ensure();
}
