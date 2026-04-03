import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/context/LanguageContext";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import { Search } from "lucide-react";
import type { DbProduct } from "@/types/database";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 20;

const categoryList = [
  { key: "all", label: "catalog.all" },
  { key: "immunite", label: "cat.immunite" },
  { key: "stress", label: "cat.stress" },
  { key: "energie", label: "cat.energie" },
  { key: "cerveau", label: "cat.cerveau" },
  { key: "beaute", label: "cat.beaute" },
  { key: "muscles", label: "cat.muscles" },
  { key: "os", label: "cat.os" },
  { key: "coeur", label: "cat.coeur" },
  { key: "hormones", label: "cat.hormones" },
  { key: "perte-de-poids", label: "cat.perte" },
  { key: "antioxydants", label: "cat.antioxydants" },
  { key: "detox", label: "cat.detox" },
  { key: "digestion", label: "cat.digestion" },
  { key: "multivitamines", label: "cat.multivitamines" },
];

type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

const Catalog = React.forwardRef<HTMLDivElement>(function Catalog(_, ref) {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const { t } = useLang();

  const activeCategory = searchParams.get("cat") || "all";

  const fetchProducts = useCallback(async (offset: number, append: boolean) => {
    if (append) setLoadingMore(true); else setLoading(true);
    
    let query = supabase.from("products")
      .select("id,name,brand,category,price,old_price,image_url,rating,reviews_count,is_promo,is_top_sale,in_stock,stock_qty")
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (activeCategory !== "all") {
      query = query.eq("category", activeCategory);
    }

    const { data } = await query;
    const newProducts = (data || []) as DbProduct[];
    
    if (append) {
      setProducts(prev => [...prev, ...newProducts]);
    } else {
      setProducts(newProducts);
    }
    setHasMore(newProducts.length === PAGE_SIZE);
    setLoading(false);
    setLoadingMore(false);
  }, [activeCategory]);

  useEffect(() => {
    setHasMore(true);
    fetchProducts(0, false);
  }, [fetchProducts]);

  const loadMore = () => {
    fetchProducts(products.length, true);
  };

  const filtered = useMemo(() => {
    let result = products;

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
  }, [products, search, sort]);

  const setCategory = (cat: string) => {
    if (cat === "all") {
      searchParams.delete("cat");
    } else {
      searchParams.set("cat", cat);
    }
    setSearchParams(searchParams);
  };

  if (loading) return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-10">
        <div className="mb-8"><div className="h-8 w-48 bg-muted animate-pulse rounded" /></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );

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
              aria-label={t("catalog.search")}
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-11 rounded-xl bg-card border border-border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label="Trier les produits"
          >
            <option value="newest">{t("catalog.sortNewest")}</option>
            <option value="price-asc">{t("catalog.sortPriceAsc")}</option>
            <option value="price-desc">{t("catalog.sortPriceDesc")}</option>
            <option value="popular">{t("catalog.sortPopular")}</option>
          </select>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{filtered.length} {t("catalog.results")}</p>

        {filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
            {hasMore && !search.trim() && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={loadMore}
                  disabled={loadingMore}
                  variant="outline"
                  className="rounded-full px-8"
                >
                  {loadingMore ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                  Voir plus de produits
                </Button>
              </div>
            )}
          </>
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
});

export default Catalog;
