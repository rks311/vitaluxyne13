import { useParams, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { ShoppingCart, Star, ChevronLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/ProductCard";
import { formatPrice, getStorageUrl, type DbProduct } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { t } = useLang();
  const [product, setProduct] = useState<DbProduct | null>(null);
  const [similar, setSimilar] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await supabase.from("products").select("*").eq("id", id!).single();
      setProduct(data);
      if (data) {
        const { data: sim } = await supabase.from("products").select("*").eq("category", data.category).neq("id", data.id).limit(4);
        setSimilar(sim || []);
      }
      setLoading(false);
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="container py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground mb-4">{t("product.notFound")}</p>
        <Link to="/catalogue" className="text-primary hover:underline">{t("product.backToCatalog")}</Link>
      </div>
    );
  }

  const flavors = product.flavors || [];
  const weights = product.weights || [];
  const flavor = selectedFlavor || flavors[0] || "Nature";
  const weight = selectedWeight || weights[0] || "";
  const nutritionFacts = (product.nutrition_facts as any[] || []);

  return (
    <div className="container py-4 md:py-8 min-h-screen">
      <Link to="/catalogue" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
        <ChevronLeft size={16} /> {t("product.back")}
      </Link>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="aspect-square rounded-lg overflow-hidden bg-card border border-border">
          <img src={getStorageUrl(product.image_url)} alt={product.name} className="w-full h-full object-cover" />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <div className="flex gap-2 mb-2">
            {product.is_top_sale && <span className="badge-top">🔥 Top</span>}
            {product.is_promo && <span className="badge-promo">Promo</span>}
          </div>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <h1 className="font-heading text-2xl md:text-3xl font-bold mt-1 mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < Math.round(product.rating || 0) ? "fill-primary text-primary" : "text-muted"} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviews_count || 0} {t("product.reviews")})</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="price-tag text-3xl">{formatPrice(product.price)}</span>
            {product.old_price && <span className="text-lg text-muted-foreground line-through">{formatPrice(product.old_price)}</span>}
          </div>

          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

          {flavors.length > 0 && (
            <div className="mb-4">
              <label className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2 block">{t("product.flavor")}</label>
              <div className="flex flex-wrap gap-2">
                {flavors.map((f) => (
                  <button key={f} onClick={() => setSelectedFlavor(f)} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${flavor === f ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>{f}</button>
                ))}
              </div>
            </div>
          )}

          {weights.length > 0 && (
            <div className="mb-4">
              <label className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2 block">{t("product.weight")}</label>
              <div className="flex flex-wrap gap-2">
                {weights.map((w) => (
                  <button key={w} onClick={() => setSelectedWeight(w)} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${weight === w ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>{w}</button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2 block">{t("product.quantity")}</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center font-bold hover:bg-muted">-</button>
              <span className="font-medium text-lg w-8 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center font-bold hover:bg-muted">+</button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm mb-6">
            {product.in_stock ? (
              <><Check size={14} className="text-primary" /><span className="text-primary font-medium">{t("product.inStock")}</span></>
            ) : (
              <span className="text-destructive font-medium">{t("product.outOfStock")}</span>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={() => addItem(product, flavor, weight, qty)} disabled={!product.in_stock} className="flex-1 h-12 font-heading text-base gradient-primary text-primary-foreground hover:opacity-90 neon-glow">
              <ShoppingCart size={18} className="me-2" /> {t("product.addToCart")}
            </Button>
          </div>

          {nutritionFacts.length > 0 && (
            <div className="mt-8 p-4 rounded-lg bg-card border border-border">
              <h3 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wider">{t("product.nutrition")}</h3>
              <div className="space-y-2">
                {nutritionFacts.map((fact: any) => (
                  <div key={fact.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{fact.label}</span>
                    <span className="font-medium">{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {similar.length > 0 && (
        <div className="mt-12 md:mt-16">
          <h2 className="font-heading text-xl md:text-2xl font-bold mb-6">{t("product.similar")} <span className="text-primary">{t("product.similarHighlight")}</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {similar.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}
