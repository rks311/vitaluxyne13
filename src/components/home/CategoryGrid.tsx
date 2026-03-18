import { useLang } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles, Brain, Moon, Dumbbell, Bone, Heart,
  Shield, Syringe, TrendingDown, MoreHorizontal
} from "lucide-react";

const categories = [
  { key: "beaute", slug: "beaute", icon: Sparkles, color: "bg-pink-50 text-pink-600" },
  { key: "cerveau", slug: "cerveau", icon: Brain, color: "bg-blue-50 text-blue-600" },
  { key: "stress", slug: "stress", icon: Moon, color: "bg-indigo-50 text-indigo-600" },
  { key: "muscles", slug: "muscles", icon: Dumbbell, color: "bg-orange-50 text-orange-600" },
  { key: "os", slug: "os", icon: Bone, color: "bg-amber-50 text-amber-700" },
  { key: "coeur", slug: "coeur", icon: Heart, color: "bg-red-50 text-red-500" },
  { key: "immunite", slug: "immunite", icon: Shield, color: "bg-emerald-50 text-emerald-600" },
  { key: "hormones", slug: "hormones", icon: Syringe, color: "bg-purple-50 text-purple-600" },
  { key: "perte", slug: "perte-de-poids", icon: TrendingDown, color: "bg-teal-50 text-teal-600" },
  { key: "autre", slug: "autre", icon: MoreHorizontal, color: "bg-gray-50 text-gray-600" },
];

export default function CategoryGrid() {
  const { t } = useLang();

  return (
    <section id="categories" className="py-12 md:py-16 bg-background">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t("cat.title")}</h2>
          <div className="w-12 h-1 bg-accent mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/catalogue?cat=${cat.slug}`}
                  className="flex flex-col items-center gap-3 p-5 md:p-6 rounded-2xl bg-card border border-border card-hover text-center group"
                >
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${cat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon size={26} />
                  </div>
                  <span className="font-heading font-semibold text-sm text-foreground">{t(`cat.${cat.key}`)}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
