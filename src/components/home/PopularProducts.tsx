import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function PopularProducts() {
  const popular = products.filter((p) => p.isTopSale).slice(0, 4);

  return (
    <section className="container py-12 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl md:text-3xl font-bold">
          PRODUITS <span className="text-primary">POPULAIRES</span>
        </h2>
        <Link to="/catalogue" className="text-sm text-primary flex items-center gap-1 hover:underline">
          Voir tout <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {popular.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
