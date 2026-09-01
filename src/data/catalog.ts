/* ================== Данные каталога ДСО (ручное ведение, аналог TV/MIGX) ================== */
import imgJaw from "../assets/crusher-jaw.jpg";
import imgCone from "../assets/crusher-cone.jpg";
import imgImpact from "../assets/crusher-impact.jpg";
import imgVsi from "../assets/crusher-vsi.jpg";
import imgMobile from "../assets/crusher-mobile.jpg";
import imgScreen from "../assets/screen-grohot.jpg";
import imgPlant from "../assets/complex-plant.jpg";
import { EXTRA_PRODUCTS, OTHER_BRAND_PARTS } from "./more";
import { PARTS_DB } from "./partsDb";

export type Rock = "granite" | "limestone";
export type StockStatus = "in_stock" | "in_transit" | "on_order" | "unknown";
export type PartStatus = "in_stock" | "on_order";
export type CatId = "jaw" | "cone" | "impact" | "vsi" | "mobile" | "screen" | "aux";

export interface Part {
  name: string;
  sku: string; // заводской артикул — база SKU-поиска
  weight: number; // кг
  status: PartStatus;
}

export interface Product {
  id: string;
  cat: CatId;
  brand?: string; // Liming по умолчанию; Metso / Sandvik / Terex / Kleemann / Extec / СМД · КСД · КМД
  name: string; // Liming C6X125
  title: string; // Щековая дробилка Liming C6X125
  tag: string;
  img: string;
  desc: string;
  stock: StockStatus;
  ttx: [string, string][];
  files: { name: string; type: "PDF" | "DWG"; size: string }[];
  parts: Part[];
  /* smart filter */
  filterable: boolean;
  rocks: Rock[];
  inputMax: number; // мм
  outMin: number; // мм
  outMax: number; // мм
  cap: [number, number]; // т/ч
}

export const STOCK_META: Record<StockStatus, { label: string; short: string; tone: "ok" | "warn" | "info" | "dim" }> = {
  in_stock: { label: "В наличии на складе в РФ (г. Чита)", short: "В наличии · Чита", tone: "ok" },
  in_transit: { label: "В пути · ожидаемый срок до 14 дней", short: "В пути ≈ 14 дней", tone: "warn" },
  on_order: { label: "Под заказ · прямая поставка с завода Liming", short: "Под заказ с завода", tone: "info" },
  unknown: { label: "Постоянное пополнение фонда · уточнить у инженера", short: "Уточнить у инженера", tone: "dim" },
};

export const CATEGORIES: { id: CatId; name: string; note: string }[] = [
  { id: "jaw", name: "Щековые дробилки", note: "Первичное дробление крупнокусковой породы" },
  { id: "cone", name: "Конусные дробилки", note: "Среднее и мелкое дробление твёрдых пород" },
  { id: "impact", name: "Роторные дробилки", note: "Кубовидный щебень из малоабразивных пород" },
  { id: "vsi", name: "Центробежно-ударные дробилки", note: "Песок и доизмельчение отсевов" },
  { id: "mobile", name: "Мобильные комплексы", note: "Гусеничный ход, запуск без фундаментов" },
  { id: "screen", name: "Грохоты и питатели", note: "Сортировка и равномерная подача" },
  { id: "aux", name: "Сопутствующее оборудование", note: "Конвейеры, АСУ ТП, сепараторы" },
];

export const CAT_NAME: Record<CatId, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.name]),
) as Record<CatId, string>;

