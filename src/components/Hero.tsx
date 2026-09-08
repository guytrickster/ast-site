import { FileCheck2, FileSpreadsheet, Factory, ShieldCheck, Timer } from "lucide-react";
import heroImg from "../assets/hero-quarry.jpg";
import { SITE } from "../lib/site";
import { PARTS_TOTAL } from "../data/catalog";
import { Arrow, Btn, useLead } from "./ui";
import { cn } from "../utils/cn";

const TICKER = [
  "Инжиниринг процессов дробления",
  "Импорт и поставка Liming",
  "Монтаж и шефмонтаж",
  "Гарантийное обслуживание",
  "Запчасти со склада в Чите",
  "Выезд инженера в любой регион РФ и СНГ",
];

/** ведущие мировые производители ДСО (кроме российских) — бегущая строка под шапкой */
const BRANDS = [
  "Liming Heavy Industry", "Sandvik", "Kleemann", "Terex", "Powerscreen", "Extec",
  "Metso", "FLSmidth", "Weir Trio", "Telsmith", "Astec KPI·JCI", "McCloskey",
  "Keestrack", "Tesab", "Hazemag", "ThyssenKrupp", "BHS Sonthofen", "Pilot Crushtec",
];

export function Hero() {
  const lead = useLead();
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* фон */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Гранитный карьер: работа дробильно-сортировочного комплекса Liming"
          className="anim-kb h-full w-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/78 to-ink/28" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/72" />
        <div className="u-grid-dark absolute inset-0 opacity-35 mix-blend-overlay" />
      </div>

      {/* контент */}
      {/* бегущая строка брендов — сразу под шапкой */}
      <div className="relative mt-[68px] border-y border-line/60 bg-ink/78 py-2.5 backdrop-blur-sm lg:mt-[106px]">
        <div className="flex overflow-hidden">
          <div className="anim-marquee flex w-max shrink-0">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i} className="flex items-center whitespace-nowrap" aria-hidden={i >= BRANDS.length}>
                <span className="h-1.5 w-1.5 rotate-45 bg-line-2" />
                <span className={cn(
                  "px-8 font-display text-[12.5px] font-extrabold uppercase tracking-[0.2em]",
                  b.startsWith("Liming") ? "text-brand" : "text-fog/80",
                )}>
                  {b}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-4 pt-14 pb-24 sm:px-6 lg:pt-16">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-3 border border-line-2 bg-ink/55 px-4 py-2.5 backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4 shrink-0 text-brand" />
            <span className="leading-tight">
              <span className="hidden whitespace-nowrap font-bold uppercase tracking-[0.14em] text-fog sm:block sm:text-[11px]">
                Официальный дилер и импортёр Henan Liming Heavy Industry
              </span>
              <span className="block whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.12em] text-fog sm:hidden">
                Официальный дилер Liming Heavy Industry
              </span>
              <span className="mt-1 block whitespace-nowrap text-[9.5px] font-semibold uppercase tracking-[0.2em] text-dim">
                в России, Новороссии и странах СНГ
              </span>
            </span>
          </div>

          <h1 className="h-display mt-7 text-[clamp(1.45rem,4.5vw,5.4rem)] text-white">
            Дробильно-сортировочные <span className="text-brand">комплексы</span> под ключ
          </h1>

          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-fog/90 sm:text-lg">
            Проектирование, поставка и шефмонтаж оборудования Liming под физико-механические свойства
            вашей породы. Заводская гарантия, запчасти со склада в Чите, сервисные бригады по всей
            России и СНГ — <b className="text-white">без посредников и «серых» цепочек</b>.
          </p>

          <div className="mt-9 grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
            <Btn href="#/catalog" className="w-full sm:w-auto">
              Каталог оборудования <Arrow />
            </Btn>
            <Btn
              variant="ghost"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
              onClick={() => lead.open("Расчёт ТКП: дробильно-сортировочный комплекс")}
            >
              <Timer className="h-4 w-4 shrink-0 text-brand" />
              <span className="text-center">Расчёт ТКП — до 24 часов</span>
            </Btn>
            <Btn 
              href="#/parts" 
              variant="ghost" 
              className="w-full sm:w-auto flex items-center justify-center gap-2">
              <FileSpreadsheet className="h-4 w-4 shrink-0 text-brand" />
              <span className="text-center">Пакетный запрос по ведомости</span>
            </Btn>
          </div>

          {/* факты */}
          <div className="mt-12 grid max-w-3xl grid-cols-2 gap-px border border-line/70 bg-line/40 sm:grid-cols-4">
            {[
              { icon: FileCheck2, v: "24 ч", t: "расчёт ТКП инженером" },
              { icon: Factory, v: PARTS_TOTAL.toLocaleString("ru-RU"), t: "запчастей в каталоге" },
              { icon: Timer, v: "24/7", t: "сервисная поддержка" },
              { icon: ShieldCheck, v: "350+", t: "выездов сервисных бригад" },
            ].map((f, i) => (
              <div key={i} className="bg-ink/72 p-4 backdrop-blur-sm">
                <f.icon className="h-4 w-4 text-brand" />
                <div className="mt-3 font-display text-2xl font-extrabold text-white tnum">{f.v}</div>
                <div className="mt-1 text-[10.5px] uppercase tracking-[0.12em] text-dim leading-snug">{f.t}</div>
              </div>
            ))}
          </div>
        </div>


      </div>

      {/* бегущая строка */}
      <div className="relative border-t border-line/70 bg-ink/85 py-3.5 backdrop-blur">
        <div className="flex overflow-hidden">
          <div className="anim-marquee flex w-max shrink-0">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} className="flex items-center whitespace-nowrap" aria-hidden={i >= TICKER.length}>
                <span className="h-1 w-1 rounded-full bg-brand" />
                <span className="px-10 font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-steel">
                  {t}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <a href={`tel:${SITE.phoneHref.replace("tel:", "")}`} className="sr-only">
        {SITE.phone}
      </a>
    </section>
  );
}
