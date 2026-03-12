import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/types/database";
import { ShoppingCart, Package, Users, DollarSign, ArrowUpRight, TrendingUp, Calendar, AlertCircle, Clock, Truck, CheckCircle2, XCircle, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(142,60%,45%)", "hsl(217,70%,55%)", "hsl(45,100%,50%)", "hsl(270,60%,55%)", "hsl(0,70%,55%)"];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, clients: 0, pendingOrders: 0, avgOrderValue: 0, deliveredOrders: 0, shippedOrders: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [ordersByDay, setOrdersByDay] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const [ordersRes, productsRes, clientsRes] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("id, name, category, price, stock_qty, image_url"),
        supabase.from("clients").select("id"),
      ]);

      const orders = ordersRes.data || [];
      const products = productsRes.data || [];
      const revenue = orders.filter(o => o.status === "Livrée").reduce((s, o) => s + o.total, 0);
      const pendingOrders = orders.filter(o => o.status === "En préparation").length;
      const deliveredOrders = orders.filter(o => o.status === "Livrée").length;
      const shippedOrders = orders.filter(o => o.status === "Expédiée").length;
      const avgOrderValue = orders.length > 0 ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length) : 0;

      setStats({ revenue, orders: orders.length, products: products.length, clients: (clientsRes.data || []).length, pendingOrders, avgOrderValue, deliveredOrders, shippedOrders });
      setRecentOrders(orders.slice(0, 8));

      // Low stock
      setLowStockProducts(products.filter(p => (p.stock_qty ?? 0) <= 5 && (p.stock_qty ?? 0) >= 0).sort((a, b) => (a.stock_qty ?? 0) - (b.stock_qty ?? 0)).slice(0, 5));

      // Orders by day (last 7 days)
      const dayMap: Record<string, { count: number; revenue: number }> = {};
      const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        dayMap[d.toISOString().split('T')[0]] = { count: 0, revenue: 0 };
      }
      orders.forEach(o => {
        const key = o.created_at.split('T')[0];
        if (dayMap[key]) { dayMap[key].count++; dayMap[key].revenue += o.total; }
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

      // Top products
      const { data: items } = await supabase.from("order_items").select("product_name, quantity, total_price");
      const productMap: Record<string, { sold: number; revenue: number }> = {};
      (items || []).forEach((item) => {
        if (!productMap[item.product_name]) productMap[item.product_name] = { sold: 0, revenue: 0 };
        productMap[item.product_name].sold += item.quantity;
        productMap[item.product_name].revenue += item.total_price;
      });
      setTopProducts(Object.entries(productMap).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.revenue - a.revenue).slice(0, 5));
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

  const statusIcons: Record<string, any> = {
    "En préparation": Clock,
    "Expédiée": Truck,
    "Livrée": CheckCircle2,
    "Annulée": XCircle,
  };

  const statCards = [
    { label: "Chiffre d'affaires", value: formatPrice(stats.revenue), icon: DollarSign, sub: `${stats.deliveredOrders} commandes livrées`, color: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-400" },
    { label: "Commandes", value: stats.orders.toString(), icon: ShoppingCart, sub: `${stats.pendingOrders} en attente`, color: "from-blue-500/20 to-blue-500/5", iconColor: "text-blue-400" },
    { label: "Produits", value: stats.products.toString(), icon: Package, sub: "Dans le catalogue", color: "from-purple-500/20 to-purple-500/5", iconColor: "text-purple-400" },
    { label: "Clients", value: stats.clients.toString(), icon: Users, sub: `Panier moyen: ${formatPrice(stats.avgOrderValue)}`, color: "from-amber-500/20 to-amber-500/5", iconColor: "text-amber-400" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl">
          <p className="text-xs font-heading font-bold mb-1">{label}</p>
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
      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-primary/10 via-card to-card border border-border rounded-xl p-5 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold">Bienvenue sur UltraAdmin 👋</h2>
          <p className="text-sm text-muted-foreground mt-1">Voici un résumé de votre activité aujourd'hui</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <Activity size={14} className="text-emerald-400" />
          <span className="text-emerald-400 font-medium">En ligne</span>
          <span>· {new Date().toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card border border-border rounded-xl p-4 md:p-5 hover:border-primary/20 transition-all hover:shadow-lg hover:shadow-primary/5 group">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <Icon size={18} className={stat.iconColor} />
              </div>
              <p className="font-heading text-2xl md:text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.label}</p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">{stat.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Revenue Area chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-400" />
              <h3 className="font-heading font-bold text-base">Revenus & Commandes (7j)</h3>
            </div>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">Cette semaine</span>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ordersByDay}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217,70%,55%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(217,70%,55%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142,60%,45%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(142,60%,45%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(0,0%,52%)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(0,0%,52%)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="commandes" stroke="hsl(142,60%,45%)" fill="url(#colorOrders)" strokeWidth={2} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(217,70%,55%)" fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Order status breakdown */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold text-base mb-4">Statut Commandes</h3>
          {statusData.length > 0 ? (
            <>
              <div className="h-[140px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={3} dataKey="value">
                      {statusData.map((_: any, idx: number) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {statusData.map((s: any, idx: number) => {
                  const Icon = statusIcons[s.name] || Clock;
                  return (
                    <div key={s.name} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <Icon size={12} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{s.name}</span>
                      </div>
                      <span className="text-sm font-bold">{s.value}</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Aucune commande</p>
          )}
        </motion.div>
      </div>

      {/* Middle row */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Top Products */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <h3 className="font-heading font-bold text-base">Top Produits Vendus</h3>
            </div>
            <button onClick={() => navigate("/admin/products")} className="text-xs text-primary flex items-center gap-1 hover:underline">Catalogue <ArrowUpRight size={12} /></button>
          </div>
          {topProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package size={32} className="text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucune vente encore</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => {
                const maxRevenue = topProducts[0]?.revenue || 1;
                const medals = ['🥇', '🥈', '🥉'];
                return (
                  <div key={p.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                    <span className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-sm shrink-0">
                      {i < 3 ? medals[i] : <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${(p.revenue / maxRevenue) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground shrink-0">{p.sold} vendus</p>
                      </div>
                    </div>
                    <span className="text-xs font-heading font-bold text-emerald-400 shrink-0">{formatPrice(p.revenue)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Low stock alert + Category */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="space-y-4">
          {/* Low Stock Alert */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-amber-400" />
              <h3 className="font-heading font-bold text-sm">Stock Faible</h3>
            </div>
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">✅ Tous les stocks sont OK</p>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                    <span className="text-xs truncate max-w-[140px]">{p.name}</span>
                    <span className={`text-xs font-bold font-mono ${(p.stock_qty ?? 0) === 0 ? 'text-red-400' : 'text-amber-400'}`}>
                      {p.stock_qty ?? 0} unités
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Distribution */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Package size={16} className="text-purple-400" />
              <h3 className="font-heading font-bold text-sm">Catalogue</h3>
            </div>
            {categoryData.length > 0 ? (
              <div className="space-y-2">
                {categoryData.map((cat: any, idx: number) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-xs capitalize text-muted-foreground flex-1">{cat.name}</span>
                    <span className="text-xs font-bold">{cat.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Aucune donnée</p>
            )}
          </div>
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
                <th className="text-left px-3 pb-3 font-medium hidden sm:table-cell">Date</th>
                <th className="text-left px-3 pb-3 font-medium">Total</th>
                <th className="text-left px-3 pb-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate("/admin/orders")}>
                  <td className="px-5 py-3.5 font-mono text-xs text-primary">{order.order_number}</td>
                  <td className="px-3 py-3.5">
                    <p className="font-medium">{order.client_name}</p>
                    <p className="text-[10px] text-muted-foreground md:hidden">{order.wilaya}</p>
                  </td>
                  <td className="px-3 py-3.5 text-muted-foreground hidden md:table-cell">{order.wilaya}</td>
                  <td className="px-3 py-3.5 text-xs text-muted-foreground hidden sm:table-cell">{new Date(order.created_at).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short' })}</td>
                  <td className="px-3 py-3.5 font-heading font-bold">{formatPrice(order.total)}</td>
                  <td className="px-3 py-3.5">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusColors[order.status] || ""}`}>{order.status}</span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">Aucune commande</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
