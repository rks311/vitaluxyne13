import { Truck, CreditCard, ShieldCheck, Phone } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

export default function TrustBadges() {
  const { t } = useLang();

  const badges = [
    { icon: Truck, title: t("trust.delivery"), desc: t("trust.deliveryDesc") },
    { icon: CreditCard, title: t("trust.cod"), desc: t("trust.codDesc") },
    { icon: ShieldCheck, title: t("trust.original"), desc: t("trust.originalDesc") },
    { icon: Phone, title: t("trust.support"), desc: t("trust.supportDesc") },
  ];

  return (
    <section className="py-8 md:py-12 bg-secondary/30 min-h-[120px] md:min-h-[104px]" aria-label="Nos garanties">
      <div className="container">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible" role="list">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                role="listitem"
                className="flex items-center gap-3 bg-card rounded-xl p-3.5 md:p-4 border border-border min-w-[220px] md:min-w-0 shrink-0 md:shrink"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0" aria-hidden="true">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xs md:text-sm text-foreground">{b.title}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 leading-tight">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
