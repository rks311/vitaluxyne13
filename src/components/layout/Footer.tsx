import { Phone, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border pb-20 md:pb-0">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-heading text-xl font-bold mb-4">
              ULTRA<span className="text-primary">NUTRITION</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              La référence N°1 des compléments alimentaires de musculation en Algérie.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/catalogue" className="hover:text-primary transition-colors">Catalogue</Link></li>
              <li><Link to="/pack" className="hover:text-primary transition-colors">Créer un Pack</Link></li>
              <li><Link to="/catalogue" className="hover:text-primary transition-colors">Promotions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wider">Informations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>FAQ</li>
              <li>Politique de retour</li>
              <li>Livraison</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone size={14} /> 0555 12 34 56</li>
              <li className="flex items-center gap-2"><Mail size={14} /> contact@ultranutrition.dz</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Alger, Algérie</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © 2026 Ultra Nutrition. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
