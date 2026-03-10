import { testimonials } from "@/data/products";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";

export default function Testimonials() {
  const { t } = useLang();

  return (
    <section className="bg-surface py-10 md:py-16">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Quote size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-lg md:text-2xl font-bold">{t("reviews.title")} <span className="text-primary">{t("reviews.highlight")}</span></h2>
            <p className="text-[10px] md:text-xs text-muted-foreground">{t("reviews.sub")}</p>
          </div>
        </motion.div>

        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0">
          {testimonials.map((review, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="snap-start shrink-0 w-[260px] md:w-auto p-4 rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={12} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed italic">"{review.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">{review.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-medium">{review.name}</p>
                  <p className="text-[10px] text-muted-foreground">{review.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
