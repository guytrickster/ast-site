import { useMemo, useState } from "react";
import { FlaskConical, Layers, Mountain, RotateCcw, Gauge } from "lucide-react";
import { PRODUCTS, type Product, type Rock } from "../data/catalog";
import { Arrow, Btn, SectionHead, StockBadge, useLead } from "./ui";
import { cn } from "../utils/cn";

interface Params {
  rock?: Rock;
  input?: number;
  frac?: number;
  cap?: number;
}

const STEPS = [
  {
    key: "rock" as const,
    title: "Тип породы",
    icon: Mountain,
    options: [
      { v: "granite", label: "Гранит / диабаз / кварцит", hint: "абразивная, до 320 МПа" },
      { v: "limestone", label: "Известняк / доломит / мергель", hint: "мягкая и средняя, до 150 МПа" },
    ],
  },
  {
    key: "input" as const,
    title: "Макс. кусок на входе",
    icon: Layers,
    options: [
      { v: 400, label: "до 400 мм", hint: "после взрыва, ДОЗ" },
      { v: 650, label: "до 650 мм", hint: "крупнокусковая руда" },
      { v: 1000, label: "до 1000 мм", hint: "первичка из-под экскаватора" },
    ],
  },
  {
    key: "frac" as const,
    title: "Требуемая фракция",
    icon: FlaskConical,
    options: [
      { v: 3, label: "0–5 мм", hint: "песок класса I" },
      { v: 12, label: "5–20 мм", hint: "мелкий щебень" },
      { v: 30, label: "20–40 мм", hint: "ходовая фракция" },
      { v: 55, label: "40–70 мм", hint: "балласт, отсыпка" },
      { v: 90, label: "70+ мм", hint: "бутовый камень, рядовой" },
    ],
  },
  {
    key: "cap" as const,
    title: "Производительность",
    icon: Gauge,
    options: [
      { v: 120, label: "до 120 т/ч", hint: "малый карьер" },
      { v: 250, label: "250 т/ч", hint: "средняя линия" },
      { v: 400, label: "400 т/ч", hint: "крупное производство" },
      { v: 600, label: "600+ т/ч", hint: "ГОК / федеральный проект" },
    ],
  },
];

function fracFits(p: Product, f: number) {
  return p.outMin - 2 <= f && f <= p.outMax + 2;
}
function capFits(p: Product, n: number) {
  return n <= p.cap[1] * 1.12 && n >= p.cap[0] * 0.35;
}

