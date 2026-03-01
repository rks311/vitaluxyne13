import { Phone, MapPin, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const [clicks, setClicks] = useState(0);
  const navigate = useNavigate();

  const handleSecretClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    if (newClicks >= 5) {
      setClicks(0);
      navigate("/admin/login");
    }
    // Reset after 3 seconds
    setTimeout(() => setClicks(0), 3000);
  };

  return (
    <footer className="bg-surface border-t border-border pb-20 md:pb-0">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-heading text-xl font-bold mb-4">
              ULTRA<span className="text-primary">NUTRITION</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              La référence des compléments alimentaires de musculation en Algérie.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/catalogue" className="hover:text-primary transition-colors">Catalogue</Link></li>
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
          <button
            onClick={handleSecretClick}
            className="hover:text-muted-foreground/80 transition-colors cursor-default select-none"
          >
            © 2026 Ultra Nutrition. Tous droits réservés.
          </button>
        </div>
      </div>
    </footer>
  );
}
