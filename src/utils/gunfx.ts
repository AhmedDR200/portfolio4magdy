// The intro's sounds, made in the browser with the Web Audio API (no sound
// files), on the same beats as RDR2's opening: two shells clinking as they're
// loaded, the breech of a double-barrel snapping shut, and a shot that rolls
// away as an echo across open country. Everything goes through a compressor so
// the shot is loud without clipping.

/** When each sound lands, in seconds from the start. */
export const INTRO_BEATS = { tinks: [1.3, 1.85], close: [2.62, 2.85], fire: 3.8 };

let shared: AudioContext | null = null;

/** The intro's audio context. Browsers keep it suspended until the visitor interacts. */
export const audioContext = () => {
  if (!shared) {
    try {
      shared = new AudioContext();
    } catch {
      return null;
    }
  }
  return shared;
};

const noiseBuffer = (ctx: AudioContext, seconds: number) => {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
};

// A room the size of a valley: two seconds of decaying stereo noise.
const valley = (ctx: AudioContext) => {
  const length = Math.ceil(ctx.sampleRate * 2.6);
  const ir = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = ir.getChannelData(ch);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3.2);
  }
  const convolver = ctx.createConvolver();
  convolver.buffer = ir;
  return convolver;
};

type Out = { ctx: AudioContext; dry: AudioNode; wet: AudioNode };

const burst = (o: Out, t: number, length: number, filter: BiquadFilterType, freq: number, q: number, level: number, wet = 0) => {
  const src = o.ctx.createBufferSource();
  src.buffer = noiseBuffer(o.ctx, length + 0.05);
  const f = o.ctx.createBiquadFilter();
  f.type = filter;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = o.ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(level, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, t + length);
  src.connect(f).connect(g).connect(o.dry);
  if (wet) {
    const send = o.ctx.createGain();
    send.gain.value = wet;
    g.connect(send).connect(o.wet);
  }
  src.start(t);
  src.stop(t + length + 0.05);
};

const tone = (o: Out, t: number, type: OscillatorType, from: number, to: number, length: number, level: number, wet = 0) => {
  const osc = o.ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + length);
  const g = o.ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(level, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + length);
  osc.connect(g).connect(o.dry);
  if (wet) {
    const send = o.ctx.createGain();
    send.gain.value = wet;
    g.connect(send).connect(o.wet);
  }
  osc.start(t);
  osc.stop(t + length + 0.02);
};

// The pump pulled back: a metal slide and a low clunk.
const rackBack = (o: Out, t: number) => {
  burst(o, t, 0.006, "highpass", 4200, 0.7, 0.5);
  burst(o, t + 0.004, 0.075, "bandpass", 2300, 1.4, 0.55, 0.2);
  tone(o, t + 0.01, "triangle", 190, 85, 0.07, 0.5);
};

// Slammed forward: a sharper clack with a short metallic ring.
const rackForward = (o: Out, t: number) => {
  burst(o, t, 0.005, "highpass", 5000, 0.7, 0.7);
  burst(o, t + 0.003, 0.055, "bandpass", 3300, 2, 0.7, 0.25);
  tone(o, t + 0.006, "triangle", 230, 110, 0.06, 0.55);
  tone(o, t + 0.006, "sine", 2150, 2100, 0.14, 0.05, 0.3);
  tone(o, t + 0.006, "sine", 3420, 3380, 0.1, 0.035, 0.3);
};

// A brass shell clinking against the breech.
const tink = (o: Out, t: number) => {
  burst(o, t, 0.004, "highpass", 6000, 0.7, 0.35);
  tone(o, t, "sine", 3900, 3850, 0.18, 0.05, 0.3);
  tone(o, t, "sine", 5600, 5500, 0.12, 0.03, 0.3);
};

// The shot: a crack, a body of noise and a low boom, sent into the valley.
const shot = (o: Out, t: number) => {
  burst(o, t, 0.05, "highpass", 1600, 0.6, 1, 0.6);
  burst(o, t + 0.002, 0.55, "lowpass", 1700, 0.5, 0.9, 0.9);
  tone(o, t, "sine", 115, 38, 0.4, 1, 0.5);
  tone(o, t, "triangle", 70, 32, 0.6, 0.45, 0.4);
};

