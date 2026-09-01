import { ArrowRight, Cog, Handshake, Headset, Puzzle } from "lucide-react";
import { Hero } from "../components/Hero";
import { SmartFilter } from "../components/SmartFilter";
import { XRay } from "../components/XRay";
import { LCC } from "../components/LCC";
import { BatchDrop } from "../components/BatchDrop";
import { Arrow, Btn, Reveal, SectionHead, useLead } from "../components/ui";
import { CATEGORIES, PARTS_TOTAL, PRODUCTS } from "../data/catalog";
import { SITE, useCountUp, useInView } from "../lib/site";
import { PlantImg } from "../components/SafeImg";
import { LIMING_COMPANY_PHOTO, MEDIA } from "../data/photos";
import { ImgSmart } from "../components/ImgSmart";
import { ProductImg } from "./Catalog";

const CERT_BRANDS = ["Liming Heavy Industry", "Sandvik", "Kleemann", "Terex", "Powerscreen", "Extec"];

function Counter({ v, suffix, label, run }: { v: number; suffix: string; label: string; run: boolean }) {
  const val = useCountUp(v, run);
  return (
    <div className="border-l border-line-2 pl-5">
      <div className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-none text-white tnum">
        {Math.round(val)}
        <span className="text-brand">{suffix}</span>
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.16em] text-dim leading-snug">{label}</div>
    </div>
  );
}

