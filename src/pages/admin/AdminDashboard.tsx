import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/types/database";
import { ShoppingCart, Package, Users, DollarSign, ArrowUpRight, BarChart3, TrendingUp, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

const COLORS = ["hsl(0,0%,78%)", "hsl(0,0%,58%)", "hsl(0,0%,42%)", "hsl(0,0%,30%)", "hsl(45,100%,50%)"];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, clients: 0, pendingOrders: 0, avgOrderValue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [ordersByDay, setOrdersByDay] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const [ordersRes, productsRes, clientsRes] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("id, category, price"),
        supabase.from("clients").select("id"),
      ]);

      const orders = ordersRes.data || [];
      const products = productsRes.data || [];
      const revenue = orders.filter(o => o.status === "Livrée").reduce((s, o) => s + o.total, 0);
      const pendingOrders = orders.filter(o => o.status === "En préparation").length;
      const avgOrderValue = orders.length > 0 ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length) : 0;
      
      setStats({ 
        revenue, 
        orders: orders.length, 
        products: products.length, 
        clients: (clientsRes.data || []).length,
        pendingOrders,
        avgOrderValue
      });
      setRecentOrders(orders.slice(0, 6));

      // Orders by day (last 7 days)
      const dayMap: Record<string, { count: number; revenue: number }> = {};
      const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        dayMap[key] = { count: 0, revenue: 0 };
      }
      orders.forEach(o => {
        const key = o.created_at.split('T')[0];
        if (dayMap[key]) {
          dayMap[key].count++;
          dayMap[key].revenue += o.total;
        }
      });
      setOrdersByDay(Object.entries(dayMap).map(([date, data]) => {
        const d = new Date(date);
        return { name: dayNames[d.getDay()], commandes: data.count, revenue: data.revenue };
      }));

      // Status distribution
      const statusCount: Record<string, number> = {};
      orders.forEach(o => { statusCount[o.status] = (statusCount[o.status] || 0) + 1; });
      setStatusData(Object.entries(statusCount).map(([name, value]) => ({ name, value })));

      // Category distribution
      const catCount: Record<string, number> = {};
      products.forEach(p => { catCount[p.category] = (catCount[p.category] || 0) + 1; });
      setCategoryData(Object.entries(catCount).map(([name, value]) => ({ name, value })));

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
    { label: "Chiffre d'affaires", value: formatPrice(stats.revenue), icon: DollarSign, sub: "Commandes livrées" },
    { label: "Commandes", value: stats.orders.toString(), icon: ShoppingCart, sub: `${stats.pendingOrders} en attente` },
    { label: "Produits", value: stats.products.toString(), icon: Package, sub: "Dans le catalogue" },
    { label: "Clients", value: stats.clients.toString(), icon: Users, sub: `Panier moyen: ${formatPrice(stats.avgOrderValue)}` },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-xs font-heading font-bold">{label}</p>
          {payload.map((p: any) => (
            <p key={p.dataKey} className="text-xs text-muted-foreground">
              {p.dataKey === 'revenue' ? formatPrice(p.value) : `${p.value} commande(s)`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card border border-border rounded-xl p-4 md:p-5 hover:border-primary/20 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Icon size={18} className="text-primary" /></div>
              </div>
              <p className="font-heading text-xl md:text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              <p className="text-[10px] text-primary/60 mt-0.5">{stat.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        {/* Orders chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              <h3 className="font-heading font-bold text-base">Commandes (7 jours)</h3>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ordersByDay}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0,0%,78%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(0,0%,78%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(0,0%,52%)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(0,0%,52%)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="commandes" stroke="hsl(0,0%,78%)" fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category distribution */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-primary" />
              <h3 className="font-heading font-bold text-base">Répartition Catalogue</h3>
            </div>
          </div>
          {categoryData.length > 0 ? (
            <div className="flex items-center gap-4">
              <div className="w-[140px] h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                      {categoryData.map((_: any, idx: number) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {categoryData.map((cat: any, idx: number) => (
                  <div key={cat.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="capitalize text-muted-foreground">{cat.name}</span>
                    <span className="ml-auto font-bold">{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune donnée</p>
          )}
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Top Products */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              <h3 className="font-heading font-bold text-base">Top Produits</h3>
            </div>
            <BarChart3 size={16} className="text-muted-foreground" />
          </div>
          {topProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-1">Aucune vente encore</p>
              <p className="text-xs text-muted-foreground/60">Les statistiques apparaîtront après les premières commandes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => {
                const maxRevenue = topProducts[0]?.revenue || 1;
                return (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full rounded-full gradient-primary" style={{ width: `${(p.revenue / maxRevenue) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground shrink-0">{p.sold} vendus</p>
                      </div>
                    </div>
                    <span className="text-xs font-heading font-bold text-primary shrink-0">{formatPrice(p.revenue)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Status breakdown */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold text-base mb-4">Statut Commandes</h3>
          {statusData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucune commande</p>
          ) : (
            <>
              <div className="h-[120px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} layout="vertical" margin={{ left: 0, right: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={90} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(0,0%,52%)' }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(0,0%,78%)" radius={[0, 4, 4, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {["En préparation", "Expédiée", "Livrée", "Annulée"].map((status) => {
                  const count = recentOrders.filter(o => o.status === status).length;
                  return (
                    <div key={status} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[status] || ""}`}>{status}</span>
                      <span className="text-sm font-bold">{count}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
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
                <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate("/admin/orders")}>
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
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Aucune commande — les stats apparaîtront ici</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
