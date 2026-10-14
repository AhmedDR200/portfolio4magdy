import { useEffect, useReducer } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { unlock } from "../../utils/achievements";
import { changeHonor } from "../../utils/honor";

// A working miniature of Bee3a inside the phone on the Bee3a card: ring up a
// sale at the till, book a slot, and watch "today" update. Everything lives in
// this component's state; nothing is sent or saved. The Arabic copy is the
// app's own, and Bee3a's colors stay inside the phone (it's the product's brand).

type Tab = "today" | "pos" | "bookings";
type Method = "cash" | "instapay";
type Booking = { id: number; name: string; service: string; time: string; confirmed: boolean };
type Sale = { no: number; total: number; method: Method };

const CATALOG = [
  { id: "cut", name: "قص وسشوار", price: 250, service: true },
  { id: "color", name: "صبغة جذور", price: 450, service: true },
  { id: "facial", name: "تنظيف بشرة", price: 350, service: true },
  { id: "serum", name: "سيروم شعر", price: 220, service: false },
];
const SERVICES = CATALOG.filter((item) => item.service);
const SLOTS = ["12:00", "1:30", "3:00", "4:30", "6:00", "7:30"];
const METHODS: Record<Method, string> = { cash: "كاش", instapay: "انستاباي" };

type State = {
  tab: Tab;
  cart: Record<string, number>;
  method: Method;
  sale: Sale | null;
  nextInvoice: number;
  /** Sales per hour so far today; a new sale adds to the last one. */
  hours: number[];
  bookings: Booking[];
  newBooking: number | null;
  pickService: string | null;
  pickTime: string | null;
  toast: string | null;
  touched: boolean;
};

const INITIAL: State = {
  tab: "today",
  cart: {},
  method: "cash",
  sale: null,
  nextInvoice: 1043,
  hours: [300, 550, 400, 800, 1000],
  bookings: [
    { id: 1, name: "ندى", service: "صبغة جذور", time: "12:00", confirmed: true },
    { id: 2, name: "سلمى", service: "قص وسشوار", time: "1:30", confirmed: false },
    { id: 3, name: "هبة", service: "تنظيف بشرة", time: "3:00", confirmed: true },
  ],
  newBooking: null,
  pickService: null,
  pickTime: null,
  toast: null,
  touched: false,
};

type Action =
  | { type: "tab"; tab: Tab }
  | { type: "add" | "remove"; id: string }
  | { type: "method"; method: Method }
  | { type: "collect" }
  | { type: "newSale" }
  | { type: "pickService"; id: string }
  | { type: "pickTime"; time: string }
  | { type: "book" }
  | { type: "hideToast" }
  | { type: "reset" };

const cartTotal = (cart: Record<string, number>) =>
  CATALOG.reduce((sum, item) => sum + (cart[item.id] ?? 0) * item.price, 0);

const reducer = (state: State, action: Action): State => {
  const s = { ...state, touched: true };
  switch (action.type) {
    case "tab":
      return { ...s, tab: action.tab };
    case "add":
      return { ...s, sale: null, cart: { ...s.cart, [action.id]: (s.cart[action.id] ?? 0) + 1 } };
    case "remove": {
      const cart = { ...s.cart, [action.id]: Math.max(0, (s.cart[action.id] ?? 0) - 1) };
      return { ...s, cart };
    }
    case "method":
      return { ...s, method: action.method };
    case "collect": {
      const total = cartTotal(s.cart);
      if (!total) return state;
      const hours = [...s.hours];
      hours[hours.length - 1] += total;
      return { ...s, cart: {}, hours, sale: { no: s.nextInvoice, total, method: s.method }, nextInvoice: s.nextInvoice + 1 };
    }
    case "newSale":
      return { ...s, sale: null };
    case "pickService":
      return { ...s, pickService: action.id };
    case "pickTime":
      return { ...s, pickTime: action.time };
    case "book": {
      const service = SERVICES.find((item) => item.id === s.pickService);
      if (!service || !s.pickTime) return state;
      const booking = { id: Date.now(), name: "إنت", service: service.name, time: s.pickTime, confirmed: true };
      return {
        ...s,
        bookings: [...s.bookings, booking],
        newBooking: booking.id,
        pickService: null,
        pickTime: null,
        tab: "today",
        toast: "الحجز اتأكد",
      };
    }
    case "hideToast":
      return { ...state, toast: null };
    case "reset":
      return INITIAL;
  }
};

