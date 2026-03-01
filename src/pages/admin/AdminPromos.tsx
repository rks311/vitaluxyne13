import { Tags, Plus, Edit, Trash2, Calendar, Percent } from "lucide-react";
import { formatPrice } from "@/data/products";
import { motion } from "framer-motion";

const promos = [
  { id: "1", name: "Promo Ramadan", discount: 15, type: "percentage", products: 4, startDate: "2026-03-01", endDate: "2026-03-30", active: true },
  { id: "2", name: "Flash Sale Weekend", discount: 20, type: "percentage", products: 2, startDate: "2026-03-07", endDate: "2026-03-09", active: true },
  { id: "3", name: "Nouveau Client", discount: 500, type: "fixed", products: 8, startDate: "2026-01-01", endDate: "2026-12-31", active: false },
];

export default function AdminPromos() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Gérez vos promotions et codes promo</p>
        <button className="h-10 px-4 rounded-md gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Nouvelle promo
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos.map((promo, i) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Tags size={16} className="text-primary" />
                </div>
                <h3 className="font-heading font-bold text-sm">{promo.name}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${promo.active ? "bg-emerald-500/10 text-emerald-400" : "bg-secondary text-muted-foreground"}`}>
                {promo.active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Percent size={14} className="text-primary" />
                <span className="font-heading font-bold text-lg">
                  {promo.type === "percentage" ? `-${promo.discount}%` : `-${formatPrice(promo.discount)}`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar size={12} />
                {promo.startDate} → {promo.endDate}
              </div>
              <p className="text-xs text-muted-foreground">{promo.products} produits concernés</p>
            </div>

            <div className="flex items-center justify-end gap-1 pt-3 border-t border-border">
              <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                <Edit size={14} />
              </button>
              <button className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
