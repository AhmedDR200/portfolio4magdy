import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "dark" | "light";

type SettingsContextValue = {
  theme: Theme;
  reduceMotion: boolean;
  toggleTheme: () => void;
  toggleReduceMotion: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

const THEME_KEY = "portfolio-theme";
const MOTION_KEY = "portfolio-reduce-motion";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
};

const getInitialReduceMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(MOTION_KEY);
  if (stored === "true") return true;
  if (stored === "false") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [reduceMotion, setReduceMotion] = useState<boolean>(
    getInitialReduceMotion
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-reduce-motion",
      String(reduceMotion)
    );
    localStorage.setItem(MOTION_KEY, String(reduceMotion));
  }, [reduceMotion]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      theme,
      reduceMotion,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      toggleReduceMotion: () => setReduceMotion((m) => !m),
    }),
    [theme, reduceMotion]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return ctx;
};
