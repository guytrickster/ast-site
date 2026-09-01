import { useMemo, useState } from "react";
import {
  ArrowRight, ChevronRight, Download, FileText, ListChecks, PackageSearch, Search, Table2, Wrench,
} from "lucide-react";
import { brandOf, CAT_NAME, CATEGORIES, PRODUCTS, type CatId, type Part, type Product } from "../data/catalog";
import { normalizeKey } from "../data/catalog";
import { Arrow, Btn, PartStatusBadge, Reveal, SectionHead, StockBadge, useLead } from "../components/ui";
import { PlantImg } from "../components/SafeImg";
import { ImgSmart } from "../components/ImgSmart";
import { photoOf } from "../data/photos";
import { cn } from "../utils/cn";

/** фото машины: официальный кадр завода Liming, при недоступности CDN — локальный визуал */
export function ProductImg({
  p,
  className,
  alt,
  eager = false,
}: {
  p: Product;
  className: string;
  alt?: string;
  eager?: boolean;
}) {
  const { remote, local } = photoOf(p);
  return (
    <ImgSmart
      remote={remote}
      fallback={local}
      alt={alt ?? p.title}
      className={className}
      eager={eager}
    />
  );
}

/* PlantImg используется для кадра линии с маскировкой сторонних шильдов */
export { PlantImg };

