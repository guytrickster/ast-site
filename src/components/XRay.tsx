import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Crosshair, Info, Ruler, Scan } from "lucide-react";
import crusherImg from "../assets/crusher-jaw.jpg";
import { Arrow, Btn, SectionHead, useLead } from "./ui";
import { cn } from "../utils/cn";

/* Позиции узлов — в системе координат viewBox 1536×1024 под сгенерированное фото */
interface XNode {
  id: string;
  x: number;
  y: number;
  name: string;
  sku: string;
  weight: string;
  status: "in_stock" | "on_order";
  note: string;
}

const NODES: XNode[] = [
  {
    id: "flywheel", x: 272, y: 424,
    name: "Маховик в сборе", sku: "C6X125-02-03", weight: "2 260 кг", status: "on_order",
    note: "Кованый маховик гасит пиковые нагрузки при захвате куска и выравнивает нагрузку на сеть.",
  },
  {
    id: "sheave", x: 552, y: 372,
    name: "Шкив привода клиноремённый", sku: "C6X125-03-07", weight: "1 120 кг", status: "on_order",
    note: "Съёмная конусная втулка — замена без перепрессовки вала.",
  },
  {
    id: "eshaft", x: 902, y: 540,
    name: "Эксцентриковый вал", sku: "C6X125-02-01", weight: "1 480 кг", status: "on_order",
    note: "Сталь 34ХН1М, закалка ТВЧ посадочных мест. Поставка с подшипниками 23176-CA/W33.",
  },
  {
    id: "movableplate", x: 1002, y: 452,
    name: "Плита дробящая подвижная", sku: "C6X125-31.01-02", weight: "1 890 кг", status: "in_stock",
    note: "Высокомарганцовистая сталь Mn18Cr2. На складе в Чите — комплект с клиньями.",
  },
  {
    id: "fixedplate", x: 1218, y: 442,
    name: "Плита дробящая неподвижная", sku: "C6X125-31.01-01", weight: "1 745 кг", status: "in_stock",
    note: "Симметричный профиль — переворачивается при износе, двойной ресурс.",
  },
  {
    id: "toggle", x: 886, y: 716,
    name: "Распорная плита", sku: "C6X125-09-04", weight: "412 кг", status: "in_stock",
    note: "Предохранительный узел: первой принимает удар недробимого тела.",
  },
  {
    id: "cheek", x: 1150, y: 652,
    name: "Футеровка боковая (щека)", sku: "C6X125-06-09", weight: "96 кг", status: "in_stock",
    note: "Защита станины в зоне дробления. Износ контролируется шаблоном при каждом ТО.",
  },
  {
    id: "hydra", x: 585, y: 782,
    name: "Гидростанция регулировки щели", sku: "C6X125-HU-01", weight: "210 кг", status: "on_order",
    note: "Клиновая регулировка CSS без остановки линии дольше 15 минут.",
  },
];