/** построение цепочек дробления до 3 стадий */
function buildChains(params: Required<Params>): Product[][] {
  const pool = PRODUCTS.filter(
    (p) => p.filterable && p.rocks.includes(params.rock) && capFits(p, params.cap),
  );
  const chains: Product[][] = [];
  const extend = (chain: Product[], feed: number): void => {
    const last = chain[chain.length - 1];
    if (fracFits(last, params.frac)) {
      chains.push(chain);
      return;
    }
    if (chain.length >= 3) return;
    const next = pool
      .filter(
        (p) =>
          !chain.includes(p) &&
          p.inputMax * 1.15 >= Math.min(feed, last.outMax) &&
          p.outMax < last.outMax, // крупность обязана падать по цепочке
      )
      .sort((a, b) => Math.abs((a.cap[0] + a.cap[1]) / 2 - params.cap) - Math.abs((b.cap[0] + b.cap[1]) / 2 - params.cap));
    for (const n of next.slice(0, 2)) extend([...chain, n], Math.min(feed, last.outMax));
  };
  const primaries = pool
    .filter((p) => p.inputMax >= params.input)
    .sort((a, b) => Math.abs((a.cap[0] + a.cap[1]) / 2 - params.cap) - Math.abs((b.cap[0] + b.cap[1]) / 2 - params.cap));
  for (const pr of primaries.slice(0, 3)) extend([pr], params.input);
  // сортировка: сначала короткие цепочки, внутри — близость по мощности
  chains.sort(
    (a, b) =>
      a.length - b.length ||
      scoreChain(a, params.cap) - scoreChain(b, params.cap),
  );
  const seen = new Set<string>();
  return chains.filter((c) => {
    const k = c.map((p) => p.id).join(">");
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 3);
}
function scoreChain(chain: Product[], need: number) {
  return chain.reduce((s, p) => s + Math.abs((p.cap[0] + p.cap[1]) / 2 - need), 0);
}

export function SmartFilter() {
  const [params, setParams] = useState<Params>({});
  const lead = useLead();
  const done = params.rock && params.input && params.frac !== undefined && params.cap;
  const chains = useMemo(() => (done ? buildChains(params as Required<Params>) : []), [done, params]);

  const pick = (key: keyof Params, v: unknown) =>
    setParams((p) => ({ ...p, [key]: p[key] === v ? undefined : (v as never) }));

  return (
    <section id="smart-filter" className="relative overflow-hidden border-t border-line bg-ink py-24">
      <div className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-brand/8 blur-[140px]" />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6">
        <SectionHead
          kicker="Smart-подбор за 4 шага"
          title={<>Соберите схему дробления <span className="text-brand">под вашу породу</span></>}
          sub="Алгоритм использует реальные ограничения машин: входной кусок, диапазон выходной фракции и коридор производительности. Если одна машина не закрывает задачу — система достроит цепочку из двух-трёх стадий, как это делает наш технолог."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]">
          {/* шаги */}
          <div className="grid gap-7">
            {STEPS.map((step, idx) => {
              const chosen = params[step.key] !== undefined;
              return (
                <div key={step.key} className={cn("transition-opacity duration-500", idx > 0 && !params[STEPS[idx - 1].key] && "opacity-35 pointer-events-none")}>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "flex h-8 w-8 items-center justify-center border font-display text-[12px] font-extrabold",
                      chosen ? "border-brand bg-brand text-ink" : "border-line-2 text-dim",
                    )}>
                      {idx + 1}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <step.icon className="h-4 w-4 text-brand" />
                      <span className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-white">
                        {step.title}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3.5 grid gap-2 sm:grid-cols-2">
                    {step.options.map((o) => {
                      const val = typeof o.v === "string" ? o.v : Number(o.v);
                      const isOn = params[step.key] === val;
                      return (
                        <button
                          key={String(o.v)}
                          onClick={() => pick(step.key, val)}
                          className={cn(
                            "group cursor-pointer border px-4 py-3 text-left transition-all duration-200",
                            isOn
                              ? "border-brand bg-brand/10 shadow-[inset_0_0_0_1px_rgba(255,107,0,0.35)]"
                              : "border-line bg-ink-2 hover:border-line-2 hover:bg-ink-3",
                          )}
                        >
                          <div className={cn("text-[13.5px] font-semibold", isOn ? "text-brand-2" : "text-fog")}>
                            {o.label}
                          </div>
                          <div className="mt-0.5 text-[11px] text-dim">{o.hint}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => setParams({})}
              className="inline-flex cursor-pointer items-center gap-2 self-start text-[11px] uppercase tracking-[0.2em] text-dim transition-colors hover:text-brand"
            >
              <RotateCcw className="h-3.5 w-3.5" /> сбросить параметры
            </button>
          </div>

          {/* результат */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="border border-line-2 bg-ink-2">
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <span className="tech-label text-brand">Результат подбора</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim tnum">
                  {done ? `${chains.length} схемы` : "ожидание ввода"}
                </span>
              </div>

              {!done ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-10 text-center">
                  <div className="relative">
                    <span className="anim-ring absolute inset-0 rounded-full border border-brand/50" />
                    <div className="border border-line-2 bg-ink p-4">
                      <FlaskConical className="h-7 w-7 text-brand" />
                    </div>
                  </div>
                  <p className="max-w-xs text-[13px] leading-relaxed text-dim">
                    Пройдите 4 шага слева — система отфильтрует парк оборудования и покажет оптимальные схемы дробления.
                  </p>
                </div>
              ) : chains.length === 0 ? (
                <div className="p-8">
                  <p className="text-sm leading-relaxed text-steel">
                    Под эти параметры требуется индивидуальный расчёт (нестандартное сочетание
                    крупности и производительности). Инженер АСТ подготовит схему вручную — пришлите вводные.
                  </p>
                  <Btn
                    className="mt-5"
                    onClick={() => lead.open(`Индивидуальный расчёт схемы: ${describe(params)}`)}
                  >
                    Отправить вводные инженеру <Arrow />
                  </Btn>
                </div>
              ) : (
                <div className="grid gap-4 p-5">
                  {chains.map((chain, ci) => (
                    <div key={ci} className="border border-line bg-ink p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                          Схема {String.fromCharCode(65 + ci)} · {chain.length === 1 ? "одна машина" : `${chain.length} стадии`}
                        </span>
                        <span className="font-mono text-[10px] text-dim">
                          {paramsInput(chain)}
                        </span>
                      </div>
                      <div className="grid gap-2">
                        {chain.map((p, pi) => (
                          <a
                            key={p.id}
                            href={`#/product/${p.id}`}
                            className="group flex items-center gap-4 border border-line bg-ink-2 p-3 transition-colors hover:border-brand/60"
                          >
                            <img src={p.img} alt={p.title} className="h-14 w-20 shrink-0 object-cover" />
                            <div className="min-w-0 flex-1">
                              <div className="text-[9.5px] uppercase tracking-[0.18em] text-dim">
                                Стадия {["I", "II", "III"][pi]} · {p.tag}
                              </div>
                              <div className="mt-0.5 truncate font-display text-[13.5px] font-extrabold uppercase text-white transition-colors group-hover:text-brand-2">
                                {p.name}
                              </div>
                              <div className="mt-1 text-[11px] text-steel tnum">
                                вход до {p.inputMax} мм → {p.outMin}–{p.outMax} мм · {p.cap[0]}–{p.cap[1]} т/ч
                              </div>
                            </div>
                            <Arrow />
                          </a>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        {chain.length > 1 && <StockBadge status="on_order" />}
                        <button
                          onClick={() =>
                            lead.open(`Расчёт ТКП по схеме ${String.fromCharCode(65 + ci)}: ${chain.map((p) => p.name).join(" → ")} (${describe(params)})`)
                          }
                          className="ml-auto cursor-pointer font-display text-[11px] font-bold uppercase tracking-[0.16em] text-brand underline-offset-4 transition-colors hover:text-brand-2 hover:underline"
                        >
                          Расчёт ТКП по этой схеме →
                        </button>
                      </div>
                    </div>
                  ))}
                  <p className="px-1 pt-1 text-[11.5px] leading-relaxed text-dim">
                    Подбор ориентировочный: точную конфигурацию (камеры дробления, сита, мощности)
                    инженер зафиксирует в ТКП после анализа пробы породы. Срок расчёта — до 24 часов.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function describe(p: Params) {
  const rock = p.rock === "granite" ? "гранит" : "известняк";
  return `${rock}, вход до ${p.input ?? "?"} мм, фракция до ${p.frac ?? "?"} мм, ${p.cap ?? "?"} т/ч`;
}
function paramsInput(chain: Product[]) {
  const total = chain.reduce((s, p) => s + Number(String(p.cap[1]).replace(/\D+/g, "") || 0), 0);
  return `${chain.length} агрег. · пик ${total} т/ч`;
}
