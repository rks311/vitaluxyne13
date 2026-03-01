import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";

export default function PromoSection() {
  const promos = products.filter((p) => p.isPromo).slice(0, 4);

  return (
    <section className="bg-surface py-12 md:py-16">
      <div className="container">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-2">
          🔥 <span className="text-primary">PROMOTIONS</span>
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-8">Offres limitées - Ne ratez pas ces deals !</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {promos.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
