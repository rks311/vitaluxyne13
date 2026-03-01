import { Home, Search, Package, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const navItems = [
  { icon: Home, label: "Accueil", path: "/" },
  { icon: Search, label: "Catalogue", path: "/catalogue" },
  { icon: ShoppingCart, label: "Panier", path: "__cart__" },
];

export default function MobileNav() {
  const location = useLocation();
  const { itemCount, setIsOpen } = useCart();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isCart = item.path === "__cart__";
          const isActive = !isCart && location.pathname === item.path;
          const Icon = item.icon;

          if (isCart) {
            return (
              <button
                key={item.label}
                onClick={() => setIsOpen(true)}
                className="flex flex-col items-center gap-1 relative"
              >
                <div className="relative">
                  <Icon size={20} className="text-muted-foreground" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full gradient-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.path}
              className="flex flex-col items-center gap-1"
            >
              <Icon size={20} className={isActive ? "text-primary" : "text-muted-foreground"} />
              <span className={`text-[10px] ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
