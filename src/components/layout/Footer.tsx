import { Phone, MapPin, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const navigate = useNavigate();
  const { t } = useLang();

  return (
    <footer className="bg-primary text-primary-foreground pb-20 md:pb-0">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-heading text-xl font-bold mb-4">Vitaluxyne</h3>
            <p className="text-sm text-primary-foreground/70">{t("footer.desc")}</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wider text-primary-foreground/80">{t("footer.navigation")}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/catalogue" className="hover:text-primary-foreground transition-colors">{t("nav.catalog")}</Link></li>
              <li><Link to="/catalogue?cat=muscles" className="hover:text-primary-foreground transition-colors">{t("cat.muscles")}</Link></li>
              <li><Link to="/catalogue?cat=immunite" className="hover:text-primary-foreground transition-colors">{t("cat.immunite")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wider text-primary-foreground/80">{t("footer.info")}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>{t("footer.faq")}</li>
              <li>{t("footer.returns")}</li>
              <li>{t("footer.shipping")}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wider text-primary-foreground/80">{t("footer.contact")}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2"><Phone size={14} /> 0555 12 34 56</li>
              <li className="flex items-center gap-2"><Mail size={14} /> contact@vitaluxyne.com</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Alger, Algérie</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-primary-foreground/20 text-center text-xs text-primary-foreground/50">
          <span
            onClick={() => navigate("/admin/login")}
            className="cursor-text select-none"
          >
            {t("footer.rights")}
          </span>
        </div>
      </div>
    </footer>
  );
}