/* ---------------- карточка товара ---------------- */
export function ProductCard({ p, hit }: { p: Product; hit?: Part | null }) {
  const lead = useLead();
  return (
    <div className="group relative flex h-full flex-col overflow-hidden border border-line bg-ink-2 transition-colors duration-300 hover:border-line-2">
      <a href={`#/product/${p.id}`} className="relative block h-52 overflow-hidden">
        <ProductImg
          p={p}
          className="absolute inset-0 h-full w-full object-cover opacity-85 transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent" />
        <div className="absolute left-4 top-4">
          <StockBadge status={p.stock} />
        </div>
      </a>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]">
          <span className="text-brand">{CAT_NAME[p.cat]}</span>
          <span className="text-line-2">/</span>
          <span className="text-dim">{brandOf(p)}</span>
        </div>
        <a href={`#/product/${p.id}`} className="mt-1.5 font-display text-[17px] font-extrabold uppercase leading-tight text-white transition-colors hover:text-brand-2">
          {p.title}
        </a>
        <div className="mt-1 text-[11.5px] uppercase tracking-[0.12em] text-dim">{p.tag}</div>

        {hit && (
          <div className="mt-3 flex items-center gap-2 border border-brand/35 bg-brand/10 px-3 py-2 text-[11.5px] text-brand-2">
            <PackageSearch className="h-4 w-4 shrink-0" />
            <span className="truncate">Запчасть по запросу: {hit.name} · арт. {hit.sku}</span>
          </div>
        )}

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-4 text-[12px] tnum">
          <div>
            <dt className="text-dim">Вход</dt>
            <dd className="font-semibold text-fog">до {p.inputMax} мм</dd>
          </div>
          <div>
            <dt className="text-dim">Фракция</dt>
            <dd className="font-semibold text-fog">{p.outMin}–{p.outMax} мм</dd>
          </div>
          <div>
            <dt className="text-dim">Производит.</dt>
            <dd className="font-semibold text-fog">{p.cap[0]}–{p.cap[1]} т/ч</dd>
          </div>
          <div>
            <dt className="text-dim">Бренд</dt>
            <dd className="font-semibold text-fog">Liming / АСТ</dd>
          </div>
        </dl>

        <div className="mt-5 flex items-center gap-3 pt-1">
          <a
            href={`#/product/${p.id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 border border-line-2 px-4 py-3 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-fog transition-colors hover:border-brand hover:text-white"
          >
            ТТХ и чертежи <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={() => lead.open(`ТКП: ${p.title}`)}
            className="cursor-pointer bg-brand px-4 py-3 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-brand-2"
          >
            ТКП 24 ч
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- страница каталога ---------------- */
const isCat = (c?: string): c is CatId => !!c && CATEGORIES.some((x) => x.id === c);

export function CatalogPage({ cat }: { cat?: string }) {
  const [q, setQ] = useState("");
  const activeCat = isCat(cat) ? cat : undefined;

  const results = useMemo(() => {
    const nq = normalizeKey(q);
    const list = PRODUCTS.filter((p) => !activeCat || p.cat === activeCat);
    if (!nq) return list.map((p) => ({ p, hit: null as Part | null }));
    return list
      .map((p): { p: Product; hit: Part | null } | null => {
        const inMachine = normalizeKey(`${p.title} ${p.name} ${p.tag}`).includes(nq);
        const part = p.parts.find(
          (pt) => normalizeKey(pt.sku).includes(nq) || normalizeKey(pt.name).includes(nq),
        );
        if (inMachine) return { p, hit: null };
        if (part) return { p, hit: part };
        return null;
      })
      .filter((x): x is { p: Product; hit: Part | null } => !!x);
  }, [q, activeCat]);

  return (
    <div className="bg-ink pt-32 sm:pt-36">
      <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-6">
        <SectionHead
          kicker="Каталог оборудования"
          title={activeCat ? (<>Категория: <span className="text-brand">{CAT_NAME[activeCat]}</span></>) : (<>Дробильно-сортировочное <span className="text-brand">оборудование</span></>)}
          sub="Дилерская линейка Henan Liming Heavy Industry с официальными заводскими фото и спецификациями: щековые, конусные, роторные и центробежно-ударные дробилки, грохоты, питатели, мобильные комплексы и конвейеры. Запчасти поставляем и для техники других марок — по заводским каталожным номерам."
        />

        {/* поиск + категории */}
        <div className="mt-10 flex flex-col gap-5">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dim" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Модель или артикул: HPT300, броня конуса, PE750x1060.02-01…"
              className="w-full border border-line-2 bg-ink-2 py-4 pl-12 pr-4 text-sm text-white placeholder:text-dim outline-none transition-colors focus:border-brand"
            />
            {q && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.16em] text-dim tnum">
                {results.length} поз.
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="#/catalog"
              className={cn(
                "border px-4 py-2.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] transition-colors",
                !activeCat ? "border-brand bg-brand text-ink" : "border-line-2 text-steel hover:border-brand hover:text-white",
              )}
            >
              Все разделы
            </a>
            {CATEGORIES.map((c) => (
              <a
                key={c.id}
                href={`#/catalog/${c.id}`}
                className={cn(
                  "border px-4 py-2.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] transition-colors",
                  activeCat === c.id ? "border-brand bg-brand text-ink" : "border-line-2 text-steel hover:border-brand hover:text-white",
                )}
              >
                {c.name}
              </a>
            ))}
            <a
              href="#/parts"
              className="border border-brand/40 bg-brand/10 px-4 py-2.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-brand-2 transition-colors hover:bg-brand/20"
            >
              Запчасти по артикулу →
            </a>
          </div>
        </div>

        {/* сетка */}
        {results.length === 0 ? (
          <div className="mt-12 border border-line bg-ink-2 p-10 text-center">
            <PackageSearch className="mx-auto h-10 w-10 text-dim" />
            <p className="mt-4 text-sm text-steel">
              По запросу «{q}» ничего не найдено. Проверьте артикул или пришлите его инженеру — выполним
              кросс-номенклатурный подбор по заводским каталогам Liming.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map(({ p, hit }, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <ProductCard p={p} hit={hit} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- карточка товара ---------------- */
export function ProductPage({ id }: { id?: string }) {
  const lead = useLead();
  const p = PRODUCTS.find((x) => x.id === id) ?? PRODUCTS[0];
  const related = PRODUCTS.filter((x) => x.id !== p.id && x.cat === p.cat)
    .concat(PRODUCTS.filter((x) => x.id !== p.id && x.cat !== p.cat))
    .slice(0, 3);

  const tabs = [
    { to: "sec-ttx", label: "Характеристики", icon: ListChecks },
    { to: "sec-files", label: "Чертежи и габариты", icon: FileText },
    { to: "sec-parts", label: `Запчасти · ${p.parts.length}`, icon: Table2 },
    { to: "sec-quote", label: "Запросить цену", icon: Wrench },
  ];
  const scrollTo = (to: string) =>
    document.getElementById(to)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="bg-ink pt-28 sm:pt-32">
      {/* шапка карточки */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-dim">
          <a href="#/catalog" className="transition-colors hover:text-brand">Каталог</a>
          <ChevronRight className="h-3 w-3" />
          <a href={`#/catalog/${p.cat}`} className="transition-colors hover:text-brand">{CAT_NAME[p.cat]}</a>
          <ChevronRight className="h-3 w-3" />
          <span className="text-fog">{p.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_1fr]">
          <div className="relative overflow-hidden border border-line-2 bg-black">
            <ProductImg p={p} className="h-full max-h-[480px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <div className="absolute left-4 top-4 flex gap-2">
              <StockBadge status={p.stock} full />
            </div>
            <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
              {p.name} · официальное фото Henan Liming Heavy Industry
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="tech-label text-brand">{p.tag}</div>
              <span className="border border-line-2 px-2 py-1 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-steel">
                {brandOf(p)}
              </span>
            </div>
            <h1 className="h-display mt-3 text-[clamp(1.7rem,3.4vw,2.9rem)] text-white">{p.title}</h1>
            <p className="mt-4 text-[14.5px] leading-relaxed text-steel">{p.desc}</p>

            <div className="mt-6 grid grid-cols-2 gap-px border border-line bg-line/60 sm:grid-cols-3">
              {p.ttx.slice(0, 6).map(([k, v]) => (
                <div key={k} className="bg-ink-2 p-3.5">
                  <div className="text-[9.5px] uppercase tracking-[0.14em] text-dim">{k}</div>
                  <div className="mt-1 text-[13px] font-semibold text-fog tnum">{v}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Btn onClick={() => lead.open(`ТКП: ${p.title} (производительность ${p.cap[0]}–${p.cap[1]} т/ч)`)}>
                Запросить цену и ТКП <Arrow />
              </Btn>
              <Btn variant="ghost" onClick={() => lead.open(`Документация и чертежи: ${p.title}`)}>
                <Download className="h-4 w-4" /> Чертежи PDF/DWG
              </Btn>
            </div>
            <p className="mt-4 text-[12px] text-dim">
              Расчёт ТКП — до 24 часов. Цена проектная, зависит от комплектации и логистики — не публичная оферта.
            </p>
          </div>
        </div>
      </div>

      {/* липкое техническое меню */}
      <div className="sticky top-[64px] z-40 mt-10 border-y border-line bg-ink/95 backdrop-blur-md sm:top-[68px]">
        <div className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-4 sm:px-6">
          {tabs.map((t) => (
            <button
              key={t.to}
              onClick={() => scrollTo(t.to)}
              className="flex shrink-0 cursor-pointer items-center gap-2 border-b-2 border-transparent px-4 py-4 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-steel transition-colors hover:border-brand hover:text-white"
            >
              <t.icon className="h-4 w-4 text-brand" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-6">
        {/* ТТХ */}
        <section id="sec-ttx" className="scroll-mt-40 pt-14">
          <h2 className="h-display text-2xl text-white">Технические характеристики</h2>
          <div className="mt-6 overflow-hidden border border-line">
            {p.ttx.map(([k, v], i) => (
              <div key={k} className={cn("grid grid-cols-[1fr_1.2fr] sm:grid-cols-[1fr_2fr]", i % 2 && "bg-ink-2")}>
                <div className="border-r border-line px-5 py-3.5 text-[13px] text-steel">{k}</div>
                <div className="px-5 py-3.5 text-[13.5px] font-semibold text-fog tnum">{v}</div>
              </div>
            ))}
            <div className="border-t border-line bg-ink-2 px-5 py-3.5 text-[12px] text-dim">
              Характеристики соответствуют официальным спецификациям завода Henan Liming Heavy Industry.
              Итоговая конфигурация фиксируется в ТКП.
            </div>
          </div>
        </section>

        {/* Документация */}
        {p.files.length > 0 && (
        <section id="sec-files" className="scroll-mt-40 pt-14">
          <h2 className="h-display text-2xl text-white">Чертежи и габариты</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {p.files.map((f) => (
              <div key={f.name} className="flex items-center gap-4 border border-line bg-ink-2 p-4">
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center border font-display text-[10px] font-extrabold",
                  f.type === "PDF" ? "border-brand/50 text-brand" : "border-xray/50 text-xray",
                )}>
                  {f.type}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-mono text-[12px] text-fog">{f.name}</div>
                  <div className="mt-0.5 text-[11px] text-dim">{f.size} · высылается вместе с ТКП</div>
                </div>
                <button
                  onClick={() => lead.open(`Документация: ${f.name} (${p.title})`)}
                  className="shrink-0 cursor-pointer border border-line-2 px-3.5 py-2.5 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-fog transition-colors hover:border-brand hover:text-white"
                >
                  Получить
                </button>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* Запчасти */}
        <section id="sec-parts" className="scroll-mt-40 pt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="h-display text-2xl text-white">Запчасти и расходные материалы для ТО</h2>
              <p className="mt-2 text-[13px] text-dim">
                Применяется в: <span className="text-brand-2">{p.title}</span> ·{" "}
                {brandOf(p) === "Liming" || brandOf(p) === "АСТ"
                  ? "оригинальные заводские артикулы"
                  : "оригинальные каталожные номера производителя"}
              </p>
            </div>
            <Btn variant="ghost" href="#/parts">Вся база запчастей</Btn>
          </div>

          <div className="mt-6 overflow-x-auto border border-line">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-ink-2 text-[10px] uppercase tracking-[0.16em] text-dim">
                  <th className="px-5 py-3.5 font-semibold">Наименование</th>
                  <th className="px-5 py-3.5 font-semibold">Заводской артикул</th>
                  <th className="px-5 py-3.5 font-semibold">Масса</th>
                  <th className="px-5 py-3.5 font-semibold">Наличие</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {p.parts.map((pt) => (
                  <tr key={pt.sku} id={pt.sku} className="border-b border-line/60 transition-colors hover:bg-ink-2/70">
                    <td className="px-5 py-4 text-[13.5px] text-fog">{pt.name}</td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-[13px] text-brand-2">{pt.sku}</span>
                      <span className="sr-only" aria-hidden>{pt.sku.replace(/[^0-9A-Za-zА-Яа-яЁё]+/g, "")}</span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-steel tnum">{pt.weight.toLocaleString("ru-RU")} кг</td>
                    <td className="px-5 py-4"><PartStatusBadge status={pt.status} /></td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => lead.open(`Запчасть: ${pt.name}, арт. ${pt.sku} (для ${p.title})`)}
                        className="cursor-pointer border border-brand/50 px-3.5 py-2 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-brand transition-colors hover:bg-brand hover:text-ink"
                      >
                        Цена и срок
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section id="sec-quote" className="scroll-mt-40 pt-14">
          <div className="relative overflow-hidden border border-brand/40 bg-gradient-to-br from-brand/15 to-ink p-8 sm:p-10">
            <div className="u-grid-dark absolute inset-0 opacity-30" />
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-xl">
                <h3 className="h-display text-xl text-white sm:text-2xl">ТКП по {p.name} — до 24 часов</h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-steel">
                  В предложение войдут: цена с комплектацией, график поставки и шефмонтажа, спецификация
                  расходных материалов на первый год и условия заводской гарантии Liming.
                </p>
              </div>
              <Btn onClick={() => lead.open(`ТКП: ${p.title}`)}>Получить ТКП <Arrow /></Btn>
            </div>
          </div>
        </section>

        {/* похожие */}
        <section className="pt-16">
          <h2 className="h-display text-2xl text-white">Смотрите также</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((rp) => (
              <ProductCard key={rp.id} p={rp} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
