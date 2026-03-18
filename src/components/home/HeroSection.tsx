import { motion } from "framer-motion";
import { ArrowDown, MessageCircle } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { t } = useLang();

  const scrollToCategories = () => {
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-mint">
      <div className="container py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              🌿 Compléments certifiés & authentiques
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground mb-4"
          >
            {t("hero.title")},{" "}
            <span className="text-primary gold-underline">{t("hero.titleHighlight")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              onClick={scrollToCategories}
              size="lg"
              className="h-12 px-8 font-heading text-base bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg shadow-primary/20"
            >
              {t("hero.cta")}
              <ArrowDown size={18} className="ms-2" />
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 font-heading text-base rounded-full border-primary text-primary hover:bg-primary/5"
            >
              <a href="https://wa.me/213555123456" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} className="me-2" />
                {t("hero.whatsapp")}
              </a>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
    </section>
  );
}
