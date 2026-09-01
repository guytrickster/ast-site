import {
  Award, ClipboardCheck, Clock, Factory, FileCheck2, Mail, MapPin, Phone, Route as RouteIcon,
  ShieldCheck, Ship, Truck,
} from "lucide-react";
import { BeforeAfter } from "../components/BeforeAfter";
import { Arrow, Btn, Reveal, SectionHead, useLead } from "../components/ui";
import { SITE } from "../lib/site";
import imgEngineer from "../assets/engineer-field.jpg";
import imgWarehouse from "../assets/parts-warehouse.jpg";
import { ImgSmart } from "../components/ImgSmart";
import { LIMING_COMPANY_PHOTO } from "../data/photos";

/* ============================ УСЛУГИ И ИНЖИНИРИНГ ============================ */
const STEPS = [
  { n: "01", t: "Анализ пробы породы", d: "Забор пробы с вашей площадки, лаборатория истираемости и прочности — база честного расчёта, а не подбор «по каталогу»." },
  { n: "02", t: "Расчёт схемы дробления", d: "Технолог подбирает стадии, камеры дробления и сита под требуемые фракции и тоннаж. Смета рисков по простоям." },
  { n: "03", t: "ТКП и компоновка", d: "Технико-коммерческое предложение с чертежами КМД, грузопотоками и спецификацией — до 24 часов на типовую схему." },
  { n: "04", t: "Поставка и таможня", d: "Официальный импорт: контракт, валютный контроль, сертификация ТР ТС и логистика — зона ответственности АСТ." },
  { n: "05", t: "Шефмонтаж и пуск", d: "Собственная бригада, лазерная центровка валов, пусконаладка и обучение вашего персонала. Выезд в любой регион." },
  { n: "06", t: "Гарантия и ТО 24/7", d: "Регламентные обслуживания, дефектовки, запчасти со склада в Чите и постгарантийное сопровождение." },
];

const CASES = [
  {
    place: "Гранитный карьер · Забайкалье",
    t: "Линия 450 т/ч на граните f=14",
    d: "C6X125 + 2 × HPT500 + S5X. Проект, поставка и шефмонтаж комплекса — 26 дней от заезда бригады до пуска в промышленную нагрузку.",
  },
  {
    place: "Угольный разрез · Кузбасс",
    t: "Замена КСД-3000 на HPT500",
    d: "Модернизация без остановки карьера: обвязка под существующие фундаменты, переброска питателей. Остановка линии — 5 суток, тоннаж +17%.",
  },
  {
    place: "Известняковый карьер · Новороссия",
    t: "Мобильный комплекс NK75J без фундаментов",
    d: "Первичное дробление известняка в охранной зоне ЛЭП: развёртывание за смену, перемещение по выемке тягачом. 120–350 т/ч без капитальных работ.",
  },
];

