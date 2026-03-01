import { Store, Truck, Phone, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminSettings() {
  const handleSave = () => toast.success("Paramètres sauvegardés");

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Store Info */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Store size={18} className="text-primary" />
          <h3 className="font-heading font-bold text-base">Informations boutique</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Nom de la boutique</label>
            <input defaultValue="Ultra Nutrition" className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" maxLength={100} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email</label>
            <input defaultValue="contact@ultranutrition.dz" className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" maxLength={100} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Téléphone</label>
              <input defaultValue="0555 12 34 56" className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" maxLength={20} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">WhatsApp</label>
              <input defaultValue="+213555123456" className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" maxLength={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Truck size={18} className="text-primary" />
          <h3 className="font-heading font-bold text-base">Livraison Yalidine</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Clé API Yalidine</label>
            <input type="password" defaultValue="yal_xxxxxxxxxxxxx" className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" maxLength={100} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Frais livraison domicile</label>
              <input defaultValue="600" type="number" className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Frais point relais</label>
              <input defaultValue="0" type="number" className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={18} className="text-primary" />
          <h3 className="font-heading font-bold text-base">Réseaux sociaux</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Instagram</label>
            <input defaultValue="@ultranutrition_dz" className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" maxLength={100} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Facebook</label>
            <input defaultValue="facebook.com/ultranutritiondz" className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" maxLength={200} />
          </div>
        </div>
      </div>

      <Button onClick={handleSave} className="gradient-primary text-primary-foreground font-heading h-11 px-6">
        <Save size={16} className="mr-2" /> Sauvegarder
      </Button>
    </div>
  );
}
