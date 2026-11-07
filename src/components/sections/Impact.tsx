import { motion } from 'framer-motion';

import { impactStats } from '../../constants';
import { styles } from '../../constants/styles';
import { fadeUp } from '../../utils/motion';
import { useSkin } from '../../utils/theme';
import ElementTile from '../atoms/ElementTile';
import Medal from '../atoms/Medal';

// In the lab each number is a readout under an element that puns on it: U for
// users (uranium), Pu for push (plutonium), Ca for cache (calcium), Au for
// automation (gold). Their real atomic numbers.
const LAB_TILES: Record<string, { symbol: string; number: number; name: string }> = {
  crowd: { symbol: 'U', number: 92, name: 'Users' },
  bell: { symbol: 'Pu', number: 94, name: 'Push' },
  stopwatch: { symbol: 'Ca', number: 20, name: 'Cache' },
  loop: { symbol: 'Au', number: 79, name: 'Auto' },
};

const Impact = () => {
  const lab = useSkin() === 'bb';
  return (
    <section id="impact" aria-label="Impact" className="py-16 sm:py-24">
      <div className={`${styles.container} grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4`}>
        {impactStats.map((stat, i) => {
          const tile = LAB_TILES[stat.icon];
          return (
            <motion.div
              key={stat.value}
              variants={fadeUp(i * 0.08)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              className="flex flex-col gap-2.5 border-l border-paper/15 px-6 sm:px-7"
            >
              {lab && tile ? (
                <p className="m-0 mb-2 flex items-center gap-3 font-mono text-[11px] tracking-[0.14em] text-smoke">
                  <ElementTile
                    symbol={tile.symbol}
                    number={tile.number}
                    name={tile.name}
                    size={58}
                    tone="solid"
                  />
                  <span className="flex flex-col gap-1">
                    <span>READOUT {String(i + 1).padStart(2, '0')}</span>
                    <span aria-hidden="true" className="tape-thin block h-1.5 w-16" />
                  </span>
                </p>
              ) : (
                <Medal name={stat.icon} size={52} className="mb-2" />
              )}
              <p className="m-0 font-display text-[clamp(80px,8.4vw,124px)] leading-none text-frost">
                {stat.value}
              </p>
              <p className="m-0 text-[14px] leading-[1.55]">{stat.label}</p>
              <p lang="ar" dir="rtl" className="m-0 text-left font-arabic text-[22px] text-smoke">
                {stat.labelAr}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Impact;
