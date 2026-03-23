import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/213555123456?text=Bonjour%2C%20je%20suis%20intéressé%20par%20vos%20produits%20Vitaluxyne"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 z-40 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle size={28} className="text-white" />
    </a>
  );
}
