import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { formatPrice, getStorageUrl } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, MapPin, User, Truck, Phone, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const DELIVERY_FEE = 600;

const wilayas = [
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar","Blida","Bouira","Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger","Djelfa","Jijel","Sétif","Saïda","Skikda","Sidi Bel Abbès","Annaba","Guelma","Constantine","Médéa","Mostaganem","M'Sila","Mascara","Ouargla","Oran","El Bayadh","Illizi","Bordj Bou Arréridj","Boumerdès","El Tarf","Tindouf","Tissemsilt","El Oued","Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma","Aïn Témouchent","Ghardaïa","Relizane"
];

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { t } = useLang();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", wilaya: "", commune: "", address: "", delivery: "domicile", notes: "" });
  const navigate = useNavigate();

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));
  const canProceed = step === 1 ? form.name && form.phone && form.wilaya && form.commune && form.address : step === 2 ? form.delivery : true;

  const handleConfirm = async () => {
    setSubmitting(true);
    const deliveryFee = form.delivery === "relais" ? 0 : DELIVERY_FEE;
    const grandTotal = total + deliveryFee;

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({ order_number: "TEMP", client_name: form.name.trim().slice(0, 100), client_phone: form.phone.trim().slice(0, 15), wilaya: form.wilaya, commune: form.commune.trim().slice(0, 100), address: form.address.trim().slice(0, 200), delivery_type: form.delivery, delivery_fee: deliveryFee, notes: form.notes.trim().slice(0, 300) || null, subtotal: total, total: grandTotal, status: "En préparation" })
        .select("id, order_number").single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({ order_id: order.id, product_name: item.name, flavor: item.flavor, weight: item.weight, quantity: item.quantity, unit_price: item.price, total_price: item.price * item.quantity }));
      await supabase.from("order_items").insert(orderItems);

      // Auto-decrement stock for each product
      for (const item of items) {
        const { data } = await supabase.from("products").select("stock_qty").eq("id", item.productId).single();
        if (data) {
          const newQty = Math.max(0, ((data as any).stock_qty || 0) - item.quantity);
          await supabase.from("products").update({ stock_qty: newQty } as any).eq("id", item.productId);
        }
      }

      await supabase.from("clients").upsert({ name: form.name.trim().slice(0, 100), phone: form.phone.trim().slice(0, 15), wilaya: form.wilaya }, { onConflict: "phone" });

      const orderLines = items.map((item) => `• ${item.name} (${item.flavor}, ${item.weight}) x${item.quantity} - ${formatPrice(item.price * item.quantity)}`);
      const message = encodeURIComponent(`🛒 *Nouvelle Commande ${order.order_number}*\n\n*Client:* ${form.name}\n*Téléphone:* ${form.phone}\n*Wilaya:* ${form.wilaya}\n*Commune:* ${form.commune}\n*Adresse:* ${form.address}\n*Livraison:* ${form.delivery === "domicile" ? "À domicile" : "Point relais"}\n${form.notes ? `*Notes:* ${form.notes}\n` : ""}\n*Produits:*\n${orderLines.join("\n")}\n\n*Sous-total:* ${formatPrice(total)}\n*Livraison:* ${deliveryFee === 0 ? "Gratuit" : formatPrice(deliveryFee)}\n*Total:* ${formatPrice(grandTotal)}\n\n💳 Paiement à la livraison`);

      window.open(`https://wa.me/213555123456?text=${message}`, "_blank");
      toast.success(`Commande ${order.order_number} ${t("checkout.orderSuccess")}`);
      clearCart();
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(t("checkout.orderError"));
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center min-h-screen">
        <p className="text-muted-foreground mb-4">{t("checkout.emptyCart")}</p>
        <Button onClick={() => navigate("/catalogue")} className="gradient-primary text-primary-foreground">{t("cart.viewCatalog")}</Button>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-10 min-h-screen max-w-2xl mx-auto pb-24">
      <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6">{t("checkout.title")}</h1>

      <div className="flex items-center gap-2 mb-8">
        {[{ id: 1, label: t("checkout.info"), icon: User }, { id: 2, label: t("checkout.delivery"), icon: Truck }, { id: 3, label: t("checkout.confirm"), icon: Check }].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${step === s.id ? "gradient-primary text-primary-foreground" : step > s.id ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                {step > s.id ? <Check size={12} /> : <Icon size={12} />}
                <span>{s.label}</span>
              </div>
              {i < 2 && <div className="w-4 md:w-8 h-px bg-border mx-1" />}
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                <h2 className="font-heading text-lg font-bold">{t("checkout.yourInfo")}</h2>
                <input placeholder={t("checkout.fullName")} value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full h-12 rounded-xl bg-card border border-border px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary" maxLength={100} />
                <input placeholder={t("checkout.phone")} value={form.phone} onChange={(e) => update("phone", e.target.value)} type="tel" className="w-full h-12 rounded-xl bg-card border border-border px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary" maxLength={15} />
                <select value={form.wilaya} onChange={(e) => update("wilaya", e.target.value)} className="w-full h-12 rounded-xl bg-card border border-border px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="">{t("checkout.selectWilaya")}</option>
                  {wilayas.map((w, i) => <option key={w} value={w}>{(i + 1).toString().padStart(2, "0")} - {w}</option>)}
                </select>
                <input placeholder={t("checkout.commune")} value={form.commune} onChange={(e) => update("commune", e.target.value)} className="w-full h-12 rounded-xl bg-card border border-border px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary" maxLength={100} />
                <input placeholder={t("checkout.address")} value={form.address} onChange={(e) => update("address", e.target.value)} className="w-full h-12 rounded-xl bg-card border border-border px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary" maxLength={200} />
                <textarea placeholder={t("checkout.notes")} value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={2} className="w-full rounded-xl bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" maxLength={300} />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                <h2 className="font-heading text-lg font-bold">{t("checkout.deliveryMode")}</h2>
                {[{ id: "domicile", label: t("checkout.homeDelivery"), desc: `${t("checkout.homeDeliveryDesc")} - ${formatPrice(DELIVERY_FEE)}`, icon: "🏠" }, { id: "relais", label: t("checkout.relayPoint"), desc: `${t("checkout.free")} - ${t("checkout.relayDesc")}`, icon: "📍" }].map((opt) => (
                  <button key={opt.id} onClick={() => update("delivery", opt.id)} className={`w-full p-4 rounded-xl border text-left transition-all ${form.delivery === opt.id ? "border-primary bg-primary/5 neon-glow" : "border-border bg-card hover:border-primary/30"}`}>
                    <div className="flex items-center justify-between">
                      <div><span className="me-2">{opt.icon}</span><span className="font-medium text-sm">{opt.label}</span><p className="text-xs text-muted-foreground mt-1">{opt.desc}</p></div>
                      {form.delivery === opt.id && <Check size={18} className="text-primary" />}
                    </div>
                  </button>
                ))}
                <div className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-2 mb-2"><CreditCard size={16} className="text-primary" /><span className="font-medium text-sm">{t("checkout.codPayment")}</span></div>
                  <p className="text-xs text-muted-foreground">{t("checkout.codDesc")}</p>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                <h2 className="font-heading text-lg font-bold">{t("checkout.confirmOrder")}</h2>
                <div className="bg-card border border-border rounded-xl p-4 space-y-2 text-sm">
                  <p><span className="text-muted-foreground">{t("checkout.name")}</span> {form.name}</p>
                  <p><span className="text-muted-foreground">{t("checkout.phoneLabel")}</span> {form.phone}</p>
                  <p><span className="text-muted-foreground">{t("checkout.addressLabel")}</span> {form.address}, {form.commune}, {form.wilaya}</p>
                  <p><span className="text-muted-foreground">{t("checkout.deliveryLabel")}</span> {form.delivery === "domicile" ? t("checkout.atHome") : t("checkout.relay")}</p>
                </div>
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-2 mb-1"><Phone size={14} className="text-primary" /><span className="text-sm font-medium">{t("checkout.whatsappConfirm")}</span></div>
                  <p className="text-xs text-muted-foreground">{t("checkout.whatsappDesc")}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 mt-6">
            {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)} className="border-border rounded-xl">{t("checkout.back")}</Button>}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed} className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground disabled:opacity-50">{t("checkout.next")}</Button>
            ) : (
              <Button onClick={handleConfirm} disabled={submitting} className="flex-1 h-12 font-heading text-base rounded-xl gradient-primary text-primary-foreground neon-glow hover:opacity-90">
                {submitting ? <Loader2 size={18} className="animate-spin me-2" /> : "✅"} {t("checkout.confirmViaWhatsapp")}
              </Button>
            )}
          </div>
        </div>

        <div className="md:col-span-2 bg-card border border-border rounded-xl p-4 h-fit sticky top-20">
          <h3 className="font-heading font-bold mb-3 text-sm">{t("checkout.summary")}</h3>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.flavor}-${item.weight}`} className="flex gap-2">
                <img src={getStorageUrl(item.imageUrl)} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.flavor} · {item.weight} · x{item.quantity}</p>
                  <p className="text-xs font-heading font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{t("checkout.subtotal")}</span><span>{formatPrice(total)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("checkout.deliveryFee")}</span><span>{form.delivery === "relais" ? t("checkout.free") : formatPrice(DELIVERY_FEE)}</span></div>
            <div className="flex justify-between font-heading font-bold text-base pt-2 border-t border-border mt-2">
              <span>{t("cart.total")}</span><span className="text-primary">{formatPrice(total + (form.delivery === "relais" ? 0 : DELIVERY_FEE))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
