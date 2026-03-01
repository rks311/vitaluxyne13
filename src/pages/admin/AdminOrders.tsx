import { Search, Eye, Truck, Check, X, Clock } from "lucide-react";
import { formatPrice } from "@/data/products";
import { motion } from "framer-motion";
import { useState } from "react";

const orders = [
  { id: "CMD-0847", client: "Karim B.", phone: "0555 12 34 56", wilaya: "Alger", commune: "Bab El Oued", items: 3, total: 12500, status: "Livrée", date: "28 Fév 2026", delivery: "Yalidine - Domicile" },
  { id: "CMD-0846", client: "Sofiane M.", phone: "0661 78 90 12", wilaya: "Oran", commune: "Bir El Djir", items: 1, total: 8500, status: "En cours", date: "28 Fév 2026", delivery: "Yalidine - Point relais" },
  { id: "CMD-0845", client: "Yacine D.", phone: "0550 45 67 89", wilaya: "Constantine", commune: "El Khroub", items: 4, total: 15200, status: "En préparation", date: "27 Fév 2026", delivery: "Yalidine - Domicile" },
  { id: "CMD-0844", client: "Amine R.", phone: "0770 11 22 33", wilaya: "Sétif", commune: "Sétif", items: 2, total: 7200, status: "Livrée", date: "27 Fév 2026", delivery: "Yalidine - Point relais" },
  { id: "CMD-0843", client: "Mohamed A.", phone: "0555 99 88 77", wilaya: "Annaba", commune: "Annaba", items: 5, total: 21000, status: "Expédiée", date: "26 Fév 2026", delivery: "Yalidine - Domicile" },
  { id: "CMD-0842", client: "Rami K.", phone: "0661 44 55 66", wilaya: "Blida", commune: "Blida", items: 1, total: 4800, status: "Annulée", date: "26 Fév 2026", delivery: "Yalidine - Domicile" },
  { id: "CMD-0841", client: "Hamza T.", phone: "0555 33 22 11", wilaya: "Tizi Ouzou", commune: "Tizi Ouzou", items: 2, total: 9800, status: "Livrée", date: "25 Fév 2026", delivery: "Yalidine - Point relais" },
  { id: "CMD-0840", client: "Nassim L.", phone: "0770 66 77 88", wilaya: "Béjaïa", commune: "Béjaïa", items: 3, total: 16500, status: "Livrée", date: "25 Fév 2026", delivery: "Yalidine - Domicile" },
];

const statusColors: Record<string, string> = {
  "Livrée": "bg-emerald-500/10 text-emerald-400",
  "En cours": "bg-blue-500/10 text-blue-400",
  "En préparation": "bg-amber-500/10 text-amber-400",
  "Expédiée": "bg-purple-500/10 text-purple-400",
  "Annulée": "bg-red-500/10 text-red-400",
};

const statusIcons: Record<string, React.ReactNode> = {
  "Livrée": <Check size={10} />,
  "En cours": <Truck size={10} />,
  "En préparation": <Clock size={10} />,
  "Expédiée": <Truck size={10} />,
  "Annulée": <X size={10} />,
};

const filters = ["Toutes", "En préparation", "En cours", "Expédiée", "Livrée", "Annulée"];

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Toutes");

  const filtered = orders.filter((o) => {
    const matchSearch = o.client.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "Toutes" || o.status === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une commande..."
            className="w-full h-10 rounded-md bg-card border border-border pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            maxLength={100}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeFilter === f
                ? "gradient-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left px-4 py-3 font-medium">Commande</th>
                <th className="text-left px-3 py-3 font-medium">Client</th>
                <th className="text-left px-3 py-3 font-medium hidden md:table-cell">Wilaya</th>
                <th className="text-left px-3 py-3 font-medium hidden lg:table-cell">Livraison</th>
                <th className="text-left px-3 py-3 font-medium">Total</th>
                <th className="text-left px-3 py-3 font-medium">Statut</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs text-primary">{o.id}</p>
                    <p className="text-[10px] text-muted-foreground">{o.date}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-sm">{o.client}</p>
                    <p className="text-[10px] text-muted-foreground">{o.phone}</p>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground hidden md:table-cell">{o.wilaya}</td>
                  <td className="px-3 py-3 text-muted-foreground text-xs hidden lg:table-cell">{o.delivery}</td>
                  <td className="px-3 py-3 font-heading font-bold">{formatPrice(o.total)}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${statusColors[o.status]}`}>
                      {statusIcons[o.status]}
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                      <Eye size={14} />
                    </button>
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
