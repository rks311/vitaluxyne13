import { Package, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { products, formatPrice } from "@/data/products";
import { useProductImage } from "@/hooks/useProductImage";
import { motion } from "framer-motion";
import { useState } from "react";

function ProductImage({ imageKey }: { imageKey: string }) {
  const src = useProductImage(imageKey);
  return <img src={src} alt="" className="w-10 h-10 rounded-md object-cover" />;
}

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full h-10 rounded-md bg-card border border-border pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            maxLength={100}
          />
        </div>
        <button className="h-10 px-4 rounded-md gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left px-4 py-3 font-medium">Produit</th>
                <th className="text-left px-3 py-3 font-medium hidden md:table-cell">Marque</th>
                <th className="text-left px-3 py-3 font-medium">Prix</th>
                <th className="text-left px-3 py-3 font-medium hidden md:table-cell">Stock</th>
                <th className="text-left px-3 py-3 font-medium hidden lg:table-cell">Catégorie</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProductImage imageKey={p.image} />
                      <div>
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground md:hidden">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground hidden md:table-cell">{p.brand}</td>
                  <td className="px-3 py-3">
                    <span className="font-heading font-bold text-primary">{formatPrice(p.price)}</span>
                    {p.oldPrice && (
                      <span className="text-[10px] text-muted-foreground line-through ml-1">{formatPrice(p.oldPrice)}</span>
                    )}
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${p.inStock ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {p.inStock ? "En stock" : "Rupture"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground text-xs hidden lg:table-cell capitalize">{p.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                        <Edit size={14} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
