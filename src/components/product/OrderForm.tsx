import { useState, useMemo } from "react";
import { X, Check, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, getStorageUrl, type DbProduct } from "@/types/database";
import { WILAYAS, getDeliveryOptions } from "@/data/wilayas";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { trackPurchase, trackInitiateCheckout } from "@/lib/metaPixel";
import { MESSENGER_URL } from "@/lib/messenger";

interface OrderFormProps {
  product: DbProduct;
  quantity: number;
  onClose: () => void;
}

export default function OrderForm({ product, quantity, onClose }: OrderFormProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", wilaya: "", commune: "", address: "", comment: "", qty: quantity,
    deliveryOption: "",
  });

  const deliveryOptions = useMemo(() => getDeliveryOptions(form.wilaya), [form.wilaya]);
  const selectedDelivery = deliveryOptions.find(o => o.id === form.deliveryOption);
  const deliveryFee = selectedDelivery?.price || 0;
  const subtotal = product.price * form.qty;
  const total = subtotal + deliveryFee;

  const handleWilayaChange = (wilayaName: string) => {
    const opts = getDeliveryOptions(wilayaName);
    setForm(f => ({
      ...f,
      wilaya: wilayaName,
      deliveryOption: opts.length === 1 ? opts[0].id : opts[0]?.id || "",
    }));
  };

  const isValid = form.name.trim().length >= 2 && form.phone.trim().length >= 10 && form.wilaya && form.commune.trim() && form.address.trim().length >= 5 && form.deliveryOption;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;
    if (!form.name.trim()) { toast.error("Veuillez remplir tous les champs obligatoires."); return; }

    trackInitiateCheckout(total, form.qty);
    setLoading(true);
    try {
      const orderId = crypto.randomUUID();
      const phone = form.phone.trim().startsWith("0") ? form.phone.trim() : `0${form.phone.trim()}`;

      const { error: orderError } = await supabase.from("orders").insert({
        id: orderId,
        order_number: "TEMP",
        client_name: form.name.trim().slice(0, 100),
        client_phone: phone.slice(0, 15),
        wilaya: form.wilaya,
        commune: form.commune.trim().slice(0, 100),
        address: form.address.trim().slice(0, 200),
        delivery_type: selectedDelivery?.type || "domicile",
        delivery_fee: deliveryFee,
        service_livraison: form.deliveryOption,
        subtotal,
        total,
        notes: form.comment.trim().slice(0, 500) || null,
        status: "En préparation",
      });

      if (orderError) throw orderError;

      await supabase.from("order_items").insert({
        order_id: orderId,
        product_name: product.name,
        product_id: product.id,
        quantity: form.qty,
        unit_price: product.price,
        total_price: subtotal,
      } as any);

      await supabase.from("clients").upsert({
        name: form.name.trim().slice(0, 100),
        phone: phone.slice(0, 15),
        wilaya: form.wilaya,
      }, { onConflict: "phone" });

      // Stock is NOT decremented here - only when admin confirms the order

      const clientRef = `CMD-${orderId.slice(0, 6).toUpperCase()}`;
      setOrderNumber(clientRef);
      trackPurchase(total, clientRef);
      setStep("success");
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de l'envoi. Réessayez.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Formulaire de commande"
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="bg-background/95 backdrop-blur-xl border-l border-primary/20 w-full max-w-sm h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 bg-background/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
          <h2 className="font-heading text-base font-bold text-foreground">Commander</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground transition-colors" aria-label="Fermer le formulaire">
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {step === "form" ? (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col" noValidate>
            <div className="p-4 space-y-3 flex-1">
              {/* Product summary */}
              <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-md bg-secondary overflow-hidden shrink-0">
                  <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${product.image_url}`} alt="" className="w-full h-full object-cover" width={40} height={40} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs truncate">{product.name}</p>
                  <p className="text-[10px] text-muted-foreground">{formatPrice(product.price)} × {form.qty}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setForm(f => ({ ...f, qty: Math.max(1, f.qty - 1) }))} className="w-6 h-6 rounded bg-secondary flex items-center justify-center text-xs font-bold" aria-label="Diminuer la quantité">-</button>
                  <span className="w-4 text-center text-xs font-medium" aria-live="polite">{form.qty}</span>
                  <button type="button" onClick={() => setForm(f => ({ ...f, qty: f.qty + 1 }))} className="w-6 h-6 rounded bg-secondary flex items-center justify-center text-xs font-bold" aria-label="Augmenter la quantité">+</button>
                </div>
              </div>

              <div>
                <label htmlFor="order-name" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Nom complet *</label>
                <input
                  id="order-name"
                  type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ahmed Benali"
                  className="w-full h-9 rounded-lg bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" required maxLength={100}
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="order-phone" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Téléphone *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium" aria-hidden="true">+213</span>
                  <input
                    id="order-phone"
                    type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/[^\d]/g, "").slice(0, 10) }))}
                    placeholder="0770 12 34 56"
                    className="w-full h-9 rounded-lg bg-secondary border border-border pl-11 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" required maxLength={10}
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="order-wilaya" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Wilaya *</label>
                  <select
                    id="order-wilaya"
                    value={form.wilaya} onChange={e => handleWilayaChange(e.target.value)}
                    className="w-full h-9 rounded-lg bg-secondary border border-border px-2 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-primary" required
                  >
                    <option value="">Wilaya</option>
                    {WILAYAS.map(w => <option key={w.code} value={w.name}>{w.code}-{w.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="order-commune" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Commune *</label>
                  <input
                    id="order-commune"
                    type="text" value={form.commune} onChange={e => setForm(f => ({ ...f, commune: e.target.value }))}
                    placeholder="Centre"
                    className="w-full h-9 rounded-lg bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" required maxLength={100}
                    autoComplete="address-level2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="order-address" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Adresse *</label>
                <textarea
                  id="order-address"
                  value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Rue, numéro, bâtiment..."
                  className="w-full h-14 rounded-lg bg-secondary border border-border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary" required maxLength={200}
                  autoComplete="street-address"
                />
              </div>

              {form.wilaya && deliveryOptions.length > 0 && (
                <fieldset>
                  <legend className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Livraison</legend>
                  <div className="space-y-1.5" role="radiogroup" aria-label="Options de livraison">
                    {deliveryOptions.map(opt => (
                      <button
                        key={opt.id} type="button"
                        onClick={() => setForm(f => ({ ...f, deliveryOption: opt.id }))}
                        className={`w-full p-2.5 rounded-lg border text-left transition-all text-xs ${form.deliveryOption === opt.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"}`}
                        role="radio"
                        aria-checked={form.deliveryOption === opt.id}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{opt.type === "bureau" ? "📦" : "🏠"} {opt.label}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading font-bold text-primary">{formatPrice(opt.price)}</span>
                            {form.deliveryOption === opt.id && <Check size={12} className="text-primary" aria-hidden="true" />}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              <div>
                <label htmlFor="order-comment" className="text-[10px] text-muted-foreground mb-1 block">Note (optionnel)</label>
                <input id="order-comment" value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} className="w-full h-9 rounded-lg bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" maxLength={500} placeholder="Instructions..." />
              </div>
            </div>

            {/* Sticky bottom */}
            <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur-md p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Livraison</span>
                <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : "—"}</span>
              </div>
              <div className="flex items-center justify-between font-heading font-bold text-sm pt-1.5 border-t border-border">
                <span>Total</span>
                <span className="text-primary" aria-live="polite">{formatPrice(total)}</span>
              </div>

              <Button type="submit" disabled={loading || !isValid} className="w-full h-11 font-heading text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50">
                {loading ? <><Loader2 size={14} className="animate-spin me-2" aria-hidden="true" /> Envoi...</> : `✅ Confirmer · ${formatPrice(total)}`}
              </Button>
              <p className="text-[9px] text-center text-muted-foreground">💳 Paiement à la livraison</p>
            </div>
          </form>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center justify-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4" aria-hidden="true">
              <Check size={32} className="text-primary" />
            </motion.div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">Commande {orderNumber} reçue !</h3>
            <p className="text-xs text-muted-foreground mb-4 max-w-xs text-center">Un conseiller vous appellera sous 24h pour confirmation.</p>

            <div className="w-full p-3 rounded-lg bg-secondary/50 border border-border text-left text-xs space-y-1 mb-4">
              <p><span className="text-muted-foreground">Produit:</span> {product.name} × {form.qty}</p>
              <p><span className="text-muted-foreground">Livraison:</span> {selectedDelivery?.label}</p>
              <p className="font-heading font-bold pt-1 border-t border-border"><span className="text-muted-foreground font-normal">Total:</span> {formatPrice(total)}</p>
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              <Button asChild className="h-10 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-xl font-heading text-sm">
                <a href={MESSENGER_URL} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={16} className="me-2" aria-hidden="true" /> Messenger
                </a>
              </Button>
              <Button variant="outline" onClick={onClose} className="h-10 rounded-xl border-border text-sm">
                Continuer mes achats
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
