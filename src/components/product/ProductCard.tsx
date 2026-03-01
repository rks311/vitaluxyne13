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
      className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-300 hover:neon-glow flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isTopSale && <span className="badge-top">🔥 Top Vente</span>}
          {product.isPromo && product.oldPrice && (
            <span className="badge-promo">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <h3 className="font-medium text-sm leading-tight mb-2 line-clamp-2">{product.name}</h3>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="price-tag text-lg">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addItem(product, product.flavors[0] || "Nature", product.weights[0] || "")}
              className="flex-1 h-9 rounded-md gradient-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <ShoppingCart size={14} /> Ajouter
            </button>
            <Link
              to={`/produit/${product.id}`}
              className="h-9 w-9 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
            >
              <Eye size={16} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
