import { useCallback, useEffect, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { PlantImg } from "./SafeImg";

export function BeforeAfter() {
  const [pos, setPos] = useState(46);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    setPos(Math.min(97, Math.max(3, ((clientX - r.left) / r.width) * 100)));
  }, []);

  /* Слушатели вешаем на window: указатель может уйти за пределы блока или
     «залипнуть» на дочернем SVG — так перетаскивание не срывается. */
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!active.current) return;
      e.preventDefault();
      setFromClientX(e.clientX);
    };
    const up = () => {
      if (!active.current) return;
      active.current = false;
      setDragging(false);
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [setFromClientX]);

  const onDown = (e: React.PointerEvent) => {
    e.preventDefault();
    active.current = true;
    setDragging(true);
    setFromClientX(e.clientX);
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] w-full touch-none select-none overflow-hidden border border-line-2 bg-ink-3 sm:aspect-[16/8] xl:mx-auto xl:aspect-[21/9] xl:max-h-[62vh]"
      style={{ cursor: dragging ? "grabbing" : "ew-resize" }}
      onPointerDown={onDown}
      onDragStart={(e) => e.preventDefault()}
      role="slider"
      aria-label="Сравнение: проектная модель и реализованный объект"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setPos((p) => Math.max(3, p - 3));
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          setPos((p) => Math.min(97, p + 3));
        }
      }}
    >
      {/* слой изображений не перехватывает указатель */}
      <div className="pointer-events-none absolute inset-0">
        {/* ПОСЛЕ: реализованный объект */}
        <PlantImg
          alt="Реализованный дробильно-сортировочный комплекс АСТ"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* ДО: проектная 3D-модель (чертёжная стилизация) */}
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <PlantImg
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              filter:
                "grayscale(1) invert(0.9) contrast(1.45) brightness(0.85) sepia(1) hue-rotate(178deg) saturate(2.2)",
            }}
          />
          <div className="u-grid absolute inset-0" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 800" preserveAspectRatio="none" aria-hidden>
            <g stroke="#7FD9FF" strokeWidth="2" opacity="0.85" fontFamily="Roboto" fill="#9FE6FF">
              <line x1="150" y1="706" x2="1450" y2="706" strokeDasharray="8 6" />
              <line x1="150" y1="690" x2="150" y2="722" />
              <line x1="1450" y1="690" x2="1450" y2="722" />
              <text x="720" y="690" fontSize="26" textAnchor="middle">48 000</text>
              <line x1="1400" y1="180" x2="1400" y2="706" strokeDasharray="8 6" />
              <line x1="1384" y1="180" x2="1416" y2="180" />
              <text x="1444" y="450" fontSize="26" transform="rotate(-90 1444 450)" textAnchor="middle">H 8 400</text>
              <rect x="220" y="130" width="248" height="52" fill="none" strokeDasharray="6 5" />
              <text x="344" y="163" fontSize="22" textAnchor="middle">УЗЕЛ ПЕРВИЧКИ</text>
              <rect x="900" y="220" width="300" height="52" fill="none" strokeDasharray="6 5" />
              <text x="1050" y="253" fontSize="22" textAnchor="middle">СОРТИРОВКА</text>
            </g>
          </svg>
          <div className="absolute bottom-4 left-4 border border-xray/40 bg-ink/85 px-3 py-2 backdrop-blur-sm">
            <span className="tech-label !text-[9.5px] text-xray">3D-модель проекта АСТ · КМД</span>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 border border-line-2 bg-ink/85 px-3 py-2 backdrop-blur-sm">
          <span className="tech-label !text-[9.5px] text-white">Реализованный объект</span>
        </div>
      </div>

      {/* ползунок */}
      <div className="pointer-events-none absolute inset-y-0 z-10" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -left-px w-0.5 bg-brand shadow-[0_0_18px_rgba(255,107,0,0.8)]" />
        <div
          className={`absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-brand bg-ink shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-transform ${
            dragging ? "scale-110" : ""
          }`}
        >
          <MoveHorizontal className="h-5 w-5 text-brand" />
        </div>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 border border-line-2 bg-ink/80 px-3 py-1.5 backdrop-blur-sm">
        <span className="text-[10.5px] uppercase tracking-[0.2em] text-steel">тяните · сравнивайте</span>
      </div>
    </div>
  );
}
