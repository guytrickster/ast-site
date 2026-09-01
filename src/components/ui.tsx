import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowRight, CheckCircle2, ChevronRight, Loader2, Paperclip, ShieldCheck, Trash2, X,
} from "lucide-react";
import { SITE, useFakeSubmit, useInView } from "../lib/site";
import type { StockStatus } from "../data/catalog";
import { STOCK_META } from "../data/catalog";
import { cn } from "../utils/cn";

/* ---------------- Reveal ---------------- */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);
  return (
    <div
      ref={ref}
      className={cn("reveal", inView && "is-in", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------------- Section head ---------------- */
export function SectionHead({
  kicker,
  title,
  sub,
  invert = false,
  className = "",
}: {
  kicker: string;
  title: ReactNode;
  sub?: string;
  invert?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <div className="flex items-center gap-3">
        <span className="h-px w-10 bg-brand" />
        <span className="tech-label text-brand">{kicker}</span>
      </div>
      <h2
        className={cn(
          "h-display mt-4 text-[clamp(1.7rem,3.6vw,3rem)]",
          invert ? "text-ink" : "text-white",
        )}
      >
        {title}
      </h2>
      {sub && (
        <p className={cn("mt-4 text-[15px] leading-relaxed", invert ? "text-graphite/80" : "text-steel")}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ---------------- Buttons ---------------- */
export function Btn({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  size = "md",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "dark";
  className?: string;
  size?: "md" | "sm";
}) {
  /* чистая индустриальная кнопка с мягко скруглёнными углами */
  const base =
    "group inline-flex items-center justify-center gap-2.5 rounded-md font-display font-bold uppercase transition-all duration-300 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
  const sizes = {
    md: "px-8 py-4 text-[12px] tracking-[0.16em]",
    sm: "px-6 py-3.5 text-[11px] tracking-[0.14em]",
  } as const;
  const styles = {
    primary:
      "bg-brand text-ink hover:bg-brand-2 hover:shadow-[0_14px_36px_-12px_rgba(255,107,0,0.6)] active:translate-y-px active:shadow-none",
    ghost:
      "border border-line-2 bg-ink-2/60 text-fog backdrop-blur-sm hover:border-brand hover:text-white active:bg-ink-3",
    dark: "border border-line bg-ink text-fog hover:border-brand-2 hover:text-white",
  } as const;
  if (href) {
    return (
      <a href={href} className={cn(base, sizes[size], styles[variant], className)}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cn(base, sizes[size], styles[variant], className)}>
      {children}
    </button>
  );
}

export function Arrow() {
  return (
    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
  );
}

/* ---------------- Stock badge ---------------- */
const toneCls: Record<string, string> = {
  ok: "text-ok border-ok/30 bg-ok/10",
  warn: "text-warn border-warn/30 bg-warn/10",
  info: "text-xray border-xray/30 bg-xray/10",
  dim: "text-steel border-line-2 bg-ink-3",
};
export function StockBadge({ status, full = false }: { status: StockStatus; full?: boolean }) {
  const meta = STOCK_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border px-2.5 py-1.5 text-[11px] font-medium tracking-wide",
        toneCls[meta.tone],
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-70 anim-ring", {
          "bg-ok": meta.tone === "ok",
          "bg-warn": meta.tone === "warn",
          "bg-xray": meta.tone === "info",
          "bg-steel": meta.tone === "dim",
        })} />
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", {
          "bg-ok": meta.tone === "ok",
          "bg-warn": meta.tone === "warn",
          "bg-xray": meta.tone === "info",
          "bg-steel": meta.tone === "dim",
        })} />
      </span>
      {full ? meta.label : meta.short}
    </span>
  );
}

export function PartStatusBadge({ status }: { status: "in_stock" | "on_order" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-1 text-[10.5px] font-medium whitespace-nowrap",
        status === "in_stock" ? toneCls.ok : toneCls.info,
      )}
    >
      <span className={cn("h-1 w-1 rounded-full", status === "in_stock" ? "bg-ok" : "bg-xray")} />
      {status === "in_stock" ? "На складе в Чите" : "Под заказ"}
    </span>
  );
}

/* ---------------- Lead modal ---------------- */
interface LeadCtx {
  open: (subject?: string) => void;
}
const LeadContext = createContext<LeadCtx>({ open: () => {} });
export const useLead = () => useContext(LeadContext);

const inputCls =
  "w-full bg-ink border border-line-2 px-4 py-3.5 text-sm text-white placeholder:text-dim outline-none transition-colors focus:border-brand";

