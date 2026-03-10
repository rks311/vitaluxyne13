import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/types/database";
import { TrendingUp, TrendingDown, ShoppingCart, Package, Users, DollarSign, ArrowUpRight, BarChart3, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, clients: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const [ordersRes, productsRes, clientsRes] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("id"),
        supabase.from("clients").select("id"),
      ]);

      const orders = ordersRes.data || [];
      const revenue = orders.filter(o => o.status === "Livrée").reduce((s, o) => s + o.total, 0);
      setStats({ revenue, orders: orders.length, products: (productsRes.data || []).length, clients: (clientsRes.data || []).length });
      setRecentOrders(orders.slice(0, 6));

      // Top products from order_items
      const { data: items } = await supabase.from("order_items").select("product_name, quantity, total_price");
      const productMap: Record<string, { sold: number; revenue: number }> = {};
      (items || []).forEach((item) => {
        if (!productMap[item.product_name]) productMap[item.product_name] = { sold: 0, revenue: 0 };
        productMap[item.product_name].sold += item.quantity;
        productMap[item.product_name].revenue += item.total_price;
      });
      const top = Object.entries(productMap).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
      setTopProducts(top);
    };
    load();
  }, []);

  const statusColors: Record<string, string> = {
    "Livrée": "bg-emerald-500/10 text-emerald-400",
    "En cours": "bg-blue-500/10 text-blue-400",
    "En préparation": "bg-amber-500/10 text-amber-400",
    "Expédiée": "bg-purple-500/10 text-purple-400",
    "Annulée": "bg-red-500/10 text-red-400",
  };

  const statCards = [
    { label: "Chiffre d'affaires", value: formatPrice(stats.revenue), icon: DollarSign },
    { label: "Commandes", value: stats.orders.toString(), icon: ShoppingCart },
    { label: "Produits", value: stats.products.toString(), icon: Package },
    { label: "Clients", value: stats.clients.toString(), icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card border border-border rounded-xl p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Icon size={18} className="text-primary" /></div>
              </div>
              <p className="font-heading text-xl md:text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Top Products */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-base">Top Produits</h3>
            <BarChart3 size={16} className="text-muted-foreground" />
          </div>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune vente encore</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.sold} vendus</p>
                  </div>
                  <span className="text-xs font-heading font-bold text-primary">{formatPrice(p.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold text-base mb-4">Statut Commandes</h3>
          {["En préparation", "Expédiée", "Livrée", "Annulée"].map((status) => {
            const count = recentOrders.filter(o => o.status === status).length;
            return (
              <div key={status} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[status] || ""}`}>{status}</span>
                <span className="text-sm font-bold">{count}</span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between p-5 pb-0">
          <h3 className="font-heading font-bold text-base">Commandes récentes</h3>
          <button onClick={() => navigate("/admin/orders")} className="text-xs text-primary flex items-center gap-1 hover:underline">Voir tout <ArrowUpRight size={12} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm mt-4">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left px-5 pb-3 font-medium">N°</th>
                <th className="text-left px-3 pb-3 font-medium">Client</th>
                <th className="text-left px-3 pb-3 font-medium hidden md:table-cell">Wilaya</th>
                <th className="text-left px-3 pb-3 font-medium">Total</th>
                <th className="text-left px-3 pb-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-primary">{order.order_number}</td>
                  <td className="px-3 py-3.5 font-medium">{order.client_name}</td>
                  <td className="px-3 py-3.5 text-muted-foreground hidden md:table-cell">{order.wilaya}</td>
                  <td className="px-3 py-3.5 font-heading font-bold">{formatPrice(order.total)}</td>
                  <td className="px-3 py-3.5">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusColors[order.status] || ""}`}>{order.status}</span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Aucune commande</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
