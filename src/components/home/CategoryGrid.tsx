import { useLang } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import beauteImg from "@/assets/categories/beaute.jpg";
import cerveauImg from "@/assets/categories/cerveau.jpg";
import stressImg from "@/assets/categories/stress.jpg";
import musclesImg from "@/assets/categories/muscles.jpg";
import osImg from "@/assets/categories/os.jpg";
import coeurImg from "@/assets/categories/coeur.jpg";
import immuniteImg from "@/assets/categories/immunite.jpg";
import hormonesImg from "@/assets/categories/hormones.jpg";
import perteImg from "@/assets/categories/perte.jpg";

const categories = [
  { key: "beaute", slug: "beaute", image: beauteImg, gradient: "from-pink-500/80 to-rose-600/80" },
  { key: "cerveau", slug: "cerveau", image: cerveauImg, gradient: "from-blue-500/80 to-indigo-600/80" },
  { key: "stress", slug: "stress", image: stressImg, gradient: "from-violet-500/80 to-purple-600/80" },
  { key: "muscles", slug: "muscles", image: musclesImg, gradient: "from-orange-500/80 to-amber-600/80" },
  { key: "os", slug: "os", image: osImg, gradient: "from-amber-500/80 to-yellow-600/80" },
  { key: "coeur", slug: "coeur", image: coeurImg, gradient: "from-red-500/80 to-rose-600/80" },
  { key: "immunite", slug: "immunite", image: immuniteImg, gradient: "from-emerald-500/80 to-green-600/80" },
  { key: "hormones", slug: "hormones", image: hormonesImg, gradient: "from-purple-500/80 to-fuchsia-600/80" },
  { key: "perte", slug: "perte-de-poids", image: perteImg, gradient: "from-teal-500/80 to-cyan-600/80" },
];

export default function CategoryGrid() {
  const { t } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section id="categories" className="py-10 md:py-16 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t("cat.title")}</h2>
            <p className="text-sm text-muted-foreground mt-1">Trouvez le complément adapté à vos besoins</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => scroll("left")} className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll("right")} className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-1 px-1">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="snap-start shrink-0"
            >
              <Link
                to={`/catalogue?cat=${cat.slug}`}
                className="group block relative w-[150px] md:w-[170px] rounded-2xl overflow-hidden aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-500"
              >
                <img
                  src={cat.image}
                  alt={t(`cat.${cat.key}`)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-60 group-hover:opacity-70 transition-opacity duration-500`} />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 pb-5">
                  <h3 className="font-heading font-bold text-sm md:text-base text-white text-center leading-tight drop-shadow-lg">
                    {t(`cat.${cat.key}`)}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    Découvrir →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
