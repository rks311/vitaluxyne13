import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { DbProduct } from "@/types/database";
import ProductCard from "@/components/product/ProductCard";
import { SlidersHorizontal, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";

const categories = [
  { id: "whey", label: "Whey Protein", icon: "💪" },
  { id: "creatine", label: "Créatine", icon: "⚡" },
  { id: "gainer", label: "Gainer", icon: "🏋️" },
  { id: "preworkout", label: "Pre-Workout", icon: "🔥" },
  { id: "bcaa", label: "BCAA", icon: "💊" },
  { id: "fatburner", label: "Fat Burner", icon: "🔥" },
];

const objectivesList = ["Prise de masse", "Sèche", "Endurance", "Force", "Récupération"];

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("cat") || "";
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedObjective, setSelectedObjective] = useState("");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedObjective && !(p.objectives || []).includes(selectedObjective)) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, selectedCategory, selectedObjective, search]);

  const clearFilters = () => { setSelectedCategory(""); setSelectedObjective(""); setSearch(""); };
  const hasFilters = selectedCategory || selectedObjective || search;

  if (loading) {
    return <div className="container py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  return (
    <div className="container py-6 md:py-10 min-h-screen">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-6">{t("catalog.title")} <span className="text-primary">{t("catalog.highlight")}</span></h1>

      <div className="flex gap-2 mb-4">
        <input type="text" placeholder={t("catalog.search")} value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 h-10 rounded-md bg-card border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground" />
        <button onClick={() => setShowFilters(!showFilters)} className={`h-10 px-3 rounded-md border flex items-center gap-1.5 text-sm ${showFilters ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
          <SlidersHorizontal size={16} /> {t("catalog.filters")}
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
            <div className="bg-card border border-border rounded-lg p-4 space-y-4">
              <div>
                <label className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2 block">{t("catalog.category")}</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button key={cat.id} onClick={() => setSelectedCategory(selectedCategory === cat.id ? "" : cat.id)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${selectedCategory === cat.id ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2 block">{t("catalog.objective")}</label>
                <div className="flex flex-wrap gap-2">
                  {objectivesList.map((obj) => (
                    <button key={obj} onClick={() => setSelectedObjective(selectedObjective === obj ? "" : obj)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${selectedObjective === obj ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
                      {obj}
                    </button>
                  ))}
                </div>
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-primary flex items-center gap-1 hover:underline">
                  <X size={12} /> {t("catalog.clearFilters")}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-sm text-muted-foreground mb-4">{filtered.length} {t("catalog.results")}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg mb-2">{t("catalog.noResults")}</p>
          <button onClick={clearFilters} className="text-primary hover:underline text-sm">{t("catalog.clearFilters")}</button>
        </div>
      )}
    </div>
  );
}
