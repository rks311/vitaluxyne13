import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
            <Zap size={12} /> N°1 en Algérie
          </span>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] mb-4">
            DÉPASSE TES
            <br />
            <span className="text-primary neon-text">LIMITES</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-md">
            Compléments alimentaires 100% authentiques. Whey, créatine, gainer et plus.
            Livraison rapide dans toute l'Algérie.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/catalogue">
              <Button className="w-full sm:w-auto h-12 px-8 text-base font-heading gradient-primary text-primary-foreground hover:opacity-90 neon-glow">
                Commander maintenant <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/pack">
              <Button variant="outline" className="w-full sm:w-auto h-12 px-8 text-base font-heading border-primary/30 text-primary hover:bg-primary/10">
                Créer mon pack
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
