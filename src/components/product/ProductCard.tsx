import { Product, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProductImage } from "@/hooks/useProductImage";

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { addItem } = useCart();
  const imageSrc = useProductImage(product.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 flex flex-col active:scale-[0.98]"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isTopSale && <span className="badge-top text-[9px] px-1.5">🔥 Top</span>}
          {product.isPromo && product.oldPrice && (
            <span className="badge-promo text-[9px] px-1.5">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>
          )}
        </div>
        {/* Quick view */}
        <Link
          to={`/produit/${product.id}`}
          className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
        >
          <Eye size={14} />
        </Link>
      </div>

      {/* Info */}
      <div className="p-2.5 md:p-3 flex-1 flex flex-col">
        <p className="text-[10px] text-muted-foreground mb-0.5">{product.brand}</p>
        <h3 className="font-medium text-xs md:text-sm leading-tight mb-2 line-clamp-2">{product.name}</h3>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="price-tag text-base md:text-lg">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-[9px] text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>

          <button
            onClick={() => addItem(product, product.flavors[0] || "Nature", product.weights[0] || "")}
            className="w-full h-9 rounded-xl gradient-primary text-primary-foreground text-xs font-medium flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity active:scale-95"
          >
            <ShoppingCart size={13} /> Ajouter
          </button>
        </div>
      </div>
    </motion.div>
  );
}