const money = (n: number) => `${n.toLocaleString("en")} جنيه`;
const time = (t: string) => `${t} م`;

// Bee3a's own plural forms for the invoice.
const itemsLabel = (n: number) =>
  n === 0 ? "فاضية" : n === 1 ? "حاجة واحدة" : n === 2 ? "حاجتين" : n <= 10 ? `${n} حاجات` : `${n} حاجة`;

const chip = (on: boolean) =>
  `rounded-full border px-2.5 py-1 text-[12px] transition-colors ${
    on ? "border-[#1A6444] bg-[#1A6444] text-[#FAF6F0]" : "border-[#E4DFD8] bg-white text-[#17130F] hover:border-[#1A6444]"
  }`;

const primary =
  "h-10 w-full rounded-xl bg-[#1A6444] text-[14px] font-semibold text-[#FAF6F0] transition-opacity disabled:opacity-40";

const Today = ({ state }: { state: State }) => {
  const total = state.hours.reduce((a, b) => a + b, 0);
  const max = Math.max(...state.hours);
  // By time, except the one just booked, which goes on top so it is seen.
  const order = (b: Booking) => (b.id === state.newBooking ? -1 : SLOTS.indexOf(b.time));
  const bookings = [...state.bookings].sort((a, b) => order(a) - order(b));

  return (
    <div className="flex h-full flex-col gap-2.5">
      <p className="m-0 text-[19px] font-bold leading-[1.2]">نوّرت يا منى</p>
      <div className="flex flex-col gap-2 rounded-[14px] bg-[#1A6444] p-3 text-[#FAF6F0]">
        <span className="flex items-baseline justify-between text-[13px]">
          مبيعات النهارده
          <b className="text-[15px] tabular-nums">{money(total)}</b>
        </span>
        <span className="flex h-[34px] items-end gap-[5px]">
          {state.hours.map((amount, i) => (
            <span
              key={i}
              className={`w-3.5 rounded-[3px] transition-[height] duration-700 ${
                i === state.hours.length - 1 ? "bg-[#DAF5E5]" : "bg-[#6FBE95]"
              }`}
              style={{ height: `${(amount / max) * 100}%` }}
            />
          ))}
        </span>
      </div>
      <div className="rounded-xl bg-[#DAF5E5] px-3 py-2 text-[14px] text-[#104C32]">استفتاح حلو!</div>
      <p className="m-0 text-[13px] text-[#6B6259]">الحجوزات الجاية</p>
      <ul data-lenis-prevent className="m-0 flex min-h-0 flex-1 list-none flex-col gap-1.5 overflow-y-auto p-0">
        {bookings.map((b) => (
          <li
            key={b.id}
            className={`flex items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 ${
              b.id === state.newBooking ? "bg-[#DAF5E5] ring-1 ring-[#1A6444]" : "bg-[#F2EEE8]"
            }`}
          >
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[13px]">
                {b.name} · {b.service}
              </span>
              <span className="text-[11px] text-[#6B6259]">{time(b.time)}</span>
            </span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${
                b.confirmed ? "bg-[#DAF5E5] text-[#104C32]" : "bg-[#E4DFD8] text-[#4A433C]"
              }`}
            >
              {b.id === state.newBooking ? "جديد" : b.confirmed ? "مؤكد" : "مستني تأكيد"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Pos = ({ state, dispatch }: { state: State; dispatch: (a: Action) => void }) => {
  if (state.sale) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DAF5E5] text-[26px] text-[#1A6444]">
          ✓
        </span>
        <p className="m-0 text-[20px] font-bold">اتدفع</p>
        <p className="m-0 text-[12px] text-[#6B6259]">فاتورة رقم {state.sale.no}</p>
        <p className="m-0 text-[22px] font-bold tabular-nums">{money(state.sale.total)}</p>
        <p className="m-0 text-[12px] text-[#6B6259]">الدفع: {METHODS[state.sale.method]}</p>
        <button type="button" onClick={() => dispatch({ type: "newSale" })} className={`${primary} mt-3`}>
          بيعة جديدة
        </button>
      </div>
    );
  }

  const count = Object.values(state.cart).reduce((a, b) => a + b, 0);
  const total = cartTotal(state.cart);
  return (
    <div className="flex h-full flex-col gap-2.5">
      <p className="m-0 text-[19px] font-bold leading-[1.2]">الكاشير</p>
      <div className="grid grid-cols-2 gap-2">
        {CATALOG.map((item) => {
          const qty = state.cart[item.id] ?? 0;
          return (
            <div key={item.id} className="relative">
              <button
                type="button"
                aria-label={`زوّد ${item.name}`}
                onClick={() => dispatch({ type: "add", id: item.id })}
                className={`flex h-[64px] w-full flex-col items-start justify-between rounded-xl border bg-white p-2 text-right transition-colors ${
                  qty ? "border-[#1A6444]" : "border-[#E4DFD8] hover:border-[#1A6444]"
                }`}
              >
                <span className="text-[13px] leading-tight">{item.name}</span>
                <span className="text-[11px] text-[#6B6259] tabular-nums">{money(item.price)}</span>
              </button>
              {qty > 0 && (
                // Quantity and "less" share one pill in the corner the price leaves free.
                <span className="absolute bottom-1.5 left-1.5 flex h-5 items-center gap-1 rounded-full bg-[#1A6444] pl-0.5 pr-2 text-[11px] text-[#FAF6F0]">
                  <span className="tabular-nums">{qty}</span>
                  <button
                    type="button"
                    aria-label={`قلّل ${item.name}`}
                    onClick={() => dispatch({ type: "remove", id: item.id })}
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FAF6F0] text-[12px] leading-none text-[#1A6444]"
                  >
                    −
                  </button>
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-2 rounded-[14px] border border-[#E4DFD8] bg-white p-2.5">
        <span className="flex items-baseline justify-between text-[12px] text-[#6B6259]">
          الفاتورة · {itemsLabel(count)}
          <b className="text-[14px] text-[#17130F] tabular-nums">{money(total)}</b>
        </span>
        <div role="radiogroup" aria-label="طريقة الدفع" className="flex gap-1.5">
          {(Object.keys(METHODS) as Method[]).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={state.method === m}
              onClick={() => dispatch({ type: "method", method: m })}
              className={`flex-1 ${chip(state.method === m)}`}
            >
              {METHODS[m]}
            </button>
          ))}
        </div>
        <button type="button" disabled={!total} onClick={() => dispatch({ type: "collect" })} className={primary}>
          {total ? `حصّل ${money(total)}` : "لسه مفيش حاجة في السلة"}
        </button>
      </div>
    </div>
  );
};

const Bookings = ({ state, dispatch }: { state: State; dispatch: (a: Action) => void }) => {
  const taken = new Set(state.bookings.map((b) => b.time));
  return (
    <div className="flex h-full flex-col gap-2.5">
      <p className="m-0 text-[19px] font-bold leading-[1.2]">حجز جديد</p>
      <p className="m-0 text-[12px] text-[#6B6259]">الخدمة</p>
      <div className="flex flex-wrap gap-1.5">
        {SERVICES.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={state.pickService === s.id}
            onClick={() => dispatch({ type: "pickService", id: s.id })}
            className={chip(state.pickService === s.id)}
          >
            {s.name}
          </button>
        ))}
      </div>
      <p className="m-0 text-[12px] text-[#6B6259]">الساعة</p>
      <div className="grid grid-cols-3 gap-1.5">
        {SLOTS.map((slot) =>
          taken.has(slot) ? (
            <span
              key={slot}
              title="محجوز"
              className="rounded-full border border-dashed border-[#CFCAC3] px-2 py-1 text-center text-[12px] text-[#AFAAA3] line-through"
            >
              {time(slot)}
            </span>
          ) : (
            <button
              key={slot}
              type="button"
              aria-pressed={state.pickTime === slot}
              onClick={() => dispatch({ type: "pickTime", time: slot })}
              className={chip(state.pickTime === slot)}
            >
              {time(slot)}
            </button>
          )
        )}
      </div>
      <button
        type="button"
        disabled={!state.pickService || !state.pickTime}
        onClick={() => dispatch({ type: "book" })}
        className={`${primary} mt-auto`}
      >
        احجز
      </button>
      <p className="m-0 text-center text-[11px] text-[#6B6259]">الحجز هيتسجّل باسمك: «إنت»</p>
    </div>
  );
};

// What "Try it" plays: a sale at the till, then a booking. Each step is a
// tap the visitor would make; numbers are pauses in ms.
const TOUR: (Action | number)[] = [
  { type: "reset" },
  500,
  { type: "tab", tab: "pos" },
  { type: "add", id: "cut" },
  { type: "add", id: "cut" },
  { type: "add", id: "serum" },
  { type: "method", method: "instapay" },
  { type: "collect" },
  1800,
  { type: "tab", tab: "bookings" },
  { type: "pickService", id: "facial" },
  { type: "pickTime", time: "4:30" },
  { type: "book" },
];
const TOUR_STEP_MS = 750;

const TABS: { id: Tab | "more"; label: string }[] = [
  { id: "today", label: "النهارده" },
  { id: "pos", label: "الكاشير" },
  { id: "bookings", label: "الحجوزات" },
  { id: "more", label: "المزيد" },
];

type Props = {
  /** The guided tour ("Try the demo" on the card) is playing. */
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
  className?: string;
};

// The phone and the line under it. The card places it and owns the tour button.
const Bee3aDemo = ({ playing, onPlayingChange, className = "" }: Props) => {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  useEffect(() => {
    if (!state.sale) return;
    unlock("first-sale");
    changeHonor(1, "bee3a-sale");
  }, [state.sale]);

  useEffect(() => {
    if (!playing) return;
    let step = 0;
    let id = 0;
    const next = () => {
      const item = TOUR[step++];
      if (item === undefined) return onPlayingChange(false);
      if (typeof item === "number") {
        id = window.setTimeout(next, item);
        return;
      }
      dispatch(item);
      id = window.setTimeout(next, TOUR_STEP_MS);
    };
    next();
    return () => window.clearTimeout(id);
  }, [playing, onPlayingChange]);

  useEffect(() => {
    if (!state.toast) return;
    const id = window.setTimeout(() => dispatch({ type: "hideToast" }), 2200);
    return () => window.clearTimeout(id);
  }, [state.toast]);

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        role="group"
        aria-label="Bee3a demo (in Arabic)"
        dir="rtl"
        lang="ar"
        data-xray="bee3a-demo"
        // Touching the phone hands control back to the visitor.
        onPointerDown={() => onPlayingChange(false)}
        className="relative flex h-[468px] w-[252px] flex-col overflow-hidden rounded-[34px] border-[6px] border-[#2A241E] bg-[#FAF6F0] font-bee3a text-[#17130F] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
      >
        <div className="relative min-h-0 flex-1 px-3.5 pb-2 pt-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={state.tab}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              {state.tab === "today" && <Today state={state} />}
              {state.tab === "pos" && <Pos state={state} dispatch={dispatch} />}
              {state.tab === "bookings" && <Bookings state={state} dispatch={dispatch} />}
            </motion.div>
          </AnimatePresence>

          <div aria-live="polite" className="pointer-events-none absolute inset-x-3 top-3">
            <AnimatePresence>
              {state.toast && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="m-0 rounded-xl bg-[#17130F] px-3 py-2 text-[13px] text-[#FAF6F0] shadow-lg"
                >
                  ✓ {state.toast}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <nav aria-label="أقسام بيعة" className="flex justify-between border-t border-[#E4DFD8] bg-[#FAF6F0] px-3.5 py-2.5 text-[12px]">
          {TABS.map((t) =>
            t.id === "more" ? (
              <span key={t.id} className="px-1 py-1 text-[#AFAAA3]">
                {t.label}
              </span>
            ) : (
              <button
                key={t.id}
                type="button"
                aria-current={state.tab === t.id ? "page" : undefined}
                onClick={() => dispatch({ type: "tab", tab: t.id as Tab })}
                className={`rounded-lg px-1 py-1 transition-colors ${
                  state.tab === t.id ? "font-semibold text-[#1A6444]" : "text-[#6B6259] hover:text-[#17130F]"
                }`}
              >
                {t.label}
              </button>
            )
          )}
        </nav>
      </div>

      <p className="m-0 flex items-center gap-2 whitespace-nowrap text-[11px] text-smoke">
        Tap the phone · nothing is saved
        {state.touched && (
          <>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => {
                onPlayingChange(false);
                dispatch({ type: "reset" });
              }}
              className="uppercase tracking-[0.1em] text-frost hover:underline"
            >
              Reset ↺
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default Bee3aDemo;