function Trust() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section id="trust" ref={ref} className="relative border-t border-line bg-ink-2 py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-brand" />
              <span className="tech-label text-brand">Оцифрованная экспертность</span>
            </div>
            <h2 className="h-display mt-4 text-[clamp(1.6rem,3vw,2.6rem)] text-white">
              Проектно-инжиниринговый центр, а не торговый посредник
            </h2>
            <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-steel">
              ООО «АСТ-Карьерные решения» — официальный дистрибьютор Henan Liming Heavy Industry. Мы объединяем
              технологическую базу крупнейшего азиатского машиностроительного концерна с практическим опытом
              нашей инженерной команды, которая с 2005 года обслуживает и запускает ДСО на площадках от Калининграда
              до Камчатки. Команда сертифицирована производителями и знает оборудование конкурентов — это помогает
              честно сравнивать и подбирать оптимум, а не «свой» товар:
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {CERT_BRANDS.map((b) => (
                <span key={b} className="border border-line-2 bg-ink px-3 py-1.5 text-[11.5px] font-semibold tracking-wide text-steel">
                  {b}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120} className="grid content-center gap-8 sm:grid-cols-2">
            <Counter v={20} suffix="" label="лет опыта команды в эксплуатации и сервисе ДСО" run={inView} />
            <Counter v={120} suffix="+" label="объектов проектного сопровождения и шефмонтажа" run={inView} />
            <Counter v={350} suffix="+" label="выездов сервисных бригад по РФ и СНГ" run={inView} />
            <Counter v={24} suffix=" ч" label="расчёт ТКП и схемы дробления" run={inView} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const items = [
    {
      icon: Puzzle,
      name: "Инжиниринг",
      sub: "проектирование процессов дробления",
      t: "Индивидуальные конструкторские решения под пробы породы: расчёт схемы, компоновка КМД, руководство по установке и обучение персонала по наладке.",
    },
    {
      icon: Cog,
      name: "Интеграция",
      sub: "импорт, поставка и монтаж",
      t: "Полный цикл от завода Liming до площадки: таможня и логистика по РФ и СНГ на нас, шефмонтаж и стабильный выпуск продукции — приоритет каждого контракта.",
    },
    {
      icon: Headset,
      name: "Саппорт",
      sub: "поддержка и сопровождение",
      t: "Гарантийное и постгарантийное обслуживание, регламентные ТО, дефектовка с выездом бригады и запчасти со склада в Чите — без пауз «уточним у завода».",
    },
  ];
  return (
    <section className="relative border-t border-line bg-ink py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <SectionHead
          kicker="Что делает компания"
          title={<>Полный цикл: проект — поставка — <span className="text-brand">сервис</span></>}
        />
        <div className="mt-12 grid gap-px border border-line bg-line/60 md:grid-cols-3">
          {items.map((s, i) => (
            <Reveal key={s.name} delay={i * 110} className="h-full">
              <div className="group relative h-full bg-ink-2 p-7 transition-colors duration-300 hover:bg-ink-3">
                <div className="flex h-12 w-12 items-center justify-center border border-line-2 transition-colors duration-300 group-hover:border-brand">
                  <s.icon className="h-6 w-6 text-brand" strokeWidth={1.5} />
                </div>
                <div className="mt-6 font-display text-xl font-extrabold uppercase text-white">{s.name}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-brand-2">{s.sub}</div>
                <p className="mt-4 text-[13.5px] leading-relaxed text-steel">{s.t}</p>
                <a
                  href="#/services"
                  className="mt-6 inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-dim transition-colors group-hover:text-brand"
                >
                  Кейсы «до/после» и этапы <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CatalogPreview() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-ink-2 py-24">
      <div className="u-grid-dark absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            kicker="Каталог ДСО"
            title={<>Оборудование и <span className="text-brand">расходные материалы</span></>}
            sub="Карточки с живыми статусами склада, полными ТТХ, чертежами и таблицами оригинальных запчастей с заводскими артикулами — инженеру и снабженцу не придётся ничего выспрашивать по телефону."
          />
          <Btn variant="ghost" href="#/catalog" className="shrink-0">
            Весь каталог <Arrow />
          </Btn>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIES.slice(0, 7).map((c, i) => {
            const prods = PRODUCTS.filter((p) => p.cat === c.id);
            const first = prods[0];
            return (
              <Reveal key={c.id} delay={i * 70}>
                <a
                  href={`#/catalog/${c.id}`}
                  className="group relative block h-56 overflow-hidden border border-line bg-ink"
                >
                  {first ? (
                    <ProductImg
                      p={first}
                      alt={c.name}
                      className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
                    />
                  ) : (
                    <PlantImg
                      alt={c.name}
                      className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-brand">{prods.length} поз. в базе</div>
                    <div className="mt-1.5 font-display text-[15px] font-extrabold uppercase leading-tight text-white">
                      {c.name}
                    </div>
                    <div className="mt-1 line-clamp-1 text-[11.5px] text-steel">{c.note}</div>
                  </div>
                  <div className="absolute right-4 top-4 border border-line-2 bg-ink/70 p-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <ArrowRight className="h-4 w-4 text-brand" />
                  </div>
                </a>
              </Reveal>
            );
          })}
          <Reveal delay={490}>
            <a
              href="#/parts"
              className="group relative flex h-56 flex-col justify-between overflow-hidden border border-brand/40 bg-gradient-to-br from-brand/15 to-ink p-5"
            >
              <img
                src={MEDIA.warehouse}
                alt="Склад оригинальных запчастей для ДСО в Чите"
                className="absolute inset-0 h-full w-full object-cover opacity-30 transition-opacity duration-700 group-hover:opacity-45"
                loading="lazy"
                decoding="async"
              />
              <div className="relative">
                <div className="tech-label text-brand">Склад · г. Чита</div>
              </div>
              <div className="relative">
                <div className="font-display text-lg font-extrabold uppercase leading-tight text-white">
                  Запчасти и расходные материалы
                </div>
                <div className="mt-1 text-[11.5px] text-steel">
                  Поиск по заводскому артикулу · {PARTS_TOTAL.toLocaleString("ru-RU")} позиций по всем брендам
                </div>
                <div className="mt-4 inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                  Открыть базу запчастей <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function AboutStrip() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-ink py-24">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative border border-line-2">
            <ImgSmart
              remote={LIMING_COMPANY_PHOTO}
              fallback={MEDIA.warehouse}
              alt="Выставочная площадка готового оборудования Henan Liming Heavy Industry"
              className="h-[380px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center gap-4 border border-line-2 bg-ink/85 p-4 backdrop-blur">
              <Handshake className="h-8 w-8 shrink-0 text-brand" strokeWidth={1.4} />
              <p className="text-[12.5px] leading-snug text-fog">
                <b className="text-white">Henan Liming Heavy Industry</b> — концерн полного цикла: 1 200+ патентов,
                роботизированная сварка корпусов, экспорт в 170+ стран.
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120} className="order-1 lg:order-2">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="tech-label text-brand">Партнёрство</span>
          </div>
          <h2 className="h-display mt-4 text-[clamp(1.6rem,3vw,2.6rem)] text-white">
            Дружба — основа партнёрства <span className="text-brand">АСТ и Liming</span>
          </h2>
          <p className="mt-5 text-[14.5px] leading-relaxed text-steel">
            Стремление к развитию высокотехнологичных решений в горнодобывающей отрасли, личный опыт сотрудников
            АСТ в обслуживании и эксплуатации ДСО, обмен экспертизой и совместная работа привели к прочным
            дружеским отношениям между АСТ-Карьерные решения и международной компанией Liming. Дружба и стала
            основой партнёрских отношений компаний.
          </p>
          <p className="mt-4 text-[14.5px] leading-relaxed text-steel">
            Для заказчика это значит простую вещь: <b className="text-fog">заводская гарантия, прямые цены и
            приоритетная загрузка производственных мощностей</b> — без прослоек и «серых» поставок.
          </p>
          <div className="btn-row mt-7">
            <Btn href="#/about">О компании и заводе <Arrow /></Btn>
            <Btn variant="ghost" href="#/about">Реквизиты и контакты</Btn>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PartsBand() {
  const lead = useLead();
  return (
    <section className="relative overflow-hidden border-t border-line bg-ink py-24">
      <div
        className="absolute inset-0 opacity-45"
        style={{ backgroundImage: `url(${MEDIA.warehouse})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/92 to-ink/70" />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-brand" />
              <span className="tech-label text-brand">База запчастей · артикульный поиск</span>
            </div>
            <h2 className="h-display mt-4 text-[clamp(1.6rem,3vw,2.6rem)] text-white">
              Деталь по заводскому номеру — <span className="text-brand">за 10 секунд</span>
            </h2>
            <p className="mt-5 max-w-lg text-[14.5px] leading-relaxed text-steel">
              Брони и плиты, втулки и подпятники, била, сита, подшипники. Умный поиск понимает артикулы даже
              с неверными дефисами и пробелами: строки <span className="font-mono text-[12.5px] text-brand-2">HPT300-4-01</span> и{" "}
              <span className="font-mono text-[12.5px] text-brand-2">hpt 300 4 01</span> найдут одну и ту же броню.
            </p>
            <div className="btn-row mt-7">
              <Btn href="#/parts">Поиск по артикулу <Arrow /></Btn>
              <Btn variant="ghost" onClick={() => lead.open("Срочный подбор запчасти по артикулу")}>
                Деталь срочно, на связи инженер
              </Btn>
            </div>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-px border border-line bg-line/50 text-center">
              {[
                { v: `${Math.floor(PARTS_TOTAL / 1000)} 000+`, t: "артикулов в базе" },
                { v: "24 ч", t: "ТКП по ведомости" },
                { v: "3 дня", t: "отгрузка в регионы" },
              ].map((s) => (
                <div key={s.t} className="bg-ink/85 p-3">
                  <div className="font-display text-lg font-extrabold text-white tnum">{s.v}</div>
                  <div className="mt-1 text-[9.5px] uppercase tracking-[0.14em] text-dim">{s.t}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <BatchDrop compact />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CTABand() {
  const lead = useLead();
  return (
    <section className="relative overflow-hidden border-t border-line bg-gradient-to-br from-brand-deep via-brand to-brand-2 py-20">
      <div className="u-grid-dark absolute inset-0 opacity-30" />
      <div className="relative mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-8 px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="tech-label !text-ink/70">Прямой диалог, без скриптов продаж</div>
          <h2 className="h-display mt-3 text-[clamp(1.6rem,3.2vw,2.8rem)] text-ink">
            Связаться с ведущим инженером АСТ
          </h2>
          <p className="mt-3 text-[15px] font-medium leading-relaxed text-ink/85">
            Специалист, который знает разницу между истираемостью гранита и прочностью известняка.
            Звонок по РФ бесплатный. ТКП — до 24 часов.
          </p>
        </div>
        <div className="btn-row w-full lg:w-auto">
          <Btn variant="dark" href={SITE.phoneHref}>
            {SITE.phone}
          </Btn>
          <Btn
            className="bg-ink !text-white hover:!text-brand-2"
            onClick={() => lead.open("Консультация ведущего инженера")}
          >
            Задать вопрос инженеру <Arrow />
          </Btn>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <Hero />
      <Trust />
      <Services />
      <CatalogPreview />
      <SmartFilter />
      <XRay />
      <LCC />
      <PartsBand />
      <AboutStrip />
      <CTABand />
    </>
  );
}
