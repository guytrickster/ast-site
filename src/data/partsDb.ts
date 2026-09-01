/* ============================================================================
   Складская база запчастей ДСО (1000+ позиций).
   Каталожные номера соответствуют реальным заводским системам нумерации:
   · Liming / китайские серии — код серии + узел (C6X125-31.01-02, HPT300-4-01)
   · Metso Nordberg — N-серия и MM-серия (N11921408, MM0262102)
   · Sandvik — формат 442.xxxx-xx
   · Отечественные КСД/КМД/СМД/ДРО — номера чертежей (1277.05.311-1, 104900021220)
   · Подшипники — обозначения по ГОСТ/ISO (22322-E1-XL, 23176-CA/W33)
   · Ленты — по ГОСТ 20-85 / EP-стандарту (EP400/3-1000)
   ========================================================================== */
import type { PartStatus } from "./catalog";

export interface DbPart {
  name: string;
  sku: string;
  weight: number;
  status: PartStatus;
  fits: string;
  group: string;
}

const out: DbPart[] = [];
/** детерминированный «псевдослучай» — стабильные веса и статусы между сборками */
let seed = 20260215;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const pick = <T,>(a: T[]): T => a[Math.floor(rnd() * a.length) % a.length];
const w = (min: number, max: number) => Math.round((min + rnd() * (max - min)) * 10) / 10;
const st = (p = 0.62): PartStatus => (rnd() < p ? "in_stock" : "on_order");

const add = (p: DbPart) => {
  if (!out.some((x) => x.sku === p.sku)) out.push(p);
};

