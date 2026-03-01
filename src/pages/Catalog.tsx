import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products, categories, brands, objectives } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("cat") || "";
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedObjective, setSelectedObjective] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedObjective && !p.objective.includes(selectedObjective)) return false;
      if (selectedBrand && p.brand !== selectedBrand) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [selectedCategory, selectedObjective, selectedBrand, search]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedObjective("");
    setSelectedBrand("");
    setSearch("");
  };

  const hasFilters = selectedCategory || selectedObjective || selectedBrand || search;

  return (
    <div className="container py-6 md:py-10 min-h-screen">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-6">
        NOTRE <span className="text-primary">CATALOGUE</span>
      </h1>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 h-10 rounded-md bg-card border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`h-10 px-3 rounded-md border flex items-center gap-1.5 text-sm ${showFilters ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
        >
          <SlidersHorizontal size={16} /> Filtres
        </button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-card border border-border rounded-lg p-4 space-y-4">
              {/* Categories */}
              <div>
                <label className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2 block">Catégorie</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? "" : cat.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        selectedCategory === cat.id
                          ? "gradient-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-muted"
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Objectives */}
              <div>
                <label className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2 block">Objectif</label>
                <div className="flex flex-wrap gap-2">
                  {objectives.map((obj) => (
                    <button
                      key={obj}
                      onClick={() => setSelectedObjective(selectedObjective === obj ? "" : obj)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        selectedObjective === obj
                          ? "gradient-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-muted"
                      }`}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <label className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2 block">Marque</label>
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(selectedBrand === brand ? "" : brand)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        selectedBrand === brand
                          ? "gradient-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-muted"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-primary flex items-center gap-1 hover:underline">
                  <X size={12} /> Effacer les filtres
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <p className="text-sm text-muted-foreground mb-4">{filtered.length} produit(s) trouvé(s)</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg mb-2">Aucun produit trouvé</p>
          <button onClick={clearFilters} className="text-primary hover:underline text-sm">Effacer les filtres</button>
        </div>
      )}
    </div>
  );
}
