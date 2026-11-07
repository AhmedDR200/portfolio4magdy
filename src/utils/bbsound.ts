// The lab's cold-open music: the Breaking Bad main title theme, played from
// public/audio/bb-intro.m4a with the permission of its rights holder. The beats
// were measured from the file itself (10 ms RMS windows), so the picture can
// land on them. If the file can't load, the intro goes on in silence, shorter.

/** Seconds from the start of the file. */
export const BB_BEATS = {
  /** The first hit. */
  open: 0.04,
  /** The swell: a new, louder section. The tile lands here. */
  swell: 6.32,
  /** The last hit; the music cuts to its tail 0.66 s after it. The curtain lifts on it. */
  hit: 11.41,
  /** Where the body of the music ends and only its tail rings on. */
  cut: 12.07,
};

export type BbTrack = { buffer: AudioBuffer };

export const loadBbTrack = async (ctx: AudioContext): Promise<BbTrack | null> => {
  try {
    const res = await fetch("/audio/bb-intro.m4a");
    // A dev server answers a missing file with the page itself, so check it's audio.
    if (!res.ok || !(res.headers.get("content-type") ?? "").startsWith("audio")) return null;
    return { buffer: await ctx.decodeAudioData(await res.arrayBuffer()) };
  } catch {
    return null;
  }
};

/** Starts the music in `delay` seconds and returns a node to read its level from. */
export const playBbTrack = (ctx: AudioContext, track: BbTrack, delay: number): AnalyserNode => {
  const src = ctx.createBufferSource();
  src.buffer = track.buffer;
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  src.connect(analyser).connect(ctx.destination);
  src.start(ctx.currentTime + delay);
  return analyser;
};

/** The current loudness of an analyser, 0 to about 1. */
export const level = (analyser: AnalyserNode, buffer: Uint8Array) => {
  analyser.getByteTimeDomainData(buffer);
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    const v = (buffer[i] - 128) / 128;
    sum += v * v;
  }
  return Math.sqrt(sum / buffer.length);
};