/* ─────────────────────────── 1. ЩЕКОВЫЕ ДРОБИЛКИ LIMING ─────────────────────────── */
const JAW_C6X = [
  { m: "C6X80", k: 0.5 }, { m: "C6X100", k: 0.75 }, { m: "C6X110", k: 0.85 },
  { m: "C6X125", k: 1 }, { m: "C6X145", k: 1.3 }, { m: "C6X160", k: 1.55 },
  { m: "C5X110", k: 0.8 }, { m: "C5X125", k: 1 }, { m: "C5X145", k: 1.25 },
];
for (const { m, k } of JAW_C6X) {
  const fits = `Щековая дробилка Liming ${m}`;
  add({ name: "Плита дробящая подвижная Mn18Cr2", sku: `${m}-31.01-02`, weight: w(600 * k, 1900 * k), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Плита дробящая неподвижная Mn18Cr2", sku: `${m}-31.01-01`, weight: w(580 * k, 1800 * k), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Плита дробящая подвижная Mn22Cr2 (абразив)", sku: `${m}-31.02-02`, weight: w(600 * k, 1900 * k), status: st(0.4), fits, group: "Щековые дробилки" });
  add({ name: "Футеровка боковая (щека) левая", sku: `${m}-06-09L`, weight: w(60 * k, 190 * k), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Футеровка боковая (щека) правая", sku: `${m}-06-09R`, weight: w(60 * k, 190 * k), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Плита распорная", sku: `${m}-09-04`, weight: w(120 * k, 430 * k), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Сухарь распорной плиты передний", sku: `${m}-09-11`, weight: w(20 * k, 60 * k), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Сухарь распорной плиты задний", sku: `${m}-09-12`, weight: w(20 * k, 60 * k), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Клин крепления плиты верхний", sku: `${m}-08-11`, weight: w(30 * k, 100 * k), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Клин регулировки щели (CSS)", sku: `${m}-10-03`, weight: w(80 * k, 260 * k), status: st(0.45), fits, group: "Щековые дробилки" });
  add({ name: "Вал эксцентриковый кованый", sku: `${m}-02-01`, weight: w(700 * k, 1600 * k), status: st(0.25), fits, group: "Щековые дробилки" });
  add({ name: "Маховик в сборе", sku: `${m}-02-03`, weight: w(1100 * k, 2400 * k), status: st(0.25), fits, group: "Щековые дробилки" });
  add({ name: "Шкив приводной клиноремённый", sku: `${m}-03-07`, weight: w(500 * k, 1200 * k), status: st(0.3), fits, group: "Щековые дробилки" });
  add({ name: "Щека подвижная в сборе", sku: `${m}-01-00`, weight: w(2600 * k, 8800 * k), status: "on_order", fits, group: "Щековые дробилки" });
  add({ name: "Тяга пружинная с пружиной", sku: `${m}-11-02`, weight: w(40 * k, 120 * k), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Гидростанция регулировки щели", sku: `${m}-HU-01`, weight: w(120, 260), status: st(0.3), fits, group: "Щековые дробилки" });
  add({ name: "Комплект РТИ гидроцилиндра", sku: `${m}-HU-RK`, weight: 2, status: st(0.8), fits, group: "Щековые дробилки" });
  add({ name: "Амортизатор упругий ограничитель", sku: `${m}-12-05`, weight: w(15 * k, 45 * k), status: st(), fits, group: "Щековые дробилки" });
}

const JAW_PE = ["PE-250×400", "PE-400×600", "PE-500×750", "PE-600×900", "PE-750×1060", "PE-900×1200", "PE-1200×1500", "PEX-250×750", "PEX-250×1000", "PEX-300×1300"];
for (const m of JAW_PE) {
  const code = m.replace("×", "x").replace("PE-", "PE").replace("PEX-", "PEX");
  // ширина приёмного отверстия из названия (PE-750×1060 → 750) как коэффициент массы
  const size = Number(m.split("×")[0].replace(/\D+/g, "")) / 300;
  const fits = `Щековая дробилка Liming ${m}`;
  add({ name: "Плита дробящая подвижная 110Г13Л", sku: `${code}.02-01`, weight: w(180 * size, 620 * size), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Плита дробящая неподвижная 110Г13Л", sku: `${code}.02-02`, weight: w(170 * size, 600 * size), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Плита боковая футеровочная", sku: `${code}.06-03`, weight: w(30 * size, 90 * size), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Плита распорная", sku: `${code}.09-07`, weight: w(50 * size, 160 * size), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Сухарь прижимной", sku: `${code}.08-01`, weight: w(8 * size, 24 * size), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Клин крепления плиты", sku: `${code}.08-04`, weight: w(12 * size, 38 * size), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Вал эксцентриковый", sku: `${code}.01-01`, weight: w(280 * size, 900 * size), status: st(0.3), fits, group: "Щековые дробилки" });
  add({ name: "Щека подвижная в сборе", sku: `${code}.01-00`, weight: w(900 * size, 3200 * size), status: "on_order", fits, group: "Щековые дробилки" });
  add({ name: "Маховик", sku: `${code}.03-02`, weight: w(320 * size, 1050 * size), status: st(0.3), fits, group: "Щековые дробилки" });
  add({ name: "Ось подвижной щеки", sku: `${code}.01-05`, weight: w(60 * size, 220 * size), status: st(0.4), fits, group: "Щековые дробилки" });
  add({ name: "Комплект пружин возврата", sku: `${code}.11-01`, weight: w(6 * size, 20 * size), status: st(0.75), fits, group: "Щековые дробилки" });
}

const JAW_PEW = ["PEW250×1000", "PEW400×600", "PEW760", "PEW860", "PEW1100"];
for (const m of JAW_PEW) {
  const fits = `Щековая дробилка Liming ${m} (евросерия)`;
  add({ name: "Плита дробящая подвижная", sku: `${m}-31-01`, weight: w(420, 2050), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Плита дробящая неподвижная", sku: `${m}-31-02`, weight: w(400, 2100), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Гидроцилиндр регулировки щели", sku: `${m}-HC-01`, weight: w(35, 95), status: st(0.4), fits, group: "Щековые дробилки" });
  add({ name: "Футеровка боковая", sku: `${m}-06-02`, weight: w(45, 150), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Плита распорная", sku: `${m}-09-01`, weight: w(90, 340), status: st(), fits, group: "Щековые дробилки" });
  add({ name: "Подшипник эксцентрикового вала", sku: pick(["22336-CA/W33", "22340-CA/W33", "23148-CA/W33"]), weight: w(45, 210), status: st(), fits, group: "Подшипники" });
}

/* ─────────────────────────── 2. КОНУСНЫЕ ДРОБИЛКИ LIMING ─────────────────────────── */
const CONE_HPT = [
  { m: "HPT100", k: 0.42 }, { m: "HPT200", k: 0.7 }, { m: "HPT300", k: 1 },
  { m: "HPT400", k: 1.35 }, { m: "HPT500", k: 1.7 }, { m: "HPT800", k: 2.4 },
];
const CAVITIES = ["C1", "C2", "M", "F1", "F2"];
for (const { m, k } of CONE_HPT) {
  const fits = `Конусная дробилка Liming ${m}`;
  CAVITIES.forEach((c, i) => {
    add({ name: `Броня конуса подвижная (mantle), камера ${c}`, sku: `${m}-4-01-${c}`, weight: w(700 * k, 1700 * k), status: st(i < 3 ? 0.7 : 0.35), fits, group: "Конусные дробилки" });
    add({ name: `Броня неподвижная (concave), камера ${c}`, sku: `${m}-4-02-${c}`, weight: w(720 * k, 1750 * k), status: st(i < 3 ? 0.7 : 0.35), fits, group: "Конусные дробилки" });
  });
  add({ name: "Втулка цилиндрическая бронзовая", sku: `${m}-07-03`, weight: w(30 * k, 90 * k), status: st(), fits, group: "Конусные дробилки" });
  add({ name: "Втулка коническая бронзовая", sku: `${m}-07-06`, weight: w(35 * k, 100 * k), status: st(), fits, group: "Конусные дробилки" });
  add({ name: "Втулка эксцентриковая", sku: `${m}-07-04`, weight: w(50 * k, 140 * k), status: st(), fits, group: "Конусные дробилки" });
  add({ name: "Подпятник сферический", sku: `${m}-09-01`, weight: w(40 * k, 120 * k), status: st(0.5), fits, group: "Конусные дробилки" });
  add({ name: "Вал эксцентриковый в сборе", sku: `${m}-02-10`, weight: w(400 * k, 1100 * k), status: st(0.25), fits, group: "Конусные дробилки" });
  add({ name: "Шестерня коническая большая", sku: `${m}-06-02`, weight: w(90 * k, 260 * k), status: st(0.45), fits, group: "Конусные дробилки" });
  add({ name: "Шестерня коническая малая (пиньон)", sku: `${m}-06-01`, weight: w(25 * k, 80 * k), status: st(0.45), fits, group: "Конусные дробилки" });
  add({ name: "Уплотнение пылевое, комплект", sku: `${m}-19-08`, weight: w(3, 9), status: st(0.85), fits, group: "Конусные дробилки" });
  add({ name: "Кольцо гидроцилиндра фиксации", sku: `${m}-14-02`, weight: w(30 * k, 95 * k), status: st(0.4), fits, group: "Конусные дробилки" });
  add({ name: "Гидроаккумулятор системы защиты", sku: `${m}-HA-01`, weight: w(18, 42), status: st(0.5), fits, group: "Конусные дробилки" });
  add({ name: "Насос смазочной станции", sku: `${m}-LU-05`, weight: w(22, 60), status: st(0.4), fits, group: "Конусные дробилки" });
  add({ name: "Фильтроэлемент маслостанции", sku: `${m}-LU-F1`, weight: 2, status: st(0.9), fits, group: "ГСМ и фильтры" });
  add({ name: "Комплект РТИ гидросистемы", sku: `${m}-HY-RK`, weight: 3, status: st(0.85), fits, group: "Конусные дробилки" });
}

const CONE_HST = ["HST100", "HST160", "HST250", "HST315"];
for (const m of CONE_HST) {
  const fits = `Конусная дробилка Liming ${m}`;
  for (const c of ["S1", "S2", "H1", "H2", "H3"]) {
    add({ name: `Броня конуса подвижная, камера ${c}`, sku: `${m}-4-01-${c}`, weight: w(520, 1900), status: st(0.55), fits, group: "Конусные дробилки" });
    add({ name: `Броня неподвижная, камера ${c}`, sku: `${m}-4-02-${c}`, weight: w(540, 1950), status: st(0.55), fits, group: "Конусные дробилки" });
  }
  add({ name: "Шестерня коническая", sku: `${m}.06-01`, weight: w(38, 95), status: st(), fits, group: "Конусные дробилки" });
  add({ name: "Втулка нижняя бронзовая", sku: `${m}-07-05`, weight: w(28, 78), status: st(), fits, group: "Конусные дробилки" });
  add({ name: "Втулка эксцентриковая бронзовая", sku: `${m}-07-02`, weight: w(35, 92), status: st(), fits, group: "Конусные дробилки" });
  add({ name: "Подпятник сферический", sku: `${m}-09-02`, weight: w(32, 88), status: st(), fits, group: "Конусные дробилки" });
  add({ name: "Гидроцилиндр главного вала", sku: `${m}-HC-02`, weight: w(60, 165), status: st(0.35), fits, group: "Конусные дробилки" });
  add({ name: "Кольцо уплотнительное пылезащитное", sku: `${m}-19-04`, weight: 3, status: st(0.85), fits, group: "Конусные дробилки" });
}

const CONE_PY = ["PYB600", "PYD600", "PYB900", "PYZ900", "PYD900", "PYB1200", "PYZ1200", "PYB1750", "PYZ1750", "PYD1750", "PYB2200", "PYZ2200", "CS75", "CS160", "CS240B", "CS430"];
for (const m of CONE_PY) {
  const fits = `Конусная дробилка Liming ${m} (пружинная)`;
  add({ name: "Броня конуса дробящего", sku: `${m}-4-01`, weight: w(150, 2400), status: st(0.5), fits, group: "Конусные дробилки" });
  add({ name: "Броня неподвижная (чаша)", sku: `${m}-4-02`, weight: w(160, 2500), status: st(0.5), fits, group: "Конусные дробилки" });
  add({ name: "Втулка коническая бронзовая", sku: `${m}-07-05`, weight: w(18, 96), status: st(), fits, group: "Конусные дробилки" });
  add({ name: "Втулка эксцентриковая", sku: `${m}-07-01`, weight: w(22, 105), status: st(), fits, group: "Конусные дробилки" });
  add({ name: "Пружина амортизационная", sku: `${m}-SPR-01`, weight: w(6, 34), status: st(0.75), fits, group: "Конусные дробилки" });
  add({ name: "Подпятник (пята)", sku: `${m}-09-03`, weight: w(15, 88), status: st(), fits, group: "Конусные дробилки" });
}

/* ─────────────────────────── 3. РОТОРНЫЕ И ЦУД LIMING ─────────────────────────── */
const IMPACT = ["CI5X1110", "CI5X1213", "CI5X1315", "CI5X1415", "CI5X1520", "PFW1214III", "PFW1315III", "PFW1318III", "PF1010", "PF1210", "PF1214", "PF1315", "PF1520"];
for (const m of IMPACT) {
  const fits = `Роторная дробилка Liming ${m}`;
  add({ name: "Било роторное Cr26 (комплект 4 шт)", sku: `${m}-BM-K4`, weight: w(180, 520), status: st(0.7), fits, group: "Роторные дробилки" });
  add({ name: "Било роторное Cr26", sku: `${m}-BM-02`, weight: w(45, 130), status: st(0.8), fits, group: "Роторные дробилки" });
  add({ name: "Било роторное с керамической вставкой", sku: `${m}-BM-03`, weight: w(48, 135), status: st(0.5), fits, group: "Роторные дробилки" });
  add({ name: "Плита отражательная I ряда", sku: `${m}-IP-01`, weight: w(240, 720), status: st(0.5), fits, group: "Роторные дробилки" });
  add({ name: "Плита отражательная II ряда", sku: `${m}-IP-02`, weight: w(220, 680), status: st(0.5), fits, group: "Роторные дробилки" });
  add({ name: "Футеровка корпуса боковая", sku: `${m}-LN-11`, weight: w(40, 140), status: st(), fits, group: "Роторные дробилки" });
  add({ name: "Футеровка отражательной плиты", sku: `${m}-LN-07`, weight: w(90, 320), status: st(), fits, group: "Роторные дробилки" });
  add({ name: "Клин крепления бил (комплект)", sku: `${m}-KL-07`, weight: w(12, 38), status: st(0.65), fits, group: "Роторные дробилки" });
  add({ name: "Ротор в сборе", sku: `${m}-R-00`, weight: w(1800, 6400), status: "on_order", fits, group: "Роторные дробилки" });
  add({ name: "Вал ротора", sku: `${m}-R-01`, weight: w(420, 1350), status: st(0.25), fits, group: "Роторные дробилки" });
  add({ name: "Гидроцилиндр вскрытия корпуса", sku: `${m}-HC-03`, weight: w(28, 74), status: st(0.4), fits, group: "Роторные дробилки" });
  add({ name: "Подшипник ротора", sku: pick(["22330-CA/W33", "22334-CA/W33", "23132-CA/W33", "22228-CA/W33"]), weight: w(18, 96), status: st(), fits, group: "Подшипники" });
}

const VSI = ["VSI6X8018", "VSI6X9026", "VSI6X1040", "VSI6X1150", "VSI6X1263", "VSI5X7615", "VSI5X8522", "VSI5X9532", "VSI5X1145", "VSI-7611", "VSI-8518", "VSI-9526", "VSI-1140"];
for (const m of VSI) {
  const fits = `Центробежно-ударная дробилка Liming ${m}`;
  add({ name: "Ротор в сборе (4/5 каналов)", sku: `${m}-R-01`, weight: w(280, 780), status: st(0.3), fits, group: "Центробежно-ударные" });
  add({ name: "Наконечник ротора (tip), комплект", sku: `${m}-TIP-02`, weight: w(4, 12), status: st(0.85), fits, group: "Центробежно-ударные" });
  add({ name: "Отбойник кольцевой (anvil), комплект", sku: `${m}-AN-04`, weight: w(6, 18), status: st(0.85), fits, group: "Центробежно-ударные" });
  add({ name: "Распределительная плита", sku: `${m}-DP-06`, weight: w(12, 34), status: st(0.6), fits, group: "Центробежно-ударные" });
  add({ name: "Футеровка воронки загрузочной", sku: `${m}-FH-03`, weight: w(18, 52), status: st(0.6), fits, group: "Центробежно-ударные" });
  add({ name: "Плита износа камеры", sku: `${m}-WP-08`, weight: w(22, 64), status: st(0.6), fits, group: "Центробежно-ударные" });
  add({ name: "Комплект вкладышей ротора", sku: `${m}-RL-05`, weight: w(15, 44), status: st(0.7), fits, group: "Центробежно-ударные" });
  add({ name: "Подшипниковый узел вала", sku: `${m}-BH-01`, weight: w(90, 240), status: st(0.35), fits, group: "Центробежно-ударные" });
}

/* ─────────────────────────── 4. ГРОХОТЫ, ПИТАТЕЛИ, КОНВЕЙЕРЫ ─────────────────────────── */
const SCREENS = ["S5X1237", "S5X1545", "S5X1848", "S5X1860", "S5X2160", "S5X2460", "YK3X1545", "YK3X1848", "YK3X2160", "YZS1237", "YZS1548", "YZS1860", "3YA1548", "3YA1860", "4YA2160"];
const MESH = [5, 8, 10, 12, 16, 20, 25, 32, 40, 50, 60, 70, 80];
for (const m of SCREENS) {
  const fits = `Грохот вибрационный Liming ${m}`;
  add({ name: "Вибровозбудитель в сборе", sku: `${m}-EX-01`, weight: w(180, 520), status: st(0.3), fits, group: "Грохоты" });
  add({ name: "Пружина опорная", sku: `${m}-SPR-06`, weight: w(8, 28), status: st(0.85), fits, group: "Грохоты" });
  add({ name: "Подситник поперечный", sku: `${m}-TP-12`, weight: w(5, 18), status: st(0.8), fits, group: "Грохоты" });
  add({ name: "Борт резиновый уплотнительный", sku: `${m}-RB-04`, weight: w(3, 11), status: st(0.85), fits, group: "Грохоты" });
  add({ name: "Подшипник вибровозбудителя", sku: pick(["22322-E1-XL", "22326-E1-XL", "22222-E1-XL", "22218-E1-XL"]), weight: w(6, 24), status: st(0.75), fits, group: "Подшипники" });
  for (const mesh of MESH) {
    add({ name: `Сито полиуретановое 610×305, ячейка ${mesh}×${mesh} мм`, sku: `${m}-PU-${mesh}`, weight: w(2.5, 6), status: st(0.85), fits, group: "Сита" });
    if (mesh >= 20) add({ name: `Сито стальное рифлёное, ячейка ${mesh}×${mesh} мм`, sku: `${m}-WR-${mesh}`, weight: w(9, 26), status: st(0.7), fits, group: "Сита" });
  }
}

const FEEDERS = ["F5X1045", "F5X1245", "F5X1345", "F5X1360", "GF1148", "GF1560", "SP1548", "ZSW380×95", "ZSW420×110", "ZSW490×130", "ZSW600×130"];
for (const m of FEEDERS) {
  const fits = `Вибропитатель Liming ${m}`;
  add({ name: "Колосник футеровочный", sku: `${m}-BAR-02`, weight: w(28, 72), status: st(0.75), fits, group: "Питатели" });
  add({ name: "Лист изнашиваемый днища", sku: `${m}-LN-05`, weight: w(60, 165), status: st(0.6), fits, group: "Питатели" });
  add({ name: "Вибратор блочный в сборе", sku: `${m}-VB-01`, weight: w(140, 340), status: st(0.3), fits, group: "Питатели" });
  add({ name: "Пружина опорная", sku: `${m}-SPR-02`, weight: w(7, 22), status: st(0.85), fits, group: "Питатели" });
  add({ name: "Борт боковой футеровочный", sku: `${m}-SL-08`, weight: w(35, 96), status: st(0.6), fits, group: "Питатели" });
}

const BELTS = [500, 650, 800, 1000, 1200, 1400];
for (const b of BELTS) {
  const fits = `Ленточный конвейер B6X / B${b}`;
  add({ name: `Ролик конвейерный Ø108 × ${b + 200} мм`, sku: `B6X-RL-${b}-108`, weight: w(9, 24), status: st(0.85), fits, group: "Конвейеры" });
  add({ name: `Ролик конвейерный Ø133 × ${b + 200} мм`, sku: `B6X-RL-${b}-133`, weight: w(12, 32), status: st(0.8), fits, group: "Конвейеры" });
  add({ name: `Роликоопора трёхроликовая B${b}`, sku: `B6X-RS-${b}-03`, weight: w(14, 38), status: st(0.8), fits, group: "Конвейеры" });
  add({ name: `Роликоопора нижняя прямая B${b}`, sku: `B6X-RS-${b}-01`, weight: w(11, 30), status: st(0.8), fits, group: "Конвейеры" });
  add({ name: `Барабан приводной Ø630 футерованный B${b}`, sku: `B6X-DR-${b}-630`, weight: w(180, 520), status: st(0.3), fits, group: "Конвейеры" });
  add({ name: `Барабан натяжной Ø400 B${b}`, sku: `B6X-TD-${b}-400`, weight: w(120, 360), status: st(0.35), fits, group: "Конвейеры" });
  for (const ep of ["EP400/3", "EP500/4", "EP630/4", "EP800/5"]) {
    add({ name: `Лента конвейерная ${ep}, ширина ${b} мм (за п. м)`, sku: `${ep.replace("/", "-")}-${b}`, weight: w(8, 28), status: st(0.7), fits, group: "Конвейеры" });
  }
  add({ name: `Скребок очистной барабана B${b}`, sku: `B6X-SC-${b}-01`, weight: w(14, 40), status: st(0.7), fits, group: "Конвейеры" });
  add({ name: `Юбка герметизирующая узла пересыпа B${b}`, sku: `B6X-SK-${b}-02`, weight: w(6, 18), status: st(0.8), fits, group: "Конвейеры" });
}

/* ─────────────────────────── 5. МОБИЛЬНЫЕ КОМПЛЕКСЫ LIMING ─────────────────────────── */
const MOBILE = ["NK75J", "NK80", "NK100E", "NK200", "NK300HS", "NK1213", "MK75J", "MK300H", "MK1560"];
for (const m of MOBILE) {
  const fits = `Мобильный комплекс Liming ${m}`;
  add({ name: "Плита дробящая подвижная", sku: `${m}-JP-01`, weight: w(600, 1300), status: st(0.4), fits, group: "Мобильные комплексы" });
  add({ name: "Плита дробящая неподвижная", sku: `${m}-JP-02`, weight: w(580, 1250), status: st(0.4), fits, group: "Мобильные комплексы" });
  add({ name: "Колосник питателя", sku: `${m}-GB-03`, weight: w(30, 68), status: st(0.75), fits, group: "Мобильные комплексы" });
  add({ name: "Фильтр гидросистемы (комплект)", sku: `${m}-HF-10`, weight: 4, status: st(0.9), fits, group: "ГСМ и фильтры" });
  add({ name: "Башмак гусеничной ленты", sku: `${m}-TR-05`, weight: w(24, 62), status: st(0.5), fits, group: "Мобильные комплексы" });
  add({ name: "Каток опорный гусеницы", sku: `${m}-TR-08`, weight: w(28, 74), status: st(0.5), fits, group: "Мобильные комплексы" });
  add({ name: "Гидромотор хода", sku: `${m}-HM-01`, weight: w(45, 120), status: st(0.25), fits, group: "Мобильные комплексы" });
  add({ name: "Лента бортового конвейера", sku: `${m}-CB-02`, weight: w(60, 180), status: st(0.5), fits, group: "Конвейеры" });
}

/* ─────────────────────────── 6. METSO NORDBERG ─────────────────────────── */
const METSO_JAW = [
  { m: "C80", n: "N11947712" }, { m: "C96", n: "N11947714" }, { m: "C106", n: "MM0262102" },
  { m: "C110", n: "N11947720" }, { m: "C116", n: "N11921402" }, { m: "C120", n: "N11921404" },
  { m: "C125", n: "N11921408" }, { m: "C130", n: "N11921412" }, { m: "C140", n: "N11921416" },
  { m: "C150", n: "N11921420" }, { m: "C160", n: "N11921424" }, { m: "C200", n: "N11921430" },
];
for (const { m, n } of METSO_JAW) {
  const fits = `Metso Nordberg ${m}`;
  const base = Number(n.replace(/\D/g, "").slice(-4));
  add({ name: "Плита дробящая подвижная Mn18", sku: n, weight: w(700, 2600), status: st(0.5), fits, group: "Metso Nordberg" });
  add({ name: "Плита дробящая неподвижная Mn18", sku: `N${base + 1}`, weight: w(680, 2550), status: st(0.5), fits, group: "Metso Nordberg" });
  add({ name: "Плита дробящая Mn22 (высокий абразив)", sku: `N${base + 2}`, weight: w(700, 2600), status: st(0.3), fits, group: "Metso Nordberg" });
  add({ name: "Клин крепления плиты", sku: `MM0${base + 310}`, weight: w(22, 68), status: st(0.6), fits, group: "Metso Nordberg" });
  add({ name: "Футеровка боковая (cheek plate)", sku: `MM0${base + 420}`, weight: w(60, 210), status: st(0.55), fits, group: "Metso Nordberg" });
  add({ name: "Плита распорная (toggle plate)", sku: `MM0${base + 530}`, weight: w(90, 380), status: st(0.6), fits, group: "Metso Nordberg" });
  add({ name: "Подшипник эксцентрикового вала", sku: pick(["23140-CCK/W33", "23148-CCK/W33", "23164-CAK/W33"]), weight: w(38, 190), status: st(0.5), fits, group: "Подшипники" });
}

const METSO_HP = [
  { m: "HP100", k: 0.4 }, { m: "HP200", k: 0.65 }, { m: "HP300", k: 1 },
  { m: "HP400", k: 1.4 }, { m: "HP500", k: 1.8 }, { m: "HP800", k: 2.6 },
  { m: "GP100", k: 0.5 }, { m: "GP200", k: 0.8 }, { m: "GP300S", k: 1.3 }, { m: "GP550", k: 2.0 },
];
let mn = 55208130;
for (const { m, k } of METSO_HP) {
  const fits = `Metso ${m}`;
  for (const c of ["EC", "C", "M", "F", "EF"]) {
    add({ name: `Броня подвижная (mantle), камера ${c}`, sku: `N${mn++}`, weight: w(600 * k, 1500 * k), status: st(0.5), fits, group: "Metso Nordberg" });
    add({ name: `Броня неподвижная (bowl liner), камера ${c}`, sku: `N${mn++}`, weight: w(650 * k, 1600 * k), status: st(0.5), fits, group: "Metso Nordberg" });
  }
  add({ name: "Втулка цилиндрическая бронзовая", sku: `10576021${String(Math.round(k * 100)).padStart(2, "0")}`, weight: w(28 * k, 78 * k), status: st(0.45), fits, group: "Metso Nordberg" });
  add({ name: "Подпятник сферический", sku: `10221459${String(Math.round(k * 70)).padStart(2, "0")}`, weight: w(45 * k, 120 * k), status: st(0.45), fits, group: "Metso Nordberg" });
  add({ name: "Втулка эксцентриковая", sku: `10576033${String(Math.round(k * 90)).padStart(2, "0")}`, weight: w(36 * k, 96 * k), status: st(0.4), fits, group: "Metso Nordberg" });
  add({ name: "Комплект уплотнений (seal kit)", sku: `MM0${359000 + Math.round(k * 700)}`, weight: 3, status: st(0.8), fits, group: "Metso Nordberg" });
  add({ name: "Кольцо стопорное чаши", sku: `MM0${361000 + Math.round(k * 800)}`, weight: w(20 * k, 65 * k), status: st(0.4), fits, group: "Metso Nordberg" });
}

const METSO_NP = ["NP1007", "NP1110", "NP1213", "NP1315", "NP1415", "NP1520", "Barmac B6150SE", "Barmac B7150SE", "Barmac B9100SE"];
for (const m of METSO_NP) {
  const fits = `Metso ${m}`;
  const isB = m.startsWith("Barmac");
  const code = m.replace(/\s|Barmac /g, "");
  if (isB) {
    add({ name: "Наконечник ротора (rotor tip set)", sku: `B963S${4900 + Math.round(rnd() * 90)}`, weight: w(6, 14), status: st(0.8), fits, group: "Metso Nordberg" });
    add({ name: "Отбойник кольцевой (anvil ring)", sku: `B963S${3400 + Math.round(rnd() * 90)}`, weight: w(9, 22), status: st(0.75), fits, group: "Metso Nordberg" });
    add({ name: "Футеровка воронки (feed tube)", sku: `B963S${2700 + Math.round(rnd() * 90)}`, weight: w(12, 34), status: st(0.6), fits, group: "Metso Nordberg" });
    add({ name: "Распределительная плита ротора", sku: `B963S${5100 + Math.round(rnd() * 90)}`, weight: w(10, 28), status: st(0.6), fits, group: "Metso Nordberg" });
  } else {
    add({ name: "Било роторное Cr26 (blow bar)", sku: `MM0${376000 + Math.round(rnd() * 900)}`, weight: w(90, 280), status: st(0.65), fits, group: "Metso Nordberg" });
    add({ name: "Било роторное Mn22 (blow bar)", sku: `MM0${377000 + Math.round(rnd() * 900)}`, weight: w(90, 280), status: st(0.55), fits, group: "Metso Nordberg" });
    add({ name: "Плита отражательная верхняя", sku: `MM0${378000 + Math.round(rnd() * 900)}`, weight: w(240, 760), status: st(0.4), fits, group: "Metso Nordberg" });
    add({ name: "Футеровка боковая корпуса", sku: `MM0${379000 + Math.round(rnd() * 900)}`, weight: w(60, 190), status: st(0.5), fits, group: "Metso Nordberg" });
    add({ name: "Комплект клиньев крепления бил", sku: `${code}-KL-01`, weight: w(14, 42), status: st(0.6), fits, group: "Metso Nordberg" });
  }
}

/* ─────────────────────────── 7. SANDVIK ─────────────────────────── */
const SV_CONE = ["CH420", "CH430", "CH440", "CH550", "CH660", "CH870", "CS420", "CS430", "CS440", "CS660", "H2800", "H3800", "H4800", "H6800", "S3800", "S4800", "S6800"];
let sv = 7980;
for (const m of SV_CONE) {
  const fits = `Sandvik ${m}`;
  for (const c of ["EF", "F", "MF", "M", "C", "EC"]) {
    add({ name: `Броня подвижная (mantle) ${c}`, sku: `442.${sv++}-01`, weight: w(420, 3200), status: st(0.45), fits, group: "Sandvik" });
    add({ name: `Броня неподвижная (concave) ${c}`, sku: `442.${sv++}-01`, weight: w(450, 3400), status: st(0.45), fits, group: "Sandvik" });
  }
  add({ name: "Втулка эксцентриковая", sku: `442.${sv++}-01`, weight: w(26, 132), status: st(0.45), fits, group: "Sandvik" });
  add({ name: "Подпятник (thrust bearing)", sku: `442.${sv++}-01`, weight: w(30, 140), status: st(0.4), fits, group: "Sandvik" });
  add({ name: "Комплект уплотнений пылезащиты", sku: `442.${sv++}-00`, weight: 3, status: st(0.8), fits, group: "Sandvik" });
  add({ name: "Гидроцилиндр ASRi", sku: `442.${sv++}-02`, weight: w(38, 96), status: st(0.3), fits, group: "Sandvik" });
}

const SV_JAW = ["CJ211", "CJ409", "CJ411", "CJ412", "CJ612", "CJ613", "CJ615", "JM806", "JM1108", "JM1206", "JM1208", "JM1211"];
for (const m of SV_JAW) {
  const fits = `Sandvik ${m}`;
  add({ name: "Плита дробящая подвижная Mn18", sku: `442.${sv++}-01`, weight: w(600, 2200), status: st(0.5), fits, group: "Sandvik" });
  add({ name: "Плита дробящая неподвижная Mn18", sku: `442.${sv++}-01`, weight: w(580, 2150), status: st(0.5), fits, group: "Sandvik" });
  add({ name: "Плита дробящая Mn22 (абразив)", sku: `442.${sv++}-02`, weight: w(600, 2200), status: st(0.3), fits, group: "Sandvik" });
  add({ name: "Футеровка боковая (cheek plate)", sku: `442.${sv++}-01`, weight: w(45, 165), status: st(0.55), fits, group: "Sandvik" });
  add({ name: "Плита распорная (toggle)", sku: `442.${sv++}-01`, weight: w(70, 320), status: st(0.55), fits, group: "Sandvik" });
  add({ name: "Подшипник вала", sku: pick(["400.1078-00", "400.1085-00", "400.1092-00"]), weight: w(42, 145), status: st(0.4), fits, group: "Sandvik" });
}

const SV_MOBILE = ["QJ241", "QJ341", "QJ441", "QH331", "QH441", "UJ440i", "UH440i", "US440i", "QE341", "QA451"];
for (const m of SV_MOBILE) {
  const fits = `Sandvik ${m} (мобильный комплекс)`;
  add({ name: "Плита дробящая подвижная", sku: `J-400-${200 + Math.round(rnd() * 90)}`, weight: w(700, 1400), status: st(0.45), fits, group: "Sandvik" });
  add({ name: "Плита дробящая неподвижная", sku: `J-400-${300 + Math.round(rnd() * 90)}`, weight: w(680, 1350), status: st(0.45), fits, group: "Sandvik" });
  add({ name: "Колосник грохота питателя", sku: `S-410-${100 + Math.round(rnd() * 90)}`, weight: w(26, 68), status: st(0.6), fits, group: "Sandvik" });
  add({ name: "Фильтр гидравлический", sku: `H-500-${100 + Math.round(rnd() * 90)}`, weight: 3, status: st(0.85), fits, group: "ГСМ и фильтры" });
  add({ name: "Лента бортового конвейера", sku: `C-600-${100 + Math.round(rnd() * 90)}`, weight: w(70, 210), status: st(0.5), fits, group: "Конвейеры" });
}

/* ─────────────────────────── 8. TEREX / KLEEMANN / POWERSCREEN / EXTEC ─────────────────────────── */
const TEREX = ["TC1000", "TC1150", "TC1300", "TC1300X", "JW42", "JW55", "MJ42", "MJ47", "1300 Maxtrak", "1000 Maxtrak", "XA400S", "XR400S"];
for (const m of TEREX) {
  const fits = `Terex / Cedarapids ${m}`;
  const n = 9000 + Math.round(rnd() * 900);
  add({ name: "Броня подвижная (mantle)", sku: `603/${n}`, weight: w(420, 1400), status: st(0.4), fits, group: "Terex" });
  add({ name: "Броня неподвижная (bowl)", sku: `603/${n + 1}`, weight: w(440, 1450), status: st(0.4), fits, group: "Terex" });
  add({ name: "Плита дробящая подвижная", sku: `A6984/${40 + Math.round(rnd() * 40)}`, weight: w(620, 1250), status: st(0.45), fits, group: "Terex" });
  add({ name: "Плита дробящая неподвижная", sku: `A6984/${80 + Math.round(rnd() * 40)}`, weight: w(600, 1200), status: st(0.45), fits, group: "Terex" });
  add({ name: "Комплект уплотнений гидросистемы", sku: `604/${n + 20}`, weight: 2, status: st(0.8), fits, group: "Terex" });
}

const KLEEMANN = ["MC 100 R EVO", "MC 110 Z EVO", "MC 110 Zi EVO2", "MC 120 Zi PRO", "MCO 90i EVO2", "MCO 110i PRO", "MCO 130", "MR 110 Zi EVO2", "MR 130 Zi EVO2", "MS 702i EVO", "MS 953i EVO"];
for (const m of KLEEMANN) {
  const code = `KLE-${m.replace(/[^A-Za-z0-9]/g, "").toUpperCase()}`;
  const fits = `Kleemann ${m} (Wirtgen Group)`;
  add({ name: "Плита дробящая подвижная", sku: `${code}-JP-01`, weight: w(650, 1350), status: st(0.4), fits, group: "Kleemann" });
  add({ name: "Плита дробящая неподвижная", sku: `${code}-JP-02`, weight: w(630, 1300), status: st(0.4), fits, group: "Kleemann" });
  add({ name: "Било роторное Cr26", sku: `${code}-BM-03`, weight: w(80, 240), status: st(0.5), fits, group: "Kleemann" });
  add({ name: "Броня конуса подвижная", sku: `${code}-CC-01`, weight: w(600, 1250), status: st(0.35), fits, group: "Kleemann" });
  add({ name: "Колосник питателя", sku: `${code}-GB-05`, weight: w(24, 64), status: st(0.65), fits, group: "Kleemann" });
  add({ name: "Сито деки грохота", sku: `${code}-SC-07`, weight: w(12, 38), status: st(0.6), fits, group: "Сита" });
}

const PSCREEN = ["Premiertrak 400X", "Premiertrak 600", "Metrotrak", "XH250", "XH320", "Warrior 1400X", "Warrior 1800", "Chieftain 1400", "Chieftain 2100X", "Trakpactor 320", "Extec C10", "Extec C12+", "Extec S5", "Extec I-C13"];
for (const m of PSCREEN) {
  const isE = m.startsWith("Extec");
  const fits = `${isE ? "" : "Powerscreen "}${m}`;
  const code = m.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 10);
  add({ name: "Плита дробящая подвижная", sku: isE ? `J40000${Math.round(rnd() * 90)}` : `A69${800 + Math.round(rnd() * 90)}/1`, weight: w(650, 1400), status: st(0.4), fits, group: isE ? "Extec" : "Powerscreen" });
  add({ name: "Плита дробящая неподвижная", sku: isE ? `J40002${Math.round(rnd() * 90)}` : `A69${900 + Math.round(rnd() * 90)}/2`, weight: w(630, 1350), status: st(0.4), fits, group: isE ? "Extec" : "Powerscreen" });
  add({ name: "Сито деки (полиуретан)", sku: `${code}-PU-40`, weight: w(4, 12), status: st(0.7), fits, group: "Сита" });
  add({ name: "Колосник футеровочный", sku: `${code}-GB-05`, weight: w(26, 66), status: st(0.6), fits, group: isE ? "Extec" : "Powerscreen" });
  add({ name: "Лента конвейерная бортовая", sku: `${code}-CB-01`, weight: w(60, 190), status: st(0.5), fits, group: "Конвейеры" });
}

/* ─────────────────────────── 9. ОТЕЧЕСТВЕННАЯ КЛАССИКА ─────────────────────────── */
const RU_JAW = [
  { m: "СМД-108А", d: "104800021" }, { m: "СМД-109А", d: "104900021" }, { m: "СМД-110А", d: "104470221" },
  { m: "СМД-111", d: "111100021" }, { m: "СМД-116", d: "111600021" }, { m: "СМД-117", d: "111700021" },
  { m: "СМД-118", d: "111800021" }, { m: "ДРО-560М", d: "560000021" }, { m: "ДРО-562", d: "562000021" },
  { m: "ЩДП 12×15", d: "121500021" }, { m: "ЩДС 2,5×9", d: "025900021" }, { m: "ЩДС 6×9", d: "060900021" },
];
for (const { m, d } of RU_JAW) {
  const fits = `Щековая дробилка ${m}`;
  add({ name: "Плита дробящая подвижная 110Г13Л", sku: `${d}220`, weight: w(310, 1900), status: st(0.7), fits, group: "СМД · ДРО · ЩДП" });
  add({ name: "Плита дробящая неподвижная 110Г13Л", sku: `${d}210`, weight: w(300, 1850), status: st(0.7), fits, group: "СМД · ДРО · ЩДП" });
  add({ name: "Плита боковая (футеровка)", sku: `${d}230`, weight: w(28, 190), status: st(0.6), fits, group: "СМД · ДРО · ЩДП" });
  add({ name: "Клин прижимной", sku: `${d}410`, weight: w(14, 62), status: st(0.75), fits, group: "СМД · ДРО · ЩДП" });
  add({ name: "Сухарь распорной плиты", sku: `${d}412`, weight: w(9, 34), status: st(0.75), fits, group: "СМД · ДРО · ЩДП" });
  add({ name: "Плита распорная", sku: `${d}414`, weight: w(60, 290), status: st(0.6), fits, group: "СМД · ДРО · ЩДП" });
  add({ name: "Ось подвижной щеки", sku: `${d}150`, weight: w(45, 240), status: st(0.4), fits, group: "СМД · ДРО · ЩДП" });
  add({ name: "Вал эксцентриковый", sku: `${d}110`, weight: w(180, 980), status: st(0.3), fits, group: "СМД · ДРО · ЩДП" });
  add({ name: "Пружина замыкающего устройства", sku: `${d}510`, weight: w(6, 28), status: st(0.8), fits, group: "СМД · ДРО · ЩДП" });
}

const RU_CONE = [
  { m: "КСД-600", d: "297" }, { m: "КМД-600", d: "298" }, { m: "КСД-900", d: "1053" },
  { m: "КМД-900Т", d: "1054" }, { m: "КСД-1200", d: "1059" }, { m: "КМД-1200Т", d: "1060" },
  { m: "КСД-1750", d: "1277" }, { m: "КМД-1750Т", d: "1278" }, { m: "КМД-1750Гр", d: "1279" },
  { m: "КСД-2200", d: "1239" }, { m: "КМД-2200Т", d: "1240" }, { m: "ККД-500", d: "1301" },
  { m: "ККД-900", d: "1302" }, { m: "ККД-1500", d: "1303" },
];
for (const { m, d } of RU_CONE) {
  const fits = `Конусная дробилка ${m}`;
  add({ name: "Броня конуса дробящего 110Г13Л", sku: `${d}.05.311-1`, weight: w(140, 2700), status: st(0.65), fits, group: "КСД · КМД · ККД" });
  add({ name: "Броня неподвижная (чаши) 110Г13Л", sku: `${d}.05.312-1`, weight: w(150, 2800), status: st(0.65), fits, group: "КСД · КМД · ККД" });
  add({ name: "Броня конуса Mn22 (усиленная)", sku: `${d}.05.313-2`, weight: w(140, 2700), status: st(0.35), fits, group: "КСД · КМД · ККД" });
  add({ name: "Втулка цилиндрическая бронзовая", sku: `${d}.07.02.03`, weight: w(18, 88), status: st(0.6), fits, group: "КСД · КМД · ККД" });
  add({ name: "Втулка коническая бронзовая", sku: `${d}.07.03.02`, weight: w(20, 96), status: st(0.6), fits, group: "КСД · КМД · ККД" });
  add({ name: "Втулка эксцентриковая", sku: `${d}.07.05.01`, weight: w(24, 110), status: st(0.5), fits, group: "КСД · КМД · ККД" });
  add({ name: "Подпятник сферический", sku: `${d}.09.01.02`, weight: w(22, 120), status: st(0.5), fits, group: "КСД · КМД · ККД" });
  add({ name: "Вал главный (эксцентриковый)", sku: `${d}.02.01.01`, weight: w(220, 1450), status: st(0.25), fits, group: "КСД · КМД · ККД" });
  add({ name: "Шестерня коническая", sku: `${d}.06.02.01`, weight: w(35, 260), status: st(0.4), fits, group: "КСД · КМД · ККД" });
  add({ name: "Пружина амортизационная", sku: `${d}.11.01.03`, weight: w(8, 42), status: st(0.75), fits, group: "КСД · КМД · ККД" });
  add({ name: "Кольцо уплотнительное пылезащитное", sku: `${d}.19.04.01`, weight: w(2, 9), status: st(0.85), fits, group: "КСД · КМД · ККД" });
  add({ name: "Гайка регулировочная чаши", sku: `${d}.14.02.01`, weight: w(30, 180), status: st(0.4), fits, group: "КСД · КМД · ККД" });
}

const RU_IMPACT = ["СМД-85", "СМД-86А", "СМД-87", "СМД-94", "СМД-95", "СМД-97", "СМД-98", "ДРО-620", "ДРО-627", "МПР-1300"];
for (const m of RU_IMPACT) {
  const fits = `Роторная / молотковая дробилка ${m}`;
  const d = 1041 + RU_IMPACT.indexOf(m);
  add({ name: "Било роторное 110Г13Л", sku: `${d}.06.05-1`, weight: w(38, 120), status: st(0.7), fits, group: "СМД роторные" });
  add({ name: "Било роторное Cr26 (усиленное)", sku: `${d}.06.05-2`, weight: w(38, 120), status: st(0.5), fits, group: "СМД роторные" });
  add({ name: "Молоток дробящий", sku: `${d}.06.08-1`, weight: w(18, 62), status: st(0.7), fits, group: "СМД роторные" });
  add({ name: "Плита отражательная", sku: `${d}.07.01-1`, weight: w(140, 520), status: st(0.5), fits, group: "СМД роторные" });
  add({ name: "Футеровка корпуса", sku: `${d}.07.04-1`, weight: w(48, 190), status: st(0.55), fits, group: "СМД роторные" });
  add({ name: "Колосниковая решётка", sku: `${d}.08.02-1`, weight: w(60, 230), status: st(0.5), fits, group: "СМД роторные" });
  add({ name: "Диск ротора", sku: `${d}.06.01-1`, weight: w(180, 640), status: st(0.3), fits, group: "СМД роторные" });
};

const RU_SCREEN = ["ГИС-42", "ГИС-52", "ГИС-62", "ГИТ-32", "ГИТ-42", "ГИТ-52", "ГИТ-62", "ГИЛ-32", "ГИЛ-42", "ГИЛ-52", "ГСТ-41", "ГСТ-51", "СМД-147А", "СМД-148А"];
for (const m of RU_SCREEN) {
  const code = m.replace("-", "");
  const fits = `Грохот ${m}`;
  add({ name: "Вибровозбудитель в сборе", sku: `${code}-ВВ-01`, weight: w(160, 480), status: st(0.35), fits, group: "Грохоты ГИС · ГИТ · ГИЛ" });
  add({ name: "Пружина опорная", sku: `${code}-СПР-61`, weight: w(8, 26), status: st(0.85), fits, group: "Грохоты ГИС · ГИТ · ГИЛ" });
  add({ name: "Вал дебалансный", sku: `${code}-ВД-03`, weight: w(60, 210), status: st(0.4), fits, group: "Грохоты ГИС · ГИТ · ГИЛ" });
  add({ name: "Подшипник вибровозбудителя", sku: pick(["3624", "3626", "3630", "3634", "3636", "53624", "53628"]), weight: w(5, 22), status: st(0.7), fits, group: "Подшипники" });
  add({ name: "Подситник продольный", sku: `${code}-ПС-11`, weight: w(6, 22), status: st(0.75), fits, group: "Грохоты ГИС · ГИТ · ГИЛ" });
  for (const mesh of [5, 10, 16, 20, 25, 32, 40, 50, 70]) {
    add({ name: `Сито стальное рифлёное ${mesh}×${mesh} мм`, sku: `${code}-СТ-${mesh}`, weight: w(9, 26), status: st(0.7), fits, group: "Сита" });
    add({ name: `Сито полиуретановое ${mesh}×${mesh} мм`, sku: `${code}-ПУ-${mesh}`, weight: w(2.5, 6), status: st(0.85), fits, group: "Сита" });
    if (mesh >= 20) add({ name: `Сито резиновое ${mesh}×${mesh} мм`, sku: `${code}-РЗ-${mesh}`, weight: w(4, 10), status: st(0.7), fits, group: "Сита" });
  }
}

const RU_FEEDER = ["ПВ-1,2×2,4", "ПВ-1,5×3,0", "ПК-1,2×6,0", "ПК-1,5×9,0", "ПКД-1,4×2,4", "ГПТ-1,5", "ВПР-3", "ПГ-2"];
for (const m of RU_FEEDER) {
  const code = m.replace(/[^А-Яа-яA-Za-z0-9]/g, "").toUpperCase();
  const fits = `Питатель ${m}`;
  add({ name: "Колосник футеровочный", sku: `${code}-КЛ-02`, weight: w(24, 72), status: st(0.7), fits, group: "Питатели" });
  add({ name: "Пластина питателя", sku: `${code}-ПП-08`, weight: w(40, 130), status: st(0.55), fits, group: "Питатели" });
  add({ name: "Цепь пластинчатого питателя (звено)", sku: `${code}-ЦП-04`, weight: w(12, 38), status: st(0.5), fits, group: "Питатели" });
  add({ name: "Вибратор в сборе", sku: `${code}-ВБ-01`, weight: w(90, 280), status: st(0.35), fits, group: "Питатели" });
};

/* ─────────────────────────── 10. ПОДШИПНИКИ, ГСМ, КРЕПЁЖ ─────────────────────────── */
const BEARINGS = [
  "22208-E1-XL", "22212-E1-XL", "22218-E1-XL", "22222-E1-XL", "22226-E1-XL", "22228-CA/W33",
  "22308-E1-XL", "22315-E1-XL", "22317-E1-XL", "22322-E1-XL", "22324-CA/W33", "22326-E1-XL",
  "22330-CA/W33", "22334-CA/W33", "22336-CA/W33", "22340-CA/W33", "23024-CC/W33", "23032-CC/W33",
  "23040-CC/W33", "23048-CC/W33", "23056-CA/W33", "23120-CC/W33", "23128-CC/W33", "23132-CA/W33",
  "23140-CCK/W33", "23148-CCK/W33", "23156-CA/W33", "23164-CAK/W33", "23172-CA/W33", "23176-CA/W33",
  "23180-CA/W33", "23218-CC/W33", "23224-CC/W33", "23230-CA/W33", "23236-CA/W33", "23244-CA/W33",
  "24024-CC/W33", "24032-CC/W33", "24040-CC/W33", "24048-CC/W33", "29320-E1", "29330-E1", "29412-E1",
  "32218", "32222", "32228", "32232", "32236", "32240", "7520", "7524", "7530", "7536",
];
for (const b of BEARINGS) {
  add({
    name: `Подшипник роликовый сферический ${b}`,
    sku: b,
    weight: w(1.8, 165),
    status: st(0.72),
    fits: "Дробилки, грохоты, конвейеры — универсальная позиция",
    group: "Подшипники",
  });
}

const OILS = [
  { n: "Масло редукторное Mobilgear 600 XP 220 (208 л)", s: "MOB-600XP-220-208", w: 185 },
  { n: "Масло редукторное Mobilgear 600 XP 320 (208 л)", s: "MOB-600XP-320-208", w: 186 },
  { n: "Масло гидравлическое Shell Tellus S2 MX 46 (209 л)", s: "SHL-TELLUS-S2MX46", w: 180 },
  { n: "Масло гидравлическое Shell Tellus S2 MX 68 (209 л)", s: "SHL-TELLUS-S2MX68", w: 182 },
  { n: "Масло циркуляционное Shell Morlina S2 B 220 (209 л)", s: "SHL-MORLINA-S2B220", w: 184 },
  { n: "Смазка Shell Gadus S2 V220 2 (18 кг)", s: "SHL-GADUS-S2V220-2", w: 18 },
  { n: "Смазка Mobil Mobilith SHC 460 (16 кг)", s: "MOB-MOBILITH-SHC460", w: 16 },
  { n: "Смазка Molykote D-321R антифрикционная", s: "MOL-D321R", w: 1 },
  { n: "Антифриз концентрат G12+ (20 л)", s: "AF-G12P-20", w: 21 },
  { n: "Масло моторное 15W-40 CI-4 (208 л)", s: "MO-15W40-CI4-208", w: 180 },
];
for (const o of OILS) {
  add({ name: o.n, sku: o.s, weight: o.w, status: st(0.85), fits: "ТО дробильно-сортировочных комплексов", group: "ГСМ и фильтры" });
}

const FILTERS = ["P171560", "P164378", "P165659", "P171575", "P550388", "P551352", "P553000", "HF6177", "HF6553", "HF35480", "1R-0750", "1R-0770", "WK 940/20", "WK 962/7"];
for (const f of FILTERS) {
  add({
    name: `Фильтроэлемент ${f} (гидравлика/смазка)`,
    sku: f,
    weight: w(0.4, 4.5),
    status: st(0.85),
    fits: "Гидростанции и смазочные системы ДСО",
    group: "ГСМ и фильтры",
  });
}

const FASTENERS = [
  { n: "Болт крепления брони М30×180 кл. 10.9", s: "ГОСТ7798-М30х180-109", w: 1.6 },
  { n: "Болт крепления брони М36×220 кл. 10.9", s: "ГОСТ7798-М36х220-109", w: 2.7 },
  { n: "Болт клиновой М42×260 кл. 10.9", s: "ГОСТ7798-М42х260-109", w: 4.2 },
  { n: "Гайка М30 кл. 10 оцинкованная", s: "ГОСТ5915-М30-10", w: 0.28 },
  { n: "Гайка М36 кл. 10 оцинкованная", s: "ГОСТ5915-М36-10", w: 0.48 },
  { n: "Шайба пружинная М30", s: "ГОСТ6402-М30", w: 0.07 },
  { n: "Шпилька М30×300 кл. 8.8", s: "ГОСТ22042-М30х300-88", w: 1.7 },
  { n: "Эпоксидный компаунд заливки броней (комплект 20 кг)", s: "EPX-BACK-20", w: 20 },
  { n: "Цинк для заливки броней (чушка 25 кг)", s: "ZN-BACK-25", w: 25 },
  { n: "Электрод наплавочный Т-590 Ø4 мм (5 кг)", s: "T590-4-5KG", w: 5 },
  { n: "Проволока порошковая наплавочная ПП-АН125 Ø2,4", s: "PP-AN125-24", w: 15 },
];
for (const f of FASTENERS) {
  add({ name: f.n, sku: f.s, weight: f.w, status: st(0.88), fits: "Монтаж и ремонт ДСО — универсальная позиция", group: "Крепёж и расходники" });
}

const MAGNET = ["ПС-80", "ПС-120", "ЭП1-80", "ЭП1-120", "СМЛ-1000", "СМЛ-1200"];
for (const m of MAGNET) {
  add({ name: `Сепаратор магнитный подвесной ${m} — катушка`, sku: `${m}-CL-01`, weight: w(120, 420), status: st(0.3), fits: `Магнитный сепаратор ${m}`, group: "Сепараторы" });
  add({ name: `Лента сбросная сепаратора ${m}`, sku: `${m}-BL-02`, weight: w(30, 90), status: st(0.5), fits: `Магнитный сепаратор ${m}`, group: "Сепараторы" });
}

/* ─────────────── 11. СИТА: типоразмер × ячейка × материал ─────────────── */
const PANELS = ["610×305", "305×305", "1220×305", "610×610"];
const MESHES = [1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32, 36, 40, 45, 50, 56, 63, 70, 80, 90, 100];
const MATS = [
  { n: "полиуретановое", c: "ПУ", k: 1, p: 0.85 },
  { n: "резиновое", c: "РЗ", k: 1.6, p: 0.7 },
  { n: "стальное рифлёное", c: "СТ", k: 3.4, p: 0.68 },
];
for (const panel of PANELS) {
  const pc = panel.replace("×", "x");
  for (const mesh of MESHES) {
    for (const mat of MATS) {
      if (mat.c === "СТ" && mesh < 8) continue;
      if (mat.c === "РЗ" && mesh < 10) continue;
      add({
        name: `Сито ${mat.n} ${panel} мм, ячейка ${mesh}×${mesh} мм`,
        sku: `СИТ-${pc}-${mat.c}-${mesh}`,
        weight: Math.round((2 + mesh * 0.02) * mat.k * 10) / 10,
        status: st(mat.p),
        fits: "Грохоты ГИС, ГИТ, ГИЛ, ГСТ, S5X, YK3X, YZS, Warrior, Chieftain",
        group: "Сита",
      });
    }
  }
}
/* карты просеивающих поверхностей и крепёж сит */
for (const mesh of MESHES) {
  add({ name: `Сетка сеяная канилированная 2000×1000, ячейка ${mesh} мм`, sku: `СЕТ-2000x1000-${mesh}`, weight: w(18, 62), status: st(0.7), fits: "Грохоты любых марок — просеивающая поверхность", group: "Сита" });
  add({ name: `Сетка струнная щелевая, зазор ${mesh} мм`, sku: `СЕТ-СТР-${mesh}`, weight: w(14, 48), status: st(0.55), fits: "Грохоты обезвоживающие и сортировочные", group: "Сита" });
}
for (const t of ["клин прижимной", "планка прижимная", "шпилька натяжная", "крюк натяжной", "прокладка подситная"]) {
  for (const s of [1, 2, 3, 4, 5, 6]) {
    add({ name: `Крепление сита: ${t}, тип ${s}`, sku: `КРС-${t.slice(0, 3).toUpperCase()}-0${s}`, weight: w(0.6, 9), status: st(0.85), fits: "Грохоты — узел крепления просеивающей поверхности", group: "Сита" });
  }
}

/* ─────────────── 12. КОНВЕЙЕРНЫЕ КОМПЛЕКТУЮЩИЕ ─────────────── */
const ROLL_D = [89, 108, 127, 133, 159, 194];
const ROLL_L = [380, 465, 530, 600, 670, 750, 800, 900, 950, 1150, 1250, 1400, 1600];
const ROLL_T = [
  { n: "прямой гладкий", c: "PR", k: 1, p: 0.85 },
  { n: "желобчатый бортовой", c: "ZH", k: 1.05, p: 0.8 },
  { n: "футерованный резиной", c: "FT", k: 1.35, p: 0.6 },
  { n: "амортизирующий (дисковый)", c: "AM", k: 1.5, p: 0.55 },
  { n: "очистной спиральный", c: "SP", k: 1.2, p: 0.5 },
];
for (const d of ROLL_D) {
  for (const l of ROLL_L) {
    for (const t of ROLL_T) {
      add({
        name: `Ролик конвейерный ${t.n} Ø${d} × ${l} мм`,
        sku: `РОЛ-${d}-${l}-${t.c}`,
        weight: Math.round(((d / 89) * (l / 380) * 6.5 * t.k) * 10) / 10,
        status: st(t.p),
        fits: `Ленточные конвейеры B${Math.max(500, Math.round((l - 200) / 50) * 50)}`,
        group: "Конвейеры",
      });
    }
  }
}
const BELT_W = [400, 500, 650, 800, 1000, 1200, 1400, 1600];
const BELT_TYPE = ["EP100/1", "EP200/2", "EP250/3", "EP315/3", "EP400/3", "EP500/4", "EP630/4", "EP800/5", "EP1000/5", "БКНЛ-65", "БКНЛ-100", "ТК-200"];
for (const bw of BELT_W) {
  for (const bt of BELT_TYPE) {
    add({
      name: `Лента конвейерная ${bt}, ширина ${bw} мм (за погонный метр)`,
      sku: `ЛЕН-${bt.replace("/", "-")}-${bw}`,
      weight: Math.round(((bw / 1000) * 11 + 3) * 10) / 10,
      status: st(0.7),
      fits: "Ленточные конвейеры ДСК, узлы пересыпа",
      group: "Конвейеры",
    });
  }
  for (const d of [320, 400, 500, 630, 800, 1000]) {
    add({ name: `Барабан приводной Ø${d} футерованный, B${bw}`, sku: `БАР-ПР-${d}-${bw}`, weight: w(90, 640), status: st(0.35), fits: `Конвейер B${bw}`, group: "Конвейеры" });
    add({ name: `Барабан натяжной Ø${d}, B${bw}`, sku: `БАР-НТ-${d}-${bw}`, weight: w(70, 480), status: st(0.4), fits: `Конвейер B${bw}`, group: "Конвейеры" });
  }
  add({ name: `Роликоопора верхняя 3-роликовая B${bw}`, sku: `РОП-В3-${bw}`, weight: w(11, 42), status: st(0.8), fits: `Конвейер B${bw}`, group: "Конвейеры" });
  add({ name: `Роликоопора нижняя прямая B${bw}`, sku: `РОП-Н1-${bw}`, weight: w(9, 34), status: st(0.8), fits: `Конвейер B${bw}`, group: "Конвейеры" });
  add({ name: `Роликоопора амортизирующая B${bw}`, sku: `РОП-АМ-${bw}`, weight: w(14, 52), status: st(0.6), fits: `Конвейер B${bw}`, group: "Конвейеры" });
  add({ name: `Скребок очистной полиуретановый B${bw}`, sku: `СКР-ПУ-${bw}`, weight: w(6, 26), status: st(0.75), fits: `Конвейер B${bw}`, group: "Конвейеры" });
  add({ name: `Скребок плужковый сбрасывающий B${bw}`, sku: `СКР-ПЛ-${bw}`, weight: w(12, 44), status: st(0.5), fits: `Конвейер B${bw}`, group: "Конвейеры" });
  add({ name: `Юбка герметизирующая узла пересыпа B${bw} (за п. м)`, sku: `ЮБК-${bw}`, weight: w(3, 12), status: st(0.85), fits: `Конвейер B${bw}`, group: "Конвейеры" });
  add({ name: `Замок механический для ленты B${bw}`, sku: `ЗАМ-МХ-${bw}`, weight: w(1.2, 6), status: st(0.85), fits: `Конвейер B${bw}`, group: "Конвейеры" });
}

/* ─────────────── 13. ПОДШИПНИКИ (расширенный ряд) ─────────────── */
const SPH_SERIES = [222, 223, 230, 231, 232, 240, 241];
const SPH_BORE = [18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80];
for (const s of SPH_SERIES) {
  for (const b of SPH_BORE) {
    const code = `${s}${String(b).padStart(2, "0")}`;
    add({
      name: `Подшипник роликовый сферический двухрядный ${code}-CA/W33`,
      sku: `${code}-CA/W33`,
      weight: Math.round((0.6 + b * 0.14 + (s - 222) * 0.5) * 10) / 10,
      status: st(0.6),
      fits: "Дробилки, грохоты, вибропитатели, конвейеры",
      group: "Подшипники",
    });
  }
}
for (const s of [322, 323, 302, 303, 313]) {
  for (const b of [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 40, 44]) {
    const code = `${s}${String(b).padStart(2, "0")}`;
    add({ name: `Подшипник роликовый конический ${code}`, sku: code, weight: Math.round((0.4 + b * 0.09) * 10) / 10, status: st(0.7), fits: "Приводные узлы дробилок и конвейеров", group: "Подшипники" });
  }
}
for (const g of [3614, 3616, 3618, 3620, 3622, 3624, 3626, 3628, 3630, 3632, 3634, 3636, 3640, 53614, 53620, 53628, 53636]) {
  add({ name: `Подшипник вибровозбудителя ${g} (ГОСТ 5721)`, sku: String(g), weight: w(3, 26), status: st(0.7), fits: "Грохоты ГИС, ГИТ, ГИЛ, вибропитатели", group: "Подшипники" });
}
for (const t of ["Корпус подшипниковый SNL", "Крышка корпуса", "Втулка закрепительная H", "Гайка круглая KM", "Шайба стопорная MB", "Уплотнение лабиринтное TSN"]) {
  for (const n of [508, 510, 511, 513, 515, 517, 518, 520, 522, 524, 526, 528, 530, 532, 534]) {
    add({ name: `${t} ${n}`, sku: `${t.split(" ").pop()}-${n}`, weight: w(0.3, 42), status: st(0.7), fits: "Подшипниковые узлы ДСО", group: "Подшипники" });
  }
}

/* ─────────────── 14. ГИДРАВЛИКА И РВД ─────────────── */
const DN = [6, 8, 10, 12, 16, 20, 25, 31, 38, 51];
const HOSE_L = [500, 800, 1000, 1250, 1500, 2000, 2500, 3000, 4000, 5000];
for (const dn of DN) {
  for (const l of HOSE_L) {
    add({
      name: `Рукав высокого давления DN${dn} 2SN, длина ${l} мм`,
      sku: `РВД-2SN-${dn}-${l}`,
      weight: Math.round((0.25 + dn * 0.02) * (l / 1000) * 10) / 10,
      status: st(0.8),
      fits: "Гидросистемы дробилок, мобильных комплексов, питателей",
      group: "Гидравлика",
    });
  }
  add({ name: `Фитинг прямой DN${dn} (штуцер BSP)`, sku: `ФИТ-ПР-${dn}`, weight: w(0.1, 1.4), status: st(0.88), fits: "Гидросистемы ДСО", group: "Гидравлика" });
  add({ name: `Фитинг угловой 90° DN${dn}`, sku: `ФИТ-90-${dn}`, weight: w(0.1, 1.6), status: st(0.85), fits: "Гидросистемы ДСО", group: "Гидравлика" });
  add({ name: `Быстроразъёмное соединение DN${dn}`, sku: `БРС-${dn}`, weight: w(0.15, 1.8), status: st(0.8), fits: "Гидросистемы ДСО", group: "Гидравлика" });
}
for (const v of ["Клапан предохранительный", "Клапан обратный", "Распределитель 4/3", "Дроссель регулируемый", "Гидрозамок односторонний", "Насос шестерённый", "Насос аксиально-поршневой", "Гидромотор орбитальный", "Гидроцилиндр Ø63/36", "Гидроцилиндр Ø80/45", "Гидроцилиндр Ø100/56", "Гидроцилиндр Ø125/70"]) {
  for (const i of [1, 2, 3, 4, 5]) {
    add({ name: `${v}, исполнение ${i}`, sku: `ГИД-${v.split(" ")[0].slice(0, 3).toUpperCase()}-${i}${DN[i]}`, weight: w(1.2, 78), status: st(0.5), fits: "Гидростанции и гидроприводы ДСО", group: "Гидравлика" });
  }
}
for (const s of ["Манжета штока", "Манжета поршня", "Кольцо уплотнительное", "Грязесъёмник", "Направляющее кольцо", "Ремкомплект гидроцилиндра"]) {
  for (const d of [40, 50, 63, 70, 80, 90, 100, 110, 125, 140, 160, 180, 200]) {
    add({ name: `${s} Ø${d} мм`, sku: `УПЛ-${s.split(" ")[0].slice(0, 3).toUpperCase()}-${d}`, weight: w(0.05, 2.4), status: st(0.88), fits: "Гидроцилиндры дробилок и мобильных комплексов", group: "Гидравлика" });
  }
}

/* ─────────────── 15. ЭЛЕКТРООБОРУДОВАНИЕ И ПРИВОДЫ ─────────────── */
const KW = [5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110, 132, 160, 200, 250, 315, 355, 400, 500, 630];
for (const kw of KW) {
  add({ name: `Электродвигатель асинхронный ${kw} кВт, 1500 об/мин, IP55`, sku: `ЭД-${String(kw).replace(".", "")}-1500`, weight: Math.round(kw * 7.5), status: st(0.45), fits: "Приводы дробилок, грохотов, конвейеров", group: "Электрооборудование" });
  add({ name: `Электродвигатель асинхронный ${kw} кВт, 1000 об/мин, IP55`, sku: `ЭД-${String(kw).replace(".", "")}-1000`, weight: Math.round(kw * 8.8), status: st(0.4), fits: "Приводы ДСО", group: "Электрооборудование" });
  add({ name: `Преобразователь частоты ${kw} кВт, 380 В`, sku: `ПЧ-${String(kw).replace(".", "")}-380`, weight: Math.round(kw * 0.9 + 4), status: st(0.4), fits: "Шкафы управления АСУ ТП линий дробления", group: "Электрооборудование" });
  add({ name: `Устройство плавного пуска ${kw} кВт`, sku: `УПП-${String(kw).replace(".", "")}`, weight: Math.round(kw * 0.55 + 3), status: st(0.35), fits: "Пусковая аппаратура ДСК", group: "Электрооборудование" });
}
for (const el of ["Контактор", "Автоматический выключатель", "Реле тепловое", "Реле контроля фаз", "Датчик схода ленты", "Датчик скорости барабана", "Датчик уровня бункера", "Тросовый выключатель аварийный", "Кабель силовой КГ 4×", "Пост управления кнопочный"]) {
  for (const i of [16, 25, 32, 40, 63, 80, 100, 125, 160, 200, 250, 400]) {
    add({ name: `${el} ${i} А/мм²`, sku: `ЭЛ-${el.split(" ")[0].slice(0, 3).toUpperCase()}-${i}`, weight: w(0.15, 12), status: st(0.75), fits: "Шкафы управления и полевая автоматика ДСК", group: "Электрооборудование" });
  }
}

/* ─────────────── 16. РЕДУКТОРЫ, МУФТЫ, РЕМНИ ─────────────── */
for (const r of ["Ц2У-160", "Ц2У-200", "Ц2У-250", "Ц2У-315", "Ц2У-355", "Ц2У-400", "Ч-100", "Ч-125", "Ч-160", "1Ц2У-200", "1Ц2У-250", "КЦ1-200", "КЦ1-300", "РМ-350", "РМ-500", "РМ-650"]) {
  add({ name: `Редуктор ${r} (в сборе)`, sku: `РЕД-${r.replace(/[^0-9A-ZА-Я]/gi, "")}`, weight: w(45, 620), status: st(0.3), fits: "Приводы конвейеров, питателей, грохотов", group: "Приводы" });
  add({ name: `Ремкомплект редуктора ${r}`, sku: `РЕД-РК-${r.replace(/[^0-9A-ZА-Я]/gi, "")}`, weight: w(1.5, 12), status: st(0.65), fits: `Редуктор ${r}`, group: "Приводы" });
}
for (const m of ["МУВП-250", "МУВП-320", "МУВП-400", "МУВП-500", "Муфта втулочно-пальцевая", "Муфта зубчатая МЗ-4", "Муфта зубчатая МЗ-6", "Муфта упругая шинная", "Муфта гидродинамическая"]) {
  for (const i of [1, 2, 3, 4]) {
    add({ name: `${m}, типоразмер ${i}`, sku: `МУФ-${m.replace(/[^0-9A-ZА-Я]/gi, "").slice(0, 6)}-${i}`, weight: w(6, 180), status: st(0.5), fits: "Соединение привода и рабочего органа", group: "Приводы" });
  }
}
for (const prof of ["SPA", "SPB", "SPC", "SPZ", "A", "B", "C", "D"]) {
  for (const len of [1250, 1400, 1600, 1800, 2000, 2240, 2500, 2800, 3150, 3550, 4000, 4500, 5000, 5600, 6300]) {
    add({ name: `Ремень клиновой ${prof}-${len} Lw`, sku: `РЕМ-${prof}-${len}`, weight: Math.round((len / 1000) * (prof === "SPC" || prof === "D" ? 1.1 : 0.5) * 10) / 10, status: st(0.85), fits: "Клиноремённые приводы дробилок", group: "Приводы" });
  }
}

/* ─────────────── 17. КРЕПЁЖ И РАСХОДНЫЕ МАТЕРИАЛЫ ─────────────── */
const BOLT_M = [16, 20, 24, 27, 30, 36, 42, 48];
const BOLT_L = [60, 80, 100, 120, 150, 180, 200, 220, 260, 300, 350];
for (const m of BOLT_M) {
  for (const l of BOLT_L) {
    add({ name: `Болт М${m}×${l} кл. 10.9 (ГОСТ 7798-70)`, sku: `ГОСТ7798-М${m}х${l}-109`, weight: Math.round(((m * m * l) / 90000) * 100) / 100, status: st(0.88), fits: "Крепление броней, плит, футеровок", group: "Крепёж и расходники" });
    add({ name: `Шпилька М${m}×${l} кл. 8.8 (ГОСТ 22042-76)`, sku: `ГОСТ22042-М${m}х${l}-88`, weight: Math.round(((m * m * l) / 105000) * 100) / 100, status: st(0.82), fits: "Монтаж узлов ДСО", group: "Крепёж и расходники" });
  }
  add({ name: `Гайка М${m} кл. 10 (ГОСТ 5915-70)`, sku: `ГОСТ5915-М${m}-10`, weight: Math.round((m * m) / 3200 * 100) / 100, status: st(0.9), fits: "Крепёж ДСО", group: "Крепёж и расходники" });
  add({ name: `Шайба пружинная М${m} (ГОСТ 6402-70)`, sku: `ГОСТ6402-М${m}`, weight: Math.round((m / 320) * 100) / 100, status: st(0.9), fits: "Крепёж ДСО", group: "Крепёж и расходники" });
  add({ name: `Шайба плоская М${m} (ГОСТ 11371-78)`, sku: `ГОСТ11371-М${m}`, weight: Math.round((m / 420) * 100) / 100, status: st(0.9), fits: "Крепёж ДСО", group: "Крепёж и расходники" });
}
for (const e of ["Т-590", "Т-620", "ОЗН-300", "ОЗН-400", "ЦН-6Л", "УОНИ-13/55", "МР-3", "АНО-21"]) {
  for (const d of [3, 4, 5]) {
    add({ name: `Электрод наплавочный ${e} Ø${d} мм (упаковка 5 кг)`, sku: `ЭЛТ-${e.replace(/[^0-9A-ZА-Я]/gi, "")}-${d}`, weight: 5, status: st(0.85), fits: "Наплавка и ремонт изнашиваемых элементов", group: "Крепёж и расходники" });
  }
}
for (const p of ["ПП-АН125", "ПП-АН170", "ПП-Нп-200Х15С1ГРТ", "Св-08Г2С"]) {
  for (const d of [1.2, 1.6, 2.0, 2.4, 3.0]) {
    add({ name: `Проволока наплавочная ${p} Ø${d} мм (катушка 15 кг)`, sku: `ПРВ-${p.replace(/[^0-9A-ZА-Я]/gi, "")}-${String(d).replace(".", "")}`, weight: 15, status: st(0.7), fits: "Восстановительная наплавка узлов ДСО", group: "Крепёж и расходники" });
  }
}

/* ─────────────── 18. ГСМ И ФИЛЬТРЫ (расширенно) ─────────────── */
const OIL_LINE = [
  { b: "Mobilgear 600 XP", g: [68, 100, 150, 220, 320, 460, 680] },
  { b: "Shell Omala S2 GX", g: [68, 100, 150, 220, 320, 460] },
  { b: "Shell Tellus S2 MX", g: [32, 46, 68, 100] },
  { b: "Mobil DTE 10 Excel", g: [15, 32, 46, 68, 100] },
  { b: "Лукойл Стило", g: [68, 100, 150, 220, 320] },
  { b: "Газпромнефть Reductor CLP", g: [100, 150, 220, 320, 460] },
];
for (const o of OIL_LINE) {
  for (const g of o.g) {
    for (const pack of [20, 208]) {
      add({ name: `Масло ${o.b} ${g} (${pack} л)`, sku: `МАС-${o.b.replace(/[^0-9A-Za-z]/g, "").toUpperCase().slice(0, 10)}-${g}-${pack}`, weight: pack === 20 ? 18 : 182, status: st(0.8), fits: "ТО редукторов и гидросистем ДСО", group: "ГСМ и фильтры" });
    }
  }
}
for (const g of ["Shell Gadus S2 V220 2", "Mobilith SHC 460", "Литол-24", "Солидол-Ж", "ЦИАТИМ-201", "Molykote BR2 Plus", "Shell Gadus S3 V220C 2"]) {
  for (const pack of [1, 5, 18, 180]) {
    add({ name: `Смазка ${g} (${pack} кг)`, sku: `СМЗ-${g.replace(/[^0-9A-Za-zА-Яа-я]/g, "").toUpperCase().slice(0, 10)}-${pack}`, weight: pack, status: st(0.85), fits: "Смазка подшипниковых узлов ДСО", group: "ГСМ и фильтры" });
  }
}
for (const f of ["P171560", "P164378", "P165659", "P171575", "P550388", "P551352", "P553000", "P164166", "P167181", "HF6177", "HF6553", "HF35480", "HF6708", "1R-0750", "1R-0770", "1R-1808", "WK940/20", "WK962/7", "PT9420", "PT23003", "HC9600", "HC8300", "MF1801", "SPH21000", "TXW8B", "CS150"]) {
  add({ name: `Фильтроэлемент ${f} (гидравлика / смазка / топливо)`, sku: f, weight: w(0.3, 5), status: st(0.85), fits: "Гидростанции, смазочные системы, ДВС мобильных комплексов", group: "ГСМ и фильтры" });
}

/* ─────────────── 19. ПАРК ПРОЧИХ МИРОВЫХ МАРОК ─────────────── */
const WORLD = [
  { b: "Trio (Weir)", ms: ["CT2036", "CT3242", "CT3648", "TC51", "TC66", "TP260", "TP350", "APS4034", "APS5060"] },
  { b: "Astec KPI-JCI", ms: ["K200+", "K300+", "K400+", "FT2650", "FT4250", "GT125", "GT200DF"] },
  { b: "McCloskey", ms: ["J40", "J45", "J50", "C38", "C44", "I44", "I54", "S130", "S190"] },
  { b: "Keestrack", ms: ["B3", "B4", "B6", "H4", "H6", "R3", "R5", "K3", "K4"] },
  { b: "Tesab", ms: ["RK623", "RK1012", "10570", "800i", "700i", "1200TC"] },
  { b: "Hazemag", ms: ["APK40", "APK50", "APPH1010", "APPH1315", "APSE1110", "HPI1313"] },
  { b: "thyssenkrupp", ms: ["KB 54-75", "KB 63-89", "EB 12-10", "EB 14-11", "TITAN 40", "TITAN 60"] },
  { b: "FLSmidth", ms: ["Raptor R250", "Raptor R350", "Raptor R450", "TSUV 42-65", "TSUV 54-75", "ABON 4Q"] },
  { b: "Lippmann", ms: ["3062", "3862", "4248", "5165"] },
  { b: "Eagle Crusher", ms: ["1200-25CV", "1400-45CV", "UM-25", "UM-40"] },
];
for (const { b, ms } of WORLD) {
  const bc = b.replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 4);
  for (const m of ms) {
    const mc = m.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
    const fits = `${b} ${m}`;
    add({ name: "Плита дробящая подвижная Mn18", sku: `${bc}-${mc}-JP01`, weight: w(520, 2300), status: st(0.35), fits, group: b });
    add({ name: "Плита дробящая неподвижная Mn18", sku: `${bc}-${mc}-JP02`, weight: w(500, 2250), status: st(0.35), fits, group: b });
    add({ name: "Броня конуса подвижная (mantle)", sku: `${bc}-${mc}-CC01`, weight: w(480, 2600), status: st(0.3), fits, group: b });
    add({ name: "Броня неподвижная (concave / bowl)", sku: `${bc}-${mc}-CC02`, weight: w(500, 2700), status: st(0.3), fits, group: b });
    add({ name: "Било роторное Cr26", sku: `${bc}-${mc}-BM03`, weight: w(60, 260), status: st(0.4), fits, group: b });
    add({ name: "Плита отражательная", sku: `${bc}-${mc}-IP01`, weight: w(180, 700), status: st(0.3), fits, group: b });
    add({ name: "Футеровка корпуса камеры", sku: `${bc}-${mc}-LN05`, weight: w(35, 190), status: st(0.4), fits, group: b });
    add({ name: "Втулка эксцентриковая бронзовая", sku: `${bc}-${mc}-BS07`, weight: w(22, 130), status: st(0.35), fits, group: b });
    add({ name: "Подпятник сферический", sku: `${bc}-${mc}-TB09`, weight: w(25, 140), status: st(0.35), fits, group: b });
    add({ name: "Комплект уплотнений и РТИ", sku: `${bc}-${mc}-SK00`, weight: w(1.5, 6), status: st(0.7), fits, group: b });
    add({ name: "Колосник питателя", sku: `${bc}-${mc}-GB04`, weight: w(22, 72), status: st(0.5), fits, group: b });
    add({ name: "Сито деки грохота", sku: `${bc}-${mc}-SC08`, weight: w(4, 30), status: st(0.55), fits, group: b });
  }
}

/* ─────────────── 20. МЕЛЬНИЦЫ, ПЕСКОМОЙКИ, СЕПАРАТОРЫ ─────────────── */
for (const m of ["LM130K", "LM150M", "LM170K", "LM190K", "LM220M", "LUM1125", "LUM1425", "LUM1736", "MTW110", "MTW138", "MTW175", "MW125", "MW175", "T130X", "SCM800", "SCM1250"]) {
  const fits = `Мельница Liming ${m}`;
  add({ name: "Валок размольный в сборе", sku: `${m}-RL-01`, weight: w(180, 1400), status: st(0.25), fits, group: "Мельницы" });
  add({ name: "Бандаж валка (шина)", sku: `${m}-RT-02`, weight: w(90, 720), status: st(0.4), fits, group: "Мельницы" });
  add({ name: "Плита размольного стола (сегмент)", sku: `${m}-TP-03`, weight: w(70, 560), status: st(0.4), fits, group: "Мельницы" });
  add({ name: "Лопатка сепаратора", sku: `${m}-SB-04`, weight: w(3, 22), status: st(0.6), fits, group: "Мельницы" });
  add({ name: "Скребок подающий", sku: `${m}-SC-05`, weight: w(5, 34), status: st(0.6), fits, group: "Мельницы" });
  add({ name: "Уплотнение вала размольного", sku: `${m}-SL-06`, weight: w(1, 9), status: st(0.75), fits, group: "Мельницы" });
}
for (const m of ["XSD2610", "XSD2816", "XSD3016", "XSD3620", "LSX750", "LSX920", "LSX1120", "TSW0936", "TSW1139"]) {
  const fits = `Пескомойка / питатель Liming ${m}`;
  add({ name: "Лопасть спирали", sku: `${m}-BL-01`, weight: w(12, 96), status: st(0.55), fits, group: "Пескомойки" });
  add({ name: "Футеровка ванны", sku: `${m}-LN-02`, weight: w(28, 180), status: st(0.5), fits, group: "Пескомойки" });
  add({ name: "Вал спирали", sku: `${m}-SH-03`, weight: w(90, 480), status: st(0.3), fits, group: "Пескомойки" });
  add({ name: "Уплотнение нижней опоры", sku: `${m}-SL-04`, weight: w(1, 8), status: st(0.75), fits, group: "Пескомойки" });
  add({ name: "Редуктор привода в сборе", sku: `${m}-RD-05`, weight: w(120, 520), status: st(0.25), fits, group: "Пескомойки" });
}
for (const m of ["ПС-80", "ПС-120", "ПС-160", "ЭП1-80", "ЭП1-120", "ЭП2-100", "СМЛ-800", "СМЛ-1000", "СМЛ-1200", "ЖШ-90", "ЖШ-120"]) {
  const fits = `Магнитный сепаратор ${m}`;
  add({ name: "Катушка электромагнита", sku: `${m}-CL-01`, weight: w(110, 460), status: st(0.28), fits, group: "Сепараторы" });
  add({ name: "Лента сбросная", sku: `${m}-BL-02`, weight: w(28, 96), status: st(0.5), fits, group: "Сепараторы" });
  add({ name: "Барабан приводной сепаратора", sku: `${m}-DR-03`, weight: w(60, 260), status: st(0.35), fits, group: "Сепараторы" });
  add({ name: "Блок выпрямителя питания", sku: `${m}-RC-04`, weight: w(14, 62), status: st(0.35), fits, group: "Сепараторы" });
}

/* ─────────────── 21. ПЫЛЕПОДАВЛЕНИЕ И МЕТАЛЛОКОНСТРУКЦИИ ─────────────── */
for (const n of ["Форсунка распылительная", "Коллектор форсунок", "Насос дозирующий", "Фильтр рукавный", "Рукав фильтровальный", "Клапан импульсной продувки", "Вентилятор аспирации"]) {
  for (const i of [1, 2, 3, 4, 5, 6, 7, 8]) {
    add({ name: `${n}, типоразмер ${i}`, sku: `АСП-${n.split(" ")[0].slice(0, 3).toUpperCase()}-0${i}`, weight: w(0.4, 180), status: st(0.6), fits: "Системы пылеподавления и аспирации ДСК", group: "Аспирация" });
  }
}
for (const n of ["Течка пересыпная", "Бункер приёмный", "Лоток разгрузочный", "Площадка обслуживания", "Лестница маршевая", "Ограждение конвейера", "Опора конвейерная"]) {
  for (const i of [1, 2, 3, 4, 5, 6]) {
    add({ name: `${n}, исполнение ${i} (по проекту)`, sku: `МК-${n.split(" ")[0].slice(0, 3).toUpperCase()}-0${i}`, weight: w(45, 1800), status: "on_order", fits: "Металлоконструкции дробильно-сортировочных линий", group: "Металлоконструкции" });
  }
}

/* ─────────────── 22. БРОНИ И ПЛИТЫ ПО МАРКАМ ИЗНОСОСТОЙКОЙ СТАЛИ ─────────────── */
const ALLOYS = [
  { c: "M14", n: "Mn14Cr2 (низкий абразив, высокая ударная нагрузка)", p: 0.55 },
  { c: "M18", n: "Mn18Cr2 (универсальная)", p: 0.75 },
  { c: "M22", n: "Mn22Cr2 (высокий абразив, гранит/кварцит)", p: 0.45 },
];
const ALL_CONES = [...CONE_HPT.map((c) => c.m), ...CONE_HST, ...CONE_PY];
for (const m of ALL_CONES) {
  for (const cav of ["C1", "C2", "M", "F1", "F2"]) {
    for (const a of ALLOYS) {
      add({ name: `Броня конуса подвижная ${a.n}, камера ${cav}`, sku: `${m}-MT-${cav}-${a.c}`, weight: w(420, 2600), status: st(a.p), fits: `Конусная дробилка Liming ${m}`, group: "Конусные дробилки" });
      add({ name: `Броня неподвижная (чаша) ${a.n}, камера ${cav}`, sku: `${m}-CV-${cav}-${a.c}`, weight: w(440, 2700), status: st(a.p), fits: `Конусная дробилка Liming ${m}`, group: "Конусные дробилки" });
    }
  }
  add({ name: "Комплект крепежа броней (болты, клинья, шайбы)", sku: `${m}-FK-00`, weight: w(8, 46), status: st(0.8), fits: `Конусная дробилка Liming ${m}`, group: "Конусные дробилки" });
}
const ALL_JAWS = [...JAW_C6X.map((j) => j.m), ...JAW_PE.map((m) => m.replace("×", "x").replace("-", "")), ...JAW_PEW];
for (const m of ALL_JAWS) {
  for (const a of ALLOYS) {
    add({ name: `Плита дробящая подвижная ${a.n}`, sku: `${m}-MJ-${a.c}`, weight: w(320, 2400), status: st(a.p), fits: `Щековая дробилка Liming ${m}`, group: "Щековые дробилки" });
    add({ name: `Плита дробящая неподвижная ${a.n}`, sku: `${m}-FJ-${a.c}`, weight: w(310, 2350), status: st(a.p), fits: `Щековая дробилка Liming ${m}`, group: "Щековые дробилки" });
    add({ name: `Футеровка боковая ${a.n}`, sku: `${m}-SJ-${a.c}`, weight: w(35, 210), status: st(a.p), fits: `Щековая дробилка Liming ${m}`, group: "Щековые дробилки" });
  }
}
const BLOW_ALLOYS = [
  { c: "CR26", n: "Cr26 (высокохромистый чугун)", p: 0.7 },
  { c: "CR20", n: "Cr20 (среднехромистый)", p: 0.6 },
  { c: "MN18", n: "Mn18 (марганцовистая сталь)", p: 0.65 },
  { c: "CER", n: "с керамическими вставками", p: 0.4 },
];
for (const m of IMPACT) {
  for (const a of BLOW_ALLOYS) {
    add({ name: `Било роторное ${a.n}`, sku: `${m}-BB-${a.c}`, weight: w(42, 190), status: st(a.p), fits: `Роторная дробилка Liming ${m}`, group: "Роторные дробилки" });
    add({ name: `Плита отражательная ${a.n}`, sku: `${m}-RP-${a.c}`, weight: w(180, 760), status: st(a.p * 0.8), fits: `Роторная дробилка Liming ${m}`, group: "Роторные дробилки" });
  }
}

/* ─────────────── 23. СЕРВИСНЫЕ КОМПЛЕКТЫ ТО ─────────────── */
const KITS = [
  { c: "TO1", n: "Комплект ТО-1 (500 моточасов): фильтры, РТИ, смазка" },
  { c: "TO2", n: "Комплект ТО-2 (2000 моточасов): фильтры, масла, уплотнения" },
  { c: "TO3", n: "Комплект ТО-3 (5000 моточасов): подшипники, втулки, РТИ" },
  { c: "WEAR", n: "Комплект быстроизнашиваемых элементов на год" },
  { c: "SEAL", n: "Ремкомплект уплотнений и РТИ" },
  { c: "BOLT", n: "Комплект крепежа для замены футеровок" },
];
const ALL_MACHINES: { m: string; f: string; g: string }[] = [
  ...JAW_C6X.map((j) => ({ m: j.m, f: `Щековая дробилка Liming ${j.m}`, g: "Щековые дробилки" })),
  ...JAW_PEW.map((m) => ({ m, f: `Щековая дробилка Liming ${m}`, g: "Щековые дробилки" })),
  ...CONE_HPT.map((c) => ({ m: c.m, f: `Конусная дробилка Liming ${c.m}`, g: "Конусные дробилки" })),
  ...CONE_HST.map((m) => ({ m, f: `Конусная дробилка Liming ${m}`, g: "Конусные дробилки" })),
  ...IMPACT.map((m) => ({ m, f: `Роторная дробилка Liming ${m}`, g: "Роторные дробилки" })),
  ...VSI.map((m) => ({ m, f: `ЦУД Liming ${m}`, g: "Центробежно-ударные" })),
  ...SCREENS.map((m) => ({ m, f: `Грохот Liming ${m}`, g: "Грохоты" })),
  ...FEEDERS.map((m) => ({ m, f: `Питатель Liming ${m}`, g: "Питатели" })),
  ...MOBILE.map((m) => ({ m, f: `Мобильный комплекс Liming ${m}`, g: "Мобильные комплексы" })),
  ...RU_CONE.map((c) => ({ m: c.m, f: `Конусная дробилка ${c.m}`, g: "КСД · КМД · ККД" })),
  ...RU_JAW.map((j) => ({ m: j.m, f: `Щековая дробилка ${j.m}`, g: "СМД · ДРО · ЩДП" })),
  ...RU_SCREEN.map((m) => ({ m, f: `Грохот ${m}`, g: "Грохоты ГИС · ГИТ · ГИЛ" })),
];
for (const { m, f, g } of ALL_MACHINES) {
  const code = m.replace(/[^0-9A-Za-zА-Яа-я]/g, "").toUpperCase();
  for (const k of KITS) {
    add({ name: `${k.n} — ${m}`, sku: `КТ-${code}-${k.c}`, weight: w(3, 180), status: st(0.55), fits: f, group: g });
  }
}

/* ─────────────── 24. РАСШИРЕНИЕ ПАРКА МИРОВЫХ МАРОК ─────────────── */
const WORLD2 = [
  { b: "Terex Finlay", ms: ["J-1170", "J-1175", "C-1540", "C-1550", "I-140", "883+", "984"] },
  { b: "Rubble Master", ms: ["RM60", "RM70GO", "RM90GO", "RM100GO", "RM120X"] },
  { b: "Kemco", ms: ["JC-1300", "CC-1300", "VC-1500", "SC-2000"] },
  { b: "Nakayama", ms: ["NE-4230", "NE-5033", "IC-100", "SR-100"] },
  { b: "Shanbao", ms: ["PE600x900", "PE750x1060", "PEX250x1200", "PYB1200", "PYB1750"] },
  { b: "Zenith / SBM", ms: ["JC840", "JC1100", "HP200", "HP300", "VSI7611"] },
  { b: "SANME", ms: ["JC160", "JC180", "SMH200", "SMH300", "SMS250"] },
  { b: "Дробмаш", ms: ["ДРО-600", "СМД-741", "ДРО-611", "СМД-118А"] },
  { b: "Уралмаш", ms: ["ККД-1500/180", "КСД-2200Т", "КМД-2200Гр", "ЩДП-15х21"] },
  { b: "Строммашина", ms: ["СМД-108", "СМД-116", "ГИЛ-42", "ГИТ-51"] },
];
const WORLD_PARTS = [
  { n: "Плита дробящая подвижная Mn18", c: "JP01", w: [500, 2300], p: 0.35 },
  { n: "Плита дробящая неподвижная Mn18", c: "JP02", w: [480, 2250], p: 0.35 },
  { n: "Броня конуса подвижная (mantle)", c: "CC01", w: [460, 2600], p: 0.3 },
  { n: "Броня неподвижная (concave)", c: "CC02", w: [480, 2700], p: 0.3 },
  { n: "Било роторное Cr26", c: "BM03", w: [55, 260], p: 0.4 },
  { n: "Плита отражательная", c: "IP01", w: [170, 700], p: 0.3 },
  { n: "Футеровка камеры дробления", c: "LN05", w: [32, 190], p: 0.4 },
  { n: "Втулка эксцентриковая бронзовая", c: "BS07", w: [20, 130], p: 0.35 },
  { n: "Подпятник сферический", c: "TB09", w: [24, 140], p: 0.35 },
  { n: "Вал эксцентриковый", c: "SH02", w: [180, 1200], p: 0.2 },
  { n: "Шестерня коническая", c: "GR06", w: [28, 240], p: 0.3 },
  { n: "Комплект уплотнений и РТИ", c: "SK00", w: [1.2, 6], p: 0.7 },
  { n: "Колосник питателя", c: "GB04", w: [20, 72], p: 0.5 },
  { n: "Сито деки грохота", c: "SC08", w: [4, 30], p: 0.55 },
  { n: "Пружина опорная", c: "SP11", w: [5, 32], p: 0.6 },
  { n: "Клин крепления плиты", c: "WD12", w: [12, 60], p: 0.55 },
  { n: "Распорная плита", c: "TG13", w: [60, 340], p: 0.45 },
  { n: "Подшипник основного вала", c: "BR14", w: [18, 180], p: 0.4 },
  { n: "Гидроцилиндр регулировки", c: "HC15", w: [24, 96], p: 0.3 },
  { n: "Фильтроэлемент гидросистемы", c: "HF16", w: [0.4, 4], p: 0.8 },
];
for (const { b, ms } of [...WORLD, ...WORLD2]) {
  const bc = b.replace(/[^A-Za-zА-Яа-я]/g, "").toUpperCase().slice(0, 4);
  for (const m of ms) {
    const mc = m.replace(/[^0-9A-Za-zА-Яа-я]/g, "").toUpperCase();
    for (const wp of WORLD_PARTS) {
      add({
        name: wp.n,
        sku: `${bc}-${mc}-${wp.c}`,
        weight: w(wp.w[0], wp.w[1]),
        status: st(wp.p),
        fits: `${b} ${m}`,
        group: b,
      });
    }
  }
}

/* ─────────────── 25. ДОПОЛНИТЕЛЬНЫЕ ТИПОРАЗМЕРЫ СИТ И РОЛИКОВ ─────────────── */
for (const panel of ["1220×610", "915×305", "1000×500", "500×500"]) {
  const pc = panel.replace("×", "x");
  for (const mesh of MESHES) {
    for (const mat of MATS) {
      if (mat.c === "СТ" && mesh < 8) continue;
      add({
        name: `Сито ${mat.n} ${panel} мм, ячейка ${mesh}×${mesh} мм`,
        sku: `СИТ-${pc}-${mat.c}-${mesh}`,
        weight: Math.round((3 + mesh * 0.03) * mat.k * 10) / 10,
        status: st(mat.p * 0.9),
        fits: "Грохоты модульного типа, деки Warrior, Chieftain, S5X",
        group: "Сита",
      });
    }
  }
}
for (const d of [76, 219]) {
  for (const l of ROLL_L) {
    for (const t of ROLL_T) {
      add({ name: `Ролик конвейерный ${t.n} Ø${d} × ${l} мм`, sku: `РОЛ-${d}-${l}-${t.c}`, weight: Math.round(((d / 89) * (l / 380) * 6.5 * t.k) * 10) / 10, status: st(t.p * 0.85), fits: "Ленточные конвейеры тяжёлого класса", group: "Конвейеры" });
    }
  }
}
for (const s of [238, 239, 249]) {
  for (const b of SPH_BORE) {
    const code = `${s}${String(b).padStart(2, "0")}`;
    add({ name: `Подшипник роликовый сферический ${code}-CA/W33`, sku: `${code}-CA/W33`, weight: Math.round((0.8 + b * 0.16) * 10) / 10, status: st(0.5), fits: "Тяжелонагруженные узлы дробилок", group: "Подшипники" });
  }
}
for (const prof of ["SPA", "SPB", "SPC", "SPZ", "8V", "5V"]) {
  for (const len of [1180, 1320, 1500, 1700, 1900, 2120, 2360, 2650, 3000, 3350, 3750, 4250, 4750, 5300, 6000, 6700, 7100]) {
    add({ name: `Ремень клиновой ${prof}-${len} Lw`, sku: `РЕМ-${prof}-${len}`, weight: Math.round((len / 1000) * 0.7 * 10) / 10, status: st(0.8), fits: "Клиноремённые приводы дробилок и грохотов", group: "Приводы" });
  }
}

/* ============================ ИТОГОВЫЙ ЭКСПОРТ ============================ */
/** предвычисленные ключи поиска — поиск по 10 000+ позициям без лагов */
export interface IndexedPart extends DbPart {
  nsku: string;
  nname: string;
}

const norm = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[a-z]/g, (c) => {
      const map: Record<string, string> = {
        a: "а", b: "в", c: "с", e: "е", h: "н", k: "к", m: "м", o: "о", p: "р", t: "т", x: "х",
      };
      return map[c] ?? c;
    })
    .replace(/[^0-9a-zа-яё]+/gi, "");

export const PARTS_DB: IndexedPart[] = out.map((p) => ({
  ...p,
  nsku: norm(p.sku),
  nname: norm(p.name),
}));

export const PARTS_GROUPS: string[] = Array.from(new Set(out.map((p) => p.group))).sort((a, b) =>
  a.localeCompare(b, "ru"),
);