export function LeadProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [consent, setConsent] = useState(true);
  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const { state, submit, reset } = useFakeSubmit();

  const open = useCallback((s = "") => {
    setSubject(s);
    setFiles([]);
    setOpen(true);
    reset();
  }, [reset]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  return (
    <LeadContext.Provider value={{ open }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-ink/85 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-xl border border-line-2 bg-ink-2 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-ink-2 px-6 py-5 sm:px-8">
              <div>
                <div className="tech-label text-brand">Заявка инженеру · ТКП до 24 часов</div>
                <h3 className="h-display mt-2 text-xl text-white">Связаться с инженером АСТ</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="cursor-pointer border border-line-2 p-2 text-steel transition-colors hover:border-brand hover:text-white"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {state === "done" ? (
              <div className="px-6 py-10 sm:px-8">
                <CheckCircle2 className="h-12 w-12 text-ok" />
                <h4 className="h-display mt-5 text-lg text-white">Заявка принята в работу</h4>
                <p className="mt-3 text-sm leading-relaxed text-steel">
                  Ведущий инженер направления подготовит технико-коммерческое предложение и свяжется
                  с вами <b className="text-fog">в течение 24 часов</b>. Если вопрос срочный —
                  звоните <a className="text-brand" href={SITE.phoneHref}>{SITE.phone}</a> (бесплатно по РФ)
                  или пишите на <a className="text-brand" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
                </p>
                <Btn className="mt-7" onClick={() => setOpen(false)}>
                  Понятно
                </Btn>
              </div>
            ) : (
              <form
                className="px-6 py-6 sm:px-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
              >
                {subject && (
                  <div className="mb-5 flex items-center gap-3 border border-brand/30 bg-brand/10 px-4 py-3 text-[13px] text-brand-2">
                    <ChevronRight className="h-4 w-4 shrink-0" />
                    <span className="truncate">{subject}</span>
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required placeholder="Ваше имя *" className={inputCls} />
                  <input required type="tel" placeholder="Телефон *" className={inputCls} />
                  <input type="email" placeholder="E-mail для ТКП" className={inputCls} />
                  <input placeholder="Компания / карьер" className={inputCls} />
                </div>
                <textarea
                  rows={3}
                  defaultValue={subject ? `Интересует: ${subject}` : ""}
                  placeholder="Задача: порода, входная фракция, требуемый продукт, т/ч…"
                  className={cn(inputCls, "mt-4 resize-none")}
                />

                {/* вложения: ведомость, чертёж, фото бирки */}
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept=".xlsx,.xls,.csv,.pdf,.doc,.docx,.txt,.zip,.rar,.jpg,.jpeg,.png,.dwg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      setFiles((p) => [
                        ...p,
                        ...Array.from(e.target.files!).map((f) => ({ name: f.name, size: f.size })),
                      ]);
                    }
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 border border-dashed border-line-2 px-4 py-3 text-[12.5px] text-steel transition-colors hover:border-brand hover:text-white"
                >
                  <Paperclip className="h-4 w-4 text-brand" />
                  Прикрепить ведомость, чертёж или фото бирки
                </button>
                {files.length > 0 && (
                  <div className="mt-2 grid min-w-0 gap-2">
                    {files.map((f, i) => (
                      <div
                        key={i}
                        className="flex min-w-0 items-center gap-3 border border-line/70 bg-ink px-3 py-2 text-[12px]"
                      >
                        <Paperclip className="h-3.5 w-3.5 shrink-0 text-brand" />
                        <span className="min-w-0 flex-1 truncate text-fog" title={f.name}>
                          {f.name}
                        </span>
                        <span className="shrink-0 text-dim tnum">{Math.round(f.size / 1024)} КБ</span>
                        <button
                          type="button"
                          onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}
                          className="shrink-0 cursor-pointer text-dim transition-colors hover:text-brand"
                          aria-label="Убрать файл"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="mt-4 flex cursor-pointer items-start gap-3 text-[12.5px] leading-relaxed text-steel">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#FF6B00]"
                  />
                  <span>
                    Я соглашаюсь с{" "}
                    <a href="#/privacy" onClick={() => setOpen(false)} className="text-brand underline underline-offset-2">
                      Политикой конфиденциальности
                    </a>{" "}
                    и даю согласие на обработку персональных данных (ФЗ № 152). Данные хранятся в дата-центрах на территории РФ.
                  </span>
                </label>
                <div className="btn-row mt-6">
                  <Btn variant="primary">
                    {state === "sending" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Отправка…
                      </>
                    ) : (
                      <>
                        Получить ТКП за 24 ч <Arrow />
                      </>
                    )}
                  </Btn>
                  <div className="flex items-center gap-2 text-[11.5px] text-dim">
                    <ShieldCheck className="h-4 w-4 text-ok" />
                    Без скриптов продаж. Разговор с инженером.
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </LeadContext.Provider>
  );
}
