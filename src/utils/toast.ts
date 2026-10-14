import { useSyncExternalStore } from "react";

import type { IconName } from "../components/atoms/Icon";

export type Toast = {
  id: number;
  icon: IconName;
  /** The small line above the title, like "Achievement unlocked". */
  kicker: string;
  title: string;
  ar: string;
  /** volt: good news; paper: secrets and warnings; ink-on-volt: the big one. */
  tone?: "volt" | "paper" | "legend";
  /** Shown on the right, like "5 / 12". */
  meta?: string;
};

// Notifications shown at the top right (achievements, honor milestones).
let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export const showToast = (toast: Omit<Toast, "id">) => {
  toasts = [...toasts, { ...toast, id: nextId++ }].slice(-3);
  emit();
};

export const dismissToast = (id: number) => {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useToasts = () => useSyncExternalStore(subscribe, () => toasts);
