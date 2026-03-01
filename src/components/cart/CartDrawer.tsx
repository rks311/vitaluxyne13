import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProductImage } from "@/hooks/useProductImage";

function CartItemImage({ imageKey }: { imageKey: string }) {
  const src = useProductImage(imageKey);
  return <img src={src} alt="" className="w-16 h-16 object-cover bg-card" />;
}

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="bg-background border-border/50 w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl tracking-wider flex items-center gap-2">
            <ShoppingBag size={18} strokeWidth={1.5} />
            PANIER ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-center text-sm font-body">Votre panier est vide</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 py-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 p-3 border border-border/50">
                  <CartItemImage imageKey={item.product.image} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body font-medium text-sm truncate">{item.product.name}</h4>
                    <p className="text-[11px] text-muted-foreground font-body">{item.flavor} · {item.weight}</p>
                    <p className="text-sm font-semibold font-body mt-1">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 border border-border flex items-center justify-center hover:bg-card transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-medium w-5 text-center font-body">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 border border-border flex items-center justify-center hover:bg-card transition-colors">
                        <Plus size={12} />
                      </button>
                      <button onClick={() => removeItem(item.product.id)} className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border/50 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-body">Total</span>
                <span className="font-heading text-2xl">{formatPrice(total)}</span>
              </div>
              <button
                onClick={() => { setIsOpen(false); navigate("/checkout"); }}
                className="w-full h-13 py-4 bg-foreground text-background font-body font-semibold text-sm uppercase tracking-wider hover:bg-silver-light transition-colors"
              >
                Commander
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
