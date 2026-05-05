import type { Tables } from "@/integrations/supabase/types";

export type DbProduct = Tables<'products'>;
export type DbPack = Tables<'packs'>;
export type DbPackItem = Tables<'pack_items'>;
export type DbOrder = Tables<'orders'>;
export type DbOrderItem = Tables<'order_items'>;
export type DbClient = Tables<'clients'>;
export type DbPromo = Tables<'promos'>;

export interface PackWithItems extends DbPack {
  pack_items: DbPackItem[];
}

export interface OrderWithItems extends DbOrder {
  order_items: DbOrderItem[];
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-DZ").format(price) + " DZD";
}

/**
 * Proxy external (non-Supabase) images through wsrv.nl — a free Cloudflare-backed
 * CDN that resizes on the fly, converts to WebP, and caches globally. This fixes
 * slow loads from origins like ostrovit.com.
 */
function proxyExternal(url: string, width?: number): string {
  if (!width) return url;
  const u = url.replace(/^https?:\/\//, "");
  return `https://wsrv.nl/?url=${encodeURIComponent(u)}&w=${width}&output=webp&q=80&we`;
}

export function getStorageUrl(path: string | null, width?: number): string {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) {
    // Supabase-hosted: use native render endpoint
    if (path.includes("/storage/v1/object/public/product-images/")) {
      if (!width) return path;
      const filePath = path.split("/storage/v1/object/public/product-images/")[1];
      return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/render/image/public/product-images/${filePath}?width=${width}&resize=contain`;
    }
    // External origin: proxy through wsrv.nl for resize + WebP + CDN caching
    return proxyExternal(path, width);
  }
  if (width) {
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/render/image/public/product-images/${path}?width=${width}&resize=contain`;
  }
  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
}

/**
 * Build a responsive srcset string for product images.
 * Returns undefined when the image is external (non-Supabase) and cannot be resized.
 */
export function getStorageSrcSet(
  path: string | null,
  widths: number[] = [200, 400, 600, 800]
): string | undefined {
  if (!path) return undefined;
  // External non-Supabase URLs are now also resizable via wsrv.nl proxy
  return widths
    .map((w) => `${getStorageUrl(path, w)} ${w}w`)
    .join(", ");
}
