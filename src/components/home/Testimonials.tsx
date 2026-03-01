import { testimonials } from "@/data/products";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Testimonials() {
  return (
    <section className="bg-surface py-12 md:py-16">
      <div className="container">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-8">
          CE QUE DISENT NOS <span className="text-primary">CLIENTS</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-lg bg-card border border-border"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-3">"{t.text}"</p>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
