import React, { createContext, useContext, useState, useCallback } from "react";
import type { DbProduct } from "@/types/database";

export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  flavor: string;
  weight: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: DbProduct, flavor: string, weight: string, qty?: number) => void;
  removeItem: (productId: string, flavor: string, weight: string) => void;
  updateQuantity: (productId: string, flavor: string, weight: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function itemKey(productId: string, flavor: string, weight: string) {
  return `${productId}-${flavor}-${weight}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: DbProduct, flavor: string, weight: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === product.id && i.flavor === flavor && i.weight === weight
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id && i.flavor === flavor && i.weight === weight
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          imageUrl: product.image_url,
          quantity: qty,
          flavor,
          weight,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, flavor: string, weight: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.flavor === flavor && i.weight === weight)));
  }, []);

  const updateQuantity = useCallback((productId: string, flavor: string, weight: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => !(i.productId === productId && i.flavor === flavor && i.weight === weight)));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.flavor === flavor && i.weight === weight
          ? { ...i, quantity }
          : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