export function XRay() {
  const [level, setLevel] = useState(0); // 0..1 экспозиция
  const [active, setActive] = useState<XNode>(NODES[3]);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const lead = useLead();
  const touched = useRef(false);

  /* авто-демонстрация: плавный набор экспозиции до максимума при первом показе */
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now() + 500;
    const tick = (t: number) => {
      if (touched.current) return;
      const p = Math.min(1, Math.max(0, (t - t0) / 2400));
      const e = 1 - Math.pow(1 - p, 3);
      setLevel(e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const setManual = (v: number) => {
    touched.current = true;
    setLevel(v);
  };

  const xrayOn = level > 0.04;
  const kv = Math.round(120 + level * 330);
  const mas = (12 + level * 130).toFixed(1);

  const baseFilter = useMemo(() => {
    const l = level;
    return `grayscale(${l * 100}%) invert(${(l * 0.92 * 100).toFixed(0)}%) contrast(${(
      1 + l * 0.65
    ).toFixed(2)}) brightness(${(1 - l * 0.08).toFixed(2)}) sepia(${(l * 100).toFixed(0)}%) hue-rotate(${
      175 * l
    }deg) saturate(${(1 + l * 1.4).toFixed(2)})`;
  }, [level]);

  return (
    <section id="xray" className="relative border-t border-line bg-ink-2 py-24 overflow-hidden">
      <div className="u-grid absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6">
        <SectionHead
          kicker="Инженерный модуль · Industrial CT"
          title={<>«Рентген» корпуса: посмотрите машину <span className="text-brand">изнутри</span></>}
          sub="Радиографическая визуализация щековой дробилки серии JCE/C6X. Увеличьте экспозицию — корпус «просветится» и обнажит узлы: эксцентриковый вал, дробящие плиты, распорную плиту. Клик по маркеру — карточка запчасти с артикулом."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.75fr_1fr]">
          {/* рамка визуализации */}
          <div className="xray-frame u-noise u-scanlines relative aspect-[3/2] select-none overflow-hidden border border-line-2 bg-black">
            {/* базовое фото */}
            <img
              src={crusherImg}
              alt="Щековая дробилка Liming в разрезе — просвет корпуса"
              className="xray-photo absolute inset-0 h-full w-full object-cover"
              style={{
                filter: `brightness(${1 - level * 0.34}) saturate(${1 - level * 0.55}) contrast(${1 + level * 0.12})`,
                opacity: 1 - level * 0.72,
              }}
              draggable={false}
            />
            {/* радиография (инверсия реального снимка) */}
            <img
              src={crusherImg}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: baseFilter, opacity: 0.16 + level * 0.84, transition: "opacity .18s linear" }}
              draggable={false}
            />

            {/* сетка и HUD */}
            <div className="u-grid absolute inset-0" style={{ opacity: 0.25 + level * 0.75 }} />
            {xrayOn && (
              <div className="anim-scany absolute left-0 h-[3px] w-full bg-gradient-to-r from-transparent via-xray/80 to-transparent shadow-[0_0_24px_rgba(127,217,255,0.8)]" />
            )}
            <div className="pointer-events-none absolute inset-0 anim-flick">
              {/* угловые скобы */}
              {(["top-3 left-3 border-t-2 border-l-2", "top-3 right-3 border-t-2 border-r-2", "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"] as const).map((pos, i) => (
                <span key={i} className={cn("absolute h-7 w-7 border-xray/70 transition-opacity duration-300", pos)} style={{ opacity: 0.3 + level * 0.7 }} />
              ))}
              <Crosshair className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-xray/30" strokeWidth={1} />
            </div>

            {/* схема внутренних узлов */}
            <svg
              viewBox="0 0 1536 1024"
              className="anim-flick absolute inset-0 h-full w-full"
              style={{ opacity: level, transition: "opacity .18s linear" }}
              preserveAspectRatio="xMidYMid slice"
            >
              <g stroke="#7FD9FF" strokeWidth="2" fill="none" opacity="0.95" style={{ filter: "drop-shadow(0 0 6px rgba(127,217,255,0.9))" }}>
                {/* камера дробления */}
                <path d="M846 300 L1348 300 L1312 836 L928 836 Z" strokeDasharray="10 8" opacity="0.55" />
                {/* приёмное окно */}
                <path d="M880 300 L1320 300" strokeWidth="3" />
                <path d="M880 300 L846 372 M1320 300 L1348 372" opacity="0.8" />
                {/* неподвижная плита */}
                <path d="M1266 322 L1206 812" strokeWidth="5" />
                {Array.from({ length: 9 }).map((_, i) => (
                  <path key={i} d={`M${1258 - i * 7.6} ${352 + i * 54} l 26 -4`} opacity="0.85" />
                ))}
                {/* подвижная щека и плита */}
                <path d="M952 330 L1088 824" strokeWidth="2.5" opacity="0.8" />
                <path d="M986 342 L1108 810" strokeWidth="5" />
                {Array.from({ length: 9 }).map((_, i) => (
                  <path key={i} d={`M${996 + i * 13.6} ${372 + i * 52} l 24 6`} opacity="0.85" />
                ))}
                {/* разгрузочная щель */}
                <path d="M1110 836 L1204 836" strokeWidth="3" strokeDasharray="4 6" />
                {/* эксцентриковый вал */}
                <circle cx="930" cy="566" r="46" strokeWidth="3" />
                <circle cx="930" cy="566" r="20" strokeWidth="2.4" />
                <circle cx="942" cy="556" r="5" fill="#7FD9FF" />
                <path d="M872 566 a58 58 0 0 1 116 0" strokeDasharray="6 10" opacity="0.7">
                  <animate attributeName="stroke-dashoffset" from="0" to="-64" dur="2.4s" repeatCount="indefinite" />
                </path>
                {/* распорная плита */}
                <path d="M736 742 L950 706 L962 742 L748 780 Z" opacity="0.85" />
                {/* тяга пружинная */}
                <path d="M560 800 L880 772" strokeWidth="2.5" />
                {Array.from({ length: 12 }).map((_, i) => (
                  <path key={i} d={`M${596 + i * 22} ${796 - i * 2.1} l 7 12`} opacity="0.6" />
                ))}
                {/* маховик-шкив узел */}
                <circle cx="272" cy="424" r="238" opacity="0.5" strokeDasharray="14 10" />
                <circle cx="272" cy="424" r="72" opacity="0.75" />
                <circle cx="552" cy="372" r="150" opacity="0.55" />
                <circle cx="552" cy="372" r="40" opacity="0.8" />
                {/* гидроблок */}
                <rect x="500" y="740" width="170" height="92" rx="4" opacity="0.8" />
                <path d="M500 786 L670 786 M585 740 L585 832" opacity="0.5" />
              </g>
              {/* подписи узлов */}
              <g fill="#9FE6FF" fontSize="17" fontFamily="Roboto, sans-serif" letterSpacing="1.5" opacity="0.9">
                <text x="846" y="284">ЗАГРУЗКА</text>
                <text x="1108" y="872">CSS 100–250 MM</text>
                <text x="944" y="526" fontSize="15">ВАЛ</text>
              </g>
            </svg>

            {/* горячие точки */}
            {xrayOn &&
              NODES.map((n) => (
                <button
                  key={n.id}
                  onMouseEnter={() => setHoverId(n.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onFocus={() => setHoverId(n.id)}
                  onBlur={() => setHoverId(null)}
                  onClick={() => setActive(n)}
                  aria-label={n.name}
                  className="group/dot absolute z-10 cursor-pointer outline-none"
                  style={{ left: `${(n.x / 1536) * 100}%`, top: `${(n.y / 1024) * 100}%`, transform: "translate(-50%,-50%)" }}
                >
                  <span
                    className={cn(
                      "absolute inline-flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full border",
                      active.id === n.id ? "border-brand" : "border-xray/70",
                    )}
                    style={{ animation: "ringPulse 2.1s cubic-bezier(.2,.6,.4,1) infinite" }}
                  />
                  <span
                    className={cn(
                      "relative block h-3 w-3 rounded-full border-2 transition-all duration-200 group-hover/dot:scale-150",
                      active.id === n.id ? "bg-brand border-brand shadow-[0_0_18px_rgba(255,107,0,0.95)]" : "bg-xray border-xray shadow-[0_0_14px_rgba(127,217,255,0.9)]",
                    )}
                  />
                  <span
                    className={cn(
                      "pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap border border-xray/40 bg-ink/90 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-xray transition-opacity duration-200",
                      hoverId === n.id ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {n.name}
                  </span>
                </button>
              ))}

            {/* HUD-подписи */}
            <div className="absolute left-4 top-4 z-10 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-xray/90 sm:block" style={{ opacity: 0.25 + level * 0.75 }}>
              AST·INDUSTRIAL CT 2.4 — щековая дробилка C6X
            </div>
            <div className="absolute right-4 top-4 z-10 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-xray/90 tnum" style={{ opacity: 0.25 + level * 0.75 }}>
              {kv} kV · {mas} mA·s
              <br />
              экспозиция {Math.round(level * 100)}%
            </div>
            <div className="absolute bottom-4 left-4 z-10 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-xray/80 sm:flex" style={{ opacity: 0.25 + level * 0.75 }}>
              <Ruler className="h-3.5 w-3.5" /> масштаб 1:24 · вид слева, просвет станины
            </div>
          </div>

          {/* правая панель */}
          <div className="flex flex-col gap-5">
            <div className="border border-line bg-ink p-5">
              <div className="tech-label text-brand">Режим визуализации</div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setManual(0)}
                  className={cn(
                    "flex cursor-pointer items-center justify-center gap-2 border px-3 py-3 font-display text-[11px] font-bold uppercase tracking-[0.14em] transition-colors",
                    !xrayOn ? "border-brand bg-brand/10 text-white" : "border-line-2 text-dim hover:text-fog",
                  )}
                >
                  <Camera className="h-4 w-4" /> Фото
                </button>
                <button
                  onClick={() => setManual(1)}
                  className={cn(
                    "flex cursor-pointer items-center justify-center gap-2 border px-3 py-3 font-display text-[11px] font-bold uppercase tracking-[0.14em] transition-colors",
                    xrayOn ? "border-xray bg-xray/10 text-xray" : "border-line-2 text-dim hover:text-fog",
                  )}
                >
                  <Scan className="h-4 w-4" /> Рентген
                </button>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                  <span>Интенсивность экспозиции</span>
                  <span className="tnum">{Math.round(level * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(level * 100)}
                  onChange={(e) => setManual(Number(e.target.value) / 100)}
                  className="u-range w-full"
                  style={{ ["--fill" as string]: `${level * 100}%` }}
                  aria-label="Интенсивность рентген-экспозиции"
                />
              </div>
              <p className="mt-4 flex gap-2 text-[12px] leading-relaxed text-dim">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-xray" />
                Наведите курсор на маркер — подсказка, клик — карточка узла с заводским артикулом и статусом склада.
              </p>
            </div>

            {/* карточка активного узла */}
            <div className="relative flex-1 border border-line bg-ink p-5">
              <div className="tech-label text-xray">Узел · карточка запчасти</div>
                <div className="mt-4">
                  <h3 className="font-display text-[19px] font-extrabold uppercase leading-tight text-white">
                    {active.name}
                  </h3>
                  <div className="mt-3 grid gap-px border border-line bg-line/60 text-[12.5px] sm:grid-cols-3">
                    <div className="bg-ink-2 p-3">
                      <div className="text-[9.5px] uppercase tracking-[0.18em] text-dim">Артикул</div>
                      <div className="mt-1 font-mono text-brand-2">{active.sku}</div>
                    </div>
                    <div className="bg-ink-2 p-3">
                      <div className="text-[9.5px] uppercase tracking-[0.18em] text-dim">Масса</div>
                      <div className="mt-1 text-fog tnum">{active.weight}</div>
                    </div>
                    <div className="bg-ink-2 p-3">
                      <div className="text-[9.5px] uppercase tracking-[0.18em] text-dim">Статус</div>
                      <div className={cn("mt-1 font-semibold", active.status === "in_stock" ? "text-ok" : "text-xray")}>
                        {active.status === "in_stock" ? "Склад · Чита" : "Под заказ"}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-[13px] leading-relaxed text-steel">{active.note}</p>
                  <Btn
                    className="mt-5 w-full"
                    onClick={() => lead.open(`Запчасть: ${active.name}, арт. ${active.sku}`)}
                  >
                    Запросить цену и наличие <Arrow />
                  </Btn>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
