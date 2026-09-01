import { useId } from "react";
import plantImg from "../assets/complex-plant.jpg";

/**
 * Фото комплекса с локальным блюром зон, где генератор вывел
 * имитацию сторонних шильдов на конусных дробилках.
 */
export function PlantImg({
  className = "",
  style,
  alt = "Дробильно-сортировочный комплекс в карьере",
}: {
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const blurId = `pb${uid}`;
  const c1 = `pc1${uid}`;
  const c2 = `pc2${uid}`;
  return (
    <svg
      viewBox="0 0 1600 1049"
      className={className}
      style={style}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={alt}
    >
      <defs>
        <filter id={blurId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <clipPath id={c1}>
          <rect x="798" y="522" width="278" height="82" />
        </clipPath>
        <clipPath id={c2}>
          <rect x="1004" y="486" width="262" height="82" />
        </clipPath>
      </defs>
      <image href={plantImg} width="1600" height="1049" preserveAspectRatio="xMidYMid slice" />
      <image href={plantImg} width="1600" height="1049" preserveAspectRatio="xMidYMid slice" filter={`url(#${blurId})`} clipPath={`url(#${c1})`} />
      <image href={plantImg} width="1600" height="1049" preserveAspectRatio="xMidYMid slice" filter={`url(#${blurId})`} clipPath={`url(#${c2})`} />
    </svg>
  );
}
