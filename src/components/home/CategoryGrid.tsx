import { useLang } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";

import beauteImg from "@/assets/categories/beaute-photo.jpg";
import cerveauImg from "@/assets/categories/cerveau-photo.jpg";
import stressImg from "@/assets/categories/stress-photo.jpg";
import musclesImg from "@/assets/categories/muscles-photo.jpg";
import osImg from "@/assets/categories/os-photo.jpg";
import coeurImg from "@/assets/categories/coeur-photo.jpg";
import immuniteImg from "@/assets/categories/immunite-photo.jpg";
import hormonesImg from "@/assets/categories/hormones-photo.jpg";
import perteImg from "@/assets/categories/perte-photo.jpg";

const categories = [
  { key: "beaute", slug: "beaute", image: beauteImg },
  { key: "cerveau", slug: "cerveau", image: cerveauImg },
  { key: "stress", slug: "stress", image: stressImg },
  { key: "muscles", slug: "muscles", image: musclesImg },
  { key: "os", slug: "os", image: osImg },
  { key: "coeur", slug: "coeur", image: coeurImg },
  { key: "immunite", slug: "immunite", image: immuniteImg },
  { key: "hormones", slug: "hormones", image: hormonesImg },
  { key: "perte", slug: "perte-de-poids", image: perteImg },
];

export default function CategoryGrid() {
  const { t } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="categories" className="py-5 md:py-10 bg-background" aria-label="Catégories de produits">
      <div className="container">
        <h2 className="font-heading text-base md:text-xl font-bold text-foreground mb-3 md:mb-5">
          {t("cat.title")}
        </h2>

        <div
          ref={scrollRef}
          className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory -mx-1 px-1"
          role="list"
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat.key}
              role="listitem"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="snap-start shrink-0"
            >
              <Link
                to={`/catalogue?cat=${cat.slug}`}
                className="group block relative w-[100px] md:w-[140px] rounded-2xl overflow-hidden aspect-[3/4] shadow-sm hover:shadow-lg transition-shadow duration-300"
                aria-label={`Voir les produits ${t(`cat.${cat.key}`)}`}
              >
                <img
                  src={cat.image}
                  alt=""
                  role="presentation"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  width={140}
                  height={187}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-3">
                  <h3 className="font-heading font-bold text-[11px] md:text-xs text-white text-center leading-tight drop-shadow-md">
                    {t(`cat.${cat.key}`)}
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
