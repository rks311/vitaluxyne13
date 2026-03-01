import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function PopularProducts() {
  const popular = products.filter((p) => p.isTopSale).slice(0, 4);

  return (
    <section className="container py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-end justify-between mb-12"
      >
        <div>
          <h2 className="font-heading text-4xl md:text-5xl tracking-tight">
            BEST SELLERS
          </h2>
          <div className="w-8 h-px bg-foreground/30 mt-4" />
        </div>
        <Link
          to="/catalogue"
          className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body tracking-wide uppercase"
        >
          Tout voir <ArrowRight size={14} />
        </Link>
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {popular.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
      <Link
        to="/catalogue"
        className="md:hidden flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors font-body tracking-wide uppercase"
      >
        Tout voir <ArrowRight size={14} />
      </Link>
    </section>
  );
}
