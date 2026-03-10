import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/types/database";
import type { DbOrder } from "@/types/database";
import { Search, Eye, Check, X, Clock, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  "Livrée": "bg-emerald-500/10 text-emerald-400",
  "En cours": "bg-blue-500/10 text-blue-400",
  "En préparation": "bg-amber-500/10 text-amber-400",
  "Expédiée": "bg-purple-500/10 text-purple-400",
  "Annulée": "bg-red-500/10 text-red-400",
};

const statuses = ["Toutes", "En préparation", "En cours", "Expédiée", "Livrée", "Annulée"];
const statusFlow = ["En préparation", "En cours", "Expédiée", "Livrée"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [selectedOrder, setSelectedOrder] = useState<DbOrder | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  const loadOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
  };

  useEffect(() => { loadOrders(); }, []);

  const filtered = orders.filter((o) => {
    const matchSearch = o.client_name.toLowerCase().includes(search.toLowerCase()) || o.order_number.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "Toutes" || o.status === activeFilter;
    return matchSearch && matchFilter;
  });

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) { toast.error("Erreur"); return; }
    toast.success(`Statut → ${newStatus}`);
    loadOrders();
    if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status: newStatus });
  };

  const viewOrder = async (order: DbOrder) => {
    setSelectedOrder(order);
    const { data } = await supabase.from("order_items").select("*").eq("order_id", order.id);
    setOrderItems(data || []);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full h-10 rounded-md bg-card border border-border pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" maxLength={100} />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {statuses.map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeFilter === f ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-card border border-border rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">{selectedOrder.order_number}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <p><span className="text-muted-foreground">Client:</span> {selectedOrder.client_name}</p>
              <p><span className="text-muted-foreground">Téléphone:</span> {selectedOrder.client_phone}</p>
              <p><span className="text-muted-foreground">Wilaya:</span> {selectedOrder.wilaya}</p>
              <p><span className="text-muted-foreground">Commune:</span> {selectedOrder.commune}</p>
              <p><span className="text-muted-foreground">Adresse:</span> {selectedOrder.address}</p>
              <p><span className="text-muted-foreground">Livraison:</span> {selectedOrder.delivery_type === "domicile" ? "À domicile" : "Point relais"}</p>
              {selectedOrder.notes && <p><span className="text-muted-foreground">Notes:</span> {selectedOrder.notes}</p>}
            </div>

            <h4 className="font-heading font-bold text-sm mb-2">Produits</h4>
            <div className="space-y-2 mb-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm p-2 bg-secondary/30 rounded">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">{item.flavor} · {item.weight} · x{item.quantity}</p>
                  </div>
                  <span className="font-heading font-bold text-primary">{formatPrice(item.total_price)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{formatPrice(selectedOrder.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{formatPrice(selectedOrder.delivery_fee || 0)}</span></div>
              <div className="flex justify-between font-heading font-bold text-base"><span>Total</span><span className="text-primary">{formatPrice(selectedOrder.total)}</span></div>
            </div>

            <h4 className="font-heading font-bold text-sm mt-4 mb-2">Changer le statut</h4>
            <div className="flex flex-wrap gap-2">
              {statusFlow.map((s) => (
                <button key={s} onClick={() => updateStatus(selectedOrder.id, s)} disabled={selectedOrder.status === s} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedOrder.status === s ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                  {s}
                </button>
              ))}
              <button onClick={() => updateStatus(selectedOrder.id, "Annulée")} className="px-3 py-1.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20">Annuler</button>
            </div>
          </div>
        </div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left px-4 py-3 font-medium">Commande</th>
                <th className="text-left px-3 py-3 font-medium">Client</th>
                <th className="text-left px-3 py-3 font-medium hidden md:table-cell">Wilaya</th>
                <th className="text-left px-3 py-3 font-medium">Total</th>
                <th className="text-left px-3 py-3 font-medium">Statut</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs text-primary">{o.order_number}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(o.created_at).toLocaleDateString("fr-FR")}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-sm">{o.client_name}</p>
                    <p className="text-[10px] text-muted-foreground">{o.client_phone}</p>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground hidden md:table-cell">{o.wilaya}</td>
                  <td className="px-3 py-3 font-heading font-bold">{formatPrice(o.total)}</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusColors[o.status] || ""}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => viewOrder(o)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Aucune commande</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
