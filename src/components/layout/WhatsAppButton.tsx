import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function WhatsAppButton() {
  const { data: settings } = useSiteSettings();
  const whatsapp = settings?.whatsapp || "+213555123456";
  const cleanNumber = whatsapp.replace(/[^0-9]/g, "");

  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent("Bonjour, je suis intéressé par vos produits Vitaluxyne")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 z-40 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle size={28} className="text-white" />
    </a>
  );
}
