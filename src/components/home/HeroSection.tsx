import { motion } from "framer-motion";
import { ArrowDown, MessageCircle, ShieldCheck, Truck, Award } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-vitamins.jpg";

export default function HeroSection() {
  const { t } = useLang();

  const scrollToCategories = () => {
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden min-h-[85vh] md:min-h-[90vh] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/40 md:from-white/90 md:via-white/70 md:to-transparent" />
      </div>

      <div className="container relative z-10 py-16 md:py-24">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 backdrop-blur-sm">
              <ShieldCheck size={16} />
              Compléments certifiés & authentiques
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-3xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] text-foreground mb-5"
          >
            {t("hero.title")},{" "}
            <span className="text-primary relative">
              {t("hero.titleHighlight")}
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-accent rounded-full" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start gap-3 mb-10"
          >
            <Button
              onClick={scrollToCategories}
              size="lg"
              className="h-13 px-8 font-heading text-base bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg shadow-primary/25"
            >
              {t("hero.cta")}
              <ArrowDown size={18} className="ms-2" />
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-13 px-8 font-heading text-base rounded-full border-primary/30 text-primary hover:bg-primary/5"
            >
              <a href="https://wa.me/213555123456" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} className="me-2" />
                {t("hero.whatsapp")}
              </a>
            </Button>
          </motion.div>

          {/* Mini trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-primary" />
              <span>Livraison 48 wilayas</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary" />
              <span>Paiement à la livraison</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={16} className="text-primary" />
              <span>Produits authentiques</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
