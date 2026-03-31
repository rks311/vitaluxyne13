import { useParams, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { ShoppingCart, Star, ChevronLeft, Check, Loader2, Truck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/ProductCard";
import OrderForm from "@/components/product/OrderForm";
import UrgencyBadges from "@/components/product/UrgencyBadges";
import ComplementaryProducts from "@/components/product/ComplementaryProducts";
import { formatPrice, getStorageUrl, type DbProduct } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { trackViewContent, trackAddToCart } from "@/lib/metaPixel";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { t } = useLang();
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  const { data: product, isLoading: loading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await supabase.from("products_public").select("*").eq("id", id!).single();
      return (data as unknown as DbProduct) || null;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

  const { data: similar = [] } = useQuery({
    queryKey: ["similar", product?.category, id],
    queryFn: async () => {
      const { data } = await supabase.from("products_public").select("*").eq("category", product!.category).neq("id", id!).limit(4);
      return (data as unknown as DbProduct[]) || [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!product?.category && !!id,
  });

  useEffect(() => {
    setSelectedImageIdx(0);
    setQty(1);
    setActiveTab("description");
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (product) {
      trackViewContent({ id: product.id, name: product.name, price: product.price, category: product.category });
    }
  }, [product]);

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
  const flavor = selectedFlavor || flavors[0] || "";
  const weight = selectedWeight || weights[0] || "";
  const nutritionFacts = (product.nutrition_facts as any[] || []);
  const usageInstructions = (product as any).usage_instructions || "";
  const conseils = (product as any).conseils || "";

  const tabs = [
    { key: "description", label: t("product.description") },
    { key: "usage", label: t("product.usage") },
    { key: "conseils", label: "Conseils" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4 md:py-8">
        <Link to="/catalogue" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ChevronLeft size={16} /> {t("product.back")}
        </Link>

        <div className="grid md:grid-cols-2 gap-6 md:gap-12">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/50 border border-border">
              <img
                src={getStorageUrl(
                  selectedImageIdx === 0
                    ? product.image_url
                    : ((product as any).gallery || [])[selectedImageIdx - 1],
                  600
                )}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                width={600}
                height={600}
              />
            </div>
            {(() => {
              const gallery: string[] = (product as any).gallery || [];
              const allImages = [product.image_url, ...gallery].filter(Boolean);
              if (allImages.length <= 1) return null;
              return (
                <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${selectedImageIdx === idx ? "border-primary" : "border-border hover:border-primary/40"}`}
                    >
                      <img src={getStorageUrl(img, 80)} alt="" className="w-full h-full object-cover" loading="lazy" width={64} height={64} />
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex gap-2 mb-2">
              {product.is_top_sale && <span className="badge-top">⭐ Populaire</span>}
              {product.is_promo && <span className="badge-promo">Promo</span>}
            </div>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h1 className="font-heading text-2xl md:text-3xl font-bold mt-1 mb-3 text-foreground">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(product.rating || 0) ? "fill-accent text-accent" : "text-muted"} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.reviews_count || 0} {t("product.reviews")})</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-heading font-bold text-3xl text-accent">{formatPrice(product.price)}</span>
              {product.old_price && <span className="text-lg text-muted-foreground line-through">{formatPrice(product.old_price)}</span>}
            </div>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

            {flavors.length > 0 && (
              <div className="mb-4">
                <label className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2 block">{t("product.flavor")}</label>
                <div className="flex flex-wrap gap-2">
                  {flavors.map((f) => (
                    <button key={f} onClick={() => setSelectedFlavor(f)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${flavor === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>{f}</button>
                  ))}
                </div>
              </div>
            )}

            {weights.length > 0 && (
              <div className="mb-4">
                <label className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2 block">{t("product.weight")}</label>
                <div className="flex flex-wrap gap-2">
                  {weights.map((w) => (
                    <button key={w} onClick={() => setSelectedWeight(w)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${weight === w ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>{w}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2 block">{t("product.quantity")}</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center font-bold hover:bg-muted transition-colors">-</button>
                <span className="font-medium text-lg w-8 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center font-bold hover:bg-muted transition-colors">+</button>
              </div>
            </div>

            <UrgencyBadges product={product} />

            <div className="flex items-center gap-1.5 text-sm mb-6">
              {product.in_stock ? (
                <><Check size={14} className="text-primary" /><span className="text-primary font-medium">{t("product.inStock")}</span></>
              ) : (
                <span className="text-destructive font-medium">{t("product.outOfStock")}</span>
              )}
            </div>

            <div className="flex gap-3 mb-6">
              <Button
                onClick={() => setShowOrderForm(true)}
                disabled={!product.in_stock}
                className="flex-1 h-12 font-heading text-base bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20"
              >
                {t("product.orderNow")}
              </Button>
              <Button
                onClick={() => {
                  addItem(product, flavor, weight, qty);
                  trackAddToCart({ id: product.id, name: product.name, price: product.price }, qty);
                }}
                disabled={!product.in_stock}
                variant="outline"
                className="h-12 px-4 rounded-xl border-primary text-primary hover:bg-primary/5"
              >
                <ShoppingCart size={18} />
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Truck size={16} className="text-primary" />
                <span>{t("product.trustCod")}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone size={16} className="text-primary" />
                <span>{t("product.trustAdvice")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10 md:mt-16">
          <div className="flex gap-1 border-b border-border overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-heading font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.key ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="py-6">
            {activeTab === "description" && (
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>{product.description || "Description à venir."}</p>
                {nutritionFacts.length > 0 && (
                  <div className="mt-6 p-4 rounded-xl bg-card border border-border">
                    <h3 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wider text-foreground">{t("product.nutrition")}</h3>
                    <div className="space-y-2">
                      {nutritionFacts.map((fact: any) => (
                        <div key={fact.label} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{fact.label}</span>
                          <span className="font-medium text-foreground">{fact.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "usage" && (
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {usageInstructions ? (
                  <p className="whitespace-pre-line">{usageInstructions}</p>
                ) : (
                  <p>Mode d'emploi : consultez les recommandations sur l'emballage ou contactez notre équipe pour des conseils personnalisés.</p>
                )}
              </div>
            )}
            {activeTab === "conseils" && (
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {conseils ? (
                  <p className="whitespace-pre-line">{conseils}</p>
                ) : (
                  <p>Nos conseillers sont disponibles pour vous guider. Contactez-nous sur Messenger pour des conseils personnalisés.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Complementary products */}
        <ComplementaryProducts product={product} />

        {/* Similar products */}
        {similar.length > 0 && (
          <div className="mt-10 md:mt-14">
            <h2 className="font-heading text-base md:text-xl font-bold mb-4 text-foreground">{t("product.similar")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {similar.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>

      {/* Order Form Slide-over */}
      <AnimatePresence>
        {showOrderForm && product && (
          <OrderForm product={product} quantity={qty} onClose={() => setShowOrderForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