const BASE_PRODUCTS: Product[] = [
  {
    id: "liming-c6x125",
    cat: "jaw",
    name: "Liming C6X125",
    title: "Щековая дробилка Liming C6X125",
    tag: "Первичное дробление · крупная серия",
    img: imgJaw,
    desc: "Флагманская щековая дробилка для крупного карьера. Разборная сварная станина, кованый эксцентриковый вал, клиновая регулировка щели. Рассчитана на гранит, диабаз и железняки крепостью до 320 МПа.",
    stock: "in_stock",
    ttx: [
      ["Приёмное отверстие", "950 × 1250 мм"],
      ["Макс. кусок на входе", "750 мм"],
      ["Разгрузочная щель (CSS)", "100–250 мм"],
      ["Производительность", "290–810 т/ч"],
      ["Мощность двигателя", "160 кВт"],
      ["Масса дробилки", "≈ 48 т"],
    ],
    files: [
      { name: "schekovaya-drobilka-liming-c6x125-pasport.pdf", type: "PDF", size: "2.8 МБ" },
      { name: "schekovaya-drobilka-liming-c6x125-gabariti.dwg", type: "DWG", size: "1.4 МБ" },
    ],
    parts: [
      { name: "Плита дробящая подвижная", sku: "C6X125-31.01-02", weight: 1890, status: "in_stock" },
      { name: "Плита дробящая неподвижная", sku: "C6X125-31.01-01", weight: 1745, status: "in_stock" },
      { name: "Распорная плита", sku: "C6X125-09-04", weight: 412, status: "in_stock" },
      { name: "Подшипник эксцентрикового вала", sku: "23176-CA/W33", weight: 210, status: "in_stock" },
      { name: "Клин крепления плиты", sku: "C6X125-08-11", weight: 96, status: "on_order" },
      { name: "Маховик в сборе", sku: "C6X125-02-03", weight: 2260, status: "on_order" },
    ],
    filterable: true,
    rocks: ["granite", "limestone"],
    inputMax: 750,
    outMin: 100,
    outMax: 250,
    cap: [290, 810],
  },
  {
    id: "liming-pe750",
    cat: "jaw",
    name: "Liming PE750×1060",
    title: "Щековая дробилка Liming PE750×1060",
    tag: "Первичное дробление · классическая серия",
    img: imgJaw,
    desc: "Проверенная серией проектов «рабочая лошадка» для стадии первичного дробления. Простая кинематика, дешёвые расходники, ремонтопригодность в полевых условиях — оптимум для карьеров средней мощности.",
    stock: "in_transit",
    ttx: [
      ["Приёмное отверстие", "750 × 1060 мм"],
      ["Макс. кусок на входе", "630 мм"],
      ["Разгрузочная щель (CSS)", "80–140 мм"],
      ["Производительность", "110–320 т/ч"],
      ["Мощность двигателя", "110 кВт"],
      ["Масса дробилки", "≈ 29 т"],
    ],
    files: [
      { name: "schekovaya-drobilka-liming-pe750x1060-pasport.pdf", type: "PDF", size: "2.1 МБ" },
      { name: "schekovaya-drobilka-liming-pe750x1060-gabariti.dwg", type: "DWG", size: "0.9 МБ" },
    ],
    parts: [
      { name: "Плита дробящая подвижная", sku: "PE750x1060.02-01", weight: 1170, status: "in_stock" },
      { name: "Плита дробящая неподвижная", sku: "PE750x1060.02-02", weight: 1090, status: "in_stock" },
      { name: "Распорная плита", sku: "PE750x1060.09-07", weight: 290, status: "in_stock" },
      { name: "Сухарь клина прижимного", sku: "PE750x1060.08-02", weight: 34, status: "in_stock" },
      { name: "Подпятник распорной плиты", sku: "PE750x1060.09-12", weight: 28, status: "on_order" },
    ],
    filterable: true,
    rocks: ["granite", "limestone"],
    inputMax: 630,
    outMin: 80,
    outMax: 140,
    cap: [110, 320],
  },
  {
    id: "liming-hpt300",
    cat: "cone",
    name: "Liming HPT300",
    title: "Конусная дробилка Liming HPT300",
    tag: "Многогидроцилиндровая · II–III стадии",
    img: imgCone,
    desc: "Многоцилиндровая гидравлическая конусная дробилка с оптимизированной камерой ламинарного дробления. Стабильная гранулометрия на твёрдых породах, защита от перегрузки и недробимых тел.",
    stock: "in_stock",
    ttx: [
      ["Камеры дробления", "C1 / C2 / M / F1 / F2"],
      ["Макс. кусок на входе", "до 225 мм (камера C1)"],
      ["Диапазон фракции", "10–38 мм"],
      ["Производительность", "110–440 т/ч"],
      ["Мощность двигателя", "220 кВт"],
      ["Масса дробилки", "≈ 18 т"],
    ],
    files: [
      { name: "konusnaya-drobilka-liming-hpt300-pasport.pdf", type: "PDF", size: "3.2 МБ" },
      { name: "konusnaya-drobilka-liming-hpt300-gabariti.dwg", type: "DWG", size: "1.1 МБ" },
    ],
    parts: [
      { name: "Броня конуса подвижная", sku: "HPT300-4-01", weight: 1580, status: "in_stock" },
      { name: "Броня конуса неподвижная", sku: "HPT300-4-02", weight: 1640, status: "in_stock" },
      { name: "Втулка цилиндрическая бронзовая", sku: "HPT300-07-03", weight: 62, status: "in_stock" },
      { name: "Втулка коническая", sku: "HPT300-07-06", weight: 74, status: "in_stock" },
      { name: "Подпятник сферический", sku: "HPT300-09-01", weight: 84, status: "on_order" },
      { name: "Вал эксцентриковый в сборе", sku: "HPT300-02-10", weight: 940, status: "on_order" },
    ],
    filterable: true,
    rocks: ["granite", "limestone"],
    inputMax: 225,
    outMin: 10,
    outMax: 38,
    cap: [110, 440],
  },
  {
    id: "liming-hpt500",
    cat: "cone",
    name: "Liming HPT500",
    title: "Конусная дробилка Liming HPT500",
    tag: "Многогидроцилиндровая · высокая мощность",
    img: imgCone,
    desc: "Старшая модификация для высоконагруженных линий на абразивных породах. Увеличенный эксцентриситет, интеллектуальная гидравлика с автоподстройкой щели по загрузке.",
    stock: "on_order",
    ttx: [
      ["Камеры дробления", "C1 / C2 / M / F1 / F2"],
      ["Макс. кусок на входе", "до 290 мм (камера C1)"],
      ["Диапазон фракций", "13–51 мм"],
      ["Производительность", "160–670 т/ч"],
      ["Мощность двигателя", "315 кВт"],
      ["Масса дробилки", "≈ 39 т"],
    ],
    files: [
      { name: "konusnaya-drobilka-liming-hpt500-pasport.pdf", type: "PDF", size: "3.4 МБ" },
      { name: "konusnaya-drobilka-liming-hpt500-gabariti.dwg", type: "DWG", size: "1.3 МБ" },
    ],
    parts: [
      { name: "Броня конуса подвижная", sku: "HPT500-4-01", weight: 2680, status: "on_order" },
      { name: "Броня конуса неподвижная", sku: "HPT500-4-02", weight: 2790, status: "on_order" },
      { name: "Втулка эксцентриковая", sku: "HPT500-07-04", weight: 128, status: "in_stock" },
      { name: "Шестерня коническая большая", sku: "HPT500-06-02", weight: 215, status: "in_stock" },
      { name: "Уплотнение пылевое комплект", sku: "HPT500-19-08", weight: 6, status: "in_stock" },
    ],
    filterable: true,
    rocks: ["granite", "limestone"],
    inputMax: 290,
    outMin: 13,
    outMax: 51,
    cap: [160, 670],
  },
  {
    id: "liming-hst160",
    cat: "cone",
    name: "Liming HST160",
    title: "Конусная дробилка Liming HST160",
    tag: "Одногидроцилиндровая · компактная",
    img: imgCone,
    desc: "Одноцилиндровая гидравлическая дробилка: простая гидросхема, быстрая замена броней без заливки цинка/эпоксидки, автоматика CSS. Оптимальна для модернизации линий взамен КСД/КМД.",
    stock: "in_stock",
    ttx: [
      ["Камеры дробления", "S1 / S2 / H1 / H2 / H3"],
      ["Макс. кусок на входе", "до 360 мм (камера S1)"],
      ["Диапазон фракций", "6–44 мм"],
      ["Производительность", "55–270 т/ч"],
      ["Мощность двигателя", "160 кВт"],
      ["Масса дробилки", "≈ 10 т"],
    ],
    files: [
      { name: "konusnaya-drobilka-liming-hst160-pasport.pdf", type: "PDF", size: "2.4 МБ" },
      { name: "konusnaya-drobilka-liming-hst160-gabariti.dwg", type: "DWG", size: "0.8 МБ" },
    ],
    parts: [
      { name: "Шестерня коническая", sku: "HST160.06-01", weight: 48, status: "in_stock" },
      { name: "Броня конуса подвижная", sku: "HST160-4-02", weight: 870, status: "in_stock" },
      { name: "Броня неподвижная (защитная)", sku: "HST160-4-05", weight: 910, status: "on_order" },
      { name: "Втулка нижняя бронзовая", sku: "HST160-07-05", weight: 41, status: "in_stock" },
      { name: "Подпятник сферический", sku: "HST160-09-02", weight: 52, status: "in_stock" },
    ],
    filterable: true,
    rocks: ["granite", "limestone"],
    inputMax: 360,
    outMin: 6,
    outMax: 44,
    cap: [55, 270],
  },
  {
    id: "liming-ci5x1520",
    cat: "impact",
    name: "Liming CI5X1520",
    title: "Роторная дробилка Liming CI5X1520",
    tag: "Кубовидный щебень · II стадия",
    img: imgImpact,
    desc: "Роторный аппарат с объёмной камерой и инерционным ротором увеличенного диаметра. Выдаёт щебень лещадности до 10% на известняках и доломитах; гидроприжимы отражательных плит.",
    stock: "in_stock",
    ttx: [
      ["Приёмное отверстие", "2040 × 520 мм"],
      ["Макс. кусок (мягкие породы)", "700 мм"],
      ["Макс. кусок (средние породы)", "350 мм"],
      ["Производительность", "200–600 т/ч"],
      ["Мощность двигателя", "400 кВт (2 × 200)"],
      ["Масса дробилки", "≈ 30,5 т"],
    ],
    files: [
      { name: "rotornaya-drobilka-liming-ci5x1520-pasport.pdf", type: "PDF", size: "2.9 МБ" },
      { name: "rotornaya-drobilka-liming-ci5x1520-gabariti.dwg", type: "DWG", size: "1.0 МБ" },
    ],
    parts: [
      { name: "Било роторное с керамической вставкой", sku: "CI5X1520-ВМ-03", weight: 118, status: "in_stock" },
      { name: "Плита отражательная I ряда", sku: "CI5X1520-IP-01", weight: 640, status: "in_stock" },
      { name: "Футеровка корпуса", sku: "CI5X1520-LN-11", weight: 96, status: "in_stock" },
      { name: "Комплект клиньев бил", sku: "CI5X1520-KL-07", weight: 24, status: "on_order" },
    ],
    filterable: true,
    rocks: ["limestone"],
    inputMax: 700,
    outMin: 0,
    outMax: 60,
    cap: [200, 600],
  },
  {
    id: "liming-pfw1315",
    cat: "impact",
    name: "Liming PFW1315III",
    title: "Роторная дробилка Liming PFW1315III",
    tag: "Кубовидный щебень · проверенная серия",
    img: imgImpact,
    desc: "Гидравлическая роторная дробилка для переработки известняка и строительных отходов. Гидровскрытие корпуса сокращает время ревизии ротора до 40 минут.",
    stock: "on_order",
    ttx: [
      ["Приёмное отверстие", "1540 × 930 мм"],
      ["Макс. кусок на входе", "350 мм"],
      ["Диапазон фракций", "0–50 мм"],
      ["Производительность", "180–320 т/ч"],
      ["Мощность двигателя", "200 кВт"],
      ["Масса дробилки", "≈ 24 т"],
    ],
    files: [
      { name: "rotornaya-drobilka-liming-pfw1315-pasport.pdf", type: "PDF", size: "2.2 МБ" },
      { name: "rotornaya-drobilka-liming-pfw1315-gabariti.dwg", type: "DWG", size: "0.9 МБ" },
    ],
    parts: [
      { name: "Било роторное", sku: "PFW1315-B-02", weight: 96, status: "in_stock" },
      { name: "Футеровка отражательной плиты", sku: "PFW1315-F-07", weight: 215, status: "in_stock" },
      { name: "Плита отражательная", sku: "PFW1315-IP-04", weight: 480, status: "on_order" },
      { name: "Сито колосниковое выходное", sku: "PFW1315-S-12", weight: 55, status: "on_order" },
    ],
    filterable: true,
    rocks: ["limestone"],
    inputMax: 350,
    outMin: 0,
    outMax: 50,
    cap: [180, 320],
  },
  {
    id: "liming-vsi6x1150",
    cat: "vsi",
    name: "Liming VSI6X1150",
    title: "Центробежно-ударная дробилка VSI6X1150",
    tag: "Производство песка · доизмельчение",
    img: imgVsi,
    desc: "Центробежно-ударка с 5-открытым ротором и кольцевой футеровкой «сталь о сталь». Песок класса I из отсевов дробления, корректировка формы щебня, доизмельчение до 0–5 мм.",
    stock: "in_stock",
    ttx: [
      ["Макс. кусок на входе", "50 мм"],
      ["Режимы", "центральная + кольцевая подача"],
      ["Производительность", "250–440 т/ч"],
      ["Мощность двигателя", "500 кВт (2 × 250)"],
      ["Частота ротора", "1450–1750 об/мин"],
      ["Масса дробилки", "≈ 20 т"],
    ],
    files: [
      { name: "centrobezhno-udarnaya-liming-vsi6x1150-pasport.pdf", type: "PDF", size: "3.0 МБ" },
      { name: "centrobezhno-udarnaya-liming-vsi6x1150-gabariti.dwg", type: "DWG", size: "1.2 МБ" },
    ],
    parts: [
      { name: "Ротор 5-открытый в сборе", sku: "VSI6X1150-R-01", weight: 685, status: "in_stock" },
      { name: "Наконечник ротора (комплект)", sku: "VSI6X1150-TIP-02", weight: 8, status: "in_stock" },
      { name: "Отбойник кольцевой (комплект)", sku: "VSI6X1150-AN-04", weight: 12, status: "in_stock" },
      { name: "Распределительная плита", sku: "VSI6X1150-DP-06", weight: 22, status: "on_order" },
    ],
    filterable: true,
    rocks: ["granite", "limestone"],
    inputMax: 50,
    outMin: 0,
    outMax: 5,
    cap: [250, 440],
  },
  {
    id: "liming-nk75j",
    cat: "mobile",
    name: "Liming NK75J",
    title: "Мобильная щековая установка Liming NK75J",
    tag: "Гусеничный ход · автономность",
    img: imgMobile,
    desc: "Мобильный комплекс первичного дробления на гусеницах: вибропитатель с колосниками, щековая дробилка, боковой конвейер отсевов. Развёртывание без крана и фундаментов за одну смену.",
    stock: "on_order",
    ttx: [
      ["Дробильный агрегат", "щековая, 700 × 1000 мм"],
      ["Макс. кусок на входе", "650 мм"],
      ["Производительность", "120–350 т/ч"],
      ["Силовая установка", "дизель 226 кВт"],
      ["Транспортная масса", "≈ 42 т"],
      ["Габариты в транспорте", "14,5 × 3,1 × 3,8 м"],
    ],
    files: [
      { name: "mobilnaya-ustanovka-liming-nk75j-pasport.pdf", type: "PDF", size: "3.6 МБ" },
      { name: "mobilnaya-ustanovka-liming-nk75j-gabariti.dwg", type: "DWG", size: "1.5 МБ" },
    ],
    parts: [
      { name: "Плита дробящая подвижная", sku: "NK75J-JP-01", weight: 980, status: "on_order" },
      { name: "Плита дробящая неподвижная", sku: "NK75J-JP-02", weight: 940, status: "on_order" },
      { name: "Колосник питателя", sku: "NK75J-GB-03", weight: 58, status: "in_stock" },
      { name: "Фильтр гидросистемы (комплект)", sku: "NK75J-HF-10", weight: 4, status: "in_stock" },
    ],
    filterable: true,
    rocks: ["granite", "limestone"],
    inputMax: 650,
    outMin: 100,
    outMax: 250,
    cap: [120, 350],
  },
  {
    id: "liming-s5x1860",
    cat: "screen",
    name: "Liming S5X1860-3",
    title: "Грохот вибрационный Liming S5X1860-3",
    tag: "Тяжёлая серия · 3 деки",
    img: imgScreen,
    desc: "Инерционный грохот тяжёлого типа с внешним возбудителем и брекерной конструкцией боковин. Амплитуда настраивается балансирными съёмными грузами под конкретный продукт.",
    stock: "in_stock",
    ttx: [
      ["Рабочая поверхность", "1800 × 6000 мм × 3 деки"],
      ["Ячейки сит (по проекту)", "5–80 мм"],
      ["Производительность", "75–600 т/ч"],
      ["Угол установки", "15–20°"],
      ["Мощность двигателя", "30 кВт"],
      ["Масса грохота", "≈ 13,5 т"],
    ],
    files: [
      { name: "grohot-liming-s5x1860-pasport.pdf", type: "PDF", size: "2.0 МБ" },
      { name: "grohot-liming-s5x1860-gabariti.dwg", type: "DWG", size: "0.7 МБ" },
    ],
    parts: [
      { name: "Сито полиуретановое 610×305 (яч. 25×25)", sku: "S5X-PU-25", weight: 4, status: "in_stock" },
      { name: "Сито стальное рифлёное (яч. 40×40)", sku: "S5X-WR-40", weight: 14, status: "in_stock" },
      { name: "Подситник поперечный", sku: "S5X-TP-12", weight: 9, status: "in_stock" },
      { name: "Пружина опорная", sku: "S5X-SPR-06", weight: 17, status: "in_stock" },
      { name: "Вибровозбудитель в сборе", sku: "S5X-EX-01", weight: 380, status: "on_order" },
      { name: "Подшипник возбудителя", sku: "22322-E1-XL", weight: 11, status: "in_stock" },
    ],
    filterable: false,
    rocks: ["granite", "limestone"],
    inputMax: 300,
    outMin: 5,
    outMax: 80,
    cap: [75, 600],
  },
  {
    id: "liming-f5x1345",
    cat: "screen",
    name: "Liming F5X1345",
    title: "Вибропитатель с колосниковой решёткой F5X1345",
    tag: "Первичная подача из-под взрыва",
    img: imgScreen,
    desc: "Питатель тяжёлого класса для загрузки первичной дробилки: колосниковая секция отсекает природную мелочь до дробильной камеры, снижая износ плит на 8–12%.",
    stock: "in_transit",
    ttx: [
      ["Размер лотка", "1300 × 4500 мм"],
      ["Макс. кусок на входе", "750 мм"],
      ["Производительность", "450–900 т/ч"],
      ["Длина колосниковой зоны", "1200 мм"],
      ["Мощность двигателя", "37 кВт"],
      ["Масса питателя", "≈ 11,6 т"],
    ],
    files: [
      { name: "vibropitatel-liming-f5x1345-pasport.pdf", type: "PDF", size: "1.8 МБ" },
      { name: "vibropitatel-liming-f5x1345-gabariti.dwg", type: "DWG", size: "0.6 МБ" },
    ],
    parts: [
      { name: "Колосник футеровочный", sku: "F5X1345-BAR-02", weight: 61, status: "in_stock" },
      { name: "Пружина опорная", sku: "F5X-SPR-03", weight: 14, status: "in_stock" },
      { name: "Вибратор блочный в сборе", sku: "F5X1345-VB-01", weight: 290, status: "on_order" },
      { name: "Лист изнашиваемый днища", sku: "F5X1345-LN-05", weight: 132, status: "in_stock" },
    ],
    filterable: false,
    rocks: ["granite", "limestone"],
    inputMax: 750,
    outMin: 0,
    outMax: 300,
    cap: [450, 900],
  },
  {
    id: "ast-b1200",
    cat: "aux",
    name: "АСТ B1200",
    title: "Конвейер ленточный B1200 (проектное исполнение)",
    tag: "Транспорт продукта · комплектация линий",
    img: imgPlant,
    desc: "Стационарные и хоботовые конвейеры под проект линии: желобчатые и прямые исполнения, стяжные хвостовые станции, герметизирующие юбки в местах пересыпа. Ширина ленты 500–1400 мм.",
    stock: "unknown",
    ttx: [
      ["Ширина ленты", "1200 мм (серия 500–1400)"],
      ["Длина трассы", "12–120 м по проекту"],
      ["Производительность", "до 600 т/ч"],
      ["Скорость ленты", "1,6–2,5 м/с"],
      ["Мощность привода", "15–75 кВт по длине"],
      ["Исполнение", "стационарное / хоботовое"],
    ],
    files: [
      { name: "konveyor-ast-b1200-tipochnik.pdf", type: "PDF", size: "1.2 МБ" },
      { name: "konveyor-ast-b1200-privodnaya-stanciya.dwg", type: "DWG", size: "0.8 МБ" },
    ],
    parts: [
      { name: "Ролик конвейерный Ø108 × 1400", sku: "B1200-RL-14", weight: 18, status: "in_stock" },
      { name: "Роликоопора трёхроликовая", sku: "B1200-RS-03", weight: 26, status: "in_stock" },
      { name: "Барабан приводной Ø630 с футеровкой", sku: "B1200-DR-63", weight: 310, status: "on_order" },
      { name: "Лента EP400/3, 1000 мм (за п. м)", sku: "EP400-3-1000", weight: 12, status: "in_stock" },
    ],
    filterable: false,
    rocks: ["granite", "limestone"],
    inputMax: 500,
    outMin: 0,
    outMax: 500,
    cap: [100, 600],
  },
];

