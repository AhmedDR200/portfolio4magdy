import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { dismissToast, useToasts, type Toast } from '../../utils/toast';
import { EASE_OUT_EXPO } from '../../utils/motion';
import { useSkin } from '../../utils/theme';
import ElementTile from '../atoms/ElementTile';
import Medal from '../atoms/Medal';

// RDR2's notifications: a smoky strip with a torn edge, fading out to the right.
const SMOKE =
  'bg-[linear-gradient(90deg,rgb(var(--graphite)/0.98)_55%,rgb(var(--graphite)/0.88))] text-paper';
const TONES = {
  frost: { card: SMOKE, kicker: 'text-frost', ar: 'text-smoke', medal: 'frost' },
  paper: { card: SMOKE, kicker: 'text-paper', ar: 'text-smoke', medal: 'paper' },
  legend: { card: 'bg-frost text-ink', kicker: 'text-ink', ar: 'text-ink', medal: 'ink' },
} as const;

// The lab's: a tag with a strip of hazard tape on top and an element tile.
// Good news is green; a secret or a warning is hazard yellow, with a "!" tile
// when the toast has no element of its own; the big one is solid green.
const LAB_TONES = {
  frost: {
    card: 'border-paper/15 bg-graphite text-paper',
    kicker: 'text-frost',
    ar: 'text-smoke',
    tile: '',
  },
  paper: {
    card: 'border-bandana/50 bg-graphite text-paper',
    kicker: 'text-bandana',
    ar: 'text-smoke',
    tile: '',
  },
  legend: {
    card: 'border-frost bg-frost text-ink',
    kicker: 'text-ink',
    ar: 'text-ink',
    tile: '!border-ink !bg-ink !text-frost',
  },
} as const;

const LabToastCard = ({ toast }: { toast: Toast }) => {
  const tone = LAB_TONES[toast.tone ?? 'frost'];

  useEffect(() => {
    const id = window.setTimeout(() => dismissToast(toast.id), 4500);
    return () => window.clearTimeout(id);
  }, [toast.id]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -48 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -48 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      onClick={() => dismissToast(toast.id)}
      className={`pointer-events-auto relative flex w-full cursor-pointer items-center gap-3.5 overflow-hidden border p-3.5 pr-5 pt-[22px] ${tone.card}`}
    >
      <span aria-hidden="true" className="tape-thin absolute inset-x-0 top-0 h-2" />
      {toast.tile ? (
        <ElementTile
          symbol={toast.tile.symbol}
          number={toast.tile.number}
          size={52}
          tone={toast.tone === 'paper' ? 'outline' : 'solid'}
          className={tone.tile}
        />
      ) : toast.tone === 'paper' ? (
        <ElementTile symbol="!" size={52} tone="hazard" />
      ) : (
        <ElementTile symbol="Mg" number={12} size={52} tone="solid" className={tone.tile} />
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <b className={`font-fellsc text-[14px] tracking-[0.16em] ${tone.kicker}`}>{toast.kicker}</b>
        <span className="font-archivo text-[19px] font-bold leading-tight">{toast.title}</span>
        <span
          lang="ar"
          dir="rtl"
          className={`text-left font-arabic text-[15px] leading-snug ${tone.ar}`}
        >
          {toast.ar}
        </span>
      </span>
      {toast.meta && (
        <span className="shrink-0 font-mono text-[11px] opacity-60">{toast.meta}</span>
      )}
    </motion.div>
  );
};

const ToastCard = ({ toast }: { toast: Toast }) => {
  const tone = TONES[toast.tone ?? 'frost'];

  useEffect(() => {
    const id = window.setTimeout(() => dismissToast(toast.id), 4500);
    return () => window.clearTimeout(id);
  }, [toast.id]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -48 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -48 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      onClick={() => dismissToast(toast.id)}
      className={`torn-2 pointer-events-auto flex w-full cursor-pointer items-center gap-3.5 p-3.5 pr-5 ${tone.card}`}
    >
      <Medal name={toast.icon} size={46} tone={tone.medal} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <b className={`font-fellsc text-[13px] font-normal tracking-[0.14em] ${tone.kicker}`}>
          {toast.kicker}
        </b>
        <span className="font-fell text-[22px] leading-tight">{toast.title}</span>
        <span
          lang="ar"
          dir="rtl"
          className={`text-left font-arabic text-[15px] leading-snug ${tone.ar}`}
        >
          {toast.ar}
        </span>
      </span>
      {toast.meta && <span className="shrink-0 text-[11px] opacity-60">{toast.meta}</span>}
    </motion.div>
  );
};

// Achievement and purity/honor notifications, top left like the game's.
// Each hides after 4.5 s, or on click.
const Toasts = () => {
  const toasts = useToasts();
  const lab = useSkin() === 'bb';
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed left-4 top-[84px] [filter:drop-shadow(0_12px_20px_rgba(0,0,0,0.28))] z-[97] flex w-[min(420px,calc(100vw-32px))] flex-col items-start gap-2.5 sm:left-8 sm:top-[96px]"
    >
      <AnimatePresence initial={false}>
        {toasts.map(toast =>
          lab ? (
            <LabToastCard key={toast.id} toast={toast} />
          ) : (
            <ToastCard key={toast.id} toast={toast} />
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default Toasts;
