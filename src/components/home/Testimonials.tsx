import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";

const testimonials = [
  { name: "Amira B.", location: "Alger", text: "Excellente qualité ! Les vitamines C+Zinc m'ont aidée tout l'hiver. Livraison rapide.", rating: 5 },
  { name: "Karim M.", location: "Oran", text: "Le Whey Isolate a un goût incroyable et les résultats sont là. Je recommande à 100%.", rating: 5 },
  { name: "Sarah L.", location: "Constantine", text: "Le collagène marin a transformé ma peau en 2 mois. Merci Vitaluxyne !", rating: 5 },
  { name: "Youcef D.", location: "Tizi Ouzou", text: "Rapport qualité-prix imbattable. Les multivitamines sont top pour toute la famille.", rating: 4 },
];

export default function Testimonials() {
  const { t } = useLang();

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="font-heading text-lg md:text-2xl font-bold text-foreground">{t("reviews.title")}</h2>
          <div className="w-10 h-0.5 bg-accent mx-auto mt-2 rounded-full" />
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
          {testimonials.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="min-w-[260px] md:min-w-0 shrink-0 md:shrink p-4 rounded-xl border border-border bg-card"
            >
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={12} className={j < review.rating ? "fill-accent text-accent" : "text-muted"} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">"{review.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">{review.name.charAt(0)}</div>
                <div>
                  <p className="font-heading font-semibold text-xs">{review.name}</p>
                  <p className="text-[10px] text-muted-foreground">{review.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
