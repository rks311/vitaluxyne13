import { Product, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Plus } from "lucide-react";
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
      className="group flex flex-col"
    >
      {/* Image */}
      <Link to={`/produit/${product.id}`} className="relative aspect-[3/4] overflow-hidden bg-card mb-3">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isTopSale && <span className="badge-top">BEST</span>}
          {product.isPromo && product.oldPrice && (
            <span className="badge-promo">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>
          )}
        </div>

        {/* Quick add */}
        <button
          onClick={(e) => {
            e.preventDefault();
            addItem(product, product.flavors[0] || "Nature", product.weights[0] || "");
          }}
          className="absolute bottom-3 right-3 w-10 h-10 bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-silver-light"
        >
          <Plus size={18} />
        </button>
      </Link>

      {/* Info */}
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-body">{product.brand}</p>
        <h3 className="text-sm font-medium leading-tight line-clamp-1 font-body">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold font-body">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through font-body">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
