import { Truck, CreditCard, ShieldCheck, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";

export default function TrustBadges() {
  const { t } = useLang();

  const badges = [
    { icon: Truck, title: t("trust.delivery"), desc: t("trust.deliveryDesc"), color: "bg-blue-50 text-blue-600" },
    { icon: CreditCard, title: t("trust.cod"), desc: t("trust.codDesc"), color: "bg-emerald-50 text-emerald-600" },
    { icon: ShieldCheck, title: t("trust.original"), desc: t("trust.originalDesc"), color: "bg-amber-50 text-amber-600" },
    { icon: Phone, title: t("trust.support"), desc: t("trust.supportDesc"), color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <section className="py-12 md:py-16 bg-secondary/50">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center p-4 md:p-6"
              >
                <div className={`w-12 h-12 rounded-2xl ${b.color} flex items-center justify-center mx-auto mb-3`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-heading font-semibold text-sm md:text-base text-foreground">{b.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
