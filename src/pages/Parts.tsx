import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronRight, PackageSearch, ScanBarcode, Search } from "lucide-react";
import { PART_INDEX, normalizeKey } from "../data/catalog";
import { PARTS_GROUPS } from "../data/partsDb";
import { BatchDrop } from "../components/BatchDrop";
import { Btn, PartStatusBadge, SectionHead, useLead } from "../components/ui";
import { cn } from "../utils/cn";

const POPULAR = [
  "HPT300-4-01", "PE750x1060.02-01", "1277.05.311-1", "C6X125-31.01", "ГИС52",
  "била", "сито", "22322", "N11921408", "442.7983",
];

const PAGE = 50;

export function PartsPage() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<string | undefined>();
  const [limit, setLimit] = useState(PAGE);
  const lead = useLead();
  const nq = useMemo(() => normalizeKey(q), [q]);

  /* поиск идёт по предвычисленным ключам — без regex на каждый символ ввода */
  const filtered = useMemo(() => {
    let all: typeof PART_INDEX = PART_INDEX;
    if (group) all = all.filter((p) => p.group === group);
    if (!nq) return all;

    const exact: typeof PART_INDEX = [];
    const partial: typeof PART_INDEX = [];
    for (const p of all) {
      if (p.nsku.startsWith(nq)) exact.push(p);
      else if (p.nsku.includes(nq) || p.nname.includes(nq)) partial.push(p);
    }
    return exact.concat(partial);
  }, [nq, group]);

  useEffect(() => setLimit(PAGE), [nq, group]);
  const list = filtered.slice(0, limit);
  const total = PART_INDEX.length;

  return (
    <div className="bg-ink pt-32 sm:pt-36">
      <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-6">
        <SectionHead
          kicker="Склад запчастей · г. Чита"
          title={<>Запчасти по <span className="text-brand">заводскому артикулу</span></>}
          sub={`Онлайн-база — ${total.toLocaleString("ru-RU")} позиций с оригинальными каталожными номерами. Отгрузка со склада в Чите либо прямая поставка с завода.`}
        />

        {/* ── ПАКЕТНЫЙ ЗАПРОС ── */}
        <section id="batch" className="mt-10 scroll-mt-32">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <ScanBarcode className="h-5 w-5 text-brand" />
            <h2 className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-white">
              Пакетный запрос: дефектная ведомость целиком
            </h2>
            <span className="border border-brand/40 bg-brand/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-2">
              ТКП за 24 часа
            </span>
          </div>
          <BatchDrop />
          <p className="mt-4 flex items-start gap-2 text-[12px] leading-relaxed text-dim">
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            Инженер АСТ разберёт заявку по артикулам, проверит остатки склада и вернёт ТКП со сроками поставки.
            Приоритет разбора — у заявок с фотографиями бирок и серийных номеров машин.
          </p>
        </section>

        {/* ── визуальный разделитель ── */}
        <div className="my-14 flex items-center gap-4" aria-hidden>
          <span className="h-px flex-1 bg-line" />
          <span className="border border-line-2 bg-ink-2 px-4 py-2 font-display text-[10px] font-bold uppercase tracking-[0.22em] text-dim">
            или найдите позицию сами
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>

        {/* ── ПОИСК ── */}
        <section id="search" className="scroll-mt-32">
          <h2 className="h-display text-2xl text-white sm:text-3xl">
            Поиск по <span className="text-brand">каталожному номеру</span>
          </h2>
          <p className="mt-4 max-w-4xl text-[14px] leading-relaxed text-steel">
            Оригинальные запчасти для дробилок, грохотов, питателей и конвейеров: дробящие плиты, брони конуса,
            била, сита, втулки, подпятники, подшипники и вибровозбудители. Поиск устойчив к дефисам, пробелам и
            регистру: «hpt 300 4 01» и «HPT300-4-01» — одна и та же броня.
          </p>

          <div className="mt-7 max-w-3xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dim" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Артикул или название: HST160.06-01, броня КМД, 22322, N11921408…"
                className="w-full border border-line-2 bg-ink-2 py-4 pl-12 pr-24 text-sm text-white outline-none transition-colors placeholder:text-dim focus:border-brand"
                aria-label="Поиск запчастей по артикулу"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.16em] text-dim tnum">
                {filtered.length.toLocaleString("ru-RU")}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[10.5px] uppercase tracking-[0.16em] text-dim">Часто ищут:</span>
              {POPULAR.map((t) => (
                <button
                  key={t}
                  onClick={() => setQ(t)}
                  className={cn(
                    "cursor-pointer border px-2.5 py-1.5 font-mono text-[11px] transition-colors",
                    nq === normalizeKey(t)
                      ? "border-brand bg-brand/10 text-brand-2"
                      : "border-line-2 text-steel hover:border-brand hover:text-white",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* группы номенклатуры */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setGroup(undefined)}
              className={cn(
                "cursor-pointer border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                !group ? "border-brand bg-brand/10 text-brand-2" : "border-line text-dim hover:border-line-2 hover:text-fog",
              )}
            >
              Вся номенклатура
            </button>
            {PARTS_GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => setGroup((v) => (v === g ? undefined : g))}
                className={cn(
                  "cursor-pointer border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                  group === g ? "border-brand bg-brand/10 text-brand-2" : "border-line text-dim hover:border-line-2 hover:text-fog",
                )}
              >
                {g}
              </button>
            ))}
          </div>

          {/* таблица */}
          <div className="mt-6 overflow-x-auto border border-line">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-ink-2 text-[10px] uppercase tracking-[0.16em] text-dim">
                  <th className="px-5 py-3.5 font-semibold">Наименование</th>
                  <th className="px-5 py-3.5 font-semibold">Артикул / каталожный №</th>
                  <th className="px-5 py-3.5 font-semibold">Применяется в</th>
                  <th className="px-5 py-3.5 font-semibold">Наличие</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {list.map((pt, i) => (
                  <tr key={`${pt.sku}-${i}`} className="border-b border-line/60 transition-colors hover:bg-ink-2/70">
                    <td className="px-5 py-4 text-[13.5px] text-fog">{pt.name}</td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-[13px] text-brand-2">{pt.sku}</span>
                      <span className="sr-only" aria-hidden>{pt.sku.replace(/[^0-9A-Za-zА-Яа-яЁё]+/g, "")}</span>
                    </td>
                    <td className="px-5 py-4 text-[12.5px] text-steel">
                      {pt.parentId ? (
                        <a href={`#/product/${pt.parentId}`} className="group inline-flex items-center gap-1.5 transition-colors hover:text-brand-2">
                          {pt.parentName}
                          <ArrowRight className="h-3.5 w-3.5 text-dim transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
                        </a>
                      ) : (
                        pt.fits
                      )}
                    </td>
                    <td className="px-5 py-4"><PartStatusBadge status={pt.status} /></td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() =>
                          lead.open(`Запчасть: ${pt.name}, арт. ${pt.sku}${pt.parentName ? ` (для ${pt.parentName})` : pt.fits ? ` (${pt.fits})` : ""}`)
                        }
                        className="cursor-pointer border border-brand/50 px-3.5 py-2 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-brand transition-colors hover:bg-brand hover:text-ink"
                      >
                        Запросить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="p-10 text-center">
                <PackageSearch className="mx-auto h-10 w-10 text-dim" />
                <p className="mx-auto mt-4 max-w-md text-sm text-steel">
                  Артикул «{q}» в онлайн-базе не найден. Это не значит, что детали нет: пришлите номер инженеру —
                  проверим по заводским каталогам и складским остаткам офлайн.
                </p>
                <Btn className="mx-auto mt-5" onClick={() => lead.open(`Офлайн-проверка артикула: ${q}`)}>
                  Проверить артикул у инженера
                </Btn>
              </div>
            )}
          </div>

          {limit < filtered.length && (
            <button
              onClick={() => setLimit((v) => v + PAGE * 4)}
              className="mt-4 w-full cursor-pointer border border-line-2 bg-ink-2 py-3.5 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-steel transition-colors hover:border-brand hover:text-white"
            >
              Показать ещё — осталось {(filtered.length - limit).toLocaleString("ru-RU")} позиций
            </button>
          )}
        </section>

        {/* ── SEO-навигация по номенклатуре ── */}
        <section className="mt-16 border-t border-line pt-12">
          <h2 className="h-display text-2xl text-white sm:text-3xl">
            Какие запчасти для ДСО мы <span className="text-brand">поставляем</span>
          </h2>
          <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-steel">
            АСТ-Карьерные решения снабжает дробильно-сортировочные комплексы по всей России, Новороссии и странам
            СНГ. Оригинальные изнашиваемые элементы и узлы — со склада в Чите либо прямой поставкой с завода.
            Если нужной позиции нет в онлайн-базе, инженер подберёт её по заводскому каталогу и чертежу.
          </p>
          <div className="mt-8 grid gap-px border border-line bg-line/60 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Для щековых дробилок", items: ["Плиты дробящие подвижные и неподвижные", "Клинья и сухари крепления плит", "Распорные плиты и подпятники", "Маховики, эксцентриковые валы, подшипники"] },
              { t: "Для конусных дробилок", items: ["Брони конуса подвижные и неподвижные", "Втулки цилиндрические и конические", "Подпятники сферические, валы", "Шестерни конические, пылевые уплотнения"] },
              { t: "Для роторных и ЦУД", items: ["Била (молотки) роторные", "Плиты отражательные и футеровка корпуса", "Роторы, наконечники и отбойники VSI", "Распределительные плиты, комплекты клиньев"] },
              { t: "Для грохотов и конвейеров", items: ["Сита металлические, полиуретановые, резиновые", "Подситники, пружины опорные", "Вибровозбудители и подшипники", "Ролики, роликоопоры, барабаны, лента"] },
            ].map((g) => (
              <div key={g.t} className="bg-ink-2 p-5">
                <h3 className="font-display text-[13px] font-extrabold uppercase leading-snug text-white">{g.t}</h3>
                <ul className="mt-3 grid gap-2 text-[12.5px] leading-relaxed text-steel">
                  {g.items.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-4xl text-[12.5px] leading-relaxed text-dim">
            Обслуживаем смешанные парки: помимо оригиналов Liming поставляем запчасти для дробилок Metso Nordberg
            (C106, C125, HP300, HP500, GP300S, Barmac), Sandvik (CJ411, CH430, CH440, CS660), Terex Cedarapids,
            Kleemann, Powerscreen, Extec, а также для отечественной классики СМД-108/109/110, ДРО-560,
            КСД-600/900/1200/1750/2200, КМД-1750/2200 и грохотов ГИС-52, ГИТ-52.
          </p>
          <div className="btn-row mt-8">
            <Btn onClick={() => lead.open("Подбор запчастей для ДСО по чертежу")}>
              Подобрать запчасть с инженером <ArrowRight className="h-4 w-4" />
            </Btn>
            <Btn
              variant="ghost"
              onClick={() => document.getElementById("batch")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              Загрузить дефектную ведомость
            </Btn>
          </div>
        </section>
      </div>
    </div>
  );
}
