import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "@/data/products";

import wheyImg from "@/assets/whey.jpg";
import creatineImg from "@/assets/creatine.jpg";
import gainerImg from "@/assets/gainer.jpg";
import fatburnerImg from "@/assets/fatburner.jpg";
import preworkoutImg from "@/assets/preworkout.jpg";
import bcaaImg from "@/assets/bcaa.jpg";

const catImages: Record<string, string> = {
  whey: wheyImg,
  creatine: creatineImg,
  gainer: gainerImg,
  seche: fatburnerImg,
  masse: preworkoutImg,
  accessoires: bcaaImg,
};

export default function CategoryCards() {
  return (
    <section className="container py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-heading text-4xl md:text-5xl tracking-tight">
          CATÉGORIES
        </h2>
        <div className="w-8 h-px bg-foreground/30 mx-auto mt-4" />
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-1.5">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={`/catalogue?cat=${cat.id}`}
              className="group block relative overflow-hidden aspect-[4/3]"
            >
              <img
                src={catImages[cat.id]}
                alt={cat.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-background/50 group-hover:bg-background/30 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="font-heading text-xl md:text-2xl tracking-wide text-foreground group-hover:tracking-widest transition-all duration-500">
                  {cat.label.toUpperCase()}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