export function ServicesPage() {
  const lead = useLead();
  return (
    <div className="bg-ink pt-32 sm:pt-36">
      <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-6">
        <SectionHead
          kicker="Услуги и инжиниринг"
          title={<>Инжиниринг в действии: от пробы породы <span className="text-brand">до пуска линии</span></>}
          sub="Мы не продаём «железо со склада», мы проектируем замкнутые технологические процессы под физико-механические свойства вашей породы. Каждый час простоя в карьере стоит денег — поэтому сроки и регламенты у нас жёсткие."
        />

        {/* этапы */}
        <div className="mt-14 grid gap-px border border-line bg-line/60 md:grid-cols-2 xl:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 70}>
              <div className="group h-full bg-ink-2 p-6 transition-colors hover:bg-ink-3">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-3xl font-extrabold text-brand/90 tnum">{s.n}</span>
                  <span className="h-px flex-1 bg-line-2 transition-colors group-hover:bg-brand/60" />
                </div>
                <h3 className="mt-4 font-display text-[15px] font-extrabold uppercase text-white">{s.t}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-steel">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* до/после */}
        <div className="mt-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="tech-label text-brand">Инжиниринг в действии</div>
              <h2 className="h-display mt-3 text-2xl text-white sm:text-3xl">
                Проектная модель → <span className="text-brand">реализованный объект</span>
              </h2>
            </div>
            <p className="max-w-md text-[12.5px] leading-relaxed text-dim">
              Слева — компоновка КМД из проектной документации, справа — объект после шефмонтажа.
              Клиент видит будущую площадку ещё до подписания контракта.
            </p>
          </div>
          <BeforeAfter />
        </div>

        {/* служба шефмонтажа */}
        <div className="mt-20 grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="relative">
            <img
              src={imgEngineer}
              alt="Инженеры АСТ на шефмонтаже конусной дробилки в карьере"
              className="h-[400px] w-full border border-line-2 object-cover"
            />
            <div className="absolute bottom-4 left-4 border border-line-2 bg-ink/85 px-4 py-3 backdrop-blur">
              <div className="tech-label !text-[9.5px] text-brand">Полевой репортаж · служба шефмонтажа</div>
              <div className="mt-1 text-[12px] text-fog">Лазерная центровка приводного вала. Выездная бригада АСТ</div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="h-display text-2xl text-white sm:text-3xl">
              Собственная служба шефмонтажа — <span className="text-brand">а не субподряд</span>
            </h2>
            <p className="mt-5 text-[14.5px] leading-relaxed text-steel">
              Инженеры АСТ центруют валы лазерными трекерами, а не «на глаз». Брендированная спецодежда,
              испытательный инструмент и чек-листы пусконаладки — на каждом объекте. Готовы к сложной логистике:
              командировки по всей России, Новороссии и странам СНГ — штатная практика, а не исключение.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-px border border-line bg-line/60 text-center">
              {[
                { v: "72 ч", t: "мобилизация бригады" },
                { v: "350+", t: "выездов бригад" },
                { v: "24/7", t: "дежурный инженер" },
              ].map((c) => (
                <div key={c.t} className="bg-ink-2 p-4">
                  <div className="font-display text-xl font-extrabold text-white tnum">{c.v}</div>
                  <div className="mt-1.5 text-[9.5px] uppercase tracking-[0.14em] text-dim">{c.t}</div>
                </div>
              ))}
            </div>
            <div className="btn-row mt-7">
              <Btn onClick={() => lead.open("Запрос инженерного обследования / шефмонтажа")}>
                Заказать выезд инженера <Arrow />
              </Btn>
              <Btn variant="ghost" href="#/contacts">Контакты службы</Btn>
            </div>
          </Reveal>
        </div>

        {/* кейсы */}
        <div className="mt-20">
          <div className="tech-label text-brand">Кейсы «до / после»</div>
          <h2 className="h-display mt-3 text-2xl text-white sm:text-3xl">Типовые проекты команды</h2>
          <div className="mt-8 grid gap-px border border-line bg-line/60 lg:grid-cols-3">
            {CASES.map((c, i) => (
              <Reveal key={c.place} delay={i * 90}>
                <div className="flex h-full flex-col bg-ink-2 p-6">
                  <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-dim">
                    <MapPin className="h-3.5 w-3.5 text-brand" /> {c.place}
                  </div>
                  <h3 className="mt-3 font-display text-[15.5px] font-extrabold uppercase leading-snug text-white">{c.t}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-steel">{c.d}</p>
                  <div className="mt-auto pt-5 text-[10.5px] uppercase tracking-[0.16em] text-dim">
                    детали и контакты заказчика — по запросу
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ О КОМПАНИИ ============================ */
export function AboutPage() {
  const lead = useLead();
  return (
    <div className="bg-ink pt-32 sm:pt-36">
      <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-6">
        <SectionHead
          kicker="О компании"
          title={<>АСТ-Карьерные решения × <span className="text-brand">Liming Heavy Industry</span></>}
          sub="ООО «АСТ-Карьерные решения» — официальный дистрибьютор Henan Liming Heavy Industry Science and Technology Co., Ltd в России, Новороссии и странах СНГ. Технологическая база крупнейшего азиатского машиностроительного концерна + практический опыт нашей инженерной команды в ДСО с 2005 года."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="relative overflow-hidden border border-line-2">
            <ImgSmart
              remote={LIMING_COMPANY_PHOTO}
              fallback={imgWarehouse}
              alt="Производственно-выставочная площадка Henan Liming Heavy Industry"
              className="h-full min-h-[340px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <div className="tech-label !text-[9.5px] text-brand">Henan Liming Heavy Industry</div>
              <div className="mt-1 max-w-lg text-[13px] leading-snug text-fog">
                Концерн полного цикла: от литейного производства и роботизированной сварки корпусов до
                испытательного полигона готовых машин. Данные производителя.
              </div>
            </div>
          </Reveal>
          <div className="grid content-start gap-4">
            {[
              { icon: Factory, v: "320 000 м²", t: "производственные базы в г. Чжэнчжоу" },
              { icon: Award, v: "1 200+", t: "патентов и индустриальных наград" },
              { icon: Ship, v: "170+", t: "стран поставок с 1987 года" },
              { icon: ShieldCheck, v: "ISO 9001 · CE · EAC", t: "система качества и сертификация продукции" },
            ].map((f, i) => (
              <Reveal key={f.t} delay={i * 70}>
                <div className="flex items-center gap-4 border border-line bg-ink-2 p-5">
                  <f.icon className="h-7 w-7 shrink-0 text-brand" strokeWidth={1.4} />
                  <div>
                    <div className="font-display text-lg font-extrabold text-white">{f.v}</div>
                    <div className="text-[11.5px] text-dim">{f.t}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* статус дилера */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <Reveal className="border border-brand/40 bg-brand/8 p-7">
            <ShieldCheck className="h-8 w-8 text-brand" strokeWidth={1.4} />
            <h3 className="mt-4 font-display text-lg font-extrabold uppercase text-white">Статус официального дилера</h3>
            <p className="mt-3 text-[13px] leading-relaxed text-steel">
              Дилерский сертификат Henan Liming Heavy Industry высылается вместе с ТКП по первому запросу.
              Заводская гарантия действует на территории РФ и СНГ и обслуживается силами АСТ — без пересылки
              узлов за рубеж.
            </p>
          </Reveal>
          <Reveal delay={90} className="border border-line bg-ink-2 p-7">
            <Truck className="h-8 w-8 text-brand" strokeWidth={1.4} />
            <h3 className="mt-4 font-display text-lg font-extrabold uppercase text-white">Логистика в текущих условиях</h3>
            <p className="mt-3 text-[13px] leading-relaxed text-steel">
              Плечо Маньчжурия — Забайкальск — Чита: ж/д и автоотгрузки без транзита через ЕС. Транзит до склада
              в Чите — от 14 дней. Поставки запчастей идут плановыми партиями и не зависят от внешних ограничений.
            </p>
          </Reveal>
          <Reveal delay={180} className="border border-line bg-ink-2 p-7">
            <FileCheck2 className="h-8 w-8 text-brand" strokeWidth={1.4} />
            <h3 className="mt-4 font-display text-lg font-extrabold uppercase text-white">Документы и комплаенс</h3>
            <p className="mt-3 text-[13px] leading-relaxed text-steel">
              Декларации ТР ТС 010/2011 «О безопасности машин и оборудования», паспорта машин на русском языке,
              полный пакет для бухгалтерии и таможни. Оплата в рублях на расчётный счёт российского юрлица.
            </p>
          </Reveal>
        </div>

        {/* цитата */}
        <blockquote className="relative mt-16 border-l-4 border-brand bg-ink-2 p-8 sm:p-10">
          <p className="max-w-4xl text-[17px] font-medium leading-relaxed text-fog sm:text-[19px]">
            «Стремление к развитию качественных высокотехнологичных решений в области горнодобывающей
            промышленности, основанное на большом личном опыте сотрудников, обмен опытом и совместная работа
            привели к установлению хороших дружеских отношений между АСТ-Карьерные решения и международной
            компанией Liming. Дружба и стала основой партнёрских отношений компаний.»
          </p>
          <footer className="mt-5 text-[12px] uppercase tracking-[0.18em] text-dim">
            из истории партнёрства АСТ и Liming
          </footer>
        </blockquote>

        <div className="btn-row mt-10">
          <Btn onClick={() => lead.open("Запрос дилерского сертификата и документов")}>
            Запросить документы <Arrow />
          </Btn>
        </div>
      </div>

      {/* объединённый блок «О компании и контакты» */}
      <div className="mt-16 border-t border-line pt-20 pb-24">
        <ContactsBody />
      </div>
    </div>
  );
}

/* ============================ КОНТАКТЫ ============================ */
function Scheme() {
  return (
    <div className="xray-frame relative overflow-hidden border border-line-2 bg-ink-3">
      <div className="u-grid-dark absolute inset-0" />
      <svg viewBox="0 0 720 460" className="relative h-auto w-full">
        {/* ж/д */}
        <path d="M0 120 H720" stroke="#3a3f49" strokeWidth="7" />
        <path d="M0 120 H720" stroke="#14161a" strokeWidth="2" strokeDasharray="10 12" />
        <text x="14" y="108" fill="#6c7684" fontSize="13" fontFamily="Roboto">ж/д Транссиб · ст. Чита-2</text>
        {/* город */}
        <rect x="38" y="170" width="200" height="150" rx="4" fill="#20242b" />
        <text x="60" y="252" fill="#6c7684" fontSize="15" fontFamily="Roboto">г. Чита</text>
        <text x="60" y="274" fill="#4a5160" fontSize="11" fontFamily="Roboto">центр</text>
        {/* трасса Р258 */}
        <path d="M0 400 C 180 380, 420 372, 720 320" stroke="#4a5160" strokeWidth="10" />
        <path d="M0 400 C 180 380, 420 372, 720 320" stroke="#14161a" strokeWidth="2" strokeDasharray="14 12" />
        <text x="430" y="404" fill="#6c7684" fontSize="13" fontFamily="Roboto">Р-258 «Байкал» · А-350</text>
        {/* ответвление */}
        <path d="M436 366 C 470 340, 492 300, 506 250 L 512 210" stroke="#4a5160" strokeWidth="7" />
        {/* офис */}
        <g>
          <circle cx="512" cy="196" r="34" fill="none" stroke="#FF6B00" strokeOpacity="0.4">
            <animate attributeName="r" values="24;40;24" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="512" cy="196" r="9" fill="#FF6B00" />
          <circle cx="512" cy="196" r="16" fill="none" stroke="#FF6B00" strokeWidth="2" />
          <rect x="340" y="120" width="330" height="54" rx="2" fill="#14161a" stroke="#3a3f49" />
          <text x="356" y="141" fill="#D7DDE5" fontSize="14" fontWeight="600" fontFamily="Montserrat">АСТ-Карьерные решения</text>
          <text x="356" y="161" fill="#98A2AE" fontSize="12" fontFamily="Roboto">Романовский тракт, 41 · офис и склад</text>
        </g>
        <text x="560" y="300" fill="#6c7684" fontSize="13" fontFamily="Roboto">Романовский тракт</text>
        {/* север */}
        <g stroke="#6c7684" fill="#6c7684">
          <circle cx="676" cy="52" r="16" fill="none" />
          <path d="M676 40 L671 62 L676 58 L681 62 Z" fill="#FF6B00" stroke="none" />
          <text x="668" y="90" fontSize="12" fontFamily="Roboto" stroke="none">N</text>
        </g>
      </svg>
      <div className="absolute bottom-3 left-3 border border-line-2 bg-ink/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-dim">
        схематично · не масштаб
      </div>
    </div>
  );
}

function ContactsBody() {
  const lead = useLead();
  return (
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <SectionHead
          kicker="Контакты"
          title={<>Главный офис и склад — <span className="text-brand">г. Чита</span></>}
          sub="Прямая связь без «мы вам может быть перезвоним». Дежурный сервисный инженер — круглосуточно, офис продаж и склад запчастей — по адресу ниже."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="grid content-start gap-4">
            {[
              { icon: MapPin, t: "Адрес", d: SITE.address, sub: "офис, инженерный центр и склад запчастей" },
              { icon: Phone, t: "Телефон", d: SITE.phone, sub: "бесплатно по РФ · сервис 24/7", href: SITE.phoneHref },
              { icon: Mail, t: "E-mail", d: SITE.email, sub: "заявки, ведомости, чертежи — сюда", href: `mailto:${SITE.email}` },
              { icon: Clock, t: "Режим работы", d: SITE.hours, sub: "отгрузка со склада — по предварительному звонку" },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 60}>
                <div className="flex items-start gap-4 border border-line bg-ink-2 p-5">
                  <c.icon className="mt-1 h-5 w-5 shrink-0 text-brand" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-dim">{c.t}</div>
                    {c.href ? (
                      <a href={c.href} className="mt-1 block font-display text-xl font-extrabold text-white transition-colors hover:text-brand tnum">
                        {c.d}
                      </a>
                    ) : (
                      <div className="mt-1 font-display text-lg font-extrabold text-white">{c.d}</div>
                    )}
                    <div className="mt-1 text-[12px] text-dim">{c.sub}</div>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={280}>
              <div className="border border-line bg-ink-2 p-5 text-[12.5px] leading-relaxed text-steel">
                <div className="tech-label text-brand">Реквизиты</div>
                <div className="mt-3 grid gap-1.5">
                  <div>ООО «АСТ-Карьерные решения»</div>
                  <div className="text-dim">{SITE.inn} · {SITE.ogrn}</div>
                  <div className="text-dim">Юр. адрес: {SITE.address}</div>
                  <div className="text-dim">Базы данных заявок — дата-центры на территории РФ (ФЗ № 152)</div>
                </div>
              </div>
            </Reveal>

            <div className="btn-row pt-2">
              <Btn onClick={() => lead.open("Заявка со страницы контактов")}>
                Написать инженеру <Arrow />
              </Btn>
              <Btn variant="ghost" href="#/parts">Склад запчастей онлайн</Btn>
            </div>
          </div>

          <Reveal delay={140}>
            <Scheme />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 border border-line bg-ink-2 p-4">
                <RouteIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-[12px] leading-relaxed text-steel">
                  Регионы присутствия сервисных бригад: Сибирь, Дальний Восток, Урал, Кузбасс, Якутия, Новороссия,
                  страны СНГ.
                </p>
              </div>
              <div className="flex items-start gap-3 border border-line bg-ink-2 p-4">
                <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-[12px] leading-relaxed text-steel">
                  Для поставщиков и подрядчиков: предложения направляйте на {SITE.email} с пометкой «Снабжение».
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
  );
}

export function ContactsPage() {
  return (
    <div className="bg-ink pb-24 pt-32 sm:pt-36">
      <ContactsBody />
    </div>
  );
}

/* ============================ ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ ============================ */
export function PrivacyPage() {
  const items: [string, string][] = [
    ["1. Оператор персональных данных", `ООО «АСТ-Карьерные решения», ${SITE.inn}, ${SITE.ogrn}. Адрес: ${SITE.address}. Контакт оператора: ${SITE.email}, ${SITE.phone}.`],
    ["2. Состав обрабатываемых данных", "Имя, телефон, адрес электронной почты, наименование организации, содержание запроса и приложенные файлы (дефектные ведомости, заявки). Данные передаются пользователем добровольно через формы сайта."],
    ["3. Цели обработки", "Обработка входящих заявок, подготовка технико-коммерческих предложений, исполнение договоров поставки и сервиса, выполнение требований законодательства РФ. Данные не используются для рассылок без отдельного согласия."],
    ["4. Хранение и защита", "Базы данных физически располагаются в дата-центрах на территории Российской Федерации. Применяются организационные и технические меры защиты в соответствии с ФЗ № 152 «О персональных данных» и Постановлением Правительства РФ № 1119. Срок хранения — не более 5 лет с момента последнего обращения."],
    ["5. Права субъекта данных", "Вы вправе запросить уточнение, блокирование или уничтожение своих персональных данных, а также отозвать согласие на обработку, направив заявление на адрес " + SITE.email + " или письмом по юридическому адресу оператора."],
    ["6. Cookies и статистика", "Сайт может использовать технические cookies, необходимые для корректной работы интерфейса (сохранение состояния фильтров и форм). Рекламные исследовательские идентификаторы третьих лиц не применяются."],
  ];
  return (
    <div className="bg-ink pt-32 sm:pt-36">
      <div className="mx-auto max-w-[900px] px-4 pb-24 sm:px-6">
        <SectionHead
          kicker="ФЗ № 152 · комплаенс"
          title={<>Политика <span className="text-brand">конфиденциальности</span></>}
          sub="Редакция от 01.02.2026. Документ определяет порядок обработки и защиты данных пользователей сайта АСТ-Карьерные решения."
        />
        <div className="mt-10 grid gap-px border border-line bg-line/60">
          {items.map(([t, d]) => (
            <div key={t} className="bg-ink-2 p-6">
              <h2 className="font-display text-[14px] font-extrabold uppercase tracking-wide text-white">{t}</h2>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-steel">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[12px] leading-relaxed text-dim">
          Используя формы сайта, вы подтверждаете ознакомление с настоящей Политикой и даёте согласие на обработку
          персональных данных в указанных целях. Вся информация на сайте носит информационный характер и не является
          публичной офертой (ст. 437 ГК РФ).
        </p>
      </div>
    </div>
  );
}

