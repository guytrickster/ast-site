import { useEffect } from "react";
import type { Route } from "./site";
import { SITE } from "./site";
import { CAT_NAME, PART_INDEX, PRODUCTS, type CatId } from "../data/catalog";

const BASE_KEYS = [
  "запчасти для дробилок",
  "запчасти для дсо",
  "дробящие плиты",
  "броня конуса",
  "била для роторной дробилки",
  "сита для грохота",
  "футеровка дробилки",
  "втулки конусной дробилки",
  "запчасти Liming",
  "запчасти Metso Nordberg",
  "запчасти Sandvik",
  "запчасти КСД КМД СМД",
  "купить щековую дробилку",
  "конусная дробилка цена",
  "дробильно-сортировочный комплекс под ключ",
  "шефмонтаж дробилки",
  "склад запчастей Чита",
];

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(id: string, data: unknown) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

interface Meta {
  title: string;
  description: string;
  keywords?: string[];
}

function metaFor(route: Route): Meta {
  const { page, param } = route;

  if (page === "catalog") {
    const cat = param as CatId | undefined;
    const name = cat && CAT_NAME[cat] ? CAT_NAME[cat] : undefined;
    return name
      ? {
          title: `${name} Liming — купить у официального дилера АСТ | цены, характеристики, чертежи`,
          description: `${name} Henan Liming Heavy Industry от официального дилера ООО «АСТ-Карьерные решения». Технические характеристики, производительность, чертежи, оригинальные запчасти и шефмонтаж. Расчёт ТКП до 24 часов. Тел. ${SITE.phone}.`,
          keywords: [`${name.toLowerCase()} купить`, `${name.toLowerCase()} liming`, `${name.toLowerCase()} цена`, "запчасти для дсо"],
        }
      : {
          title: "Каталог дробильно-сортировочного оборудования Liming — купить у дилера АСТ",
          description:
            "Щековые, конусные, роторные и центробежно-ударные дробилки Liming, грохоты, вибропитатели, мобильные комплексы и конвейеры. Официальный дилер в России, Новороссии и СНГ. Характеристики, чертежи, склад запчастей в Чите.",
        };
  }

  if (page === "product") {
    const p = PRODUCTS.find((x) => x.id === param);
    if (p) {
      const cap = p.cap[1] ? `Производительность ${p.cap[0]}–${p.cap[1]} т/ч. ` : "";
      return {
        title: `Купить ${p.title} — цена, характеристики, чертёж | АСТ-Карьерные решения`,
        description: `Официальный дилер ООО «АСТ-Карьерные решения» предлагает к поставке ${p.title}. ${cap}Заводская гарантия Liming, шефмонтаж, оригинальные запчасти со склада в Чите. Расчёт ТКП до 24 часов.`,
        keywords: [
          `${p.name} купить`,
          `${p.name} цена`,
          `${p.name} характеристики`,
          `запчасти ${p.name}`,
          ...p.parts.slice(0, 6).map((pt) => `${pt.name.toLowerCase()} ${pt.sku}`),
        ],
      };
    }
  }

  if (page === "parts") {
    return {
      title: "Запчасти для дробилок и грохотов — купить по артикулу со склада | АСТ",
      description: `Оригинальные запчасти для ДСО: дробящие плиты, брони конуса, била, сита, втулки, подпятники, подшипники, вибровозбудители. ${PART_INDEX.length}+ артикулов Liming, Metso, Sandvik, Terex, Kleemann, КСД/КМД/СМД. Отгрузка со склада в Чите, ТКП по дефектной ведомости за 24 часа.`,
      keywords: [
        "запчасти для дробилок купить",
        "запчасти для грохотов",
        "дробящие плиты для щековой дробилки",
        "броня конуса купить",
        "била для роторной дробилки",
        "сита полиуретановые для грохота",
        "запчасти для дсо по артикулу",
      ],
    };
  }

  if (page === "services") {
    return {
      title: "Проектирование ДСК, шефмонтаж и сервис дробилок 24/7 — АСТ-Карьерные решения",
      description:
        "Проектирование дробильно-сортировочных заводов, расчёт схемы дробления гранита и известняка, шефмонтаж и пусконаладка конусных и щековых дробилок, дефектовка и сервис 24/7 по РФ и СНГ.",
      keywords: [
        "проектирование дробильно сортировочных заводов",
        "шеф монтаж конусной дробилки",
        "расчет схемы дробления",
        "дефектовка дробилок",
        "сервисное обслуживание ДСО",
      ],
    };
  }

  if (page === "about" || page === "contacts") {
    return {
      title: "О компании и контакты — официальный дилер Liming Heavy Industry в РФ и СНГ",
      description: `ООО «АСТ-Карьерные решения» — официальный дистрибьютор Henan Liming Heavy Industry. Главный офис и склад: ${SITE.address}. Телефон ${SITE.phone} (бесплатно по РФ), почта ${SITE.email}.`,
      keywords: ["официальный дилер Liming", "поставка дробильного оборудования Чита", "АСТ карьерные решения контакты"],
    };
  }

  if (page === "privacy") {
    return {
      title: "Политика конфиденциальности — АСТ-Карьерные решения",
      description: "Порядок обработки и защиты персональных данных пользователей сайта в соответствии с ФЗ № 152.",
    };
  }

  return {
    title:
      "Дробилки и запчасти для ДСО — официальный дилер Liming в России и СНГ | АСТ-Карьерные решения",
    description: `Проектирование, поставка и шефмонтаж дробильно-сортировочных комплексов Liming. Оригинальные запчасти для дробилок и грохотов любых марок со склада в Чите: дробящие плиты, брони конуса, била, сита. Расчёт ТКП до 24 часов, сервис 24/7. Тел. ${SITE.phone}.`,
  };
}

