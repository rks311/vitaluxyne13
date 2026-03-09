import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  return (
    <section className="relative h-[85vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background with parallax feel */}
      <div className="absolute inset-0">
        <motion.img 
          src={heroBg} 
          alt="" 
          className="w-full h-full object-cover scale-110"
          animate={{ scale: [1.1, 1.05, 1.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      {/* Animated particles/lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            style={{ top: `${20 + i * 15}%`, width: "100%" }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 text-center px-4"
      >
        {/* Subtitle above */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xs md:text-sm tracking-[0.5em] uppercase text-primary/80 font-heading mb-4"
        >
          Compléments Alimentaires Premium
        </motion.p>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, type: "spring" }}
          className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold tracking-wider leading-none"
        >
          <span className="text-foreground">ULTRA</span>
          <br className="md:hidden" />
          <span className="text-primary neon-text">NUTRITION</span>
        </motion.h1>

        {/* Animated line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-6 w-32 h-[2px] mx-auto bg-gradient-to-r from-transparent via-primary to-transparent"
        />

        {/* Stats badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-8 flex items-center justify-center gap-6 md:gap-10"
        >
          {[
            { value: "100%", label: "Authentique" },
            { value: "48h", label: "Livraison" },
            { value: "COD", label: "Paiement" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.15 }}
              className="text-center"
            >
              <p className="font-heading text-xl md:text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground tracking-wider uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={24} className="text-primary/50" />
      </motion.div>
    </section>
  );
}
