import { Truck, ShieldCheck, CreditCard, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";

export default function TrustBadges() {
  const { t } = useLang();

  const badges = [
    { icon: Truck, title: t("trust.delivery"), desc: t("trust.deliveryDesc"), color: "text-blue-400" },
    { icon: CreditCard, title: t("trust.cod"), desc: t("trust.codDesc"), color: "text-emerald-400" },
    { icon: ShieldCheck, title: t("trust.original"), desc: t("trust.originalDesc"), color: "text-amber-400" },
    { icon: MessageCircle, title: t("trust.support"), desc: t("trust.supportDesc"), color: "text-primary" },
  ];

  return (
    <section className="container py-10 md:py-16">
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
        {badges.map((badge, i) => {
          const Icon = badge.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="snap-start shrink-0 w-[140px] md:w-auto text-center p-4 md:p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Icon size={22} className={badge.color} />
              </div>
              <h3 className="font-heading font-bold text-xs md:text-sm mb-1">{badge.title}</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground">{badge.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
