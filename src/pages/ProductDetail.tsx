import { useParams, Link } from "react-router-dom";
import { products, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { ShoppingCart, Zap, Star, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/ProductCard";
import { useProductImage } from "@/hooks/useProductImage";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground mb-4">Produit non trouvé</p>
        <Link to="/catalogue" className="text-primary hover:underline">Retour au catalogue</Link>
      </div>
    );
  }

  const flavor = selectedFlavor || product.flavors[0] || "Nature";
  const weight = selectedWeight || product.weights[0] || "";
  const imageSrc = useProductImage(product.image);
  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="container py-4 md:py-8 min-h-screen">
      <Link to="/catalogue" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
        <ChevronLeft size={16} /> Retour
      </Link>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-square rounded-lg overflow-hidden bg-card border border-border"
        >
          <img src={imageSrc} alt={product.name} className="w-full h-full object-cover" />
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <div className="flex gap-2 mb-2">
            {product.isTopSale && <span className="badge-top">🔥 Top Vente</span>}
            {product.isPromo && <span className="badge-promo">Promo</span>}
          </div>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <h1 className="font-heading text-2xl md:text-3xl font-bold mt-1 mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < Math.round(product.rating) ? "fill-primary text-primary" : "text-muted"} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviews} avis)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="price-tag text-3xl">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

          {/* Flavors */}
          {product.flavors.length > 0 && (
            <div className="mb-4">
              <label className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2 block">Goût</label>
              <div className="flex flex-wrap gap-2">
                {product.flavors.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFlavor(f)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      flavor === f ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Weights */}
          {product.weights.length > 0 && (
            <div className="mb-4">
              <label className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2 block">Poids</label>
              <div className="flex flex-wrap gap-2">
                {product.weights.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      weight === w ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2 block">Quantité</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center font-bold hover:bg-muted">-</button>
              <span className="font-medium text-lg w-8 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center font-bold hover:bg-muted">+</button>
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-1.5 text-sm mb-6">
            <Check size={14} className="text-primary" />
            <span className="text-primary font-medium">En stock</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => addItem(product, flavor, weight, qty)}
              className="flex-1 h-12 font-heading text-base gradient-primary text-primary-foreground hover:opacity-90 neon-glow"
            >
              <ShoppingCart size={18} className="mr-2" /> Ajouter au panier
            </Button>
            <Link to="/checkout" onClick={() => addItem(product, flavor, weight, qty)} className="flex-1">
              <Button variant="outline" className="w-full h-12 font-heading text-base border-primary/30 text-primary hover:bg-primary/10">
                <Zap size={18} className="mr-2" /> Acheter maintenant
              </Button>
            </Link>
          </div>

          {/* Nutrition */}
          {product.nutritionFacts.length > 0 && (
            <div className="mt-8 p-4 rounded-lg bg-card border border-border">
              <h3 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wider">Valeurs Nutritionnelles (par dose)</h3>
              <div className="space-y-2">
                {product.nutritionFacts.map((fact) => (
                  <div key={fact.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{fact.label}</span>
                    <span className="font-medium">{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <div className="mt-12 md:mt-16">
          <h2 className="font-heading text-xl md:text-2xl font-bold mb-6">
            PRODUITS <span className="text-primary">SIMILAIRES</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {similar.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
