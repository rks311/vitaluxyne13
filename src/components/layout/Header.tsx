import { ShoppingCart, Phone, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { itemCount, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
      <div className="container flex items-center justify-between h-14 md:h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-heading text-lg md:text-2xl font-bold tracking-tight">
            ULTRA<span className="text-primary">NUTRITION</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/catalogue" className="text-muted-foreground hover:text-primary transition-colors">Catalogue</Link>
          <Link to="/catalogue?cat=packs" className="text-muted-foreground hover:text-primary transition-colors">Packs</Link>
          <a href="tel:+213555123456" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <Phone size={14} /> 0555 12 34 56
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full gradient-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-muted-foreground">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border"
          >
            <nav className="container py-4 flex flex-col gap-3">
              <Link to="/catalogue" onClick={() => setMenuOpen(false)} className="py-2 font-medium hover:text-primary transition-colors">Catalogue</Link>
              <Link to="/catalogue?cat=packs" onClick={() => setMenuOpen(false)} className="py-2 font-medium hover:text-primary transition-colors">Nos Packs</Link>
              <a href="tel:+213555123456" className="py-2 font-medium flex items-center gap-2 hover:text-primary transition-colors">
                <Phone size={16} /> 0555 12 34 56
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
