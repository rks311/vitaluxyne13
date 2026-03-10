import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { categories } from "@/data/products";

import wheyImg from "@/assets/whey.jpg";
import creatineImg from "@/assets/creatine.jpg";
import gainerImg from "@/assets/gainer.jpg";
import fatburnerImg from "@/assets/fatburner.jpg";
import preworkoutImg from "@/assets/preworkout.jpg";
import bcaaImg from "@/assets/bcaa.jpg";
import packsImg from "@/assets/packs.jpg";

const catImages: Record<string, string> = {
  whey: wheyImg, creatine: creatineImg, gainer: gainerImg, seche: fatburnerImg, masse: preworkoutImg, packs: packsImg, accessoires: bcaaImg,
};

export default function CategoryCards() {
  const { t } = useLang();

  return (
    <section className="py-8 md:py-14">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full gradient-primary" />
          <h2 className="font-heading text-xl md:text-2xl font-bold tracking-wide">{t("cat.title")}</h2>
        </motion.div>
      </div>
      <div className="container">
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-4 lg:grid-cols-7 md:overflow-visible md:pb-0">
          {categories.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="snap-start shrink-0 w-[120px] md:w-auto">
              <Link to={cat.id === "packs" ? "/catalogue?cat=packs" : `/catalogue?cat=${cat.id}`} className="group block relative rounded-2xl overflow-hidden aspect-[3/4] active:scale-95 transition-transform">
                <img src={catImages[cat.id]} alt={cat.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/40 rounded-2xl transition-colors duration-300" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                  <span className="text-xl md:text-2xl block mb-1">{cat.icon}</span>
                  <h3 className="font-heading font-bold text-[11px] md:text-sm text-foreground uppercase tracking-wider">{cat.label}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
