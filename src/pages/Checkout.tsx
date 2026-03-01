import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice, wilayas } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, MapPin, User, Truck } from "lucide-react";
import { useProductImage } from "@/hooks/useProductImage";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DELIVERY_FEE = 600;

function CheckoutItemImage({ imageKey }: { imageKey: string }) {
  const src = useProductImage(imageKey);
  return <img src={src} alt="" className="w-12 h-12 rounded object-cover" />;
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", wilaya: "", commune: "", address: "", delivery: "domicile" });
  const navigate = useNavigate();

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const canProceed = step === 1
    ? form.name && form.phone && form.wilaya && form.commune && form.address
    : step === 2
    ? form.delivery
    : true;

  const handleConfirm = () => {
    toast.success("Commande confirmée ! Vous recevrez un appel de confirmation.");
    clearCart();
    navigate("/");
  };

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center min-h-screen">
        <p className="text-muted-foreground mb-4">Votre panier est vide</p>
        <Button onClick={() => navigate("/catalogue")} className="gradient-primary text-primary-foreground">Voir le catalogue</Button>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-10 min-h-screen max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6">
        <span className="text-primary">COMMANDER</span>
      </h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { id: 1, label: "Informations", icon: User },
          { id: 2, label: "Livraison", icon: Truck },
          { id: 3, label: "Confirmation", icon: CreditCard },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${
                step === s.id ? "gradient-primary text-primary-foreground" : step > s.id ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
              }`}>
                {step > s.id ? <Check size={12} /> : <Icon size={12} />}
                <span className="hidden sm:inline">{s.label}</span>
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
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="font-heading text-lg font-bold">Vos informations</h2>
                <input placeholder="Nom complet" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full h-11 rounded-md bg-card border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                <input placeholder="Téléphone (ex: 0555123456)" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full h-11 rounded-md bg-card border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                <select value={form.wilaya} onChange={(e) => update("wilaya", e.target.value)} className="w-full h-11 rounded-md bg-card border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="">Sélectionner la Wilaya</option>
                  {wilayas.map((w, i) => <option key={w} value={w}>{(i + 1).toString().padStart(2, "0")} - {w}</option>)}
                </select>
                <input placeholder="Commune" value={form.commune} onChange={(e) => update("commune", e.target.value)} className="w-full h-11 rounded-md bg-card border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                <input placeholder="Adresse complète" value={form.address} onChange={(e) => update("address", e.target.value)} className="w-full h-11 rounded-md bg-card border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="font-heading text-lg font-bold">Mode de livraison</h2>
                {[
                  { id: "domicile", label: "Livraison à domicile", desc: `${formatPrice(DELIVERY_FEE)}`, icon: "🏠" },
                  { id: "relais", label: "Point relais", desc: "Gratuit", icon: "📍" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => update("delivery", opt.id)}
                    className={`w-full p-4 rounded-lg border text-left transition-colors ${
                      form.delivery === opt.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="mr-2">{opt.icon}</span>
                        <span className="font-medium">{opt.label}</span>
                        <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                      </div>
                      {form.delivery === opt.id && <Check size={18} className="text-primary" />}
                    </div>
                  </button>
                ))}
                <div className="p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard size={16} className="text-primary" />
                    <span className="font-medium text-sm">Paiement à la livraison</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Payez en espèces à la réception de votre commande.</p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="font-heading text-lg font-bold">Confirmer la commande</h2>
                <div className="bg-card border border-border rounded-lg p-4 space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Nom:</span> {form.name}</p>
                  <p><span className="text-muted-foreground">Téléphone:</span> {form.phone}</p>
                  <p><span className="text-muted-foreground">Adresse:</span> {form.address}, {form.commune}, {form.wilaya}</p>
                  <p><span className="text-muted-foreground">Livraison:</span> {form.delivery === "domicile" ? "À domicile" : "Point relais"}</p>
                  <p><span className="text-muted-foreground">Paiement:</span> Cash à la livraison</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="border-border">Retour</Button>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed} className="flex-1 gradient-primary text-primary-foreground disabled:opacity-50">
                Suivant
              </Button>
            ) : (
              <Button onClick={handleConfirm} className="flex-1 h-12 font-heading text-lg gradient-primary text-primary-foreground neon-glow hover:opacity-90">
                ✅ Confirmer la commande
              </Button>
            )}
          </div>
        </div>

        {/* Order summary */}
        <div className="md:col-span-2 bg-card border border-border rounded-lg p-4 h-fit sticky top-20">
          <h3 className="font-heading font-bold mb-3 text-sm">Résumé</h3>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-2">
                <CheckoutItemImage imageKey={item.product.image} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                  <p className="text-xs font-heading font-bold text-primary">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{formatPrice(total)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{form.delivery === "relais" ? "Gratuit" : formatPrice(DELIVERY_FEE)}</span></div>
            <div className="flex justify-between font-heading font-bold text-base pt-2 border-t border-border mt-2">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total + (form.delivery === "relais" ? 0 : DELIVERY_FEE))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
