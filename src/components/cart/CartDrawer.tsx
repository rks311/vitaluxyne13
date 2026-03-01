import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProductImage } from "@/hooks/useProductImage";

function CartItemImage({ imageKey }: { imageKey: string }) {
  const src = useProductImage(imageKey);
  return <img src={src} alt="" className="w-16 h-16 rounded-md object-cover bg-muted" />;
}

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="bg-background border-border w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" />
            Panier ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-center">Votre panier est vide</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 p-3 rounded-lg bg-card border border-border">
                  <CartItemImage imageKey={item.product.image} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.flavor} • {item.weight}</p>
                    <p className="text-sm font-heading font-bold text-primary mt-1">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
                        <Plus size={14} />
                      </button>
                      <button onClick={() => removeItem(item.product.id)} className="ml-auto text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total</span>
                <span className="font-heading text-xl font-bold text-primary">{formatPrice(total)}</span>
              </div>
              <Button
                onClick={() => { setIsOpen(false); navigate("/checkout"); }}
                className="w-full h-12 font-heading text-lg gradient-primary text-primary-foreground hover:opacity-90"
              >
                Commander
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
