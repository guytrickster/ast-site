/* ============================================================================
   Медиа-карта проекта.
   · Оборудование — официальные JPEG с сайта производителя Liming Heavy Industry
     (jaw-crusher.com). Подбор кадра идёт по серии модели.
   · Локальные ассеты используются как фолбэк, если CDN недоступен, а также
     для съёмок площадки, склада и полевых работ.
   ========================================================================== */
import type { CatId, Product } from "./catalog";

import imgJaw from "../assets/crusher-jaw.jpg";
import imgCone from "../assets/crusher-cone.jpg";
import imgImpact from "../assets/crusher-impact.jpg";
import imgVsi from "../assets/crusher-vsi.jpg";
import imgMobile from "../assets/crusher-mobile.jpg";
import imgScreen from "../assets/screen-grohot.jpg";
import imgPlant from "../assets/complex-plant.jpg";
import imgWarehouse from "../assets/parts-warehouse.jpg";
import imgEngineer from "../assets/engineer-field.jpg";
import imgHero from "../assets/hero-quarry.jpg";

export const CDN = "https://www.jaw-crusher.com/wp-content/uploads/2025/07";
const THEME = "https://www.jaw-crusher.com/wp-content/themes/limingfour/images";

export const MEDIA = {
  jaw: imgJaw,
  cone: imgCone,
  impact: imgImpact,
  vsi: imgVsi,
  mobile: imgMobile,
  screen: imgScreen,
  plant: imgPlant,
  warehouse: imgWarehouse,
  engineer: imgEngineer,
  hero: imgHero,
} as const;

/** официальное фото производственно-выставочной площадки Liming */
export const LIMING_COMPANY_PHOTO = `${THEME}/about/about-company.jpg`;

/** соответствие серии оборудования официальному снимку завода */
const SERIES: { test: RegExp; remote: string; local: string }[] = [
  // щековые
  { test: /^C6X/i, remote: `${CDN}/C6X-Jaw-Crusher.jpg`, local: imgJaw },
  { test: /^C5X/i, remote: `${CDN}/C5X-Jaw-Crusher.jpg`, local: imgJaw },
  { test: /^PEW/i, remote: `${CDN}/PEW-Jaw-Crusher.jpg`, local: imgJaw },
  { test: /^PEX?[-\s]?\d/i, remote: `${CDN}/PE-Jaw-Crusher.jpg`, local: imgJaw },
  // конусные
  { test: /^HPT/i, remote: `${CDN}/HPT-Hydraulic-Cone-Crusher.jpg`, local: imgCone },
  { test: /^HST/i, remote: `${CDN}/HST-Hydraulic-Cone-Crusher.jpg`, local: imgCone },
  { test: /^(CS|PY)/i, remote: `${CDN}/CS-Spring-Cone-Crusher.jpg`, local: imgCone },
  { test: /^HGT/i, remote: `${CDN}/HGT-Gyratory-Crusher.jpg`, local: imgCone },
  // роторные
  { test: /^CI5X/i, remote: `${CDN}/CI5X-Impact-Crusher.jpg`, local: imgImpact },
  { test: /^PFW/i, remote: `${CDN}/PFW-Impact-Crusher.jpg`, local: imgImpact },
  { test: /^PF\d/i, remote: `${CDN}/PF-Impact-Crusher.jpg`, local: imgImpact },
  // центробежно-ударные
  { test: /^VSI6X/i, remote: `${CDN}/VSI6X-Sand-Making-Machine.jpg`, local: imgVsi },
  { test: /^VSI5X/i, remote: `${CDN}/VSI5X-Sand-Making-Machine.jpg`, local: imgVsi },
  { test: /^VSI/i, remote: `${CDN}/VSI6X-Sand-Making-Machine.jpg`, local: imgVsi },
  // грохоты и питатели
  { test: /^S5X/i, remote: `${CDN}/S5X-Vibrating-Screen.jpg`, local: imgScreen },
  { test: /^(YK3X|YZS|YA|\dYA)/i, remote: `${CDN}/Y-Vibrating-Screen.jpg`, local: imgScreen },
  { test: /^F5X/i, remote: `${CDN}/F5X-Vibrating-Feeder.jpg`, local: imgScreen },
  { test: /^GF/i, remote: `${CDN}/GF-Vibrating-Feeder.jpg`, local: imgScreen },
  { test: /^(SP|ZSW)/i, remote: `${CDN}/SP-Series-Vibrating-Feeder.jpg`, local: imgScreen },
  // мобильные и конвейеры
  { test: /^NK/i, remote: `${CDN}/NK-Mobile-Crusher.jpg`, local: imgMobile },
  { test: /^MK/i, remote: `${CDN}/MK-Modular-Mobile-Crusher.jpg`, local: imgMobile },
  { test: /^(B6X|B\d{3})/i, remote: `${CDN}/B6X-Belt-Conveyor.jpg`, local: imgPlant },
];

const BY_CAT: Record<CatId, { remote: string; local: string }> = {
  jaw: { remote: `${CDN}/C6X-Jaw-Crusher.jpg`, local: imgJaw },
  cone: { remote: `${CDN}/HPT-Hydraulic-Cone-Crusher.jpg`, local: imgCone },
  impact: { remote: `${CDN}/CI5X-Impact-Crusher.jpg`, local: imgImpact },
  vsi: { remote: `${CDN}/VSI6X-Sand-Making-Machine.jpg`, local: imgVsi },
  screen: { remote: `${CDN}/S5X-Vibrating-Screen.jpg`, local: imgScreen },
  mobile: { remote: `${CDN}/NK-Mobile-Crusher.jpg`, local: imgMobile },
  aux: { remote: `${CDN}/B6X-Belt-Conveyor.jpg`, local: imgPlant },
};

export interface PhotoPair {
  /** официальный JPEG с сайта производителя */
  remote: string;
  /** локальный кадр-фолбэк */
  local: string;
}

/** пара «официальное фото / локальный фолбэк» для карточки оборудования */
export function photoOf(p: Product): PhotoPair {
  const model = p.name.replace(/^(Liming|АСТ)\s+/i, "").trim();
  const hit = SERIES.find((s) => s.test.test(model));
  if (hit) return { remote: hit.remote, local: hit.local };
  const byCat = BY_CAT[p.cat];
  return byCat ?? { remote: "", local: p.img };
}

/** нужен ли «антилоготипный» блюр (кадр линии с имитацией чужих шильдов) */
export const needsPlantMask = (src: string): boolean => src === imgPlant;
