import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { DbProduct } from "@/types/database";
import ProductCard from "@/components/product/ProductCard";
import { Search, X, Loader2, SlidersHorizontal, ChevronDown, Grid3X3, LayoutGrid, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";

const categories = [
  { id: "", label: "Tous", labelAr: "الكل", icon: "🔥" },
  { id: "whey", label: "Whey Protein", labelAr: "واي بروتين", icon: "💪" },
  { id: "creatine", label: "Créatine", labelAr: "كرياتين", icon: "⚡" },
  { id: "gainer", label: "Gainer", labelAr: "غينر", icon: "🏋️" },
  { id: "preworkout", label: "Pre-Workout", labelAr: "بري وورك آوت", icon: "🔥" },
  { id: "bcaa", label: "BCAA", labelAr: "بي سي أي أي", icon: "💊" },
  { id: "fatburner", label: "Fat Burner", labelAr: "حارق الدهون", icon: "🔥" },
];

const objectivesList = ["Prise de masse", "Sèche", "Endurance", "Force", "Récupération"];

type SortOption = "newest" | "price-asc" | "price-desc" | "popular" | "name";

const sortLabels: Record<SortOption, { fr: string; ar: string }> = {
  newest: { fr: "Nouveautés", ar: "الأحدث" },
  "price-asc": { fr: "Prix croissant", ar: "السعر: الأقل" },
  "price-desc": { fr: "Prix décroissant", ar: "السعر: الأعلى" },
  popular: { fr: "Populaire", ar: "الأكثر شعبية" },
  name: { fr: "Nom A-Z", ar: "الاسم أ-ي" },
};

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("cat") || "";
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedObjective, setSelectedObjective] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const { t, lang } = useLang();
  const tabsRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSortDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCategoryChange = useCallback((catId: string) => {
    setSelectedCategory(catId);
    if (catId) {
      setSearchParams({ cat: catId });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

  // Count products per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { "": products.length };
    categories.forEach(c => { if (c.id) counts[c.id] = 0; });
    products.forEach(p => { if (counts[p.category] !== undefined) counts[p.category]++; });
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedObjective && !(p.objectives || []).includes(selectedObjective)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    // Sort
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "popular": result.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0)); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break; // newest - already ordered by created_at desc
    }

    return result;
  }, [products, selectedCategory, selectedObjective, search, sortBy]);

  const clearFilters = () => { setSelectedCategory(""); setSelectedObjective(""); setSearch(""); setSearchParams({}); };
  const hasFilters = selectedCategory || selectedObjective || search;

  if (loading) {
    return (
      <div className="container py-20 flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm text-muted-foreground">{lang === "ar" ? "جاري التحميل..." : "Chargement..."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <div className="bg-gradient-to-b from-secondary/50 to-background border-b border-border">
        <div className="container py-8 md:py-12">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 font-heading">
              {lang === "ar" ? "تسوق حسب الفئة" : "SHOP BY CATEGORY"}
            </p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold">
              {t("catalog.title")} <span className="text-primary">{t("catalog.highlight")}</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              {lang === "ar" ? "اكتشف مجموعتنا الكاملة من المكملات الغذائية الأصلية" : "Découvrez notre gamme complète de suppléments sportifs 100% originaux"}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Sticky category tabs */}
      <div className="sticky top-[64px] z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container">
          <div ref={tabsRef} className="flex gap-1 overflow-x-auto scrollbar-hide py-3 -mx-1 px-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0
                    ${isActive
                      ? "gradient-primary text-primary-foreground shadow-md"
                      : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{lang === "ar" ? cat.labelAr : cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-primary-foreground/20" : "bg-muted"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Search + Sort + View toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("catalog.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 rounded-xl bg-card border border-border pl-9 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 placeholder:text-muted-foreground transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {/* Objectives filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-10 px-3 rounded-xl border flex items-center gap-1.5 text-sm transition-all ${showFilters ? "border-primary/50 text-primary bg-primary/5" : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}
            >
              <SlidersHorizontal size={15} />
              <span className="hidden sm:inline">{t("catalog.filters")}</span>
              {selectedObjective && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>

            {/* Sort dropdown */}
            <div ref={sortRef} className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="h-10 px-3 rounded-xl border border-border text-sm flex items-center gap-1.5 text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
              >
                <ArrowUpDown size={14} />
                <span className="hidden sm:inline">{sortLabels[sortBy][lang]}</span>
                <ChevronDown size={12} className={`transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-12 bg-card border border-border rounded-xl shadow-xl py-1 min-w-[180px] z-40"
                  >
                    {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => { setSortBy(key); setShowSortDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === key ? "text-primary bg-primary/5 font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
                      >
                        {sortLabels[key][lang]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Grid toggle (desktop) */}
            <div className="hidden lg:flex border border-border rounded-xl overflow-hidden">
              <button onClick={() => setGridCols(3)} className={`h-10 w-10 flex items-center justify-center transition-colors ${gridCols === 3 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setGridCols(4)} className={`h-10 w-10 flex items-center justify-center transition-colors ${gridCols === 4 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                <Grid3X3 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Objectives filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-5"
            >
              <div className="bg-card border border-border rounded-xl p-4">
                <label className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-3 block">
                  {t("catalog.objective")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {objectivesList.map((obj) => (
                    <button
                      key={obj}
                      onClick={() => setSelectedObjective(selectedObjective === obj ? "" : obj)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedObjective === obj
                          ? "gradient-primary text-primary-foreground shadow-sm"
                          : "bg-secondary text-secondary-foreground hover:bg-muted"
                      }`}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filters + results count */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm text-muted-foreground">
              <span className="font-heading font-bold text-foreground">{filtered.length}</span> {t("catalog.results")}
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-primary flex items-center gap-1 hover:underline ml-2">
                <X size={12} /> {t("catalog.clearFilters")}
              </button>
            )}
          </div>
        </div>

        {/* Product grid */}
        <motion.div
          layout
          className={`grid grid-cols-2 md:grid-cols-3 ${gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-3 md:gap-4`}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
              >
                <ProductCard product={product} index={0} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-muted-foreground" />
            </div>
            <p className="text-lg font-heading font-bold mb-1">{t("catalog.noResults")}</p>
            <p className="text-sm text-muted-foreground mb-4">
              {lang === "ar" ? "جرّب كلمات بحث أخرى أو غيّر الفلاتر" : "Essayez d'autres mots-clés ou modifiez vos filtres"}
            </p>
            <button onClick={clearFilters} className="text-primary hover:underline text-sm font-medium">{t("catalog.clearFilters")}</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
