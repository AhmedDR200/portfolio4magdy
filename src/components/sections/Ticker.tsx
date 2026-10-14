import { Fragment } from "react";

import { stackTicker } from "../../constants";

const items = [...stackTicker, "باك إند"];

// A tilted volt band of the stack, scrolling forever.
const Ticker = () => (
  <div className="overflow-hidden py-9">
    <div
      role="region"
      aria-label={`Stack: ${stackTicker.join(", ")}`}
      className="-ml-[5%] w-[110%] -rotate-2 overflow-hidden bg-volt py-3 text-ink sm:py-4"
    >
      <div
        className="animate-marquee flex w-max gap-[34px] pr-[34px] font-display text-[30px] uppercase leading-[1.1] sm:text-[38px]"
        style={{ "--marquee-duration": "34s" } as React.CSSProperties}
        aria-hidden="true"
      >
        {[...items, ...items].map((item, i) => (
          <Fragment key={i}>
            <span lang={item === "باك إند" ? "ar" : undefined} className={item === "باك إند" ? "font-arabic" : ""}>
              {item}
            </span>
            <span>✦</span>
          </Fragment>
        ))}
      </div>
    </div>
  </div>
);

export default Ticker;
