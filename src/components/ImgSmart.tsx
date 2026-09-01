import { useEffect, useState } from "react";

/**
 * Изображение с приоритетом официального фото производителя (CDN)
 * и мгновенным переключением на локальный кадр, если CDN недоступен.
 */
export function ImgSmart({
  remote,
  fallback,
  alt,
  className = "",
  eager = false,
}: {
  remote?: string;
  fallback: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  // при смене источника снимаем флаг ошибки
  useEffect(() => setFailed(false), [remote]);

  const src = remote && !failed ? remote : fallback;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}
