import { Phone, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/50 pb-20 md:pb-0">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-heading text-xl tracking-widest mb-4">
              ULTRA<span className="text-silver">NUTRITION</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-body">
              Compléments alimentaires premium. Algérie.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-xs uppercase tracking-[0.2em] mb-4 text-silver">Navigation</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-body">
              <li><Link to="/catalogue" className="hover:text-foreground transition-colors">Catalogue</Link></li>
              <li><Link to="/pack" className="hover:text-foreground transition-colors">Créer un Pack</Link></li>
              <li><Link to="/catalogue" className="hover:text-foreground transition-colors">Promotions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-xs uppercase tracking-[0.2em] mb-4 text-silver">Info</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-body">
              <li>FAQ</li>
              <li>Politique de retour</li>
              <li>Livraison</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-xs uppercase tracking-[0.2em] mb-4 text-silver">Contact</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-body">
              <li className="flex items-center gap-2"><Phone size={12} /> 0555 12 34 56</li>
              <li className="flex items-center gap-2"><Mail size={12} /> contact@ultranutrition.dz</li>
              <li className="flex items-center gap-2"><MapPin size={12} /> Alger, Algérie</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border/30 text-center text-[10px] text-muted-foreground uppercase tracking-widest font-body">
          © 2026 Ultra Nutrition
        </div>
      </div>
    </footer>
  );
}
