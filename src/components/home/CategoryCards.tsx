import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "@/data/products";

import wheyImg from "@/assets/whey.jpg";
import creatineImg from "@/assets/creatine.jpg";
import gainerImg from "@/assets/gainer.jpg";
import fatburnerImg from "@/assets/fatburner.jpg";
import preworkoutImg from "@/assets/preworkout.jpg";
import bcaaImg from "@/assets/bcaa.jpg";
import packsImg from "@/assets/packs.jpg";

const catImages: Record<string, string> = {
  whey: wheyImg,
  creatine: creatineImg,
  gainer: gainerImg,
  seche: fatburnerImg,
  masse: preworkoutImg,
  packs: packsImg,
  accessoires: bcaaImg,
};

export default function CategoryCards() {
  return (
    <section className="py-10 md:py-14">
      <div className="container">
        <h2 className="font-heading text-xl md:text-2xl font-bold mb-6 tracking-wide">
          CATÉGORIES
        </h2>
      </div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="container">
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-4 lg:grid-cols-7 md:overflow-visible md:pb-0">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="snap-start shrink-0 w-[130px] md:w-auto"
            >
              <Link
                to={`/catalogue?cat=${cat.id}`}
                className="group block relative rounded-xl overflow-hidden aspect-[3/4]"
              >
                <img
                  src={catImages[cat.id]}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 rounded-xl transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                  <span className="text-lg">{cat.icon}</span>
                  <h3 className="font-heading font-semibold text-xs md:text-sm mt-1 text-foreground">
                    {cat.label}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
