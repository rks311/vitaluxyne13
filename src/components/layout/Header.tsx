import { ShoppingCart, Phone, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { itemCount, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="font-heading text-xl md:text-2xl tracking-widest">
          ULTRA<span className="text-silver">NUTRITION</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-body uppercase tracking-[0.15em] text-muted-foreground">
          <Link to="/catalogue" className="hover:text-foreground transition-colors duration-300">Catalogue</Link>
          <Link to="/pack" className="hover:text-foreground transition-colors duration-300">Pack</Link>
          <a href="tel:+213555123456" className="flex items-center gap-1.5 hover:text-foreground transition-colors duration-300">
            <Phone size={12} /> 0555 12 34 56
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2.5 text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <ShoppingCart size={18} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-foreground text-background text-[9px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2.5 text-muted-foreground">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border/50"
          >
            <nav className="container py-6 flex flex-col gap-4">
              <Link to="/catalogue" onClick={() => setMenuOpen(false)} className="text-sm font-body uppercase tracking-wider hover:text-silver transition-colors">Catalogue</Link>
              <Link to="/pack" onClick={() => setMenuOpen(false)} className="text-sm font-body uppercase tracking-wider hover:text-silver transition-colors">Créer un Pack</Link>
              <a href="tel:+213555123456" className="text-sm font-body flex items-center gap-2 hover:text-silver transition-colors">
                <Phone size={14} /> 0555 12 34 56
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
