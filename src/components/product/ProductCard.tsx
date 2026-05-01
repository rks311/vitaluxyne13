import React from "react";
import { Link } from "react-router-dom";
import { formatPrice, type DbProduct } from "@/types/database";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface ProductCardProps {
  product: DbProduct;
  index?: number;
  /** Set true for the first row above the fold to prioritize LCP */
  priority?: boolean;
}

const ProductCard = React.memo(({ product, index = 0, priority = false }: ProductCardProps) => {
  return (
    <article className="animate-in fade-in duration-300" style={{ animationDelay: `${index * 30}ms` }}>
      <Link
        to={`/produit/${product.id}`}
        className="block rounded-xl border border-border bg-card overflow-hidden card-hover group"
        aria-label={`${product.name} — ${formatPrice(product.price)}`}
      >
        <div className="aspect-square bg-secondary/50 overflow-hidden relative">
          <OptimizedImage
            path={product.image_url}
            alt={product.name}
            width={400}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            srcSetWidths={[200, 300, 400, 600]}
            priority={priority}
            wrapperClassName="w-full h-full"
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
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
    </article>
  );
});

ProductCard.displayName = "ProductCard";
export default ProductCard;
