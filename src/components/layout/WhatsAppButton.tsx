import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/213555123456?text=Bonjour%2C%20je%20suis%20intéressé%20par%20vos%20produits"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-4 z-40 w-14 h-14 rounded-full gradient-primary flex items-center justify-center neon-glow hover:scale-110 transition-transform"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle size={28} className="text-primary-foreground" />
    </a>
  );
}