/** Plays the sequence on INTRO_BEATS, from now. */
export const playGunIntro = (ctx: AudioContext, beats = INTRO_BEATS) => {
  const { tinks, close: rack, fire } = beats;
  const start = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.55;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.ratio.value = 6;
  comp.attack.value = 0.002;
  comp.release.value = 0.25;
  comp.connect(master).connect(ctx.destination);

  const reverb = valley(ctx);
  const wet = ctx.createGain();
  wet.gain.value = 0.45;
  reverb.connect(wet).connect(comp);

  // One slap-back off the far hills, darker each time.
  const echo = ctx.createDelay(1);
  echo.delayTime.value = 0.42;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.28;
  const dark = ctx.createBiquadFilter();
  dark.type = "lowpass";
  dark.frequency.value = 1100;
  echo.connect(dark).connect(feedback).connect(echo);
  dark.connect(comp);

  const out: Out = { ctx, dry: comp, wet: reverb };
  tinks.forEach((at) => tink(out, start + at));
  rackBack(out, start + rack[0]);
  rackForward(out, start + rack[1]);
  shot(out, start + fire);
  const echoSend = ctx.createGain();
  echoSend.gain.value = 0.35;
  burst({ ctx, dry: echoSend, wet: reverb }, start + fire, 0.4, "lowpass", 1500, 0.5, 0.8);
  echoSend.connect(echo);
};

// ---- The original recording ----
//
// RDR2's opening sound (public/audio/intro-sound.m4a, © Rockstar Games, used
// with their permission) plays instead of the sounds above, with the logo
// landing on its loudest moment (the shot). A file in public/local/ (git-
// ignored) takes priority for trying others locally. If none loads, the
// synthesized sounds play.

export type LocalTrack = { buffer: AudioBuffer; fire: number };

const LOCAL_FILES = [...["mp3", "m4a", "wav", "ogg"].map((ext) => `/local/intro-sound.${ext}`), "/audio/intro-sound.m4a"];

// Where the shot starts: the loudest 20 ms window, walked back to its onset.
const shotTime = (buffer: AudioBuffer) => {
  const data = buffer.getChannelData(0);
  const win = Math.round(buffer.sampleRate * 0.02);
  const energy: number[] = [];
  for (let i = 0; i + win <= data.length; i += win) {
    let sum = 0;
    for (let j = i; j < i + win; j++) sum += data[j] * data[j];
    energy.push(Math.sqrt(sum / win));
  }
  let peak = 0;
  energy.forEach((e, i) => {
    if (e > energy[peak]) peak = i;
  });
  let onset = peak;
  while (onset > 0 && peak - onset < 10 && energy[onset - 1] > energy[peak] * 0.5) onset--;
  return (onset * win) / buffer.sampleRate;
};

export const loadLocalTrack = async (ctx: AudioContext): Promise<LocalTrack | null> => {
  // The git-ignored overrides only exist on a development machine.
  const files = import.meta.env.DEV ? LOCAL_FILES : LOCAL_FILES.slice(-1);
  for (const url of files) {
    try {
      const res = await fetch(url);
      // Vite answers a missing file with the page itself, so check it's audio.
      if (!res.ok || !(res.headers.get("content-type") ?? "").startsWith("audio")) continue;
      const buffer = await ctx.decodeAudioData(await res.arrayBuffer());
      return { buffer, fire: shotTime(buffer) };
    } catch {
      // Not there, or not audio: try the next one.
    }
  }
  return null;
};

export const playLocalTrack = (ctx: AudioContext, track: LocalTrack, delay: number) => {
  const src = ctx.createBufferSource();
  src.buffer = track.buffer;
  src.connect(ctx.destination);
  src.start(ctx.currentTime + delay);
};

/**
 * Call inside the tap or key press itself, before any await: iOS Safari only
 * lets audio start from a gesture, and a silent one-sample sound unlocks it.
 */
export const unlockAudio = (ctx: AudioContext) => {
  try {
    const src = ctx.createBufferSource();
    src.buffer = ctx.createBuffer(1, 1, 22050);
    src.connect(ctx.destination);
    src.start(0);
  } catch {
    // Nothing to unlock with; resume() below may still work.
  }
  return ctx.resume();
};
