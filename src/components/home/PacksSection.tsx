import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Boxes, ShoppingCart } from "lucide-react";
import { formatPrice, getStorageUrl, type PackWithItems } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLang } from "@/context/LanguageContext";

export default function PacksSection() {
  const [packs, setPacks] = useState<PackWithItems[]>([]);
  const { t } = useLang();

  useEffect(() => {
    supabase.from("packs").select("*, pack_items(*)").eq("active", true)
      .then(({ data }) => setPacks((data as any) || []));
  }, []);

  if (packs.length === 0) return null;

  return (
    <section className="container py-10 md:py-16">
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Boxes size={18} className="text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-lg md:text-2xl font-bold">{t("packs.title")} <span className="text-primary">{t("packs.highlight")}</span></h2>
          <p className="text-[10px] md:text-xs text-muted-foreground">{t("packs.sub")}</p>
        </div>
      </motion.div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
        {packs.map((pack, i) => (
          <motion.div key={pack.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="snap-start shrink-0 w-[280px] md:w-auto bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 group">
            <div className="relative h-32 overflow-hidden bg-muted">
              <img src={getStorageUrl(pack.image_url)} alt={pack.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <h3 className="font-heading font-bold text-base">{pack.name}</h3>
                <p className="text-[10px] text-muted-foreground">{pack.description}</p>
              </div>
              {pack.old_price && (
                <div className="absolute top-3 right-3 badge-promo">-{Math.round((1 - pack.price / pack.old_price) * 100)}%</div>
              )}
            </div>
            <div className="p-4">
              <div className="space-y-2 mb-4">
                {(pack.pack_items || []).map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item.product_name} {item.quantity && item.quantity > 1 ? `x${item.quantity}` : ""}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <span className="font-heading font-bold text-primary text-lg">{formatPrice(pack.price)}</span>
                  {pack.old_price && <span className="text-xs text-muted-foreground line-through ms-2">{formatPrice(pack.old_price)}</span>}
                </div>
                <button onClick={() => toast.info(t("packs.whatsapp"))} className="h-9 px-4 rounded-xl gradient-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity active:scale-95">
                  <ShoppingCart size={14} /> {t("packs.order")}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
