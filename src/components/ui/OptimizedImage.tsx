import React, { useState } from "react";
import { getStorageUrl, getStorageSrcSet } from "@/types/database";

interface OptimizedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  /** Storage path or full URL */
  path: string | null;
  /** Default width used as `src` fallback (1x) */
  width: number;
  /** Heights paired with width for layout reservation (defaults to width = square) */
  height?: number;
  /** `sizes` attribute — e.g. "(max-width: 640px) 50vw, 25vw" */
  sizes?: string;
  /** Custom widths for the srcset; defaults to common product card breakpoints */
  srcSetWidths?: number[];
  /** Eager + high priority for LCP images */
  priority?: boolean;
  /** Wrapper className applied to the outer block (skeleton lives here) */
  wrapperClassName?: string;
}

/**
 * Responsive, lazy-loaded WebP image backed by Supabase image transformations.
 * - Generates srcset/sizes so mobile devices fetch ~200-400px assets instead of 1600px originals
 * - Reserves layout space (no CLS) and fades in once decoded
 * - Shows a low-cost skeleton while loading
 */
const OptimizedImage = React.memo(function OptimizedImage({
  path,
  width,
  height,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  srcSetWidths,
  priority = false,
  wrapperClassName = "",
  className = "",
  alt = "",
  ...rest
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const h = height ?? width;
  const srcSet = getStorageSrcSet(path, srcSetWidths);

  return (
    <span
      className={`relative block overflow-hidden ${wrapperClassName}`}
      style={{ aspectRatio: `${width} / ${h}` }}
    >
      {!loaded && (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-muted"
        />
      )}
      <img
        src={getStorageUrl(path, width)}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        width={width}
        height={h}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        {...rest}
      />
    </span>
  );
});

export default OptimizedImage;