/** полный каталог: базовая линейка + всё семейство Liming + парк других брендов */
export const PRODUCTS: Product[] = [...BASE_PRODUCTS, ...EXTRA_PRODUCTS];

export const brandOf = (p: Product): string => p.brand ?? (p.id.startsWith("ast-") ? "АСТ" : "Liming");

/* ====== свободные позиции склада запчастей (для демонстрации артикульного поиска) ====== */
export interface LoosePart {
  name: string;
  sku: string;
  fits: string;
  status: PartStatus;
}
export const LOOSE_PARTS: LoosePart[] = [
  { name: "Сито полиуретановое 610×305, ячейка 10×10", sku: "СП-610х305-ПУ-10", fits: "Грохоты ГИС/ГИЛ/ГИТ, S5X", status: "in_stock" },
  { name: "Сито полиуретановое для ГИС-52", sku: "ГИС52-ПУ-10Х10", fits: "Грохот ГИС-52", status: "in_stock" },
  { name: "Броня конуса дробящего (КМД-1750 Гр)", sku: "1277.05.311-1", fits: "Конусные КМД/КСД-1750", status: "in_stock" },
  { name: "Плита дробящая ЩДП 900×1200", sku: "4825.02.01.013", fits: "Щековые ЩДП 900×1200 (в т.ч. PE-аналоги)", status: "on_order" },
  { name: "Била для роторной PFW1315 (комплект 8 шт)", sku: "PFW1315-B-02-K8", fits: "Роторные Liming PFW1315", status: "in_stock" },
  { name: "Подшипник ГИС-52 (3636 ГОСТ)", sku: "3636-GOST", fits: "Грохоты ГИС/ГИЛ-52", status: "in_stock" },
];

