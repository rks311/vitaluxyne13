import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/context/LanguageContext";
import ProductCard from "@/components/product/ProductCard";
import { Loader2, Search } from "lucide-react";
import type { DbProduct } from "@/types/database";

const categoryList = [
  { key: "all", label: "catalog.all" },
  { key: "beaute", label: "cat.beaute" },
  { key: "cerveau", label: "cat.cerveau" },
  { key: "stress", label: "cat.stress" },
  { key: "muscles", label: "cat.muscles" },
  { key: "os", label: "cat.os" },
  { key: "coeur", label: "cat.coeur" },
  { key: "immunite", label: "cat.immunite" },
  { key: "hormones", label: "cat.hormones" },
  { key: "perte-de-poids", label: "cat.perte" },
  { key: "autre", label: "cat.autre" },
];

type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

export default function Catalog() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const { t } = useLang();

  const activeCategory = searchParams.get("cat") || "all";

  useEffect(() => {
    supabase.from("products").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setProducts(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = products;

    if (activeCategory !== "all") {
      result = result.filter(p => p.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }

    switch (sort) {
      case "price-asc": result = [...result].sort((a, b) => a.price - b.price); break;
      case "price-desc": result = [...result].sort((a, b) => b.price - a.price); break;
      case "popular": result = [...result].sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0)); break;
      default: break;
    }

    return result;
  }, [products, activeCategory, search, sort]);

  const setCategory = (cat: string) => {
    if (cat === "all") {
      searchParams.delete("cat");
    } else {
      searchParams.set("cat", cat);
    }
    setSearchParams(searchParams);
  };

  if (loading) return <div className="container py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-10">
        <div className="mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t("catalog.title")}</h1>
          <div className="w-12 h-1 bg-accent mt-2 rounded-full" />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-6 -mx-1 px-1">
          {categoryList.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(cat.label)}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("catalog.search")}
              className="w-full h-11 rounded-xl bg-card border border-border pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              maxLength={100}
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-11 rounded-xl bg-card border border-border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="newest">{t("catalog.sortNewest")}</option>
            <option value="price-asc">{t("catalog.sortPriceAsc")}</option>
            <option value="price-desc">{t("catalog.sortPriceDesc")}</option>
            <option value="popular">{t("catalog.sortPopular")}</option>
          </select>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{filtered.length} {t("catalog.results")}</p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-heading text-lg font-semibold text-foreground mb-2">{t("catalog.noResults")}</p>
            <p className="text-sm text-muted-foreground">Essayez une autre catégorie ou un autre terme de recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}
