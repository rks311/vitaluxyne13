import { useState } from "react";
import { X, Check, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, type DbProduct } from "@/types/database";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface OrderFormProps {
  product: DbProduct;
  quantity: number;
  onClose: () => void;
}

export default function OrderForm({ product, quantity, onClose }: OrderFormProps) {
  const { t } = useLang();
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    comment: "",
    qty: quantity,
  });

  const total = product.price * form.qty;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.city.trim() || !form.address.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    try {
      // Save order to database
      const { error: orderError } = await supabase.from("orders").insert({
        order_number: `CMD-${Date.now().toString().slice(-6)}`,
        client_name: form.name.trim(),
        client_phone: form.phone.trim(),
        wilaya: form.city.trim(),
        commune: form.city.trim(),
        address: form.address.trim(),
        delivery_type: "domicile",
        subtotal: total,
        total: total,
        delivery_fee: 0,
        notes: form.comment.trim() || null,
        status: "Nouveau",
      });

      if (orderError) throw orderError;

      // Save order items
      await supabase.from("order_items").insert({
        order_id: (await supabase.from("orders").select("id").order("created_at", { ascending: false }).limit(1).single()).data?.id || "",
        product_name: product.name,
        quantity: form.qty,
        unit_price: product.price,
        total_price: total,
      });

      // Upsert client
      await supabase.from("clients").upsert({
        name: form.name.trim(),
        phone: form.phone.trim(),
        wilaya: form.city.trim(),
      }, { onConflict: "phone" });

      setStep("success");
    } catch (err: any) {
      toast.error("Erreur lors de l'envoi. Réessayez.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour, je veux commander:\n${product.name} x${form.qty}\nTotal: ${formatPrice(total)}\nNom: ${form.name}\nTél: ${form.phone}\nVille: ${form.city}\nAdresse: ${form.address}`
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-background rounded-t-2xl md:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold text-foreground">{t("order.title")}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground"><X size={20} /></button>
        </div>

        {step === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product info (read-only) */}
            <div className="p-3 rounded-xl bg-secondary/50 border border-border flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden shrink-0">
                <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${product.image_url}`} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-sm truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{formatPrice(product.price)} x {form.qty}</p>
              </div>
              <p className="font-heading font-bold text-accent shrink-0">{formatPrice(total)}</p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-heading uppercase tracking-wider text-muted-foreground">{t("order.quantity")}</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setForm(f => ({ ...f, qty: Math.max(1, f.qty - 1) }))} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center font-bold">-</button>
                <span className="w-6 text-center font-medium">{form.qty}</span>
                <button type="button" onClick={() => setForm(f => ({ ...f, qty: f.qty + 1 }))} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center font-bold">+</button>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("order.fullName")} *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full h-11 rounded-xl bg-card border border-border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required maxLength={100} />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("order.phone")} *</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0555 12 34 56" className="w-full h-11 rounded-xl bg-card border border-border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required maxLength={20} />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("order.city")} *</label>
              <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="w-full h-11 rounded-xl bg-card border border-border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required maxLength={100} />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("order.address")} *</label>
              <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full h-11 rounded-xl bg-card border border-border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required maxLength={200} />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("order.comment")}</label>
              <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} className="w-full h-20 rounded-xl bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" maxLength={500} />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 font-heading text-base bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
              {loading ? <><Loader2 size={16} className="animate-spin me-2" /> {t("order.submitting")}</> : t("order.submit")}
            </Button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">{t("order.thankYou")}</h3>
            <p className="text-sm text-muted-foreground mb-6">{t("order.thankYouMsg")}</p>
            
            <div className="flex flex-col gap-3">
              <Button asChild className="h-11 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-heading">
                <a href={`https://wa.me/213555123456?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} className="me-2" /> {t("order.whatsappContact")}
                </a>
              </Button>
              <Button variant="outline" onClick={onClose} className="h-11 rounded-xl border-border">
                {t("product.backToCatalog")}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
