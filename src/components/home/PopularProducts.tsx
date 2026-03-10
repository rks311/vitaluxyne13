import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { DbProduct } from "@/types/database";
import ProductCard from "@/components/product/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";

export default function PopularProducts() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const { t } = useLang();

  useEffect(() => {
    supabase.from("products").select("*").eq("is_top_sale", true).limit(4)
      .then(({ data }) => setProducts(data || []));
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="container py-10 md:py-16">
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-lg md:text-2xl font-bold">{t("popular.title")} <span className="text-primary">{t("popular.highlight")}</span></h2>
            <p className="text-[10px] md:text-xs text-muted-foreground">{t("popular.sub")}</p>
          </div>
        </div>
        <Link to="/catalogue" className="text-xs text-primary flex items-center gap-1 hover:underline font-medium">
          {t("popular.viewAll")} <ArrowRight size={12} />
        </Link>
      </motion.div>

      <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
        {products.map((product, i) => (
          <div key={product.id} className="snap-start shrink-0 w-[160px] md:w-auto">
            <ProductCard product={product} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
