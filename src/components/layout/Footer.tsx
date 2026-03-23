import { Phone, MapPin, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const navigate = useNavigate();
  const { t } = useLang();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-8 md:py-10">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-heading text-lg font-bold mb-2">Vitaluxyne</h3>
            <p className="text-xs text-primary-foreground/60 leading-relaxed">{t("footer.desc")}</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-2 text-xs uppercase tracking-wider text-primary-foreground/70">Navigation</h4>
            <ul className="space-y-1.5 text-xs text-primary-foreground/60">
              <li><Link to="/catalogue" className="hover:text-primary-foreground transition-colors">{t("nav.catalog")}</Link></li>
              <li><Link to="/catalogue?cat=muscles" className="hover:text-primary-foreground transition-colors">Muscles</Link></li>
              <li><Link to="/catalogue?cat=immunite" className="hover:text-primary-foreground transition-colors">Immunité</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-2 text-xs uppercase tracking-wider text-primary-foreground/70">Info</h4>
            <ul className="space-y-1.5 text-xs text-primary-foreground/60">
              <li>{t("footer.faq")}</li>
              <li>{t("footer.returns")}</li>
              <li>{t("footer.shipping")}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-2 text-xs uppercase tracking-wider text-primary-foreground/70">Contact</h4>
            <ul className="space-y-1.5 text-xs text-primary-foreground/60">
              <li className="flex items-center gap-1.5"><Phone size={12} /> 0555 12 34 56</li>
              <li className="flex items-center gap-1.5"><Mail size={12} /> contact@vitaluxyne.com</li>
              <li className="flex items-center gap-1.5"><MapPin size={12} /> Alger, Algérie</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-primary-foreground/15 text-center text-[10px] text-primary-foreground/40">
          <span onClick={() => navigate("/admin/login")} className="cursor-text select-none">
            {t("footer.rights")}
          </span>
        </div>
      </div>
    </footer>
  );
}
