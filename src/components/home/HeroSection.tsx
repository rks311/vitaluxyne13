import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  return (
    <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider">
          <span className="text-foreground">ULTRA</span>
          <span className="text-primary neon-text">NUTRITION</span>
        </h1>
        <div className="mt-4 w-24 h-[2px] mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
        <p className="mt-4 text-sm md:text-base text-muted-foreground tracking-[0.3em] uppercase font-heading">
          Compléments alimentaires premium
        </p>
      </motion.div>
    </section>
  );
}
