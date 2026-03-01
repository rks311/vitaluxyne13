import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  ArrowUpRight,
  BarChart3,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/data/products";

const stats = [
  { label: "Chiffre d'affaires", value: "1 245 000 DZD", change: "+18.2%", up: true, icon: DollarSign },
  { label: "Commandes", value: "156", change: "+12.5%", up: true, icon: ShoppingCart },
  { label: "Produits vendus", value: "423", change: "+8.1%", up: true, icon: Package },
  { label: "Nouveaux clients", value: "89", change: "-3.2%", up: false, icon: Users },
];

const recentOrders = [
  { id: "CMD-0847", client: "Karim B.", wilaya: "Alger", total: 12500, status: "Livrée", date: "28 Fév" },
  { id: "CMD-0846", client: "Sofiane M.", wilaya: "Oran", total: 8500, status: "En cours", date: "28 Fév" },
  { id: "CMD-0845", client: "Yacine D.", wilaya: "Constantine", total: 15200, status: "En préparation", date: "27 Fév" },
  { id: "CMD-0844", client: "Amine R.", wilaya: "Sétif", total: 7200, status: "Livrée", date: "27 Fév" },
  { id: "CMD-0843", client: "Mohamed A.", wilaya: "Annaba", total: 21000, status: "Expédiée", date: "26 Fév" },
  { id: "CMD-0842", client: "Rami K.", wilaya: "Blida", total: 4800, status: "Livrée", date: "26 Fév" },
];

const topProducts = [
  { name: "Gold Standard Whey", sold: 89, revenue: 756500 },
  { name: "Creatine Monohydrate", sold: 67, revenue: 234500 },
  { name: "Serious Mass", sold: 45, revenue: 324000 },
  { name: "ISO100 Hydrolyzed", sold: 34, revenue: 391000 },
  { name: "Impact Whey", sold: 31, revenue: 192200 },
];

const statusColors: Record<string, string> = {
  "Livrée": "bg-emerald-500/10 text-emerald-400",
  "En cours": "bg-blue-500/10 text-blue-400",
  "En préparation": "bg-amber-500/10 text-amber-400",
  "Expédiée": "bg-purple-500/10 text-purple-400",
  "Annulée": "bg-red-500/10 text-red-400",
};

const weeklyData = [
  { day: "Lun", orders: 18, revenue: 153000 },
  { day: "Mar", orders: 24, revenue: 204000 },
  { day: "Mer", orders: 16, revenue: 136000 },
  { day: "Jeu", orders: 32, revenue: 272000 },
  { day: "Ven", orders: 28, revenue: 238000 },
  { day: "Sam", orders: 22, revenue: 187000 },
  { day: "Dim", orders: 16, revenue: 136000 },
];
const maxOrders = Math.max(...weeklyData.map((d) => d.orders));

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-xl p-4 md:p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon size={18} className="text-primary" />
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? "text-emerald-400" : "text-red-400"}`}>
                  {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.change}
                </div>
              </div>
              <p className="font-heading text-xl md:text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-bold text-base">Commandes cette semaine</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Vue d'ensemble des 7 derniers jours</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-primary">
              <Activity size={14} /> Live
            </div>
          </div>
          <div className="flex items-end gap-2 h-40">
            {weeklyData.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.orders / maxOrders) * 100}%` }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                  className="w-full rounded-t-md gradient-primary min-h-[4px] relative group cursor-pointer"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border rounded px-2 py-1 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {d.orders} cmd · {formatPrice(d.revenue)}
                  </div>
                </motion.div>
                <span className="text-[10px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-base">Top Produits</h3>
            <BarChart3 size={16} className="text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.sold} vendus</p>
                </div>
                <span className="text-xs font-heading font-bold text-primary">{formatPrice(p.revenue)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-xl"
      >
        <div className="flex items-center justify-between p-5 pb-0">
          <h3 className="font-heading font-bold text-base">Commandes récentes</h3>
          <button className="text-xs text-primary flex items-center gap-1 hover:underline">
            Voir tout <ArrowUpRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm mt-4">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left px-5 pb-3 font-medium">ID</th>
                <th className="text-left px-3 pb-3 font-medium">Client</th>
                <th className="text-left px-3 pb-3 font-medium hidden md:table-cell">Wilaya</th>
                <th className="text-left px-3 pb-3 font-medium">Total</th>
                <th className="text-left px-3 pb-3 font-medium">Statut</th>
                <th className="text-left px-3 pb-3 font-medium hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5 font-mono text-xs text-primary">{order.id}</td>
                  <td className="px-3 py-3.5 font-medium">{order.client}</td>
                  <td className="px-3 py-3.5 text-muted-foreground hidden md:table-cell">{order.wilaya}</td>
                  <td className="px-3 py-3.5 font-heading font-bold">{formatPrice(order.total)}</td>
                  <td className="px-3 py-3.5">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusColors[order.status] || ""}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-muted-foreground text-xs hidden md:table-cell">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
