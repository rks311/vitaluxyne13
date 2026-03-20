import { motion } from "framer-motion";
import { ArrowDown, MessageCircle, ShieldCheck, Truck, Award, Star } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

export default function HeroSection() {
  const { t } = useLang();

  const scrollToCategories = () => {
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary via-background to-background">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="container relative z-10 pt-6 pb-8 md:pt-16 md:pb-20">
        {/* Mobile: stacked, Desktop: side by side */}
        <div className="flex flex-col items-center text-center md:text-start md:items-start max-w-2xl mx-auto md:mx-0">
          
          {/* Trust pill */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <ShieldCheck size={14} />
              Compléments certifiés & authentiques
            </span>
          </motion.div>

          {/* Headline - bigger on mobile */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-[1.75rem] leading-[1.15] md:text-5xl font-extrabold text-foreground mb-3 md:mb-5"
          >
            {t("hero.title")},{" "}
            <span className="text-primary relative inline-block">
              {t("hero.titleHighlight")}
              <span className="absolute -bottom-0.5 left-0 w-full h-[3px] bg-accent rounded-full" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5 md:mb-8 max-w-md"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTA buttons - full width on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col w-full sm:flex-row gap-2.5 sm:w-auto mb-6 md:mb-10"
          >
            <button
              onClick={scrollToCategories}
              className="h-12 px-6 font-heading text-sm font-semibold gradient-primary text-primary-foreground rounded-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              {t("hero.cta")}
              <ArrowDown size={16} />
            </button>
            <a
              href="https://wa.me/213555123456"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-6 font-heading text-sm font-semibold rounded-full border border-primary/20 text-primary bg-background hover:bg-primary/5 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <MessageCircle size={16} />
              {t("hero.whatsapp")}
            </a>
          </motion.div>

          {/* Trust row - horizontal scroll on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex items-center gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-1 w-full justify-center md:justify-start"
          >
            {[
              { icon: Truck, text: "Livraison 58 wilayas" },
              { icon: ShieldCheck, text: "Paiement à la livraison" },
              { icon: Award, text: "100% authentique" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                <b.icon size={14} className="text-primary shrink-0" />
                <span>{b.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex items-center gap-2 mt-4 md:mt-6"
          >
            <div className="flex -space-x-2">
              {["A", "K", "S", "Y"].map((l, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary">
                  {l}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-accent text-accent" />)}
              </div>
              <span className="text-xs text-muted-foreground">+500 clients satisfaits</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
