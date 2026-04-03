import { useRef, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { getStorageUrl, formatPrice, type DbProduct } from "@/types/database";
import { Link } from "react-router-dom";
import { Star, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

type SectionType = "top" | "promo" | "new" | "category";

interface FeaturedSectionProps {
  type: SectionType;
  category?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  limit?: number;
}

export default function FeaturedSection({ type, category, title, subtitle, icon, limit = 8 }: FeaturedSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const skeletonCount = Math.min(limit, 4);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["featured", type, category, limit],
    queryFn: async () => {
      let query = supabase.from("products").select("id,name,brand,category,price,old_price,image_url,rating,reviews_count,is_promo,is_top_sale,in_stock,stock_qty").eq("in_stock", true);
      if (type === "top") query = query.eq("is_top_sale", true);
      else if (type === "promo") query = query.eq("is_promo", true);
      else if (type === "new") query = query.order("created_at", { ascending: false });
      else if (type === "category" && category) query = query.eq("category", category);
      const { data } = await query.limit(limit);
      return (data as DbProduct[]) || [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });
  };

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="py-6 md:py-10" aria-label={title}>
      <div className="container">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2.5">
            {icon && <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0" aria-hidden="true">{icon}</div>}
            <div>
              <h2 className="font-heading text-base md:text-xl font-bold text-foreground leading-tight">{title}</h2>
              {subtitle && <p className="text-[11px] md:text-sm text-muted-foreground mt-0.5 hidden sm:block">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => scroll("left")} aria-label="Défiler à gauche" className="w-7 h-7 rounded-full border border-border items-center justify-center text-muted-foreground hover:text-primary transition-colors hidden md:flex">
              <ChevronLeft size={14} aria-hidden="true" />
            </button>
            <button onClick={() => scroll("right")} aria-label="Défiler à droite" className="w-7 h-7 rounded-full border border-border items-center justify-center text-muted-foreground hover:text-primary transition-colors hidden md:flex">
              <ChevronRight size={14} aria-hidden="true" />
            </button>
            <Link to={category ? `/catalogue?cat=${category}` : "/catalogue"} className="text-xs font-medium text-primary hover:underline whitespace-nowrap">
              Voir tout →
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible"
          role="list"
        >
          {products.map((p) => {
            const discount = p.old_price ? Math.round(((p.old_price - p.price) / p.old_price) * 100) : 0;
            return (
              <article
                key={p.id}
                role="listitem"
                className="snap-start shrink-0 w-[44vw] sm:w-[42vw] md:w-auto"
              >
                <Link
                  to={`/produit/${p.id}`}
                  className="group block rounded-2xl border border-border bg-card overflow-hidden card-hover relative"
                  aria-label={`${p.name} — ${formatPrice(p.price)}`}
                >
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    {p.is_top_sale && (
                      <span className="badge-top flex items-center gap-0.5 text-[10px]">
                        <TrendingUp size={9} aria-hidden="true" /> Top
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="badge-promo text-[10px]">-{discount}%</span>
                    )}
                  </div>
                  {(p.stock_qty ?? 0) > 0 && (p.stock_qty ?? 0) <= 15 && (
                    <div className="absolute bottom-[calc(100%-2rem)] right-2 z-10">
                      <span className="text-[9px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full border border-destructive/20">
                        Plus que {p.stock_qty}!
                      </span>
                    </div>
                  )}

                  <div className="aspect-square overflow-hidden relative bg-gradient-to-br from-secondary to-mint">
                    <img
                      src={getStorageUrl(p.image_url, 300)}
                      alt={p.name}
                      className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      width={300}
                      height={300}
                    />
                  </div>

                  <div className="p-2.5 md:p-3.5">
                    <h3 className="font-heading font-semibold text-xs md:text-sm leading-tight line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] text-foreground">
                      {p.name}
                    </h3>
                    {p.rating && p.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1" aria-label={`Note: ${Number(p.rating).toFixed(1)} sur 5`}>
                        <Star size={10} className="fill-accent text-accent" aria-hidden="true" />
                        <span className="text-[10px] font-medium text-foreground">{Number(p.rating).toFixed(1)}</span>
                        <span className="text-[9px] text-muted-foreground">({p.reviews_count})</span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="font-heading font-bold text-accent text-sm md:text-base">
                        {formatPrice(p.price)}
                      </span>
                      {p.old_price && (
                        <span className="text-[10px] text-muted-foreground line-through" aria-label={`Ancien prix: ${formatPrice(p.old_price)}`}>
                          {formatPrice(p.old_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
