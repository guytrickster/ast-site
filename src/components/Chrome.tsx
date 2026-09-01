import { useEffect, useState } from "react";
import { Clock, Mail, MapPin, Menu, Phone, PhoneCall, X } from "lucide-react";
import { SITE, go } from "../lib/site";
import { CATEGORIES } from "../data/catalog";
import { LogoFull, LogoMark } from "./Logo";
import { Btn, useLead } from "./ui";
import { cn } from "../utils/cn";

const NAV = [
  { to: "#/catalog", label: "Каталог", sub: "оборудования", page: "catalog" },
  { to: "#/parts", label: "Запчасти", sub: "по артикулу", page: "parts" },
  { to: "#/services", label: "Услуги", sub: "и инжиниринг", page: "services" },
  { to: "#/about", label: "О компании", sub: "и контакты", page: "about" },
];

const ACTIVE: Record<string, string> = { contacts: "about" };

export function Header({ page }: { page: string }) {
  page = ACTIVE[page] ?? page;
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const lead = useLead();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[80]">
      {/* верхняя служебная строка */}
      <div
        className={cn(
          "hidden border-b border-line/60 bg-ink/90 backdrop-blur-md transition-all duration-500 lg:block",
          scrolled ? "h-0 overflow-hidden border-transparent" : "",
        )}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-2 text-[11.5px] text-dim">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand" /> г. Чита, Романовский тракт, 41
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand" /> {SITE.hours}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center gap-1.5 whitespace-nowrap font-semibold text-fog transition-colors hover:text-brand-2"
            >
              <Phone className="h-3.5 w-3.5 text-brand" />
              <span className="tnum">{SITE.phone}</span>
              <span className="font-normal text-dim">· бесплатно по РФ</span>
            </a>
            <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-brand">
              <Mail className="h-3.5 w-3.5 text-brand" /> {SITE.email}
            </a>
          </div>
        </div>
      </div>

      {/* основная панель */}
      <div
        className={cn(
          "border-b transition-all duration-500",
          scrolled || menu
            ? "border-line bg-ink/92 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            : "border-transparent bg-gradient-to-b from-ink/80 to-transparent",
        )}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-5">
            <a href="#/" aria-label="На главную" onClick={() => setMenu(false)}>
              <LogoFull compact={scrolled} />
            </a>
            <div className="hidden border-l border-line-2 pl-5 xl:block">
              <div className="whitespace-nowrap text-[9.5px] font-semibold uppercase leading-tight tracking-[0.22em] text-dim">
                Официальный дилер
              </div>
              <div className="mt-0.5 whitespace-nowrap font-display text-[11px] font-bold uppercase leading-tight tracking-[0.14em] text-fog">
                Liming Heavy Industry
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
            {NAV.map((n) => (
              <a
                key={n.to}
                href={n.to}
                className={cn(
                  "relative font-display text-[11px] font-bold uppercase leading-[1.35] tracking-[0.1em] transition-colors hover:text-white xl:text-[12px]",
                  page === n.page ? "text-brand" : "text-steel",
                )}
              >
                {n.sub ? (
                  <span className="block text-center">
                    <span className="block whitespace-nowrap">{n.label}</span>
                    <span className="block whitespace-nowrap">{n.sub}</span>
                  </span>
                ) : (
                  <span className="whitespace-nowrap">{n.label}</span>
                )}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-0.5 bg-brand transition-all duration-300",
                    page === n.page ? "w-full" : "w-0",
                  )}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Btn size="sm" className="hidden xl:inline-flex" onClick={() => lead.open()}>
              Связаться с инженером
            </Btn>
            <button
              className="cursor-pointer border border-line-2 p-2.5 text-fog lg:hidden"
              onClick={() => setMenu((v) => !v)}
              aria-label="Меню"
            >
              {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* мобильное меню */}
        {menu && (
          <div className="border-t border-line bg-ink-2 px-5 py-5 lg:hidden">
            <nav className="grid gap-1">
              {NAV.map((n) => (
                <a
                  key={n.to}
                  href={n.to}
                  onClick={() => setMenu(false)}
                  className={cn(
                    "flex items-center justify-between border-b border-line/60 py-3.5 font-display text-sm font-bold uppercase tracking-[0.12em]",
                    page === n.page ? "text-brand" : "text-fog",
                  )}
                >
                  {n.sub ? `${n.label} ${n.sub}` : n.label}
                  <span className="text-line-2">→</span>
                </a>
              ))}
            </nav>
            <div className="mt-5 flex flex-col gap-3">
              <a href={SITE.phoneHref} className="font-display text-lg font-extrabold text-white tnum">
                {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 text-[13px] text-steel transition-colors hover:text-brand">
                <Mail className="h-4 w-4 text-brand" /> {SITE.email}
              </a>
              <Btn onClick={() => { setMenu(false); lead.open(); }}>Связаться с инженером</Btn>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink-2">
      <div className="u-grid-dark pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-[1440px] px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <LogoMark className="w-40 h-auto" />
            <p className="mt-6 max-w-sm text-[13.5px] leading-relaxed text-steel">
              Официальный дистрибьютор Henan Liming Heavy Industry в России, Новороссии и странах СНГ.
              Проектирование, поставка, шефмонтаж и сервис дробильно-сортировочных комплексов полного цикла.
            </p>
            <a
              href={SITE.phoneHref}
              className="group mt-6 flex items-center gap-3 border border-line bg-ink px-4 py-3 transition-colors hover:border-brand/60"
            >
              <PhoneCall className="h-5 w-5 shrink-0 text-brand transition-transform group-hover:-rotate-12" />
              <div>
                <div className="font-display text-lg font-extrabold text-white tnum transition-colors group-hover:text-brand-2">
                  {SITE.phone}
                </div>
                <div className="text-[10.5px] uppercase tracking-[0.18em] text-dim">бесплатно по РФ · сервис 24/7</div>
              </div>
            </a>
          </div>

          <div>
            <div className="tech-label text-brand">Каталог</div>
            <ul className="mt-5 grid gap-2.5 text-[13.5px] text-steel">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <a className="transition-colors hover:text-white" href={`#/catalog/${c.id}`}>
                    {c.name}
                  </a>
                </li>
              ))}
              <li>
                <a className="text-brand-2 transition-colors hover:text-brand" href="#/parts">
                  Запчасти и расходные материалы
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="tech-label text-brand">Компания</div>
            <ul className="mt-5 grid gap-2.5 text-[13.5px] text-steel">
              <li><a className="transition-colors hover:text-white" href="#/services">Услуги и инжиниринг</a></li>
              <li><a className="transition-colors hover:text-white" href="#/about">О компании и заводе Liming</a></li>
              <li><a className="transition-colors hover:text-white" href="#/contacts">Контакты и реквизиты</a></li>
              <li><a className="transition-colors hover:text-white" href="#/privacy">Политика конфиденциальности</a></li>
            </ul>
          </div>

          <div>
            <div className="tech-label text-brand">Контакты</div>
            <ul className="mt-5 grid gap-4 text-[13.5px] text-steel">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>{SITE.address}</span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-white">
                  {SITE.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>{SITE.hours}</span>
              </li>
            </ul>
            <Btn variant="ghost" className="mt-6 !py-3" href="#/contacts">
              Схема проезда и филиалы
            </Btn>
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-7">
          <p className="text-[11.5px] leading-relaxed text-dim">
            Вся информация на сайте носит исключительно информационный характер и ни при каких условиях не является
            публичной офертой, определяемой положениями Статьи 437 Гражданского кодекса Российской Федерации.
            Указанные характеристики основаны на официальных спецификациях завода Henan Liming Heavy Industry;
            итоговая комплектация и цена фиксируются в технико-коммерческом предложении и договоре поставки.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-[12px] text-steel">
            <span>
              © ООО «АСТ-Карьерные решения», 2026. Опыт команды экспертов в сфере эксплуатации и обслуживания ДСО —
              с 2005 года. Проект реализован при поддержке ООО «АСТ» («Азия Спец Трейд»).
            </span>
            <button
              onClick={() => go("privacy")}
              className="cursor-pointer text-dim transition-colors hover:text-brand"
            >
              {SITE.inn} · {SITE.ogrn}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
