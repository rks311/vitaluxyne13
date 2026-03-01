import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import { motion } from "framer-motion";

export default function PromoSection() {
  const promos = products.filter((p) => p.isPromo).slice(0, 4);

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
            PROMOTIONS
          </h2>
          <div className="w-8 h-px bg-foreground/30 mx-auto mt-4" />
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {promos.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
