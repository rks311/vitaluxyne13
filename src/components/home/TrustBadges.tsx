import { Truck, ShieldCheck, CreditCard, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  { icon: Truck, title: "Livraison 48h" },
  { icon: CreditCard, title: "Paiement à la livraison" },
  { icon: ShieldCheck, title: "100% Authentique" },
  { icon: MessageCircle, title: "Support WhatsApp" },
];

export default function TrustBadges() {
  return (
    <section className="container py-20 md:py-28">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/50">
        {badges.map((badge, i) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background flex flex-col items-center justify-center p-8 md:p-12"
            >
              <Icon size={24} className="text-silver mb-4" strokeWidth={1.5} />
              <h3 className="font-heading text-sm md:text-base tracking-wide text-center">{badge.title}</h3>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