export interface SearchPartItem {
  name: string;
  sku: string;
  weight?: number;
  status: PartStatus;
  parentId?: string;
  parentName?: string;
  fits?: string;
  group?: string;
  /** предвычисленные ключи поиска (нормализованные) */
  nsku: string;
  nname: string;
}

/** быстрый дедуп по артикулу (O(n) — важно при 10 000+ позициях) */
function dedupeBySku(items: Omit<SearchPartItem, "nsku" | "nname">[]): SearchPartItem[] {
  const seen = new Set<string>();
  const res: SearchPartItem[] = [];
  for (const it of items) {
    if (seen.has(it.sku)) continue;
    seen.add(it.sku);
    res.push({
      ...it,
      nsku: (it as Partial<SearchPartItem>).nsku ?? normalizeKey(it.sku),
      nname: (it as Partial<SearchPartItem>).nname ?? normalizeKey(it.name),
    });
  }
  return res;
}

/** нормализация строки поиска: латиница→кириллица, без разделителей */
export function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/[a-z]/g, (c) => {
      const map: Record<string, string> = {
        a: "а", b: "в", c: "с", e: "е", h: "н", k: "к", m: "м", o: "о", p: "р", t: "т", x: "х",
      };
      return map[c] ?? c;
    })
    .replace(/[^0-9a-zа-яё]+/gi, "");
}

/** плоский реестр всех деталей для поиска по артикулу:
    оригиналы Liming + оригинальные позиции для парка других производителей */
export const PART_INDEX: SearchPartItem[] = dedupeBySku([
  ...PRODUCTS.flatMap((p) =>
    p.parts.map((part) => ({
      ...part,
      parentId: p.id,
      parentName: p.title,
    })),
  ),
  ...OTHER_BRAND_PARTS.map((bp) => ({
    name: bp.name,
    sku: bp.sku,
    weight: bp.weight,
    status: bp.status,
    fits: bp.fits,
  })),
  ...LOOSE_PARTS.map((lp) => ({
    name: lp.name,
    sku: lp.sku,
    status: lp.status,
    fits: lp.fits,
  })),
  ...PARTS_DB.map((p) => ({
    name: p.name,
    sku: p.sku,
    weight: p.weight,
    status: p.status,
    fits: p.fits,
    group: p.group,
    nsku: p.nsku,
    nname: p.nname,
  })),
]);

export const PARTS_TOTAL = PART_INDEX.length;


