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

export function getStorageUrl(path: string | null): string {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
}
