import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-end overflow-hidden">
      {/* Full-bleed background */}
      <div className="absolute inset-0">
        <motion.img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-background/20" />
      </div>

      {/* Content at bottom */}
      <div className="container relative z-10 pb-16 md:pb-24">
        <div className="max-w-2xl">
          {/* Thin silver line accent */}
          <motion.div
            className="w-12 h-px bg-foreground/40 mb-6 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <motion.h1
            className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.85] tracking-tight mb-6"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            DÉPASSE
            <br />
            <span className="text-silver">TES LIMITES</span>
          </motion.h1>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link to="/catalogue">
              <button className="group flex items-center gap-3 h-14 px-8 bg-foreground text-background font-body font-semibold text-sm tracking-wide uppercase hover:bg-silver-light transition-colors duration-300">
                Commander
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/pack">
              <button className="h-14 px-8 border border-foreground/30 text-foreground font-body font-medium text-sm tracking-wide uppercase hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-300">
                Créer mon pack
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 right-4 md:right-0 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body" style={{ writingMode: "vertical-lr" }}>
            Scroll
          </span>
          <motion.div
            className="w-px h-8 bg-foreground/30"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originY: 0 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
