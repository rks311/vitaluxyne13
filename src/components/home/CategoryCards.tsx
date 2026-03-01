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
    <section className="container py-12 md:py-16">
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-8">
        NOS <span className="text-primary">CATÉGORIES</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={`/catalogue?cat=${cat.id}`}
              className="group block relative rounded-lg overflow-hidden aspect-square"
            >
              <img
                src={catImages[cat.id]}
                alt={cat.label}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute inset-0 group-hover:bg-primary/10 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="font-heading font-semibold text-sm md:text-base mt-1">{cat.label}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
