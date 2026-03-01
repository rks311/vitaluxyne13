import { testimonials } from "@/data/products";
import { motion } from "framer-motion";

export default function Testimonials() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl tracking-tight">
            TÉMOIGNAGES
          </h2>
          <div className="w-8 h-px bg-foreground/30 mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/30">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface p-6 md:p-8"
            >
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-body">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-xs font-heading text-foreground border border-border">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium font-body">{t.name}</p>
                  <p className="text-xs text-muted-foreground font-body">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
