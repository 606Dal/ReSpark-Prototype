"use client";

import { useState } from "react";

const FALLBACK = "/placeholders/product.svg";

export function SafeImage({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const url = !src || failed ? FALLBACK : src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

/** Stable local demo image per product id (no external CDN). */
export function productImageUrl(productId: number) {
  const ids = [101, 102, 103, 104, 105, 106];
  const mapped = ids.includes(productId) ? productId : 101 + (Math.abs(productId) % 6);
  return `/products/p-${mapped}.svg`;
}
