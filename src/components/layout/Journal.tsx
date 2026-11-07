import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  ACHIEVEMENTS,
  resetAchievements,
  useAchievementCopy,
  useUnlocked,
} from '../../utils/achievements';
import { resetHonor } from '../../utils/honor';
import { pauseScroll } from '../../utils/lenis';
import { EASE_OUT_EXPO } from '../../utils/motion';
import { PURITY_LEVELS, purityLevel, resetPurity, usePurity } from '../../utils/purity';
import { useSkin } from '../../utils/theme';
import ElementTile from '../atoms/ElementTile';
import Medal from '../atoms/Medal';
import PurityRing from '../atoms/PurityRing';

type Props = { open: boolean; onOpenChange: Dispatch<SetStateAction<boolean>> };

const RANGES = ['under 40%', '40% to 89%', '90% and up'];

// The lab's version of the journal: the collection. Thirteen element tiles
// (earned ones solid green, the rest dashed and dim, the secret one a
// question mark) beside the purity crystal, which clears as the table fills.
const Collection = ({ onClose }: { onClose: () => void }) => {
  const unlocked = useUnlocked();
  const purity = usePurity();
  const copyOf = useAchievementCopy();
  const level = purityLevel(purity);
  const done = unlocked.length;
  const total = ACHIEVEMENTS.length;

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      className="lab-grid relative mx-auto flex max-w-[1100px] flex-col gap-6 overflow-hidden border border-paper/15 bg-graphite p-5 pt-8 text-paper sm:p-9 sm:pt-11"
    >
      <span aria-hidden="true" className="tape-thin absolute inset-x-0 top-0 h-2.5" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="m-0 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-display text-[36px] uppercase leading-none sm:text-[46px]">
              The collection
            </span>
            <span className="font-mono text-[12px] tracking-[0.1em] text-frost">
              {done} OF {total}
            </span>
            <span lang="ar" className="font-arabic text-[22px] text-smoke">
              المجموعة
            </span>
          </p>
          <p className="m-0 max-w-[560px] text-[13px] leading-relaxed text-smoke">
            Every element points at something on the site: a mode, a demo, a section. The numbers
            are the real ones. Kept in this browser only.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="border border-paper/25 px-3.5 py-2 text-[12px] uppercase tracking-[0.1em] hover:border-frost hover:text-frost"
        >
          Close · J
        </button>
      </div>

      <div className="grid gap-7 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-9">
        {/* The purity crystal. */}
        <section
          aria-label="Purity"
          className="flex flex-col items-center gap-3 border border-paper/10 bg-ink/50 p-5 text-center"
        >
          <div className="flex w-full items-center gap-5 lg:flex-col lg:gap-3">
            <PurityRing purity={purity} size={176} className="hidden lg:block" />
            <PurityRing purity={purity} size={104} className="lg:hidden" />
            <div className="flex flex-col items-start gap-1.5 text-left lg:items-center lg:text-center">
              <p className="m-0 font-display text-[44px] leading-none lg:text-[48px]">
                <span className={purity >= 90 ? 'text-paper' : 'text-crystal'}>
                  {purity.toFixed(1)}
                </span>
                <span className="text-[24px]">%</span>
              </p>
              <p
                className={`m-0 font-fellsc text-[17px] tracking-[0.16em] ${
                  purity >= 90 ? 'text-frost' : ''
                }`}
              >
                {level.name}
              </p>
              <p
                lang="ar"
                dir="rtl"
                className="m-0 font-arabic text-[18px] leading-none text-smoke"
              >
                {level.ar}
              </p>
            </div>
          </div>
          <ul className="m-0 mt-1 flex w-full list-none flex-col gap-1 p-0 text-left font-mono text-[10px] tracking-[0.06em]">
            {PURITY_LEVELS.map((l, i) => (
              <li
                key={l.name}
                className={`flex justify-between gap-2 border-t border-paper/10 pt-1 ${
                  l.name === level.name ? 'text-frost' : 'text-dim'
                }`}
              >
                <span className="uppercase">{l.name}</span>
                <span>{RANGES[i]}</span>
              </li>
            ))}
          </ul>
          <p className="m-0 text-[11px] leading-snug text-dim">
            Each element is +{(75 / total).toFixed(1)}. Reading to the end credits adds 0.1.
            Spam-clicking or rushing the page spoils the batch, for the visit.
          </p>
        </section>

        {/* The tiles. */}
        <ul className="m-0 grid list-none content-start gap-3 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {ACHIEVEMENTS.map(a => {
            const has = unlocked.includes(a.id);
            const hidden = a.secret && !has;
            const copy = copyOf(a);
            return (
              <li
                key={a.id}
                className={`flex items-center gap-3.5 border p-3 ${
                  has ? 'border-paper/15 bg-ink/60' : 'border-paper/5 bg-transparent'
                }`}
              >
                <ElementTile
                  symbol={hidden ? '?' : copy.tile?.symbol ?? 'Mg'}
                  number={hidden ? '??' : copy.tile?.number}
                  size={64}
                  tone={has ? 'solid' : 'dim'}
                  className={has ? '' : '!border-dashed'}
                />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span
                    className={`font-archivo text-[15px] font-bold leading-tight ${
                      has ? '' : 'text-dim'
                    }`}
                  >
                    {hidden ? 'Secret' : copy.title}
                  </span>
                  <span className={`text-[11px] leading-snug ${has ? 'text-mist' : 'text-dim'}`}>
                    {hidden ? 'Hidden somewhere on the site' : copy.how}
                  </span>
                  {has && (
                    <span
                      lang="ar"
                      dir="rtl"
                      className="text-left font-arabic text-[14px] leading-snug text-smoke"
                    >
                      {copy.ar}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] text-dim">
        <span lang="ar" className="font-arabic text-[18px] text-smoke">
          {done === total ? 'كمّلت الجدول. كلّمني بقى.' : 'لسه فيه عناصر مستخبية في الموقع.'}
        </span>
        <button
          type="button"
          onClick={() => {
            resetAchievements();
            resetHonor();
            resetPurity();
          }}
          className="underline-offset-4 hover:text-paper hover:underline"
        >
          Reset progress
        </button>
      </div>
    </motion.div>
  );
};

// Press J: the journal of achievements, unlocked ones in frost. Secret ones
// stay a mystery until found. In the lab it is the collection of elements.
const Journal = ({ open, onOpenChange }: Props) => {
  const unlocked = useUnlocked();
  const lab = useSkin() === 'bb';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement).closest?.("input, textarea, select, [contenteditable='true']"))
        return;
      if (e.key === 'j' || e.key === 'J') onOpenChange(v => !v);
      else if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    pauseScroll(true);
    return () => pauseScroll(false);
  }, [open]);

  const done = unlocked.length;
  const total = ACHIEVEMENTS.length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="journal"
          role="dialog"
          aria-modal="true"
          aria-label={lab ? 'The collection' : 'Achievements'}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && onOpenChange(false)}
          className="fixed inset-0 z-[88] overflow-y-auto bg-ink/85 px-4 py-6 backdrop-blur-md sm:px-10 sm:py-12"
        >
          {lab ? (
            <Collection onClose={() => onOpenChange(false)} />
          ) : (
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="mx-auto flex max-w-[1100px] flex-col gap-6 rounded-[28px] border border-paper/15 bg-graphite p-5 text-paper sm:p-9"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <p className="m-0 flex items-baseline gap-3.5">
                    <span className="font-western text-[32px] leading-none sm:text-[40px]">
                      Achievements
                    </span>
                    <span lang="ar" className="font-arabic text-[22px] text-smoke">
                      الإنجازات
                    </span>
                  </p>
                  <p className="m-0 max-w-[560px] text-[13px] leading-relaxed text-smoke">
                    Every badge points at something on the site: a mode, a demo, a section. Kept in
                    this browser only.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="rounded-full border border-paper/25 px-3.5 py-2 text-[12px] uppercase tracking-[0.1em] hover:border-frost hover:text-frost"
                >
                  Close · J
                </button>
              </div>

              <div className="flex items-center gap-4 text-[12px] text-mist">
                <span className="shrink-0 tabular-nums">
                  {done} / {total} unlocked
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper/10">
                  <span
                    className="block h-full bg-frost transition-[width] duration-700"
                    style={{ width: `${(done / total) * 100}%` }}
                  />
                </span>
              </div>

              <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
                {ACHIEVEMENTS.map(a => {
                  const has = unlocked.includes(a.id);
                  const hidden = a.secret && !has;
                  return (
                    <li
                      key={a.id}
                      className={`flex items-center gap-3.5 rounded-2xl border p-3.5 ${
                        has ? 'border-paper/10 bg-ink/60' : 'border-paper/5 bg-transparent'
                      }`}
                    >
                      <Medal
                        name={hidden ? 'keyhole' : a.icon}
                        size={46}
                        tone={has ? 'frost' : 'dim'}
                      />
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span
                          className={`font-western text-[17px] leading-tight ${
                            has ? '' : 'text-dim'
                          }`}
                        >
                          {hidden ? '???' : a.title}
                        </span>
                        <span
                          lang="ar"
                          dir="rtl"
                          className="text-left font-arabic text-[15px] text-smoke"
                        >
                          {hidden ? 'إنجاز سري' : a.ar}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] text-dim">
                <span lang="ar" className="font-arabic text-[18px] text-smoke">
                  {done === total
                    ? 'أسطورة الغرب. كلّمني بقى.'
                    : 'لسه فيه حاجات مستخبية في الموقع.'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    resetAchievements();
                    resetHonor();
                  }}
                  className="underline-offset-4 hover:text-paper hover:underline"
                >
                  Reset progress
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Journal;
