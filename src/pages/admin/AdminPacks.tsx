import { Plus, Edit, Trash2, Boxes } from "lucide-react";
import { formatPrice } from "@/data/products";
import { motion } from "framer-motion";

const packs = [
  {
    id: "1",
    name: "Pack Masse Extrême",
    description: "Whey + Gainer + Créatine",
    products: ["Gold Standard Whey", "Serious Mass", "Creatine Monohydrate"],
    price: 17500,
    oldPrice: 19200,
    active: true,
  },
  {
    id: "2",
    name: "Pack Sèche Pro",
    description: "Isolate + Fat Burner + BCAA",
    products: ["ISO100 Hydrolyzed", "Hydroxycut Hardcore", "BCAA Energy"],
    price: 19000,
    oldPrice: 20500,
    active: true,
  },
  {
    id: "3",
    name: "Pack Débutant",
    description: "Whey + Créatine",
    products: ["Impact Whey Protein", "Creatine Monohydrate"],
    price: 9200,
    oldPrice: 9700,
    active: false,
  },
];

export default function AdminPacks() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Gérez les packs visibles côté client</p>
        <button className="h-10 px-4 rounded-md gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Créer un pack
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packs.map((pack, i) => (
          <motion.div
            key={pack.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-xl p-5 flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Boxes size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm">{pack.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{pack.description}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${pack.active ? "bg-emerald-500/10 text-emerald-400" : "bg-secondary text-muted-foreground"}`}>
                {pack.active ? "Actif" : "Inactif"}
              </span>
            </div>

            <div className="flex-1 space-y-1.5 mb-4">
              {pack.products.map((p) => (
                <div key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  {p}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div>
                <span className="font-heading font-bold text-primary text-lg">{formatPrice(pack.price)}</span>
                {pack.oldPrice && (
                  <span className="text-xs text-muted-foreground line-through ml-2">{formatPrice(pack.oldPrice)}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                  <Edit size={14} />
                </button>
                <button className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
