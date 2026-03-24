import { ShoppingCart, Search, Menu, X, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { itemCount, setIsOpen } = useCart();
  const { t, lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border" role="banner">
      {/* Skip to content link for a11y */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm">
        Aller au contenu principal
      </a>
      <div className="container flex items-center justify-between h-12 md:h-14">
        <Link to="/" className="flex items-center" aria-label="Vitaluxyne - Accueil">
          <span className="font-heading text-base md:text-xl font-bold tracking-tight text-primary">
            Vitaluxyne
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium" aria-label="Navigation principale">
          <Link to="/catalogue" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.catalog")}</Link>
          <Link to="/catalogue?cat=muscles" className="text-muted-foreground hover:text-primary transition-colors">Muscles</Link>
          <Link to="/catalogue?cat=immunite" className="text-muted-foreground hover:text-primary transition-colors">Immunité</Link>
        </nav>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => navigate("/catalogue")}
            className="p-2 text-muted-foreground hover:text-primary transition-colors md:hidden"
            aria-label="Rechercher des produits"
          >
            <Search size={18} aria-hidden="true" />
          </button>
          <button
            onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label={lang === "fr" ? "Passer à l'arabe" : "Switch to French"}
          >
            <Globe size={16} aria-hidden="true" />
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label={`Panier, ${itemCount} article${itemCount > 1 ? 's' : ''}`}
          >
            <ShoppingCart size={18} aria-hidden="true" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center"
                aria-hidden="true"
              >
                {itemCount}
              </motion.span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-muted-foreground"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border"
          >
            <nav className="container py-3 flex flex-col gap-1" aria-label="Navigation mobile">
              {[
                { to: "/catalogue", label: t("nav.catalog") },
                { to: "/catalogue?cat=muscles", label: "Muscles" },
                { to: "/catalogue?cat=immunite", label: "Immunité" },
                { to: "/catalogue?cat=beaute", label: "Beauté" },
                { to: "/catalogue?cat=stress", label: "Stress & Sommeil" },
              ].map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="py-2.5 px-2 rounded-lg text-sm font-medium hover:bg-secondary hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
