import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";

// REPLACE WITH REAL TESTIMONIALS
const testimonials = [
  { name: "Amira B.", location: "Alger", text: "Excellente qualité ! J'utilise les vitamines B12 et C depuis 3 mois. Je recommande Vitaluxyne.", rating: 5 },
  { name: "Karim M.", location: "Oran", text: "Livraison rapide et produits authentiques. Le zinc et les oméga-3 sont très bien dosés.", rating: 5 },
  { name: "Sarah L.", location: "Constantine", text: "Le collagène m'a fait un bien fou pour la peau. Merci pour vos conseils personnalisés !", rating: 4 },
  { name: "Youcef D.", location: "Tizi Ouzou", text: "Très bon rapport qualité-prix. Je prends les multivitamines en famille.", rating: 5 },
];

export default function Testimonials() {
  const { t } = useLang();

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t("reviews.title")}</h2>
          <p className="text-muted-foreground mt-2">{t("reviews.sub")}</p>
          <div className="w-12 h-1 bg-accent mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-xl border border-border bg-card"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} className={j < review.rating ? "fill-accent text-accent" : "text-muted"} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{review.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">{review.name.charAt(0)}</div>
                <div>
                  <p className="font-heading font-semibold text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
