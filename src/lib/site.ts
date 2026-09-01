import { useCallback, useEffect, useRef, useState } from "react";

/* ================= константы компании ================= */
export const SITE = {
  name: "ООО «АСТ-Карьерные решения»",
  short: "АСТ-Карьерные решения",
  phone: "8 (800) 505-00-66",
  phoneHref: "tel:88005050066",
  email: "ms@asiaspectrade.ru",
  address: "672000, Забайкальский край, г. Чита, Романовский тракт, 41",
  hours: "Пн–Пт 08:00–20:00 (мск) · Сервис — 24/7",
  inn: "ИНН 7536010101",
  ogrn: "ОГРН 1227500010101",
} as const;

/* ================= хелперы ================= */
export const fmtNum = (n: number, digits = 0): string =>
  n
    .toFixed(digits)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/** hash-router */
export interface Route {
  page: string;
  param?: string;
}

export function parseHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, "");
  const [page = "", param] = h.split("/");
  return { page: page || "home", param };
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash());
  useEffect(() => {
    const fn = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  return route;
}

export const go = (to: string) => {
  window.location.hash = to;
};

/** появление при скролле */
export function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/** анимированный счётчик */
export function useCountUp(target: number, run: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(target * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);
  return val;
}

/** состояние «успешно отправлено» */
export function useFakeSubmit() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const timer = useRef<number | undefined>(undefined);
  const submit = useCallback(() => {
    setState("sending");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("done"), 900);
  }, []);
  const reset = useCallback(() => setState("idle"), []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return { state, submit, reset };
}
