import { audioContext } from "./gunfx";

// The lab's small sounds, synthesized in the browser (no sound files): the
// Geiger counter's ticks and the RV's horn. Everything goes through one
// compressor per audio context, kept quiet so nothing clips.

type Bus = { input: AudioNode; noise: AudioBuffer };
const buses = new WeakMap<AudioContext, Bus>();

const bus = (ctx: AudioContext): Bus => {
  let b = buses.get(ctx);
  if (!b) {
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.ratio.value = 8;
    comp.attack.value = 0.002;
    comp.release.value = 0.15;
    const master = ctx.createGain();
    master.gain.value = 0.5;
    comp.connect(master).connect(ctx.destination);
    const noise = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.05), ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    b = { input: comp, noise };
    buses.set(ctx, b);
  }
  return b;
};

/** The shared audio context, resumed. Call it inside a key press or tap. */
export const labAudio = (): AudioContext | null => {
  const ctx = audioContext();
  if (ctx && ctx.state === "suspended") void ctx.resume().catch(() => undefined);
  return ctx;
};

/** One Geiger tick at `when` (an audio-context time): a few ms of high noise. */
export const geigerClick = (ctx: AudioContext, when = ctx.currentTime, level = 1) => {
  const b = bus(ctx);
  const src = ctx.createBufferSource();
  src.buffer = b.noise;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 2200 + Math.random() * 1800;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(0.55 * level, when + 0.0008);
  g.gain.exponentialRampToValueAtTime(0.0001, when + 0.007 + Math.random() * 0.004);
  src.connect(hp).connect(g).connect(b.input);
  src.start(when);
  src.stop(when + 0.02);
};

export type Geiger = {
  /** 0 (nothing near) to 1 (right on it). The ticking follows it. */
  setProximity: (p: number) => void;
  /** Ticks per second right now (smoothed), for the readout. */
  rate: () => number;
  stop: () => void;
};

const BASE_RATE = 1.6; // background ticks per second
const MAX_RATE = 46;

/** A Geiger counter: ticks at random times, faster the nearer the probe. */
export const startGeiger = (ctx: AudioContext): Geiger => {
  let proximity = 0;
  let shown = BASE_RATE;
  const SLICE = 0.03;
  const id = window.setInterval(() => {
    const target = BASE_RATE + (MAX_RATE - BASE_RATE) * proximity * proximity;
    shown += (target - shown) * 0.25;
    // Poisson-ish: each slice gets its share of ticks, at random moments inside it.
    let expected = target * SLICE;
    while (expected > 0) {
      if (Math.random() < Math.min(1, expected)) geigerClick(ctx, ctx.currentTime + Math.random() * SLICE, 0.5 + Math.random() * 0.5);
      expected -= 1;
    }
  }, SLICE * 1000);
  return {
    setProximity: (p) => {
      proximity = Math.max(0, Math.min(1, p));
    },
    rate: () => shown,
    stop: () => window.clearInterval(id),
  };
};

/** Fired on window each time the RV honks, so the rail's RV can answer. */
export const RV_HONK_EVENT = "rv:honk";

/** The RV's horn: two notes a third apart, twice, the second one longer. */
export const honk = (ctx: AudioContext) => {
  const b = bus(ctx);
  const blast = (start: number, length: number) => {
    const t = ctx.currentTime + start;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1500;
    lp.Q.value = 1.2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.32, t + 0.025);
    g.gain.setValueAtTime(0.32, t + length - 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + length);
    lp.connect(g).connect(b.input);
    for (const freq of [349, 440]) {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq * 1.015, t);
      osc.frequency.exponentialRampToValueAtTime(freq, t + 0.05);
      osc.connect(lp);
      osc.start(t);
      osc.stop(t + length + 0.02);
    }
  };
  blast(0, 0.17);
  blast(0.23, 0.42);
};