/** хлебные крошки + карточка товара в разметке Schema.org */
function routeStructuredData(route: Route, base: string) {
  const crumbs: { name: string; url: string }[] = [{ name: "Главная", url: `${base}#/` }];
  const { page, param } = route;

  if (page === "catalog") {
    crumbs.push({ name: "Каталог оборудования", url: `${base}#/catalog` });
    const cat = param as CatId | undefined;
    if (cat && CAT_NAME[cat]) crumbs.push({ name: CAT_NAME[cat], url: `${base}#/catalog/${cat}` });
  } else if (page === "product") {
    const p = PRODUCTS.find((x) => x.id === param);
    crumbs.push({ name: "Каталог оборудования", url: `${base}#/catalog` });
    if (p) {
      crumbs.push({ name: CAT_NAME[p.cat], url: `${base}#/catalog/${p.cat}` });
      crumbs.push({ name: p.title, url: `${base}#/product/${p.id}` });
    }
  } else if (page === "parts") {
    crumbs.push({ name: "Запчасти по артикулу", url: `${base}#/parts` });
  } else if (page === "services") {
    crumbs.push({ name: "Услуги и инжиниринг", url: `${base}#/services` });
  } else if (page === "about" || page === "contacts") {
    crumbs.push({ name: "О компании и контакты", url: `${base}#/about` });
  }

  setJsonLd("ld-breadcrumbs", {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  });

  /* карточка оборудования: Product + перечень совместимых запчастей */
  const prod = page === "product" ? PRODUCTS.find((x) => x.id === param) : undefined;
  if (prod) {
    setJsonLd("ld-product", {
      "@context": "https://schema.org",
      "@type": "Product",
      name: prod.title,
      sku: prod.id,
      category: CAT_NAME[prod.cat],
      brand: { "@type": "Brand", name: prod.brand ?? "Liming" },
      description: prod.desc,
      additionalProperty: prod.ttx.map(([k, v]) => ({
        "@type": "PropertyValue",
        name: k,
        value: v,
      })),
      isRelatedTo: prod.parts.slice(0, 12).map((pt) => ({
        "@type": "Product",
        name: pt.name,
        sku: pt.sku,
      })),
      offers: {
        "@type": "Offer",
        priceCurrency: "RUB",
        availability:
          prod.stock === "in_stock"
            ? "https://schema.org/InStock"
            : prod.stock === "in_transit"
              ? "https://schema.org/PreOrder"
              : "https://schema.org/BackOrder",
        seller: { "@type": "Organization", name: SITE.name },
        url: `${base}#/product/${prod.id}`,
      },
    });
  } else {
    document.getElementById("ld-product")?.remove();
  }
}

/** Управление мета-тегами, Open Graph и структурированными данными для SPA-маршрутов */
export function useSeo(route: Route) {
  useEffect(() => {
    const m = metaFor(route);
    const base = `${location.origin}${location.pathname}`;
    const url = `${base}${location.hash}`;
    routeStructuredData(route, base);

    document.title = m.title;
    setMeta("name", "description", m.description);
    setMeta("name", "keywords", [...(m.keywords ?? []), ...BASE_KEYS].join(", "));
    setMeta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1");
    setMeta("property", "og:title", m.title);
    setMeta("property", "og:description", m.description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", route.page === "product" ? "product" : "website");
    setMeta("property", "og:locale", "ru_RU");
    setMeta("property", "og:site_name", SITE.short);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", m.title);
    setMeta("name", "twitter:description", m.description);
    setLink("canonical", url);
  }, [route]);

  /* организация и каталог — выставляем один раз */
  useEffect(() => {
    setJsonLd("ld-org", {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      alternateName: SITE.short,
      description:
        "Официальный дилер и импортёр Henan Liming Heavy Industry в России, Новороссии и странах СНГ. Проектирование, поставка, шефмонтаж дробильно-сортировочных комплексов и оригинальные запчасти для ДСО.",
      telephone: SITE.phone,
      email: SITE.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Романовский тракт, 41",
        addressLocality: "Чита",
        addressRegion: "Забайкальский край",
        postalCode: "672000",
        addressCountry: "RU",
      },
      areaServed: ["RU", "BY", "KZ", "KG", "UZ", "AM"],
      knowsAbout: BASE_KEYS,
    });

    setJsonLd("ld-catalog", {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Каталог дробильно-сортировочного оборудования Liming",
      numberOfItems: PRODUCTS.length,
      itemListElement: PRODUCTS.slice(0, 24).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: `${location.origin}${location.pathname}#/product/${p.id}`,
      })),
    });

    setJsonLd("ld-faq", {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Как купить запчасти для дробилки по артикулу?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Введите заводской каталожный номер в поиск на странице «Запчасти» — система найдёт позицию даже при ошибках в дефисах и пробелах. Либо загрузите дефектную ведомость: инженер пришлёт ТКП в течение 24 часов.",
          },
        },
        {
          "@type": "Question",
          name: "Поставляете ли вы запчасти для дробилок других производителей?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Да. Помимо оригиналов Liming поставляем оригинальные запчасти для Metso Nordberg, Sandvik, Terex, Kleemann, Powerscreen, Extec, а также для КСД, КМД, СМД, ДРО и грохотов ГИС/ГИТ.",
          },
        },
        {
          "@type": "Question",
          name: "За какое время готовится технико-коммерческое предложение?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Расчёт ТКП по типовой схеме дробления и по запчастям — до 24 часов с момента получения вводных данных.",
          },
        },
      ],
    });
  }, []);
}
