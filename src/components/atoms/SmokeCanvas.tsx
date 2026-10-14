import { useEffect, useRef } from "react";

// Gun smoke for the intro, drawn as particles on a canvas: soft puffs that
// rise, swell, turn and curl as they thin out. Each puff is one sprite built
// at start from overlapping soft blobs, so the smoke looks torn, not round.

type Props = {
  /** Where the smoke comes from, as fractions of the canvas. */
  from: { x: number; y: number; spread: number };
  /** Seconds it keeps emitting. */
  emitFor: number;
  /** Puffs per second. */
  rate?: number;
  /** Peak opacity of one puff. */
  alpha?: number;
  /** Rising speed, in fractions of the canvas height per second. */
  rise?: number;
  className?: string;
};

const sprite = () => {
  const size = 160;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  if (!g) return c;
  // A tall, torn wisp: small faint blobs strung along a wavering line.
  for (let i = 0; i < 14; i++) {
    const k = i / 13;
    const x = size / 2 + Math.sin(k * 5 + Math.random()) * size * 0.14 + (Math.random() - 0.5) * size * 0.08;
    const y = size * (0.12 + k * 0.76);
    const r = size * (0.07 + Math.random() * 0.1);
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, "rgba(236,239,236,0.16)");
    grad.addColorStop(0.6, "rgba(236,239,236,0.05)");
    grad.addColorStop(1, "rgba(236,239,236,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  return c;
};

type Puff = { x: number; y: number; vx: number; vy: number; size: number; grow: number; rot: number; spin: number; age: number; life: number; seed: number };

const SmokeCanvas = ({ from, emitFor, rate = 20, alpha = 0.5, rise = 0.16, className = "" }: Props) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    const sprites = [sprite(), sprite(), sprite()];
    const puffs: Puff[] = [];
    let raf = 0;
    let last = performance.now();
    const start = last;
    let owed = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const W = canvas.width;
      const H = canvas.height;
      const t = (now - start) / 1000;

      if (t < emitFor) {
        owed += rate * dt;
        while (owed >= 1) {
          owed -= 1;
          puffs.push({
            x: (from.x + (Math.random() - 0.5) * from.spread) * W,
            y: from.y * H,
            vx: (Math.random() - 0.5) * 0.03 * W,
            vy: -(rise * (0.7 + Math.random() * 0.6)) * H,
            size: (0.08 + Math.random() * 0.06) * H,
            grow: (0.12 + Math.random() * 0.1) * H,
            rot: (Math.random() - 0.5) * 0.8,
            spin: (Math.random() - 0.5) * 0.6,
            age: 0,
            life: 1.8 + Math.random() * 1.1,
            seed: Math.random() * 10,
          });
        }
      }

      ctx.clearRect(0, 0, W, H);
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.age += dt;
        if (p.age >= p.life) {
          puffs.splice(i, 1);
          continue;
        }
        // Curl: a slow sideways wave, and the rise slowing as it cools.
        p.vx += Math.sin(p.age * 2.4 + p.seed) * 0.05 * W * dt;
        p.vy *= 1 - 0.35 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.spin * dt;
        p.size += p.grow * dt;
        const k = p.age / p.life;
        ctx.globalAlpha = alpha * Math.sin(Math.PI * Math.min(1, k * 1.15)) * (1 - k * 0.4);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.drawImage(sprites[Math.floor(p.seed) % sprites.length], -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      if (t < emitFor || puffs.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [from.x, from.y, from.spread, emitFor, rate, alpha, rise]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none h-full w-full ${className}`} />;
};

export default SmokeCanvas;
