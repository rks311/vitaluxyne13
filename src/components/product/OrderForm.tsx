import { useState, useMemo } from "react";
import { X, Check, MessageCircle, Loader2, MapPin, User, Phone, Package, Truck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, type DbProduct } from "@/types/database";
import { WILAYAS, getDeliveryOptions, type DeliveryOption } from "@/data/wilayas";
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

  // Auto-select cheapest when wilaya changes
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
    if (!isValid) { toast.error("Veuillez remplir tous les champs obligatoires."); return; }

    setLoading(true);
    try {
      const phone = form.phone.trim().startsWith("0") ? form.phone.trim() : `0${form.phone.trim()}`;

      const { data: order, error: orderError } = await supabase.from("orders").insert({
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
      }).select("id, order_number").single();

      if (orderError) throw orderError;

      await supabase.from("order_items").insert({
        order_id: order.id,
        product_name: product.name,
        quantity: form.qty,
        unit_price: product.price,
        total_price: subtotal,
      });

      await supabase.from("clients").upsert({
        name: form.name.trim().slice(0, 100),
        phone: phone.slice(0, 15),
        wilaya: form.wilaya,
      }, { onConflict: "phone" });

      // Decrement stock
      await supabase.rpc("decrement_stock", { p_product_id: product.id, p_quantity: form.qty });

      setOrderNumber(order.order_number);
      setStep("success");
    } catch (err: any) {
      toast.error("Erreur lors de l'envoi. Réessayez.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour, j'ai passé la commande ${orderNumber}.\n${product.name} x${form.qty}\nTotal: ${formatPrice(total)}\nNom: ${form.name}\nTél: ${form.phone}\nWilaya: ${form.wilaya}`
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="bg-background/95 backdrop-blur-xl border-l border-primary/20 w-full max-w-md h-full overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border px-5 py-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground">Commander</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"><X size={18} /></button>
        </div>

        {step === "form" ? (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Product summary */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-secondary overflow-hidden shrink-0">
                <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${product.image_url}`} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-sm truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{formatPrice(product.price)} × {form.qty}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setForm(f => ({ ...f, qty: Math.max(1, f.qty - 1) }))} className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-sm font-bold">-</button>
                <span className="w-5 text-center text-sm font-medium">{form.qty}</span>
                <button type="button" onClick={() => setForm(f => ({ ...f, qty: f.qty + 1 }))} className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-sm font-bold">+</button>
              </div>
            </div>

            {/* Name */}
            <FieldGroup icon={<User size={16} />} label="Nom complet" required>
              <input
                type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ahmed Benali"
                className="field-input" required maxLength={100}
              />
              {form.name.trim().length >= 2 && <Check size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary" />}
            </FieldGroup>

            {/* Phone */}
            <FieldGroup icon={<Phone size={16} />} label="Téléphone" required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">+213</span>
                <input
                  type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/[^\d]/g, "").slice(0, 10) }))}
                  placeholder="0770 12 34 56"
                  className="field-input !pl-12" required maxLength={10}
                />
              </div>
              {form.phone.trim().length >= 10 && <Check size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary" />}
            </FieldGroup>

            {/* Wilaya */}
            <FieldGroup icon={<MapPin size={16} />} label="Wilaya" required>
              <div className="relative">
                <select
                  value={form.wilaya} onChange={e => handleWilayaChange(e.target.value)}
                  className="field-input appearance-none pr-8" required
                >
                  <option value="">Sélectionner une wilaya</option>
                  {WILAYAS.map(w => <option key={w.code} value={w.name}>{w.code} - {w.name}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </FieldGroup>

            {/* Commune */}
            <FieldGroup icon={<MapPin size={16} />} label="Commune" required>
              <input
                type="text" value={form.commune} onChange={e => setForm(f => ({ ...f, commune: e.target.value }))}
                placeholder="Centre, Hai..."
                className="field-input" required maxLength={100}
              />
            </FieldGroup>

            {/* Address */}
            <FieldGroup icon={<MapPin size={16} />} label="Adresse complète" required>
              <textarea
                value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="Rue, numéro, bâtiment, étage..."
                className="field-input !h-20 resize-none py-2.5" required maxLength={200}
              />
            </FieldGroup>

            {/* Delivery options */}
            {form.wilaya && deliveryOptions.length > 0 && (
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-heading font-medium text-muted-foreground uppercase tracking-wider">
                  <Truck size={14} /> Service de livraison
                </label>
                <div className="space-y-2">
                  {deliveryOptions.map(opt => (
                    <button
                      key={opt.id} type="button"
                      onClick={() => setForm(f => ({ ...f, deliveryOption: opt.id }))}
                      className={`w-full p-3 rounded-xl border text-left transition-all text-sm ${form.deliveryOption === opt.id ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/30"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{opt.type === "bureau" ? "📦" : "🏠"} {opt.label}</span>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {opt.type === "bureau" ? "Retrait en bureau (moins cher)" : "Livraison à votre porte"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-primary">{formatPrice(opt.price)}</span>
                          {form.deliveryOption === opt.id && <Check size={16} className="text-primary" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Comment */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Commentaire (optionnel)</label>
              <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} className="field-input !h-16 resize-none py-2.5" maxLength={500} placeholder="Instructions spéciales..." />
            </div>

            {/* Price summary */}
            <div className="p-3 rounded-xl bg-secondary/50 border border-border space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{deliveryFee > 0 ? formatPrice(deliveryFee) : "—"}</span></div>
              <div className="flex justify-between font-heading font-bold text-base pt-1.5 border-t border-border">
                <span>Total</span><span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            <Button type="submit" disabled={loading || !isValid} className="w-full h-12 font-heading text-base bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50">
              {loading ? <><Loader2 size={16} className="animate-spin me-2" /> Envoi en cours...</> : `✅ Confirmer commande · ${formatPrice(total)}`}
            </Button>

            <p className="text-[10px] text-center text-muted-foreground">💳 Paiement à la livraison · Un conseiller vous appellera pour confirmer</p>
          </form>
        ) : (
          <div className="p-6 text-center flex flex-col items-center justify-center min-h-[60vh]">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Check size={40} className="text-primary" />
            </motion.div>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Commande {orderNumber} reçue !</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">Un conseiller Vitaluxyne vous appellera sous 24h pour confirmation finale.</p>

            <div className="w-full p-4 rounded-xl bg-secondary/50 border border-border text-left text-sm space-y-1.5 mb-6">
              <p><span className="text-muted-foreground">Produit:</span> {product.name} × {form.qty}</p>
              <p><span className="text-muted-foreground">Livraison:</span> {selectedDelivery?.label}</p>
              <p><span className="text-muted-foreground">Frais:</span> {formatPrice(deliveryFee)}</p>
              <p className="font-heading font-bold pt-1 border-t border-border"><span className="text-muted-foreground font-normal">Total:</span> {formatPrice(total)}</p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <Button asChild className="h-11 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-heading">
                <a href={`https://wa.me/213555123456?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} className="me-2" /> Contacter sur WhatsApp
                </a>
              </Button>
              <Button variant="outline" onClick={onClose} className="h-11 rounded-xl border-border">
                Continuer mes achats
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Reusable field wrapper ──────────────────────────────────
function FieldGroup({ icon, label, required, children }: { icon: React.ReactNode; label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="relative">
      <label className="flex items-center gap-1.5 text-xs font-heading font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
        {icon} {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}
