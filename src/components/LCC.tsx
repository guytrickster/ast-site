import { useMemo, useState } from "react";
import { Calculator, TrendingDown, Wrench } from "lucide-react";
import { fmtNum } from "../lib/site";
import { Arrow, Btn, SectionHead, useLead } from "./ui";

const MONTHS = 36;

interface Model {
  label: string;
  color: string;
  machine: number; // млн ₽
  setPrice: number; // млн ₽ за комплект
  setLifeT: number; // ресурс комплекта, тонн
  riskPerMonth: number; // млн ₽/мес ожидаемый ущерб
}
const ORIG: Omit<Model, "label" | "color"> = { machine: 28.0, setPrice: 2.4, setLifeT: 700_000, riskPerMonth: 0.008 };
const GRAY: Omit<Model, "label" | "color"> = { machine: 26.2, setPrice: 1.75, setLifeT: 320_000, riskPerMonth: 4.5 * (0.12 / 12) };

const DOWNTIME_COST = 18_000; // ₽/ч простоя линии
const DOWNTIME_H = 6; // ч на замену комплекта

export function LCC() {
  const [volume, setVolume] = useState(600); // тыс. т/год
  const [abrasive, setAbrasive] = useState(0.85); // коэффициент ресурса: гранит жёстче
  const lead = useLead();

  const data = useMemo(() => {
    const tPerMonth = (volume * 1000) / 12;
    const build = (m: Omit<Model, "label" | "color">) => {
      const lifeT = m.setLifeT * abrasive;
      const setsPerMonth = tPerMonth / lifeT;
      const monthly =
        setsPerMonth * m.setPrice +
        (setsPerMonth * DOWNTIME_H * DOWNTIME_COST) / 1e6 +
        m.riskPerMonth;
      const pts: number[] = [];
      for (let i = 0; i <= MONTHS; i++) pts.push(m.machine + monthly * i);
      return { pts, monthly, setLifeT: lifeT };
    };
    const o = build(ORIG);
    const g = build(GRAY);
    const economy = g.pts[MONTHS] - o.pts[MONTHS];
    let cross = -1;
    for (let i = 1; i <= MONTHS; i++) {
      if (o.pts[i] <= g.pts[i]) {
        cross = i;
        break;
      }
    }
    // маштаб графика
    const maxV = Math.max(o.pts[MONTHS], g.pts[MONTHS]) * 1.04;
    const W = 760, H = 300, P = { l: 52, r: 16, t: 14, b: 30 };
    const x = (i: number) => P.l + ((W - P.l - P.r) * i) / MONTHS;
    const y = (v: number) => P.t + (H - P.t - P.b) * (1 - v / maxV);
    const line = (pts: number[]) => pts.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    const area = (pts: number[]) =>
      `${line(pts)} L${x(MONTHS).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;
    return { o, g, economy, cross, W, H, P, x, y, maxV, line, area };
  }, [volume, abrasive]);

  const gridY = [0.25, 0.5, 0.75, 1].map((k) => data.maxV * k);

  return (
    <section id="lcc" className="relative overflow-hidden border-t border-line bg-ink-2 py-24">
      <div className="u-grid-dark absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6">
        <SectionHead
          kicker="LCC · Life Cycle Cost"
          title={<>Калькулятор стоимости <span className="text-brand">владения</span></>}
          sub="Цена машины — только первая строка сметы. Смоделируйте 36 месяцев эксплуатации: оригинальные детали Liming против «аналогов» — по ресурсу броней, простоям и риску внепланового ремонта. Модель сверена со статистикой обслуживаемых нами линий."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0 border border-line-2 bg-ink p-4 sm:p-6">
            {/* управление */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                  <span>Годовой объём переработки</span>
                  <span className="text-brand-2 tnum">{fmtNum(volume)} тыс. т</span>
                </div>
                <input
                  type="range" min={100} max={2400} step={50} value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="u-range w-full"
                  style={{ ["--fill" as string]: `${((volume - 100) / 2300) * 100}%` }}
                  aria-label="Годовой объём переработки"
                />
              </div>
              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                  Абразивность породы
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { k: 1.1, t: "Известняк" },
                    { k: 0.85, t: "Гранит" },
                    { k: 0.68, t: "Кварцит" },
                  ].map((r) => (
                    <button
                      key={r.t}
                      onClick={() => setAbrasive(r.k)}
                      className={`cursor-pointer border px-2 py-2 text-[11px] font-semibold transition-colors ${
                        abrasive === r.k
                          ? "border-brand bg-brand/10 text-brand-2"
                          : "border-line-2 text-dim hover:text-fog"
                      }`}
                    >
                      {r.t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* график */}
            <div className="mt-6 -mx-2 overflow-x-auto px-2">
              <svg viewBox={`0 0 ${data.W} ${data.H}`} className="h-auto w-full min-w-[460px]">
                <defs>
                  <linearGradient id="lccGray" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#98A2AE" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#98A2AE" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lccOrig" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* сетка */}
                {gridY.map((v, i) => (
                  <g key={i}>
                    <line x1={data.P.l} x2={data.W - data.P.r} y1={data.y(v)} y2={data.y(v)} stroke="#2c3038" strokeDasharray="3 5" />
                    <text x={data.P.l - 8} y={data.y(v) + 4} textAnchor="end" fontSize="10" fill="#6c7684" fontFamily="Roboto">
                      {fmtNum(Math.round(v))}
                    </text>
                  </g>
                ))}
                <text x={data.P.l - 8} y={data.y(0) + 4} textAnchor="end" fontSize="10" fill="#6c7684">0</text>
                <text x={8} y={18} fontSize="10" fill="#6c7684" fontFamily="Roboto">млн ₽, накопительно</text>
                {[0, 6, 12, 18, 24, 30, 36].map((m) => (
                  <text key={m} x={data.x(m)} y={data.H - 10} textAnchor="middle" fontSize="10" fill="#6c7684" fontFamily="Roboto">
                    {m} мес
                  </text>
                ))}

                {/* площади и линии */}
                <path d={data.area(data.g.pts)} fill="url(#lccGray)" />
                <path d={data.area(data.o.pts)} fill="url(#lccOrig)" />
                <path d={data.line(data.g.pts)} fill="none" stroke="#98A2AE" strokeWidth="2" strokeDasharray="7 5" />
                <path d={data.line(data.o.pts)} fill="none" stroke="#FF6B00" strokeWidth="2.6" />

                {/* точка пересечения */}
                {data.cross > 0 && (
                  <g>
                    <line x1={data.x(data.cross)} x2={data.x(data.cross)} y1={data.y(data.o.pts[data.cross])} y2={data.y(0)} stroke="#FF6B00" strokeOpacity="0.45" strokeDasharray="4 5" />
                    <circle cx={data.x(data.cross)} cy={data.y(data.o.pts[data.cross])} r="5" fill="#FF6B00" />
                    <circle cx={data.x(data.cross)} cy={data.y(data.o.pts[data.cross])} r="11" fill="none" stroke="#FF6B00" strokeOpacity="0.5" />
                    <text x={data.x(data.cross) + 14} y={data.y(data.o.pts[data.cross]) - 10} fontSize="11" fill="#FFB066" fontFamily="Roboto" fontWeight="500">
                      {data.cross}-й месяц: оригинал выходит вперёд
                    </text>
                  </g>
                )}

                {/* концевые метки */}
                <text x={data.W - data.P.r} y={data.y(data.g.pts[MONTHS]) - 10} textAnchor="end" fontSize="11" fill="#98A2AE" fontFamily="Roboto">
                  «аналоги» {fmtNum(Math.round(data.g.pts[MONTHS]))} млн ₽
                </text>
                <text x={data.W - data.P.r} y={data.y(data.o.pts[MONTHS]) + 18} textAnchor="end" fontSize="11" fill="#FF8A3D" fontFamily="Roboto" fontWeight="600">
                  оригинал Liming {fmtNum(Math.round(data.o.pts[MONTHS]))} млн ₽
                </text>
              </svg>
            </div>

            <p className="mt-3 text-[11px] leading-relaxed text-dim">
              Допущения модели: комплект быстроизнашиваемых деталей — полная обвязка камеры; замена — {DOWNTIME_H} ч
              простоя при стоимости часа простоя {fmtNum(DOWNTIME_COST)} ₽; риск внепланового ремонта узлов у
              «аналогов» — 12% годовых (средняя тяжесть случая 4,5 млн ₽). Цифры — для оценки порядка экономики,
              не оферта.
            </p>
          </div>

          {/* итоги */}
          <div className="grid min-w-0 content-start gap-4">
            <div className="border border-brand/40 bg-brand/10 p-6">
              <div className="flex items-center gap-2 tech-label text-brand">
                <TrendingDown className="h-4 w-4" /> Экономия за 36 мес
              </div>
              <div className="mt-3 font-display text-[42px] font-extrabold leading-none text-white tnum">
                {fmtNum(Math.round(data.economy))} <span className="text-lg text-steel">млн ₽</span>
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-steel">
                Разница нарастающих затрат: оригинальные детали Liming против «аналогов» при текущих вводных.
              </p>
            </div>
            <div className="border border-line-2 bg-ink p-6">
              <div className="flex items-center gap-2 tech-label text-brand">
                <Wrench className="h-4 w-4" /> Межсервисный интервал
              </div>
              <div className="mt-4 space-y-3 text-[13px]">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <span className="text-steel">Оригинал Liming</span>
                  <span className="font-semibold text-ok tnum">{fmtNum(Math.round(data.o.setLifeT / 1000))} тыс. т</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-steel">«Аналоги»</span>
                  <span className="font-semibold text-warn tnum">{fmtNum(Math.round(data.g.setLifeT / 1000))} тыс. т</span>
                </div>
              </div>
            </div>
            <div className="border border-line-2 bg-ink p-6">
              <div className="flex items-center gap-2 tech-label text-brand">
                <Calculator className="h-4 w-4" /> Точный расчёт — бесплатно
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-steel">
                Подставим ваши фактические фракции, фонд времени и график ТО — пришлём LCC-модель в Excel вместе с ТКП
                <b className="text-fog"> в течение 24 часов</b>.
              </p>
              <Btn className="mt-5 w-full" onClick={() => lead.open("LCC-расчёт стоимости владения и ТКП")}>
                Запросить LCC-модель <Arrow />
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
