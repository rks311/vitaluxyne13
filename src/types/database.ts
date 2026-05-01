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

export function getStorageUrl(path: string | null, width?: number): string {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) {
    // For existing full Supabase URLs, use render endpoint for resizing
    if (width && path.includes("/storage/v1/object/public/product-images/")) {
      const filePath = path.split("/storage/v1/object/public/product-images/")[1];
      return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/render/image/public/product-images/${filePath}?width=${width}&resize=contain`;
    }
    return path;
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
  const isExternalNonSupabase =
    path.startsWith("http") &&
    !path.includes("/storage/v1/object/public/product-images/");
  if (isExternalNonSupabase) return undefined;
  return widths
    .map((w) => `${getStorageUrl(path, w)} ${w}w`)
    .join(", ");
}
