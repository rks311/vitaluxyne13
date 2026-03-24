import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice, getStorageUrl, type DbProduct } from "@/types/database";
import { useLang } from "@/context/LanguageContext";

interface ProductCardProps {
  product: DbProduct;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t } = useLang();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={`/produit/${product.id}`}
        className="block rounded-xl border border-border bg-card overflow-hidden card-hover group"
        aria-label={`${product.name} — ${formatPrice(product.price)}`}
      >
        <div className="aspect-square bg-secondary/50 overflow-hidden relative">
          <img
            src={getStorageUrl(product.image_url)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            width={400}
            height={400}
          />
          {product.is_promo && (
            <span className="absolute top-2 start-2 badge-promo">Promo</span>
          )}
          {product.is_top_sale && (
            <span className="absolute top-2 end-2 badge-top">⭐ Top</span>
          )}
        </div>
        <div className="p-3">
          {product.objectives && product.objectives.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1.5">
              {product.objectives.slice(0, 2).map(obj => (
                <span key={obj} className="badge-category">{obj}</span>
              ))}
            </div>
          )}
          <h3 className="font-heading font-semibold text-sm text-foreground leading-tight line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-heading font-bold text-accent text-base">{formatPrice(product.price)}</span>
            {product.old_price && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.old_price)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
