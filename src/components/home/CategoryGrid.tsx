import { useLang } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Brain, Moon, Dumbbell, Bone, Heart, Shield, Zap, Scale } from "lucide-react";

const categories = [
  { key: "beaute", slug: "beaute", icon: Sparkles, color: "from-pink-500 to-rose-400" },
  { key: "cerveau", slug: "cerveau", icon: Brain, color: "from-blue-500 to-indigo-400" },
  { key: "stress", slug: "stress", icon: Moon, color: "from-violet-500 to-purple-400" },
  { key: "muscles", slug: "muscles", icon: Dumbbell, color: "from-orange-500 to-amber-400" },
  { key: "os", slug: "os", icon: Bone, color: "from-amber-500 to-yellow-400" },
  { key: "coeur", slug: "coeur", icon: Heart, color: "from-red-500 to-rose-400" },
  { key: "immunite", slug: "immunite", icon: Shield, color: "from-emerald-500 to-green-400" },
  { key: "hormones", slug: "hormones", icon: Zap, color: "from-purple-500 to-fuchsia-400" },
  { key: "perte", slug: "perte-de-poids", icon: Scale, color: "from-teal-500 to-cyan-400" },
];

export default function CategoryGrid() {
  const { t } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <section id="categories" className="py-6 md:py-12 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="font-heading text-lg md:text-2xl font-bold text-foreground">{t("cat.title")}</h2>
          <div className="hidden md:flex items-center gap-1.5">
            <button onClick={() => scroll("left")} className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll("right")} className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-2.5 md:gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory -mx-1 px-1">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="snap-start shrink-0"
              >
                <Link
                  to={`/catalogue?cat=${cat.slug}`}
                  className="group flex flex-col items-center gap-2 w-[76px] md:w-[100px]"
                >
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}>
                    <Icon size={22} className="text-white md:w-6 md:h-6" />
                  </div>
                  <span className="text-[11px] md:text-xs font-medium text-foreground text-center leading-tight">
                    {t(`cat.${cat.key}`)}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
