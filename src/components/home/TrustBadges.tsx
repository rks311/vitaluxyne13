import { Truck, ShieldCheck, CreditCard, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  { icon: Truck, title: "Livraison Rapide", desc: "Partout en Algérie sous 48h" },
  { icon: CreditCard, title: "Paiement à la Livraison", desc: "Cash on delivery, sans risque" },
  { icon: ShieldCheck, title: "100% Authentique", desc: "Produits originaux garantis" },
  { icon: MessageCircle, title: "Support WhatsApp", desc: "Réponse en moins de 30min" },
];

export default function TrustBadges() {
  return (
    <section className="container py-12 md:py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, i) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-4 md:p-6 rounded-lg bg-card border border-border"
            >
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-3">
                <Icon size={22} className="text-primary-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-sm md:text-base mb-1">{badge.title}</h3>
              <p className="text-xs text-muted-foreground">{badge.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
