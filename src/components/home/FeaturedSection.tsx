import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getStorageUrl, formatPrice, type DbProduct } from "@/types/database";
import { Link } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Star, ShoppingCart, TrendingUp } from "lucide-react";
import { toast } from "sonner";

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
  const [products, setProducts] = useState<DbProduct[]>([]);
  const { t } = useLang();

  useEffect(() => {
    let query = supabase.from("products").select("*").eq("in_stock", true);

    if (type === "top") query = query.eq("is_top_sale", true);
    else if (type === "promo") query = query.eq("is_promo", true);
    else if (type === "new") query = query.order("created_at", { ascending: false });
    else if (type === "category" && category) query = query.eq("category", category);

    query.limit(limit).then(({ data }) => setProducts(data || []));
  }, [type, category, limit]);

  if (products.length === 0) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            {icon && <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{icon}</div>}
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">{title}</h2>
              {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <Link
            to={category ? `/catalogue?cat=${category}` : "/catalogue"}
            className="text-sm font-medium text-primary hover:underline hidden sm:block"
          >
            Voir tout →
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((p, i) => {
            const discount = p.old_price ? Math.round(((p.old_price - p.price) / p.old_price) * 100) : 0;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/produit/${p.id}`}
                  className="group block rounded-2xl border border-border bg-card overflow-hidden card-hover relative"
                >
                  {/* Badges */}
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    {p.is_top_sale && (
                      <span className="badge-top flex items-center gap-1">
                        <TrendingUp size={10} /> Top
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="badge-promo">-{discount}%</span>
                    )}
                  </div>

                  {/* Image */}
                  <div className="aspect-square bg-secondary/30 overflow-hidden relative">
                    <img
                      src={getStorageUrl(p.image_url)}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* View product overlay */}
                    <div className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-lg">
                      <ShoppingCart size={14} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 md:p-4">
                    {p.objectives && p.objectives.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {p.objectives.slice(0, 2).map(obj => (
                          <span key={obj} className="badge-category">{obj}</span>
                        ))}
                      </div>
                    )}
                    <h3 className="font-heading font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem] text-foreground">
                      {p.name}
                    </h3>
                    {p.rating && p.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star size={12} className="fill-accent text-accent" />
                        <span className="text-xs font-medium text-foreground">{p.rating}</span>
                        <span className="text-[10px] text-muted-foreground">({p.reviews_count})</span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-heading font-bold text-accent text-base md:text-lg">
                        {formatPrice(p.price)}
                      </span>
                      {p.old_price && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(p.old_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <Link
          to={category ? `/catalogue?cat=${category}` : "/catalogue"}
          className="mt-6 mx-auto block w-fit text-sm font-medium text-primary hover:underline sm:hidden"
        >
          Voir tout →
        </Link>
      </div>
    </section>
  );
}
