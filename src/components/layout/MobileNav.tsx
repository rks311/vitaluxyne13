import { Home, Search, Package, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const navItems = [
  { icon: Home, label: "Accueil", path: "/" },
  { icon: Search, label: "Catalogue", path: "/catalogue" },
  { icon: Package, label: "Pack", path: "/pack" },
  { icon: ShoppingCart, label: "Panier", path: "__cart__" },
];

export default function MobileNav() {
  const location = useLocation();
  const { itemCount, setIsOpen } = useCart();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/30">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isCart = item.path === "__cart__";
          const isActive = !isCart && location.pathname === item.path;
          const Icon = item.icon;

          if (isCart) {
            return (
              <button
                key={item.label}
                onClick={() => setIsOpen(true)}
                className="flex flex-col items-center gap-0.5 relative"
              >
                <div className="relative">
                  <Icon size={18} strokeWidth={1.5} className="text-muted-foreground" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-foreground text-background text-[9px] font-bold flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-body">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.path}
              className="flex flex-col items-center gap-0.5"
            >
              <Icon size={18} strokeWidth={1.5} className={isActive ? "text-foreground" : "text-muted-foreground"} />
              <span className={`text-[9px] uppercase tracking-wider font-body ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
